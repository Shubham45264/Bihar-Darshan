import { Router } from 'express';
import * as adminController from './admin.controller';
import { authenticate, restrictTo } from '../../middlewares/auth.middleware';

const router = Router();

// Public route for site settings
router.get('/settings', adminController.getSiteSettings);
router.put('/settings', adminController.updateSiteSettings);

// Admin-only routes
router.use(authenticate, restrictTo('ADMIN'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/approvals', adminController.getPendingApprovals);
router.post('/users/:userId/points', adminController.awardUserPointsController);

export const adminRoutes = router;

