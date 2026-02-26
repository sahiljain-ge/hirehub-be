import { NextFunction, Request, Response } from 'express';
import z, { ZodError } from 'zod';
import logger from '../config/logger.js';
import { StatusCodes } from 'http-status-codes';

export const validateTestimonials =
  (schema: z.ZodObject<any, any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error(error.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
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

export const validateTestimonialId =
  (schema: z.ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error(error.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
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
