import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError.js';
import { Role } from '../generated/enums.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { StatusCodes } from 'http-status-codes';
import { sendFail } from '../utils/responseFormatter.js';
import db from '../config/prisma.js';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  company_id?: string;
}

const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required', StatusCodes.UNAUTHORIZED);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token) as JwtPayload;

    const user = await db.user.findFirst({
      where: {
        id: decoded.id,
      },
    });

    if (!user) throw new AppError('User not found', StatusCodes.UNAUTHORIZED);

    if (user.role == Role.EMPLOYER) {
      const company = await db.company.findUnique({
        where: {
          employer_id: user.id
        }
      })
      if (!company) throw new AppError('Incomplete company Profile', StatusCodes.BAD_REQUEST

      )
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role as Role,
        company_id: company?.id
      };
    } else {
      req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role as Role,
      };
    }

    next();
  } catch {
    throw new AppError('Invalid or expired token', StatusCodes.UNAUTHORIZED);
  }
};

export const requireRole = (allowedRole: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendFail(res, 'Authentication Required.', StatusCodes.UNAUTHORIZED);
    }

    if (!allowedRole.includes(req.user.role)) {
      return sendFail(res, 'Access Denied. Insufficient Permissions.', StatusCodes.FORBIDDEN);
    }

    next();
  };
};

export const requireEmployer = requireRole(Role.EMPLOYER);
export const requireJobSeeker = requireRole(Role.JOB_SEEKER);
export const requireAdmin = requireRole(Role.ADMIN);

export default authMiddleware;
