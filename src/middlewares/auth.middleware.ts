import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError.js';
import { Role } from '../generated/enums.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { StatusCodes } from 'http-status-codes';
import { sendFail } from '../utils/responseFormatter.js';
import db from '../config/prisma.js';

interface JwtPayload {
  id: string;
}

const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required', StatusCodes.UNAUTHORIZED);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token) as JwtPayload;

    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new AppError('User no longer exists', StatusCodes.UNAUTHORIZED);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      'Invalid or expired token',
      StatusCodes.UNAUTHORIZED
    );
  }
};

export const requireRole = (allowedRoles: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendFail(res, 'Authentication Required.', StatusCodes.UNAUTHORIZED);
    }

    if (allowedRoles !== req.user.role) {
      return sendFail(
        res,
        'Access Denied. Insufficient Permissions.',
        StatusCodes.FORBIDDEN
      );
    }

    next();
  };
};


export const requireEmployer = requireRole(Role.EMPLOYER);
export const requireJobSeeker = requireRole(Role.JOB_SEEKER);
export const requireAdmin = requireRole(Role.ADMIN);

export const requireCompleteCompanyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return sendFail(res, 'Authentication Required.', StatusCodes.UNAUTHORIZED);
  }

  if (req.user.role !== Role.EMPLOYER) {
    return sendFail(res, 'Access Denied.', StatusCodes.FORBIDDEN);
  }

  const company = await db.company.findUnique({
    where: { employer_id: req.user.id },
    select: { id: true },
  });

  if (!company) {
    return sendFail(
      res,
      'Incomplete company profile.',
      StatusCodes.BAD_REQUEST
    );
  }

  req.user.company_id = company.id;

  next();
};

export default authMiddleware;