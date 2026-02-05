import jwt, { SignOptions } from 'jsonwebtoken';
import { 
  ACCESS_TOKEN_EXPIRY, 
  ACCESS_TOKEN_SECRET, 
  REFRESH_TOKEN_EXPIRY, 
  REFRESH_TOKEN_SECRET 
} from '../config/server-config.js';

export const signAccessToken = (payload: object) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET!, { expiresIn: ACCESS_TOKEN_EXPIRY! } as SignOptions);
};

export const signRefreshToken = (payload: object) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET!, { expiresIn: REFRESH_TOKEN_EXPIRY!} as SignOptions);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET!);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET!);
};
