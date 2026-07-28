import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../helpers/responseHandler';
import * as discoverService from './discover.service';
import { createDiscoverSchema, updateDiscoverSchema, discoverCategoryEnum } from './discover.validation';
import { AppError } from '../../errors/AppError';
import { DiscoverCategory } from '../../db';

export const getAllDiscoverItems = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const category = req.query.category as string;
  const status = req.query.status as string;

  const items = await discoverService.getAllDiscoverItems(category, status);
  sendSuccess(res, 200, 'Discover items fetched successfully', { items });
});

export const getDiscoverItemById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const item = await discoverService.getDiscoverItemById(req.params.id as string);
  sendSuccess(res, 200, 'Item fetched successfully', { item });
});

export const createDiscoverItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = createDiscoverSchema.parse(req.body);
  const item = await discoverService.createDiscoverItem(validatedData);
  sendSuccess(res, 201, 'Item created successfully', { item });
});

export const updateDiscoverItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = updateDiscoverSchema.parse(req.body);
  const item = await discoverService.updateDiscoverItem(req.params.id as string, validatedData);
  sendSuccess(res, 200, 'Item updated successfully', { item });
});

export const approveDiscoverItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const item = await discoverService.approveDiscoverItem(req.params.id as string);
  sendSuccess(res, 200, 'Item approved successfully', { item });
});

export const rejectDiscoverItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const item = await discoverService.rejectDiscoverItem(req.params.id as string);
  sendSuccess(res, 200, 'Item rejected successfully', { item });
});

export const deleteDiscoverItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await discoverService.deleteDiscoverItem(req.params.id as string);
  sendSuccess(res, 200, 'Item deleted successfully');
});

export const getCardMedia = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const media = await discoverService.getCardMedia(req.params.id as string);
  sendSuccess(res, 200, 'Card media fetched successfully', { media });
});

export const addCardMedia = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { url, mediaType, title, caption, uploadedBy } = req.body;
  if (!url) {
    return next(new AppError('Media URL is required', 400));
  }
  const media = await discoverService.addCardMedia({
    itemId: req.params.id as string,
    url,
    mediaType,
    title,
    caption,
    uploadedBy,
  });
  sendSuccess(res, 201, 'Media added to card successfully', { media });
});

export const toggleLikeMedia = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.uid || (req as any).user?.id || req.body.userId || 'AnonymousUser';
  const media = await discoverService.toggleLikeMedia(req.params.mediaId as string, userId);
  sendSuccess(res, 200, 'Media like toggled successfully', { media });
});

export const toggleDislikeMedia = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.uid || (req as any).user?.id || req.body.userId || 'AnonymousUser';
  const media = await discoverService.toggleDislikeMedia(req.params.mediaId as string, userId);
  sendSuccess(res, 200, 'Media dislike toggled successfully', { media });
});

