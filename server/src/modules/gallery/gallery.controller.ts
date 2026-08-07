import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../helpers/responseHandler';
import * as galleryService from './gallery.service';
import * as validation from './gallery.validation';

export const getApprovedGalleryItems = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const category = req.query.category as string;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
  const items = await galleryService.getApprovedGalleryItems(category, page, limit);
  sendSuccess(res, 200, 'Gallery items fetched successfully', { items });
});

export const getGalleryItemById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const item = await galleryService.getGalleryItemById(req.params.id as string);
  sendSuccess(res, 200, 'Gallery item fetched successfully', { item });
});

export const uploadGalleryItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = validation.createGalleryItemSchema.parse(req.body);
  const item = await galleryService.uploadGalleryItem(req.user!.id as string, data);
  sendSuccess(res, 201, 'Gallery item uploaded successfully and is pending approval', { item });
});

export const approveGalleryItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const item = await galleryService.updateGalleryItemStatus(req.params.id as string, 'APPROVED');
  sendSuccess(res, 200, 'Gallery item approved successfully', { item });
});

export const rejectGalleryItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const item = await galleryService.updateGalleryItemStatus(req.params.id as string, 'REJECTED');
  sendSuccess(res, 200, 'Gallery item rejected successfully', { item });
});
