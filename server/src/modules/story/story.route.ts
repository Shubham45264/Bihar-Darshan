import { Router } from 'express';
import * as storyController from './story.controller';

const router = Router();

// Public routes
router.get('/', storyController.getStories);
router.get('/:id', storyController.getStoryById);
router.post('/', storyController.createStory); // Open to all users to submit stories
router.post('/:id/views', storyController.incrementViews);
router.post('/:id/like', storyController.toggleLike);
router.post('/:id/dislike', storyController.toggleDislike);

// Admin Approval/Rejection routes (supports PUT & PATCH)
router.put('/:id/approve', storyController.approveStory);
router.patch('/:id/approve', storyController.approveStory);

router.put('/:id/reject', storyController.rejectStory);
router.patch('/:id/reject', storyController.rejectStory);

router.delete('/:id', storyController.deleteStory);

export const storyRoutes = router;
