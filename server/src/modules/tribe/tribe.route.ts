import { Router } from 'express';
import * as tribeController from './tribe.controller';
import { authenticate, restrictTo } from '../../middlewares/auth.middleware';

const router = Router();

// --- Public Routes ---
router.get('/', tribeController.getActiveTribes);
router.get('/articles', tribeController.getApprovedArticles);
router.get('/videos/approved', tribeController.getApprovedVideos);
router.get('/videos/all', tribeController.getAllVideos);
router.get('/:id', tribeController.getTribeById);

// --- User Submissions ---
router.post('/articles', tribeController.submitArticle);
router.post('/videos', tribeController.submitVideo);

// --- Admin Video & Article Routes ---
router.get('/admin/videos/pending', authenticate, restrictTo('ADMIN'), tribeController.getPendingVideos);
router.put('/admin/videos/:id/approve', authenticate, restrictTo('ADMIN'), tribeController.approveVideo);
router.put('/admin/videos/:id/reject', authenticate, restrictTo('ADMIN'), tribeController.rejectVideo);
router.delete('/admin/videos/:id', authenticate, restrictTo('ADMIN'), tribeController.deleteVideo);

// --- Admin General Routes ---
router.use(authenticate, restrictTo('ADMIN'));

router.get('/admin/all', tribeController.getAdminAllTribes);
router.post('/', tribeController.createTribe);
router.put('/:id', tribeController.updateTribe);
router.delete('/:id', tribeController.deleteTribe);

// Admin Article Routes
router.get('/admin/articles/all', tribeController.getAllArticlesAdmin);
router.get('/admin/articles/pending', tribeController.getPendingArticles);
router.put('/articles/:id/approve', tribeController.approveArticle);
router.put('/articles/:id/reject', tribeController.rejectArticle);
router.delete('/articles/:id', tribeController.deleteArticle);

export { router as tribeRoutes };
