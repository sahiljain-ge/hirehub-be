import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/AppError.js';
import { Role } from '../generated/enums.js';

export const requireEmployer = (req: Request, _res: Response, next: NextFunction) => {
  if (req.user?.role !== Role.EMPLOYER) {
    throw new AppError('Only employers can perform this action', StatusCodes.FORBIDDEN);
  }
  next();
};
