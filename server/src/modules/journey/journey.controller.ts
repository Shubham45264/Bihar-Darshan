import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../helpers/responseHandler';
import * as journeyService from './journey.service';
import * as validation from './journey.validation';

export const getApprovedJourneys = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
  const journeys = await journeyService.getApprovedJourneys(page, limit);
  sendSuccess(res, 200, 'Journeys fetched successfully', { journeys });
});

export const getJourneyById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const journey = await journeyService.getJourneyById(req.params.id as string);
  sendSuccess(res, 200, 'Journey fetched successfully', { journey });
});

export const createJourney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = validation.createJourneySchema.parse(req.body);
  const journey = await journeyService.createJourney(req.user!.id as string, data);
  sendSuccess(res, 201, 'Journey submitted successfully and is pending approval', { journey });
});

export const approveJourney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await journeyService.approveJourneyWithEmail(req.params.id as string);
  sendSuccess(res, 200, result.message, {
    journey: result.journey,
    emailStatus: result.emailStatus,
    recipientEmail: result.recipientEmail,
  });
});

export const rejectJourney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const journey = await journeyService.updateJourneyStatus(req.params.id as string, 'REJECTED');
  sendSuccess(res, 200, 'Journey rejected successfully', { journey });
});

export const getAllJourneys = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const journeys = await journeyService.getAllJourneys();
  sendSuccess(res, 200, 'All journeys fetched successfully', { journeys });
});

export const updateJourney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const journey = await journeyService.updateJourney(req.params.id as string, req.user!.id, req.body);
  sendSuccess(res, 200, 'Journey updated successfully', { journey });
});

export const deleteJourney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await journeyService.deleteJourney(req.params.id as string);
  sendSuccess(res, 200, 'Journey deleted successfully', null);
});
