import type { RequestHandler } from 'express';
import multer from 'multer';
import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/AppError.js';

const storage = multer.memoryStorage();
const uploader = multer({ storage });

export const uploadSingle = (fieldName = 'file'): RequestHandler => {
  const single = uploader.single(fieldName);

  return (req, res, next) => {
    single(req, res, (err) => {
      if (err) {
        const message = err instanceof multer.MulterError ? err.message : 'File upload failed.';
        return next(new AppError(message, StatusCodes.BAD_REQUEST, true, err as Error));
      }

      next();
    });
  };
};

export default uploadSingle;
