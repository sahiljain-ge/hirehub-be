import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger.js';
import { updateApplicationStatusSchema } from '../schemas/application.schema.js';

const uuidParam = z.object({ applicationId: z.string().uuid('applicationId must be a valid UUID') });

export const validateApplicationIdParam = (req: Request, res: Response, next: NextFunction) => {
  try {
    uuidParam.parse(req.params);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error(error.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Validation failed',
        errors: error.issues.map(({ message, path }) => {
          return { path: path[0], issue: message };
        }),
      });
    }
    next(error);
  }
};

export const validateApplicationStatusBody = (req: Request, res: Response, next: NextFunction) => {
  try {
    updateApplicationStatusSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error(error.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Validation failed',
        errors: error.issues.map(({ message, path }) => {
          return { path: path[0], issue: message };
        }),
      });
    }
    next(error);
  }
};
