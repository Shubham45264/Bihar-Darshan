import { prisma as db } from '../../db';

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getAllCategories = async (status?: string) => {
  const whereClause: any = {};
  if (status && status.toUpperCase() !== 'ALL') {
    whereClause.status = status.toUpperCase();
  }

  return db.category.findMany({
    where: whereClause,
    include: {
      subcategories: {
        orderBy: { createdAt: 'asc' },
      },
      _count: {
        select: {
          stories: {
            where: { status: 'APPROVED' },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
};

export const getCategoryBySlug = async (slug: string) => {
  return db.category.findUnique({
    where: { slug },
    include: {
      subcategories: {
        include: {
          _count: {
            select: {
              stories: {
                where: { status: 'APPROVED' },
              },
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
};

export const createCategory = async (data: {
  title: string;
  description?: string;
  image: string;
  icon?: string;
  status?: string;
}) => {
  const slug = slugify(data.title);
  return db.category.create({
    data: {
      title: data.title,
      slug,
      description: data.description || null,
      image: data.image,
      icon: data.icon || null,
      status: (data.status as any) || 'APPROVED',
    },
    include: {
      subcategories: true,
    },
  });
};

export const updateCategory = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    image?: string;
    icon?: string;
    status?: string;
  }
) => {
  const updateData: any = { ...data };
  if (data.title) {
    updateData.slug = slugify(data.title);
  }
  return db.category.update({
    where: { id },
    data: updateData,
    include: {
      subcategories: true,
    },
  });
};

export const deleteCategory = async (id: string) => {
  return db.category.delete({
    where: { id },
  });
};

// ── SUBCATEGORY SERVICES ──

export const createSubCategory = async (
  categoryId: string,
  data: { title: string; description?: string; image: string; icon?: string }
) => {
  const slug = slugify(data.title);
  return db.subCategory.create({
    data: {
      title: data.title,
      slug,
      description: data.description || null,
      image: data.image,
      icon: data.icon || null,
      categoryId,
    },
  });
};

export const updateSubCategory = async (
  id: string,
  data: { title?: string; description?: string; image?: string; icon?: string }
) => {
  const updateData: any = { ...data };
  if (data.title) {
    updateData.slug = slugify(data.title);
  }
  return db.subCategory.update({
    where: { id },
    data: updateData,
  });
};

export const deleteSubCategory = async (id: string) => {
  return db.subCategory.delete({
    where: { id },
  });
};
