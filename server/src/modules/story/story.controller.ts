import { Request, Response, NextFunction } from 'express';
import * as storyService from './story.service';

export const createStory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const story = await storyService.createStory(req.body);
    res.status(201).json({
      success: true,
      message: 'Story submitted successfully! It will be published after admin approval.',
      data: { story },
    });
  } catch (error) {
    next(error);
  }
};

export const getStories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categorySlug, subcategorySlug, categoryId, subcategoryId, status } = req.query;
    const stories = await storyService.getStories({
      categorySlug: categorySlug as string,
      subcategorySlug: subcategorySlug as string,
      categoryId: categoryId as string,
      subcategoryId: subcategoryId as string,
      status: status as string,
    });
    res.status(200).json({
      success: true,
      data: { stories },
    });
  } catch (error) {
    next(error);
  }
};

export const getStoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const story = await storyService.getStoryById(id as string);
    if (!story) {
      res.status(404).json({ success: false, message: 'Story not found' });
      return;
    }
    res.status(200).json({
      success: true,
      data: { story },
    });
  } catch (error) {
    next(error);
  }
};

export const incrementViews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const story = await storyService.incrementViews(id as string, userId);
    res.status(200).json({
      success: true,
      data: { story },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const story = await storyService.toggleLike(id as string, userId || 'anonymous');
    res.status(200).json({
      success: true,
      data: { story },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleDislike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const story = await storyService.toggleDislike(id as string, userId || 'anonymous');
    res.status(200).json({
      success: true,
      data: { story },
    });
  } catch (error) {
    next(error);
  }
};

export const incrementShares = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const story = await storyService.incrementShares(id as string, userId);
    res.status(200).json({
      success: true,
      data: { story },
    });
  } catch (error) {
    next(error);
  }
};

export const approveStory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const story = await storyService.approveStory(id as string);
    res.status(200).json({
      success: true,
      message: 'Story approved successfully',
      data: { story },
    });
  } catch (error) {
    next(error);
  }
};

export const rejectStory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const story = await storyService.rejectStory(id as string);
    res.status(200).json({
      success: true,
      message: 'Story rejected',
      data: { story },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await storyService.deleteStory(id as string);
    res.status(200).json({
      success: true,
      message: 'Story deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
