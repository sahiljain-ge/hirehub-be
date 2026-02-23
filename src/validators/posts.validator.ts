import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger.js';

export const validate =
  <T>(schema: z.ZodType<T>, property: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = schema.parse(req[property]);

      Object.assign(req[property], parsedData);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error(error.format());

        return res.status(StatusCodes.BAD_REQUEST).json({
          status: 'fail',
          message: 'Validation failed',
          errors: error.issues.map(({ message, path }) => ({
            path: path.join('.'),
            issue: message,
          })),
        });
      }

      next(error);
    }
  };
