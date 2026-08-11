import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../helpers/responseHandler';

import { getUserById, updateUserProfile, getLeaderboardUsers } from './user.service';
import { updateProfileSchema } from './user.validation';

export const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await getUserById(req.user!.id as string);
  sendSuccess(res, 200, 'Profile fetched successfully', { user });
});

export const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = updateProfileSchema.parse(req.body);
  const updatedUser = await updateUserProfile(req.user!.id as string, validatedData);
  sendSuccess(res, 200, 'Profile updated successfully', { user: updatedUser });
});

export const getUserProfileById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = await getUserById(id as string);
  sendSuccess(res, 200, 'User profile fetched successfully', { user });
});

export const getLeaderboard = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
  const users = await getLeaderboardUsers(limit);
  sendSuccess(res, 200, 'Leaderboard fetched successfully', { leaderboard: users });
});

