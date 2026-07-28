import { prisma as db } from '../../db';

export const getAllCategories = async (status?: string) => {
  const whereClause: any = {};
  if (status) {
    const upperStatus = status.toUpperCase();
    if (upperStatus !== 'ALL') {
      whereClause.status = upperStatus;
    }
  } else {
    whereClause.status = 'APPROVED';
  }

  return db.customCategory.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
};

export const createCategory = async (data: {
  title: string;
  description?: string;
  image: string;
  district?: string;
  badgeText?: string;
  status?: string;
}) => {
  return db.customCategory.create({
    data: {
      title: data.title,
      description: data.description || null,
      image: data.image,
      district: data.district || 'BIHAR',
      badgeText: data.badgeText || data.title,
      status: (data.status as any) || 'PENDING',
    },
  });
};

export const approveCategory = async (id: string) => {
  return db.customCategory.update({
    where: { id },
    data: { status: 'APPROVED' },
  });
};

export const rejectCategory = async (id: string) => {
  return db.customCategory.update({
    where: { id },
    data: { status: 'REJECTED' },
  });
};

export const deleteCategory = async (id: string) => {
  return db.customCategory.delete({
    where: { id },
  });
};
