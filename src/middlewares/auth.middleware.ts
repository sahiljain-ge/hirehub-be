import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError.js';
import { Role } from '../generated/enums.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { StatusCodes } from 'http-status-codes';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required', StatusCodes.UNAUTHORIZED);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token) as JwtPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role as Role,
    };

    next();
  } catch {
    throw new AppError('Invalid or expired token', StatusCodes.UNAUTHORIZED);
  }
};

export default authMiddleware;
