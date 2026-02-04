import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const validateJobData =
  (schema: z.ZodObject<any, any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.message);
        return res.status(StatusCodes.BAD_REQUEST || 400).json({
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
