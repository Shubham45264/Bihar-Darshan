import { prisma as db } from '../../db';

export const createStory = async (data: {
  title: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'IMAGE' | 'VIDEO';
  mediaFiles?: any;
  authorName?: string;
  authorAvatar?: string;
  authorId?: string;
  district?: string;
  categoryId: string;
  subcategoryId: string;
}) => {
  return db.categoryStory.create({
    data: {
      title: data.title,
      content: data.content,
      mediaUrl: data.mediaUrl || null,
      mediaType: data.mediaType || 'IMAGE',
      mediaFiles: data.mediaFiles ? data.mediaFiles : null,
      authorName: data.authorName || 'Anonymous',
      authorAvatar: data.authorAvatar || null,
      authorId: data.authorId || null,
      district: data.district || 'Bihar',
      categoryId: data.categoryId,
      subcategoryId: data.subcategoryId,
      status: 'PENDING', // User submitted stories require Admin verification
    },
    include: {
      category: true,
      subcategory: true,
    },
  });
};

export const getStories = async (filter: {
  categorySlug?: string;
  subcategorySlug?: string;
  categoryId?: string;
  subcategoryId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const whereClause: any = {};

  if (filter.status) {
    if (filter.status.toUpperCase() !== 'ALL') {
      whereClause.status = filter.status.toUpperCase();
    }
  } else {
    whereClause.status = 'APPROVED';
  }

  if (filter.categoryId) whereClause.categoryId = filter.categoryId;
  if (filter.subcategoryId) whereClause.subcategoryId = filter.subcategoryId;

  if (filter.categorySlug) {
    whereClause.category = { slug: filter.categorySlug };
  }
  if (filter.subcategorySlug) {
    whereClause.subcategory = { slug: filter.subcategorySlug };
  }

  const take = filter.limit && filter.limit > 0 ? filter.limit : undefined;
  const skip = filter.page && filter.limit && filter.page > 0 ? (filter.page - 1) * filter.limit : undefined;

  return db.categoryStory.findMany({
    where: whereClause,
    take,
    skip,
    select: {
      id: true,
      title: true,
      mediaUrl: true,
      mediaType: true,
      authorName: true,
      authorAvatar: true,
      district: true,
      views: true,
      likes: true,
      dislikes: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      categoryId: true,
      subcategoryId: true,
      category: { select: { id: true, title: true, slug: true } },
      subcategory: { select: { id: true, title: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getStoryById = async (id: string) => {
  return db.categoryStory.findUnique({
    where: { id },
    include: {
      category: true,
      subcategory: true,
    },
  });
};

export const incrementViews = async (id: string, userId?: string) => {
  const story = await db.categoryStory.findUnique({ where: { id } });
  if (!story) throw new Error('Story not found');

  // Only record views for authenticated / logged-in users
  if (!userId || userId === 'guest' || userId === 'anonymous') {
    return story;
  }

  // Check if this logged-in user already viewed the story
  const hasViewed = story.viewedBy?.includes(userId);
  if (hasViewed) {
    return story;
  }

  const newViewedBy = [...(story.viewedBy || []), userId];

  return db.categoryStory.update({
    where: { id },
    data: {
      viewedBy: newViewedBy,
      views: newViewedBy.length,
    },
    include: {
      category: true,
      subcategory: true,
    },
  });
};

export const toggleLike = async (id: string, userId: string) => {
  const story = await db.categoryStory.findUnique({ where: { id } });
  if (!story) throw new Error('Story not found');

  const hasLiked = story.likedBy.includes(userId);
  const hasDisliked = story.dislikedBy.includes(userId);

  let newLikedBy = [...story.likedBy];
  let newDislikedBy = [...story.dislikedBy];

  if (hasLiked) {
    newLikedBy = newLikedBy.filter((u) => u !== userId);
  } else {
    newLikedBy.push(userId);
    if (hasDisliked) {
      newDislikedBy = newDislikedBy.filter((u) => u !== userId);
    }
  }

  return db.categoryStory.update({
    where: { id },
    data: {
      likedBy: newLikedBy,
      dislikedBy: newDislikedBy,
      likes: newLikedBy.length,
      dislikes: newDislikedBy.length,
    },
    include: {
      category: true,
      subcategory: true,
    },
  });
};

export const toggleDislike = async (id: string, userId: string) => {
  const story = await db.categoryStory.findUnique({ where: { id } });
  if (!story) throw new Error('Story not found');

  const hasLiked = story.likedBy.includes(userId);
  const hasDisliked = story.dislikedBy.includes(userId);

  let newLikedBy = [...story.likedBy];
  let newDislikedBy = [...story.dislikedBy];

  if (hasDisliked) {
    newDislikedBy = newDislikedBy.filter((u) => u !== userId);
  } else {
    newDislikedBy.push(userId);
    if (hasLiked) {
      newLikedBy = newLikedBy.filter((u) => u !== userId);
    }
  }

  return db.categoryStory.update({
    where: { id },
    data: {
      likedBy: newLikedBy,
      dislikedBy: newDislikedBy,
      likes: newLikedBy.length,
      dislikes: newDislikedBy.length,
    },
    include: {
      category: true,
      subcategory: true,
    },
  });
};

export const incrementShares = async (id: string, userId?: string) => {
  const story = await db.categoryStory.findUnique({ where: { id } });
  if (!story) throw new Error('Story not found');

  if (!userId || userId === 'guest' || userId === 'anonymous') {
    return story;
  }

  const currentSharedBy = story.sharedBy || [];
  if (currentSharedBy.includes(userId)) {
    return story;
  }

  const newSharedBy = [...currentSharedBy, userId];

  return db.categoryStory.update({
    where: { id },
    data: {
      sharedBy: newSharedBy,
      shares: newSharedBy.length,
    },
    include: {
      category: true,
      subcategory: true,
    },
  });
};

// ── ADMIN STORY VERIFICATION ──

export const approveStory = async (id: string) => {
  return db.categoryStory.update({
    where: { id },
    data: { status: 'APPROVED' },
    include: { category: true, subcategory: true },
  });
};

export const rejectStory = async (id: string) => {
  return db.categoryStory.update({
    where: { id },
    data: { status: 'REJECTED' },
    include: { category: true, subcategory: true },
  });
};

export const deleteStory = async (id: string) => {
  return db.categoryStory.delete({
    where: { id },
  });
};
