import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../helpers/responseHandler';
import { AppError } from '../../errors/AppError';
import * as communityService from './community.service';
import * as validation from './community.validation';
import { firebaseAdmin } from '../../config/firebase';
import { prisma as db } from '../../db';

const checkCommunityAccess = async (community: any, req: Request) => {
  if (community.status === 'APPROVED') return true;

  // If not approved, must be creator or admin
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return false;

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;
    const currentUser = await db.user.findUnique({
      where: { firebaseUid },
    });

    if (!currentUser) return false;

    // Check if creator or admin
    if (currentUser.role === 'ADMIN' || community.createdBy === currentUser.id) {
      req.user = currentUser;
      return true;
    }
  } catch (error) {
    console.error('checkCommunityAccess error:', error);
  }

  return false;
};

export const getAllCommunities = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const communities = await communityService.getAllCommunities();
  sendSuccess(res, 200, 'Communities fetched successfully', { communities });
});

export const getCommunityById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const community = await communityService.getCommunityById(req.params.id as string);
  const hasAccess = await checkCommunityAccess(community, req);
  if (!hasAccess) {
    return next(new AppError('Community is pending approval or access is denied', 403));
  }
  sendSuccess(res, 200, 'Community fetched successfully', { community });
});

export const createCommunity = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = validation.createCommunitySchema.parse(req.body);
  const community = await communityService.createCommunity(req.user!.id as string, data);
  sendSuccess(res, 201, 'Community created successfully', { community });
});

export const updateCommunity = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = validation.updateCommunitySchema.parse(req.body);
  const community = await communityService.updateCommunity(req.params.id as string, data);
  sendSuccess(res, 200, 'Community updated successfully', { community });
});

export const deleteCommunity = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await communityService.deleteCommunity(req.params.id as string);
  sendSuccess(res, 200, 'Community deleted successfully');
});

export const joinCommunity = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const community = await communityService.getCommunityById(req.params.id as string);
  if (community.status !== 'APPROVED' && req.user!.role !== 'ADMIN' && community.createdBy !== req.user!.id) {
    return next(new AppError('Cannot join a community that is not approved', 403));
  }
  const member = await communityService.joinCommunity(req.params.id as string, req.user!.id as string);
  sendSuccess(res, 200, 'Joined community successfully', { member });
});

export const leaveCommunity = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await communityService.leaveCommunity(req.params.id as string, req.user!.id as string);
  sendSuccess(res, 200, 'Left community successfully');
});

// Posts
export const getPostsByCommunity = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const community = await communityService.getCommunityById(req.params.id as string);
  const hasAccess = await checkCommunityAccess(community, req);
  if (!hasAccess) {
    return next(new AppError('Community is pending approval or access is denied', 403));
  }
  const posts = await communityService.getPostsByCommunity(req.params.id as string);
  sendSuccess(res, 200, 'Posts fetched successfully', { posts });
});

export const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = validation.createCommunityPostSchema.parse(req.body);
  const community = await communityService.getCommunityById(data.communityId);
  if (community.status !== 'APPROVED' && req.user!.role !== 'ADMIN' && community.createdBy !== req.user!.id) {
    return next(new AppError('Cannot post in a community that is not approved', 403));
  }
  const post = await communityService.createPost(req.user!.id as string, data);
  sendSuccess(res, 201, 'Post created successfully', { post });
});

export const likePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { voteType, previousVote } = req.body;
  if (!voteType || !previousVote) {
    return next(new AppError('voteType and previousVote are required', 400));
  }
  const post = await communityService.likePost(req.params.id as string, voteType, previousVote);
  sendSuccess(res, 200, 'Post liked successfully', { post });
});

export const votePoll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { optionId, previousOptionId } = req.body;
  if (!optionId) {
    return next(new AppError('optionId is required', 400));
  }
  const post = await communityService.votePoll(req.params.id as string, optionId, previousOptionId ?? null);
  sendSuccess(res, 200, 'Poll voted successfully', { post });
});

export const viewPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  await communityService.incrementPostViews(req.params.id as string, userId);
  sendSuccess(res, 200, 'View recorded');
});

// Comments
export const getPostComments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const post = await db.communityPost.findUnique({
    where: { id: req.params.id as string },
    include: { community: true }
  });
  if (!post) {
    return next(new AppError('Post not found', 404));
  }
  const hasAccess = await checkCommunityAccess(post.community, req);
  if (!hasAccess) {
    return next(new AppError('Community is pending approval or access is denied', 403));
  }

  const comments = await communityService.getPostComments(req.params.id as string);
  sendSuccess(res, 200, 'Comments fetched successfully', { comments });
});

export const createPostComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { content, parentId } = req.body;
  if (!content?.trim()) {
    return next(new AppError('Comment content is required', 400));
  }

  const post = await db.communityPost.findUnique({
    where: { id: req.params.id as string },
    include: { community: true }
  });
  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  if (post.community.status !== 'APPROVED' && req.user!.role !== 'ADMIN' && post.community.createdBy !== req.user!.id) {
    return next(new AppError('Cannot comment in a community that is not approved', 403));
  }

  const comment = await communityService.createPostComment(
    req.params.id as string,
    req.user!.id as string,
    content.trim(),
    parentId,
  );
  sendSuccess(res, 201, 'Comment created successfully', { comment });
});

export const getUserJoinedCommunities = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const communityIds = await communityService.getUserJoinedCommunities(req.user!.id as string);
  sendSuccess(res, 200, 'User joined communities fetched successfully', { communityIds });
});

export const getAdminAllCommunities = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const communities = await communityService.getAdminAllCommunities();
  sendSuccess(res, 200, 'All communities fetched for admin', { communities });
});

export const approveCommunity = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const community = await communityService.approveCommunity(req.params.id as string);
  sendSuccess(res, 200, 'Community approved successfully', { community });
});

export const rejectCommunity = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const community = await communityService.rejectCommunity(req.params.id as string);
  sendSuccess(res, 200, 'Community rejected successfully', { community });
});

