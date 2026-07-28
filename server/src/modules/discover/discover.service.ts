import { prisma as db } from '../../db';
import { CreateDiscoverInput, UpdateDiscoverInput } from './discover.validation';
import { AppError } from '../../errors/AppError';
import { DiscoverCategory } from '../../db';

export const getAllDiscoverItems = async (category?: string, status?: string) => {
  const whereClause: any = {};
  if (category) {
    whereClause.category = category;
  }
  if (status) {
    const upperStatus = status.toUpperCase();
    if (upperStatus !== 'ALL') {
      whereClause.status = upperStatus;
    }
  } else {
    whereClause.status = 'APPROVED';
  }

  return db.discoverItem.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
};

export const getDiscoverItemById = async (id: string) => {
  const item = await db.discoverItem.findUnique({
    where: { id },
  });

  if (!item) {
    throw new AppError('Discover item not found', 404);
  }

  return item;
};

export const createDiscoverItem = async (data: CreateDiscoverInput) => {
  const validCategories = ['FOOD', 'FESTIVAL', 'CRAFT', 'HERITAGE', 'WILDLIFE'];
  let mappedEnumCategory: DiscoverCategory = 'FESTIVAL';

  const upperCat = (data.category || '').toUpperCase();
  if (validCategories.includes(upperCat)) {
    mappedEnumCategory = upperCat as DiscoverCategory;
  } else if (upperCat.includes('FOOD')) {
    mappedEnumCategory = 'FOOD';
  } else if (upperCat.includes('CRAFT') || upperCat.includes('ART')) {
    mappedEnumCategory = 'CRAFT';
  } else if (upperCat.includes('HERITAGE') || upperCat.includes('PLACE')) {
    mappedEnumCategory = 'HERITAGE';
  } else if (upperCat.includes('WILD') || upperCat.includes('NATURE')) {
    mappedEnumCategory = 'WILDLIFE';
  } else {
    mappedEnumCategory = 'FESTIVAL';
  }

  const extendedDetails = [...(data.extendedDetails || [])];
  if (!validCategories.includes(upperCat) && data.category) {
    extendedDetails.push(`Category: ${data.category}`);
  }

  return db.discoverItem.create({
    data: {
      ...data,
      category: mappedEnumCategory,
      extendedDetails,
    },
  });
};

export const updateDiscoverItem = async (id: string, data: UpdateDiscoverInput) => {
  await getDiscoverItemById(id);
  const updatePayload: any = { ...data };
  if (data.category) {
    const validCategories = ['FOOD', 'FESTIVAL', 'CRAFT', 'HERITAGE', 'WILDLIFE'];
    const upperCat = data.category.toUpperCase();
    if (validCategories.includes(upperCat)) {
      updatePayload.category = upperCat as DiscoverCategory;
    } else {
      updatePayload.category = 'FESTIVAL';
    }
  }
  return db.discoverItem.update({
    where: { id },
    data: updatePayload,
  });
};

export const approveDiscoverItem = async (id: string) => {
  await getDiscoverItemById(id);
  return db.discoverItem.update({
    where: { id },
    data: { status: 'APPROVED' },
  });
};

export const rejectDiscoverItem = async (id: string) => {
  await getDiscoverItemById(id);
  return db.discoverItem.update({
    where: { id },
    data: { status: 'REJECTED' },
  });
};

export const deleteDiscoverItem = async (id: string) => {
  await getDiscoverItemById(id);
  return db.discoverItem.delete({
    where: { id },
  });
};

// ── CARD MEDIA FUNCTIONS ──

export const getCardMedia = async (itemId: string) => {
  return db.cardMedia.findMany({
    where: { itemId },
    orderBy: { createdAt: 'desc' },
  });
};

export const addCardMedia = async (data: {
  itemId: string;
  url: string;
  mediaType?: 'IMAGE' | 'VIDEO';
  title?: string;
  caption?: string;
  uploadedBy?: string;
}) => {
  return db.cardMedia.create({
    data: {
      itemId: data.itemId,
      url: data.url,
      mediaType: data.mediaType || 'IMAGE',
      title: data.title || null,
      caption: data.caption || null,
      uploadedBy: data.uploadedBy || 'User',
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: [],
    },
  });
};

export const toggleLikeMedia = async (mediaId: string, userId: string) => {
  const media = await db.cardMedia.findUnique({ where: { id: mediaId } });
  if (!media) throw new AppError('Media item not found', 404);

  const hasLiked = media.likedBy.includes(userId);
  const hasDisliked = media.dislikedBy.includes(userId);

  let newLikedBy = [...media.likedBy];
  let newDislikedBy = [...media.dislikedBy];

  if (hasLiked) {
    newLikedBy = newLikedBy.filter((id) => id !== userId);
  } else {
    newLikedBy.push(userId);
    if (hasDisliked) {
      newDislikedBy = newDislikedBy.filter((id) => id !== userId);
    }
  }

  return db.cardMedia.update({
    where: { id: mediaId },
    data: {
      likedBy: newLikedBy,
      dislikedBy: newDislikedBy,
      likes: newLikedBy.length,
      dislikes: newDislikedBy.length,
    },
  });
};

export const toggleDislikeMedia = async (mediaId: string, userId: string) => {
  const media = await db.cardMedia.findUnique({ where: { id: mediaId } });
  if (!media) throw new AppError('Media item not found', 404);

  const hasLiked = media.likedBy.includes(userId);
  const hasDisliked = media.dislikedBy.includes(userId);

  let newLikedBy = [...media.likedBy];
  let newDislikedBy = [...media.dislikedBy];

  if (hasDisliked) {
    newDislikedBy = newDislikedBy.filter((id) => id !== userId);
  } else {
    newDislikedBy.push(userId);
    if (hasLiked) {
      newLikedBy = newLikedBy.filter((id) => id !== userId);
    }
  }

  return db.cardMedia.update({
    where: { id: mediaId },
    data: {
      likedBy: newLikedBy,
      dislikedBy: newDislikedBy,
      likes: newLikedBy.length,
      dislikes: newDislikedBy.length,
    },
  });
};

