import morgan from 'morgan';
import logger from '../utils/logger';

// Morgan stream to use Winston for logging
const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Development format for Morgan
export const httpLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream }
);