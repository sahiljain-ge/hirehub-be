import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = StatusCodes.OK
) => {
  return res.status(statusCode).json({
    status: 'success',
    message: message || 'Request successful',
    data,
  });
};

export const sendFail = <E = unknown>(
  res: Response,
  message: string,
  statusCode = StatusCodes.BAD_REQUEST,
  errors?: E
) => {
  return res.status(statusCode).json({
    status: 'fail',
    message,
    ...(errors && { errors }),
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR
) => {
  return res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
  });
};
