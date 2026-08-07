import { prisma as db } from '../../db';
import { CreateTribeInput, CreatePersonalityInput, CreateTribalArticleInput } from './culture.validation';
import { AppError } from '../../errors/AppError';

// --- Tribes ---
export const getAllTribes = async () => db.tribe.findMany();

export const getTribeById = async (id: string) => {
  const tribe = await db.tribe.findUnique({ where: { id } });
  if (!tribe) throw new AppError('Tribe not found', 404);
  return tribe;
};

export const createTribe = async (data: CreateTribeInput) => db.tribe.create({ data });

export const updateTribe = async (id: string, data: Partial<CreateTribeInput>) => {
  await getTribeById(id);
  return db.tribe.update({ where: { id }, data });
};

export const deleteTribe = async (id: string) => {
  await getTribeById(id);
  return db.tribe.delete({ where: { id } });
};

// --- Personalities ---
export const getAllPersonalities = async (status?: string, page?: number, limit?: number) => {
  const whereClause: any = {};
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

  return db.personality.findMany({
    where: whereClause,
    take,
    skip,
    select: {
      id: true,
      name: true,
      category: true,
      district: true,
      description: true,
      imageUrl: true,
      author: true,
      status: true,
      publicId: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPersonalityById = async (id: string) => {
  const personality = await db.personality.findUnique({ where: { id } });
  if (!personality) throw new AppError('Personality not found', 404);
  return personality;
};

export const createPersonality = async (data: CreatePersonalityInput) => db.personality.create({ data });

export const updatePersonality = async (id: string, data: Partial<CreatePersonalityInput>) => {
  await getPersonalityById(id);
  return db.personality.update({ where: { id }, data });
};

export const approvePersonality = async (id: string) => {
  await getPersonalityById(id);
  return db.personality.update({
    where: { id },
    data: { status: 'APPROVED' },
  });
};

export const rejectPersonality = async (id: string) => {
  await getPersonalityById(id);
  return db.personality.update({
    where: { id },
    data: { status: 'REJECTED' },
  });
};

export const deletePersonality = async (id: string) => {
  await getPersonalityById(id);
  return db.personality.delete({ where: { id } });
};

// --- Tribal Articles ---
export const getAllArticles = async () => db.tribalArticle.findMany();

export const getArticleById = async (id: string) => {
  const article = await db.tribalArticle.findUnique({ where: { id } });
  if (!article) throw new AppError('Article not found', 404);
  return article;
};

export const createArticle = async (data: CreateTribalArticleInput) => db.tribalArticle.create({ data });

export const updateArticle = async (id: string, data: Partial<CreateTribalArticleInput>) => {
  await getArticleById(id);
  return db.tribalArticle.update({ where: { id }, data });
};

export const deleteArticle = async (id: string) => {
  await getArticleById(id);
  return db.tribalArticle.delete({ where: { id } });
};
