import { Router } from 'express';
import * as adminController from './admin.controller';
import { authenticate, restrictTo } from '../../middlewares/auth.middleware';

const router = Router();

// Public route for site settings
router.get('/settings', adminController.getSiteSettings);

// Admin-only routes
router.use(authenticate, restrictTo('ADMIN'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/approvals', adminController.getPendingApprovals);
router.put('/settings', adminController.updateSiteSettings);

export const adminRoutes = router;
