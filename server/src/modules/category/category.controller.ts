import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../helpers/responseHandler';
import * as categoryService from './category.service';

export const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const status = req.query.status as string;
  const categories = await categoryService.getAllCategories(status);
  sendSuccess(res, 200, 'Categories fetched successfully', { categories });
});

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  sendSuccess(res, 201, 'Category created successfully', { category });
});

export const approveCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.approveCategory(req.params.id as string);
  sendSuccess(res, 200, 'Category approved successfully', { category });
});

export const rejectCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.rejectCategory(req.params.id as string);
  sendSuccess(res, 200, 'Category rejected successfully', { category });
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(req.params.id as string);
  sendSuccess(res, 200, 'Category deleted successfully', null);
});
