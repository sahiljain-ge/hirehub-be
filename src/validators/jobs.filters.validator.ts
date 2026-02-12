import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger.js';
import AppError from '../utils/AppError.js';

export const validateJobsFilterParams =
  (schema: z.ZodObject<any, any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      if (req.query.posted_date) {
        const posted_date = +req.query.posted_date;
        if (posted_date > Date.now())
          throw new AppError('future date is not allowed', StatusCodes.BAD_REQUEST);
        if (!(new Date(+posted_date) instanceof Date))
          throw new AppError('invalid date', StatusCodes.BAD_REQUEST);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error(error.message);
        return res.status(StatusCodes.BAD_REQUEST || 400).json({
          status: 'fail',
          message: 'Validation failed',
          errors: error.issues.map(({ message, path }) => {
            return {
              path: path[0],
              issue: message,
            };
          }),
        });
      }
      next(error);
    }
  };
