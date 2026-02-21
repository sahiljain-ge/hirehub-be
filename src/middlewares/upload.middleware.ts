import type { RequestHandler } from 'express';
import multer from 'multer';
import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/AppError.js';
import { FILE_UPLOAD_MESSAGES } from '../constants/response.messages.js';

const uploader = multer({ storage: multer.memoryStorage() });

export interface FileValidationOptions {
  required?: boolean;
  maxBytes?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  messages?: Partial<Record<'required' | 'size' | 'type' | 'extension', string>>;
}

const ensureValidFile = (file: Express.Multer.File | undefined, rules?: FileValidationOptions) => {
  if (!rules) return;

  const msg = {
    required: rules.messages?.required ?? FILE_UPLOAD_MESSAGES.NO_FILE_UPLOADED,
    size: rules.messages?.size ?? FILE_UPLOAD_MESSAGES.FILE_TOO_LARGE,
    type: rules.messages?.type ?? FILE_UPLOAD_MESSAGES.UNSUPPORTED_FILE_TYPE,
    extension: rules.messages?.extension ?? FILE_UPLOAD_MESSAGES.UNSUPPORTED_FILE_EXTENSION,
  };

  if (rules.required && !file) throw new AppError(msg.required, StatusCodes.BAD_REQUEST);
  if (!file) return;

  if (rules.maxBytes && file.size > rules.maxBytes) {
    throw new AppError(msg.size, StatusCodes.BAD_REQUEST);
  }

  if (rules.allowedMimeTypes?.length && !rules.allowedMimeTypes.includes(file.mimetype)) {
    throw new AppError(msg.type, StatusCodes.BAD_REQUEST);
  }

  const ext = (file.originalname.split('.').pop() ?? '').toLowerCase();
  const allowedExt = rules.allowedExtensions?.map((e) => e.toLowerCase());
  if (allowedExt?.length && (!ext || !allowedExt.includes(ext))) {
    throw new AppError(msg.extension, StatusCodes.BAD_REQUEST);
  }
};

export const uploadSingle = (fieldName = 'file', rules?: FileValidationOptions): RequestHandler => {
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
