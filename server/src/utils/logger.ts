import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { env } from '../config/env';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const isVercel = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: combine(
      env.NODE_ENV === 'development' ? colorize() : winston.format.uncolorize(),
      logFormat
    ),
  }),
];

// Only write file logs when running locally (not in serverless/Vercel read-only filesystem)
if (!isVercel) {
  try {
    transports.push(
      new DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxFiles: '14d',
      }),
      new DailyRotateFile({
        filename: 'logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '14d',
      })
    );
  } catch (error) {
    console.warn('File logging disabled due to read-only filesystem:', error);
  }
}

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports,
});
