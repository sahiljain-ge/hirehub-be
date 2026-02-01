import winston from 'winston';
import path from 'path';

const customFormat = winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return stack
    ? `[${timestamp}] ${level.toUpperCase()}: ${message} - ${stack}${metaStr}`
    : `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

  defaultMeta: { service: 'hirehub-api' },

  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    process.env.NODE_ENV === 'production'
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          customFormat
        )
  ),

  transports: [
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880,
      maxFiles: 10,
    }),

    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880,
      maxFiles: 10,
    }),

    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    }),
  ],

  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join('logs', 'exceptions.log'),
    }),
  ],

  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join('logs', 'rejections.log'),
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;