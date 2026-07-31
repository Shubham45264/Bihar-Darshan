import { Router } from 'express';
import * as categoryController from './category.controller';

const router = Router();

// Public / Admin Category Routes
router.get('/', categoryController.getAllCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

// Admin Subcategory Routes
router.post('/:categoryId/subcategories', categoryController.createSubCategory);
router.put('/subcategories/:subId', categoryController.updateSubCategory);
router.delete('/subcategories/:subId', categoryController.deleteSubCategory);

export const categoryRoutes = router;
