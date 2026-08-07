import { prisma as db } from '../../db';
import { CreateGalleryItemInput } from './gallery.validation';
import { AppError } from '../../errors/AppError';
import { ApprovalStatus } from '../../db';

export const getApprovedGalleryItems = async (category?: string, page?: number, limit?: number) => {
  const take = limit && limit > 0 ? limit : undefined;
  const skip = page && limit && page > 0 ? (page - 1) * limit : undefined;

  return db.galleryItem.findMany({
    where: {
      status: 'APPROVED',
      ...(category && { category })
    },
    take,
    skip,
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      category: true,
      likes: true,
      views: true,
      status: true,
      publicId: true,
      createdAt: true,
      uploader: { select: { id: true, name: true, avatar: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getGalleryItemById = async (id: string) => {
  const item = await db.galleryItem.findUnique({
    where: { id },
    include: { uploader: { select: { id: true, name: true, avatar: true } } }
  });

  if (!item) throw new AppError('Gallery item not found', 404);
  return item;
};

export const uploadGalleryItem = async (userId: string, data: CreateGalleryItemInput) => {
  return db.galleryItem.create({
    data: {
      ...data,
      uploaderId: userId,
      status: 'PENDING',
    }
  });
};

import { deleteFromCloudinary } from '../../utils/cloudinary';

export const updateGalleryItemStatus = async (id: string, status: ApprovalStatus) => {
  const item = await db.galleryItem.findUnique({ where: { id } });
  if (!item) throw new AppError('Gallery item not found', 404);

  return db.galleryItem.update({
    where: { id },
    data: { status }
  });
};

export const deleteGalleryItem = async (id: string) => {
  const item = await db.galleryItem.findUnique({ where: { id } });
  if (!item) throw new AppError('Gallery item not found', 404);

  if (item.publicId) {
    await deleteFromCloudinary(item.publicId, 'image').catch(() => null);
  }

  return db.galleryItem.delete({ where: { id } });
};
