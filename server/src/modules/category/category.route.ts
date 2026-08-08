import { Router } from 'express';
import * as categoryController from './category.controller';
import { authenticate, restrictTo } from '../../middlewares/auth.middleware';

const router = Router();

// Public Category Routes
router.get('/', categoryController.getAllCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

// Protected Admin Category Routes
router.post('/', authenticate, restrictTo('ADMIN'), categoryController.createCategory);
router.put('/:id', authenticate, restrictTo('ADMIN'), categoryController.updateCategory);
router.delete('/:id', authenticate, restrictTo('ADMIN'), categoryController.deleteCategory);

// Protected Admin Subcategory Routes
router.post('/:categoryId/subcategories', authenticate, restrictTo('ADMIN'), categoryController.createSubCategory);
router.put('/subcategories/:subId', authenticate, restrictTo('ADMIN'), categoryController.updateSubCategory);
router.delete('/subcategories/:subId', authenticate, restrictTo('ADMIN'), categoryController.deleteSubCategory);

export const categoryRoutes = router;
