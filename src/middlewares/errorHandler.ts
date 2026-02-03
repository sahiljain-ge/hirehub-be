import type { ErrorRequestHandler } from 'express';
import logger from '../config/logger.js';
import AppError from '../utils/AppError.js';

const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  void next;

  const error =
    err instanceof AppError
      ? err
      : new AppError('Internal Server Error', 500, false);

  logger.error(error.message, {
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  res.status(error.statusCode).json({
    statusCode: error.statusCode,
    success: error.statusCode > 400 ? false : true,
    message: error.message,
    ...(process.env.NODE_ENV !== 'production' && {
      stack: error.stack,
      error,
    }),
  });
};

export default errorHandler;