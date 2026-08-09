import { prisma as db } from '../../db';
import { CreateTribeInput, CreateTribalArticleInput } from './culture.validation';
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
