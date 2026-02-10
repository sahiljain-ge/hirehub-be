import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger.js';

type Source = 'body' | 'params' | 'query';

export const validate =
  (schema: z.ZodTypeAny, source: Source) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[source]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error(error.message);

        return res.status(StatusCodes.BAD_REQUEST).json({
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
