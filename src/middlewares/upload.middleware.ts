import type { RequestHandler } from 'express';
import multer from 'multer';
import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/AppError.js';
import { FILE_UPLOAD_MESSAGES } from '../constants/response.messages.js';
import { type CategoryPolicy } from '../constants/upload-policies.js';

const uploader = multer({ storage: multer.memoryStorage() });

export interface FileValidationOptions {
  required?: boolean;
  maxBytes?: number;
  allowedMimeTypes?: string[];
  allowedFormats?: string[];
}
const ensureValidFile = (file: Express.Multer.File | undefined, rules?: CategoryPolicy) => {
  if (!rules) return;

  if (!file) {
    throw new AppError(FILE_UPLOAD_MESSAGES.NO_FILE_UPLOADED, StatusCodes.BAD_REQUEST);
  }

  if (rules.maxBytes && file.size > rules.maxBytes) {
    throw new AppError(FILE_UPLOAD_MESSAGES.FILE_TOO_LARGE, StatusCodes.BAD_REQUEST);
  }

  if (rules.allowedMimeTypes?.length && !rules.allowedMimeTypes.includes(file.mimetype)) {
    throw new AppError(FILE_UPLOAD_MESSAGES.UNSUPPORTED_FILE_TYPE, StatusCodes.BAD_REQUEST);
  }

  const ext = (file.originalname.split('.').pop() ?? '').toLowerCase();
  const allowedExt = rules.allowedFormats?.map((e) => e.toLowerCase());
  if (allowedExt?.length && (!ext || !allowedExt.includes(ext))) {
    throw new AppError(FILE_UPLOAD_MESSAGES.UNSUPPORTED_FILE_EXTENSION, StatusCodes.BAD_REQUEST);
  }
};

export const uploadSingle = (fieldName = 'file', rules?: CategoryPolicy): RequestHandler => {
  const single = uploader.single(fieldName);

  return (req, res, next) => {
    single(req, res, (err) => {
      if (err) {
        const message = err instanceof multer.MulterError ? err.message : 'File upload failed.';
        return next(new AppError(message, StatusCodes.BAD_REQUEST, true, err as Error));
      }

      try {
        ensureValidFile(req.file, rules);
      } catch (validationError) {
        return next(validationError);
      }

      next();
    });
  };
};

export default uploadSingle;
