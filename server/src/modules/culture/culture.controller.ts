import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../helpers/responseHandler';
import * as cultureService from './culture.service';
import * as validation from './culture.validation';

// Tribes
export const getAllTribes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const tribes = await cultureService.getAllTribes();
  sendSuccess(res, 200, 'Tribes fetched successfully', { tribes });
});

export const getTribeById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const tribe = await cultureService.getTribeById(req.params.id as string);
  sendSuccess(res, 200, 'Tribe fetched successfully', { tribe });
});

export const createTribe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = validation.createTribeSchema.parse(req.body);
  const tribe = await cultureService.createTribe(data);
  sendSuccess(res, 201, 'Tribe created successfully', { tribe });
});

export const updateTribe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = validation.updateTribeSchema.parse(req.body);
  const tribe = await cultureService.updateTribe(req.params.id as string, data);
  sendSuccess(res, 200, 'Tribe updated successfully', { tribe });
});

export const deleteTribe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await cultureService.deleteTribe(req.params.id as string);
  sendSuccess(res, 200, 'Tribe deleted successfully');
});

// Personalities
export const getAllPersonalities = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const status = req.query.status as string;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
  const personalities = await cultureService.getAllPersonalities(status, page, limit);
  sendSuccess(res, 200, 'Personalities fetched successfully', { personalities });
});

export const getPersonalityById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const personality = await cultureService.getPersonalityById(req.params.id as string);
  sendSuccess(res, 200, 'Personality fetched successfully', { personality });
});

export const createPersonality = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = validation.createPersonalitySchema.parse(req.body);
  const personality = await cultureService.createPersonality(data);
  sendSuccess(res, 201, 'Personality created successfully', { personality });
});

export const updatePersonality = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = validation.updatePersonalitySchema.parse(req.body);
  const personality = await cultureService.updatePersonality(req.params.id as string, data);
  sendSuccess(res, 200, 'Personality updated successfully', { personality });
});

export const approvePersonality = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const personality = await cultureService.approvePersonality(req.params.id as string);
  sendSuccess(res, 200, 'Personality approved successfully', { personality });
});

export const rejectPersonality = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const personality = await cultureService.rejectPersonality(req.params.id as string);
  sendSuccess(res, 200, 'Personality rejected successfully', { personality });
});

export const deletePersonality = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await cultureService.deletePersonality(req.params.id as string);
  sendSuccess(res, 200, 'Personality deleted successfully');
});

// Articles
export const getAllArticles = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const articles = await cultureService.getAllArticles();
  sendSuccess(res, 200, 'Articles fetched successfully', { articles });
});

export const getArticleById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const article = await cultureService.getArticleById(req.params.id as string);
  sendSuccess(res, 200, 'Article fetched successfully', { article });
});

export const createArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = validation.createTribalArticleSchema.parse(req.body);
  const article = await cultureService.createArticle(data);
  sendSuccess(res, 201, 'Article created successfully', { article });
});

export const updateArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = validation.updateTribalArticleSchema.parse(req.body);
  const article = await cultureService.updateArticle(req.params.id as string, data);
  sendSuccess(res, 200, 'Article updated successfully', { article });
});

export const deleteArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await cultureService.deleteArticle(req.params.id as string);
  sendSuccess(res, 200, 'Article deleted successfully');
});
