import { Router } from 'express';
import * as cultureController from './culture.controller';
import { authenticate, restrictTo } from '../../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/tribes', cultureController.getAllTribes);
router.get('/tribes/:id', cultureController.getTribeById);

router.get('/articles', cultureController.getAllArticles);
router.get('/articles/:id', cultureController.getArticleById);

// Admin routes
router.use(authenticate, restrictTo('ADMIN'));

router.post('/tribes', cultureController.createTribe);
router.patch('/tribes/:id', cultureController.updateTribe);
router.delete('/tribes/:id', cultureController.deleteTribe);

router.post('/articles', cultureController.createArticle);
router.patch('/articles/:id', cultureController.updateArticle);
router.delete('/articles/:id', cultureController.deleteArticle);

export const cultureRoutes = router;
