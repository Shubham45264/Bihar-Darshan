import { Router } from 'express';
import * as storyController from './story.controller';
import { authenticate, restrictTo } from '../../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', storyController.getStories);
router.get('/:id', storyController.getStoryById);
router.post('/', storyController.createStory); // Open to all users to submit stories
router.post('/:id/views', storyController.incrementViews);
router.post('/:id/like', storyController.toggleLike);
router.post('/:id/dislike', storyController.toggleDislike);
router.post('/:id/share', storyController.incrementShares);

// Admin Approval/Rejection routes (supports PUT & PATCH)
router.put('/:id/approve', authenticate, restrictTo('ADMIN'), storyController.approveStory);
router.patch('/:id/approve', authenticate, restrictTo('ADMIN'), storyController.approveStory);

router.put('/:id/reject', authenticate, restrictTo('ADMIN'), storyController.rejectStory);
router.patch('/:id/reject', authenticate, restrictTo('ADMIN'), storyController.rejectStory);

router.delete('/:id', authenticate, restrictTo('ADMIN'), storyController.deleteStory);

export const storyRoutes = router;
