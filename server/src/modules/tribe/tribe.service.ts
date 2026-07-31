import { prisma as db } from '../../db';
import { AppError } from '../../errors/AppError';
import { CreateTribeInput, UpdateTribeInput, CreateTribalArticleInput, CreateTribeVideoInput } from './tribe.validation';

// --- Tribes ---
export const getAllTribes = async (includeInactive = false) => {
  return db.tribe.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: [{ isFeatured: 'desc' }, { englishName: 'asc' }],
  });
};

export const getTribeById = async (id: string) => {
  const tribe = await db.tribe.findUnique({ where: { id } });
  if (!tribe) throw new AppError('Tribe not found', 404);
  return tribe;
};

export const createTribe = async (data: CreateTribeInput) => {
  return db.tribe.create({ data: data as any });
};

export const updateTribe = async (id: string, data: UpdateTribeInput) => {
  const existing = await db.tribe.findUnique({ where: { id } });
  
  if (!existing) {
    // If it doesn't exist, create it (e.g. saving a mock tribe for the first time)
    return db.tribe.create({
      data: {
        id,
        hindiName: data.hindiName || '',
        englishName: data.englishName || '',
        shortDesc: data.shortDesc || '',
        image: data.image || '',
        leftTitle: data.leftTitle,
        leftDesc: data.leftDesc,
        rightTitle: data.rightTitle,
        rightDesc: data.rightDesc,
        bottomDesc: data.bottomDesc,
        cultureSections: data.cultureSections ? (data.cultureSections as any) : undefined,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
      }
    });
  }

  return db.tribe.update({
    where: { id },
    data: data as any,
  });
};

export const deleteTribe = async (id: string) => {
  await getTribeById(id);
  return db.tribe.delete({ where: { id } });
};

// --- Tribal Articles ---
export const getApprovedArticles = async (tribeName?: string) => {
  const whereClause: any = { status: 'APPROVED' };
  if (tribeName) {
    whereClause.tribe = { equals: tribeName, mode: 'insensitive' };
  }
  return db.tribalArticle.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
};

export const getAllArticlesAdmin = async () => {
  return db.tribalArticle.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getPendingArticles = async () => {
  return db.tribalArticle.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
  });
};

export const createTribalArticle = async (data: CreateTribalArticleInput, userRole: string = 'USER') => {
  // If the user is an ADMIN, auto-approve the article
  const status = userRole === 'ADMIN' ? 'APPROVED' : 'PENDING';
  
  // Provide defaults for image if missing
  const image = data.image || (data.images && data.images.length > 0 ? data.images[0] : '');
  
  const createData = {
    ...data,
    image,
    status: status as any,
  };
  
  return db.tribalArticle.create({ data: createData as any });
};

export const approveArticle = async (id: string) => {
  const article = await db.tribalArticle.findUnique({ where: { id } });
  if (!article) throw new AppError('Article not found', 404);
  
  return db.tribalArticle.update({
    where: { id },
    data: { status: 'APPROVED' },
  });
};

export const rejectArticle = async (id: string) => {
  const article = await db.tribalArticle.findUnique({ where: { id } });
  if (!article) throw new AppError('Article not found', 404);
  
  return db.tribalArticle.update({
    where: { id },
    data: { status: 'REJECTED' },
  });
};

export const deleteArticle = async (id: string) => {
  const article = await db.tribalArticle.findUnique({ where: { id } });
  if (!article) throw new AppError('Article not found', 404);
  
  return db.tribalArticle.delete({ where: { id } });
};

// --- Tribe Videos ---
export const getApprovedTribeVideos = async (tribeId?: string, tribeName?: string) => {
  const whereClause: any = { status: 'APPROVED' };
  if (tribeId) whereClause.tribeId = tribeId;
  else if (tribeName) whereClause.tribeName = { equals: tribeName, mode: 'insensitive' };
  
  return (db as any).tribeVideo.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
};

export const getPendingTribeVideos = async () => {
  return (db as any).tribeVideo.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
  });
};

export const createTribeVideo = async (data: CreateTribeVideoInput, userRole: string = 'USER') => {
  const status = userRole === 'ADMIN' ? 'APPROVED' : 'PENDING';
  const caption = data.caption || data.title || '';
  const title = data.title || caption;
  const uploaderName = data.uploaderName || 'Community Member';

  return (db as any).tribeVideo.create({
    data: {
      title,
      caption,
      videoUrl: data.videoUrl,
      uploaderName,
      description: data.description || null,
      tribeId: data.tribeId,
      tribeName: data.tribeName,
      status,
    },
  });
};

export const getAllTribeVideos = async (status?: string) => {
  const whereClause: any = {};
  if (status && status !== 'all') {
    whereClause.status = status.toUpperCase();
  }
  return (db as any).tribeVideo.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
};

export const approveTribeVideo = async (id: string) => {
  const video = await (db as any).tribeVideo.findUnique({ where: { id } });
  if (!video) throw new AppError('Video not found', 404);
  return (db as any).tribeVideo.update({
    where: { id },
    data: { status: 'APPROVED', rejectionReason: null },
  });
};

export const rejectTribeVideo = async (id: string, rejectionReason?: string) => {
  const video = await (db as any).tribeVideo.findUnique({ where: { id } });
  if (!video) throw new AppError('Video not found', 404);
  return (db as any).tribeVideo.update({
    where: { id },
    data: {
      status: 'REJECTED',
      rejectionReason: rejectionReason || 'Content does not meet site community guidelines.',
    },
  });
};

export const deleteTribeVideo = async (id: string) => {
  const video = await (db as any).tribeVideo.findUnique({ where: { id } });
  if (!video) throw new AppError('Video not found', 404);
  return (db as any).tribeVideo.delete({ where: { id } });
};
