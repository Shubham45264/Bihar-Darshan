import { Request, Response, NextFunction } from 'express';
import { firebaseAdmin } from '../config/firebase';
import { AppError } from '../errors/AppError';
import { catchAsync } from '../utils/catchAsync';
import { prisma as db } from '../db';
import { Role } from '../db';

/**
 * Middleware to verify Firebase token and attach user to request
 */
export const authenticate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    // Fetch user from DB
    let currentUser = await db.user.findUnique({
      where: { firebaseUid },
    });

    if (!currentUser) {
      const email = decodedToken.email || `${firebaseUid}@user.com`;
      const isAdmin = email.toLowerCase() === 'bihardarshanofficial@gmail.com';
      currentUser = await db.user.create({
        data: {
          firebaseUid,
          email,
          name: decodedToken.name || email.split('@')[0] || 'User',
          role: isAdmin ? 'ADMIN' : 'USER',
        },
      });
    } else if (currentUser.email?.toLowerCase() === 'bihardarshanofficial@gmail.com' && currentUser.role !== 'ADMIN') {
      currentUser = await db.user.update({
        where: { id: currentUser.id },
        data: { role: 'ADMIN' },
        });
    }

    req.user = currentUser;
    req.firebaseUid = firebaseUid;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return next(new AppError('Invalid token or token has expired', 401));
  }
});

/**
 * Middleware to restrict access to specific roles
 */
export const restrictTo = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
