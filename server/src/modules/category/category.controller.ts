import { Request, Response, NextFunction } from 'express';
import * as categoryService from './category.service';

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const categories = await categoryService.getAllCategories(status as string);
    res.status(200).json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const category = await categoryService.getCategoryBySlug(slug as string);
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }
    res.status(200).json({
      success: true,
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await categoryService.updateCategory(id as string, req.body);
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id as string);
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ── SUBCATEGORY CONTROLLER METHODS ──

export const createSubCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;
    const subcategory = await categoryService.createSubCategory(categoryId as string, req.body);
    res.status(201).json({
      success: true,
      message: 'Subcategory created successfully',
      data: { subcategory },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subId } = req.params;
    const subcategory = await categoryService.updateSubCategory(subId as string, req.body);
    res.status(200).json({
      success: true,
      message: 'Subcategory updated successfully',
      data: { subcategory },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subId } = req.params;
    await categoryService.deleteSubCategory(subId as string);
    res.status(200).json({
      success: true,
      message: 'Subcategory deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
