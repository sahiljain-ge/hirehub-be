import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';
import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger.js';

export const validate =
  (schema: z.ZodObject<any>, property: 'body' | 'params' | 'query') =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[property]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error(error.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: 'fail',
          message: 'Validation failed',
          errors: error.issues.map(({ message, path }) => ({
            path: path[0],
            issue: message,
          })),
        });
      }
      next(error);
    }
  };

