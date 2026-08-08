import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { globalErrorHandler } from './middlewares/error.middleware';
import { AppError } from './errors/AppError';
import { logger } from './utils/logger';
import { authRoutes } from './modules/auth/auth.route';
import { userRoutes } from './modules/user/user.route';
import { districtRoutes } from './modules/district/district.route';
import { discoverRoutes } from './modules/discover/discover.route';
import { cultureRoutes } from './modules/culture/culture.route';
import { journeyRoutes } from './modules/journey/journey.route';
import { galleryRoutes } from './modules/gallery/gallery.route';
import { marketplaceRoutes } from './modules/marketplace/marketplace.route';
import { adminRoutes } from './modules/admin/admin.route';
import { notificationRoutes } from './modules/notification/notification.route';
import { tribeRoutes } from './modules/tribe/tribe.route';
import { categoryRoutes } from './modules/category/category.route';
import uploadRoutes from './modules/upload/upload.route';

const app: Application = express();

// Security Middlewares
app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  ...(env.CORS_ORIGIN !== '*' ? env.CORS_ORIGIN.split(',').map(o => o.trim()) : []),
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || env.CORS_ORIGIN === '*') {
      return callback(null, true);
    }
    return callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.NODE_ENV === 'development' ? 10000 : 100, // Limit each IP to a high value in development
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);

// Request Parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(compression());

// Disable browser caching for API requests to ensure dynamic DB updates
app.use('/api/v1', (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }));
}

import { storyRoutes } from './modules/story/story.route';

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/districts', districtRoutes);
app.use('/api/v1/discover', discoverRoutes);
app.use('/api/v1/culture', cultureRoutes);
app.use('/api/v1/journeys', journeyRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1/marketplace', marketplaceRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/tribes', tribeRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/stories', storyRoutes);
app.use('/api/v1/upload', uploadRoutes);

app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// Unknown route handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
