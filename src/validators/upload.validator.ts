import type { Express, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/AppError.js';
import { sendFail } from '../utils/responseFormatter.js';
import {
  DEFAULT_POLICIES,
  type CategoryPolicy,
  type UploadCategory,
} from '../services/storage/upload-policies.js';
import { FILE_UPLOAD_MESSAGES } from '../constants/response.messages.js';

type RequestWithFile = Request & { file?: Express.Multer.File };

export class UploadValidator {
  constructor(private readonly policies: Record<UploadCategory, CategoryPolicy>) {}

  requireFile(fieldName = 'file', message = 'File is required') {
    return (req: RequestWithFile, res: Response, next: NextFunction) => {
      const hasFile = Boolean(req.file ?? this.getFileFromBody(req, fieldName));
      if (!hasFile) {
        return sendFail(res, message, StatusCodes.BAD_REQUEST);
      }

      next();
    };
  }

  validateFile(category: UploadCategory, file: Express.Multer.File) {
    const policy = this.policies[category];
    if (!policy) {
      throw new AppError(`Upload category '${category}' is not supported`, StatusCodes.BAD_REQUEST);
    }

    if (!policy.allowedMimeTypes.includes(file.mimetype)) {
      throw new AppError(FILE_UPLOAD_MESSAGES.UNSUPPORTED_FILE_TYPE, StatusCodes.BAD_REQUEST);
    }

    if (file.size > policy.maxBytes) {
      throw new AppError(FILE_UPLOAD_MESSAGES.FILE_TOO_LARGE, StatusCodes.BAD_REQUEST);
    }

    const extension = this.getExtension(file.originalname);
    if (extension && !policy.allowedFormats.includes(extension)) {
      throw new AppError(FILE_UPLOAD_MESSAGES.UNSUPPORTED_FILE_EXTENSION, StatusCodes.BAD_REQUEST);
    }
  }

  private getFileFromBody(req: RequestWithFile, fieldName: string) {
    const files = (req as Request & { files?: Record<string, Express.Multer.File[]> }).files;
    if (!files) {
      return undefined;
    }

    const fieldFiles = files[fieldName];
    if (!fieldFiles || fieldFiles.length === 0) {
      return undefined;
    }

    return fieldFiles[0];
  }

  private getExtension(filename: string | undefined) {
    return filename?.split('.').pop()?.toLowerCase();
  }
}

export const uploadValidator = new UploadValidator(DEFAULT_POLICIES);
