import { Router } from 'express';
import { getMyProfile, updateMyProfile, getUserProfileById } from './user.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// Public route to get profile by ID
router.get('/public/:id', getUserProfileById);

// Protected user's own profile routes
router.get('/profile', authenticate, getMyProfile);
router.patch('/profile', authenticate, updateMyProfile);

// Generic public profile route by ID (must come after /profile)
router.get('/:id', getUserProfileById);

export const userRoutes = router;
