import { ErrorRequestHandler } from "express";
import logger from "../config/logger.js";
import { sendError } from "../utils/responseFormatter.js";
import AppError from "../utils/AppError.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Wrap unknown errors in AppError
  const error =
    err instanceof AppError
      ? err
      : new AppError('Internal Server Error', 500, false, err instanceof Error ? err : undefined);

  logger.error(error.message, {
    originalError: error.originalError
      ? {
          name: error.originalError.name,
          message: error.originalError.message,
          stack: error.originalError.stack,
        }
      : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  sendError(res, error.message, error.statusCode);
};

export default errorHandler;