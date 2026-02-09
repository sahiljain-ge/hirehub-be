import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { NODE_ENV } from './server-config.js';

const logDir = 'logs';
fs.mkdirSync(logDir, { recursive: true });

const devFormat = winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';

  return stack
    ? `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}${metaStr}`
    : `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
});

const logger = winston.createLogger({
  level: NODE_ENV === 'production' ? 'info' : 'debug',

  defaultMeta: { service: 'hirehub-api' },

  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    NODE_ENV === 'production'
      ? winston.format.json()
      : winston.format.combine(winston.format.colorize(), devFormat),
  ),

  transports: [
    new winston.transports.Console({
      level: NODE_ENV === 'production' ? 'info' : 'debug',
    }),

    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 10,
    }),

    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 10,
    }),
  ],

  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log'),
    }),
  ],

  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log'),
    }),
  ],
});

export default logger;
