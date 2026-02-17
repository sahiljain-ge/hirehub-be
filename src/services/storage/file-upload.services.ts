import type { Express, RequestHandler } from 'express';
import multer from 'multer';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../utils/AppError.js';
import { CloudinaryProvider, type StorageUploadResult } from './providers/cloudinary.provider.js';
import { DEFAULT_POLICIES, type CategoryPolicy, type UploadCategory } from './upload-policies.js';
import { UploadValidator } from '../../validators/upload.validator.js';
import { FILE_UPLOAD_MESSAGES } from '../../constants/response.messages.js';

type StorageProvider = Pick<CloudinaryProvider, 'upload' | 'delete'>;

interface UploadContext {
  userId?: string;
}

export class FileUploadService {
  private readonly uploader: multer.Multer;
  private readonly maxFileSize: number;
  private readonly validator: UploadValidator;

  constructor(
    private readonly provider: StorageProvider,
    private readonly policies: Record<UploadCategory, CategoryPolicy> = DEFAULT_POLICIES,
  ) {
    this.maxFileSize = Math.max(...Object.values(this.policies).map((policy) => policy.maxBytes));
    this.uploader = multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: this.maxFileSize },
    });
    this.validator = new UploadValidator(this.policies);
  }

  middleware(category: UploadCategory, fieldName = 'file'): RequestHandler {
    const singleFieldUpload = this.uploader.single(fieldName);

    return (req, res, next) => {
      singleFieldUpload(req, res, (err) => {
        if (err) {
          return next(err);
        }

        try {
          if (req.file) {
            this.validator.validateFile(category, req.file);
          }
        } catch (validationError) {
          return next(validationError);
        }

        next();
      });
    };
  }

  async upload(
    category: UploadCategory,
    file: Express.Multer.File | undefined,
    context: UploadContext = {},
  ): Promise<StorageUploadResult> {
    if (!file) {
      throw new AppError(FILE_UPLOAD_MESSAGES.FILE_NOT_FOUND, StatusCodes.BAD_REQUEST);
    }

    this.validator.validateFile(category, file);
    const policy = this.policies[category];
    const folder = this.buildFolderPath(policy.folder, context.userId);

    return this.provider.upload(file, {
      folder,
      resourceType: policy.resourceType,
    });
  }

  async delete(publicId: string) {
    if (!publicId) {
      throw new AppError(FILE_UPLOAD_MESSAGES.FILE_NOT_FOUND, StatusCodes.BAD_REQUEST);
    }

    await this.provider.delete(publicId);
  }

  private buildFolderPath(baseFolder: string, userId?: string) {
    const sanitizedBase = this.sanitizeFolder(baseFolder);
    if (userId) {
      const safeUserId = this.sanitizeIdentifier(userId);
      if (!safeUserId) {
        throw new AppError(FILE_UPLOAD_MESSAGES.FILE_NOT_FOUND, StatusCodes.BAD_REQUEST);
      }

      return `${sanitizedBase}/${safeUserId}`;
    }

    return sanitizedBase;
  }

  private sanitizeFolder(folder: string) {
    const sanitized = folder
      .split('/')
      .map((segment) => this.sanitizeSegment(segment))
      .filter(Boolean)
      .join('/');

    if (!sanitized) {
      throw new AppError(FILE_UPLOAD_MESSAGES.FILE_NOT_FOUND, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return sanitized;
  }

  private sanitizeSegment(segment: string) {
    return segment.replace(/[^a-zA-Z0-9._-]/g, '');
  }

  private sanitizeIdentifier(identifier: string) {
    return identifier.replace(/[^a-zA-Z0-9_-]/g, '');
  }
}

export const fileUploadService = new FileUploadService(new CloudinaryProvider());
