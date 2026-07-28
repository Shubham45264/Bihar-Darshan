import { Router } from 'express';
import * as categoryController from './category.controller';
import { authenticate, restrictTo } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', categoryController.getAllCategories);
router.post('/', authenticate, categoryController.createCategory);
router.patch('/:id/approve', authenticate, restrictTo('ADMIN'), categoryController.approveCategory);
router.patch('/:id/reject', authenticate, restrictTo('ADMIN'), categoryController.rejectCategory);
router.delete('/:id', authenticate, restrictTo('ADMIN'), categoryController.deleteCategory);

export const categoryRoutes = router;
