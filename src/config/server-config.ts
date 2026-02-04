import dotenv from 'dotenv';
dotenv.config();
export const {
  PORT,
  NODE_ENV,
  DATABASE_URL,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  BCRYPT_SALT,
  EMAIL_HOST_NAME,
  EMAIL,
  EMAIL_PASS
} = process.env;
