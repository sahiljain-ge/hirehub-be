import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';
import logger from '../config/logger.js';
import { StatusCodes } from 'http-status-codes';
import { sendFail } from '../utils/responseFormatter.js';

type RequestWithFile = Request & { file?: { path?: string } };

class JobSeekerProfileValidator {
  validate(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          logger.error(error.message);
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
  }

  requireResumeFile() {
    return (req: RequestWithFile, res: Response, next: NextFunction) => {
      const fileUrl = req.file?.path;
      if (!fileUrl) {
        return sendFail(res, 'Resume file is required', StatusCodes.BAD_REQUEST);
      }

      return next();
    };
  }
}

export default JobSeekerProfileValidator;
