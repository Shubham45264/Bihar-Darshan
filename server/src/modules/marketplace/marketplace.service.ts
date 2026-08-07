import { prisma as db } from '../../db';
import { CreateProductInput } from './marketplace.validation';
import { AppError } from '../../errors/AppError';

export const getAllProducts = async (category?: string, status?: string, page?: number, limit?: number) => {
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

  const take = limit && limit > 0 ? limit : undefined;
  const skip = page && limit && page > 0 ? (page - 1) * limit : undefined;

  return db.marketplaceProduct.findMany({
    where: whereClause,
    take,
    skip,
    select: {
      id: true,
      businessName: true,
      productName: true,
      category: true,
      image: true,
      description: true,
      contact: true,
      email: true,
      status: true,
      publicId: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getProductById = async (id: string) => {
  const product = await db.marketplaceProduct.findUnique({ where: { id } });
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

export const createProduct = async (data: CreateProductInput & { status?: any }) => {
  return db.marketplaceProduct.create({ data });
};

export const updateProduct = async (id: string, data: Partial<CreateProductInput> & { status?: any }) => {
  await getProductById(id);
  return db.marketplaceProduct.update({
    where: { id },
    data,
  });
};

export const approveProduct = async (id: string) => {
  await getProductById(id);
  return db.marketplaceProduct.update({
    where: { id },
    data: { status: 'APPROVED' },
  });
};

export const rejectProduct = async (id: string) => {
  await getProductById(id);
  return db.marketplaceProduct.update({
    where: { id },
    data: { status: 'REJECTED' },
  });
};

export const deleteProduct = async (id: string) => {
  await getProductById(id);
  return db.marketplaceProduct.delete({ where: { id } });
};
