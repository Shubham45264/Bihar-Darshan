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
