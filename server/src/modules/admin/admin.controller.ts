import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../helpers/responseHandler';
import * as adminService from './admin.service';

export const getDashboardStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const stats = await adminService.getDashboardStats();
  sendSuccess(res, 200, 'Dashboard stats fetched successfully', { stats });
});

export const getPendingApprovals = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const approvals = await adminService.getPendingApprovals();
  sendSuccess(res, 200, 'Pending approvals fetched successfully', { approvals });
});

export const getSiteSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const settings = await adminService.getSiteSettings();
  sendSuccess(res, 200, 'Site settings fetched successfully', { settings });
});

export const updateSiteSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const settings = await adminService.updateSiteSettings(req.body);
  sendSuccess(res, 200, 'Site settings updated successfully', { settings });
});

export const awardUserPointsController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { points, badges, reason } = req.body;
  const updatedUser = await adminService.awardUserPoints(
    userId as string,
    Number(points || 0),
    Number(badges || 0),
    reason || 'Admin Reward Award'
  );
  sendSuccess(res, 200, 'Points awarded successfully', { user: updatedUser });
});


