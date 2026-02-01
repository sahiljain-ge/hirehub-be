import app from './app.js';
import logger from './config/logger.js';
import { PORT } from './config/server-config.js';

process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (reason: unknown) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', { reason });

  server.close(() => {
    process.exit(1);
  });
});
