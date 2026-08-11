import { Router } from 'express';
import { getMyProfile, updateMyProfile, getUserProfileById, getLeaderboard } from './user.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// Public leaderboard route
router.get('/leaderboard', getLeaderboard);

// Public route to get profile by ID
router.get('/public/:id', getUserProfileById);

// Protected user's own profile routes
router.get('/profile', authenticate, getMyProfile);
router.patch('/profile', authenticate, updateMyProfile);

// Generic public profile route by ID (must come after /profile & /leaderboard)
router.get('/:id', getUserProfileById);

export const userRoutes = router;

