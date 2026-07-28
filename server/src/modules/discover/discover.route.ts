import { Router } from 'express';
import * as discoverController from './discover.controller';
import { authenticate, restrictTo } from '../../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', discoverController.getAllDiscoverItems);
router.get('/:id/media', discoverController.getCardMedia);
router.get('/:id', discoverController.getDiscoverItemById);

// Media interaction routes
router.post('/:id/media', discoverController.addCardMedia);
router.post('/media/:mediaId/like', discoverController.toggleLikeMedia);
router.post('/media/:mediaId/dislike', discoverController.toggleDislikeMedia);

// Authenticated user routes (for submission)
router.post('/', authenticate, discoverController.createDiscoverItem);

// Admin routes
router.patch('/:id/approve', authenticate, restrictTo('ADMIN'), discoverController.approveDiscoverItem);
router.patch('/:id/reject', authenticate, restrictTo('ADMIN'), discoverController.rejectDiscoverItem);
router.patch('/:id', authenticate, restrictTo('ADMIN'), discoverController.updateDiscoverItem);
router.delete('/:id', authenticate, restrictTo('ADMIN'), discoverController.deleteDiscoverItem);

export const discoverRoutes = router;
