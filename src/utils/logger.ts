import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
  level: 'info', // Minimum log level: error, warn, info, http, debug

  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
    winston.format.json() // JSON format for easy parsing
  ),

  transports: [
    // Console - display logs in terminal with colors
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Add colors: error=red, warn=yellow, info=green
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message}${
            Object.keys(meta).length ? ' ' + JSON.stringify(meta) : ''
          }`;
        })
      ),
    }),

    // File - save all logs to file, auto-rotate daily
    new DailyRotateFile({
      filename: 'logs/app-%DATE%.log', // %DATE% replaced with current date (e.g., app-2024-01-10.log)
      datePattern: 'YYYY-MM-DD', // Date format in filename
      maxFiles: '14d', // Keep logs for 14 days, auto-delete older ones
      maxSize: '20m', // Create new file when size reaches 20MB (e.g., app-2024-01-10.1.log)
    }),

    // File - save error logs separately for easier debugging
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log', // Dedicated file for errors
      datePattern: 'YYYY-MM-DD',
      level: 'error', // Only log 'error' level, ignore info, warn, etc.
      maxFiles: '30d', // Keep error logs longer (30 days) as they are critical
      maxSize: '20m', // Max 20MB per file
    }),
  ],
});

export default logger;