import { prisma as db } from '../../db';
import { CreateJourneyInput } from './journey.validation';
import { AppError } from '../../errors/AppError';
import { ApprovalStatus } from '../../db';

export const getApprovedJourneys = async (page?: number, limit?: number) => {
  const take = limit && limit > 0 ? limit : undefined;
  const skip = page && limit && page > 0 ? (page - 1) * limit : undefined;

  return db.journey.findMany({
    where: { status: 'APPROVED' },
    take,
    skip,
    select: {
      id: true,
      title: true,
      shortDesc: true,
      image: true,
      duration: true,
      budget: true,
      price: true,
      district: true,
      category: true,
      companyName: true,
      rating: true,
      status: true,
      createdAt: true,
      author: { select: { id: true, name: true, avatar: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getJourneyById = async (id: string) => {
  const journey = await db.journey.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true, avatar: true } } }
  });

  if (!journey) throw new AppError('Journey not found', 404);
  return journey;
};

export const createJourney = async (userId: string, data: CreateJourneyInput) => {
  return db.journey.create({
    data: {
      ...data,
      authorId: userId,
      status: 'PENDING',
    }
  });
};

export const updateJourneyStatus = async (id: string, status: ApprovalStatus) => {
  const journey = await db.journey.findUnique({ where: { id } });
  if (!journey) throw new AppError('Journey not found', 404);

  return db.journey.update({
    where: { id },
    data: { status }
  });
};

export const getAllJourneys = async (page?: number, limit?: number) => {
  const take = limit && limit > 0 ? limit : undefined;
  const skip = page && limit && page > 0 ? (page - 1) * limit : undefined;

  return db.journey.findMany({
    take,
    skip,
    select: {
      id: true,
      title: true,
      shortDesc: true,
      image: true,
      duration: true,
      budget: true,
      price: true,
      district: true,
      category: true,
      companyName: true,
      rating: true,
      status: true,
      createdAt: true,
      author: { select: { id: true, name: true, avatar: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const updateJourney = async (id: string, authorId: string, data: any) => {
  const journey = await db.journey.findUnique({ where: { id } });
  if (!journey) throw new AppError('Journey not found', 404);

  // Skip author verification check if request is by an admin
  const user = await db.user.findUnique({ where: { id: authorId } });
  if (journey.authorId !== authorId && user?.role !== 'ADMIN') {
    throw new AppError('Access denied: You are not the author of this journey', 403);
  }

  return db.journey.update({
    where: { id },
    data: {
      title: data.title,
      shortDesc: data.shortDesc,
      description: data.description,
      overviewText: data.overviewText,
      image: data.image,
      duration: data.duration,
      tripDuration: data.tripDuration,
      budget: data.budget,
      price: data.price,
      district: data.district,
      stops: data.stops,
      phone: data.phone,
      whatsapp: data.whatsapp,
      difficulty: data.difficulty,
      bestTime: data.bestTime,
      groupSize: data.groupSize,
      transportation: data.transportation,
      startPoint: data.startPoint,
      endPoint: data.endPoint,
      emergencyContact: data.emergencyContact,
      email: data.email,
      quote: data.quote,
      galleryImages: data.galleryImages,
      timeline: data.timeline,
      category: data.category,
      companyName: data.companyName,
      rating: data.rating,
      userRating: data.userRating,
      highlights: data.highlights,
      includedServices: data.includedServices,
      excludedServices: data.excludedServices,
      googleMapsLink: data.googleMapsLink,
      guideName: data.guideName,
      guideImage: data.guideImage,
      guideExperience: data.guideExperience,
      guideLanguages: data.guideLanguages,
      guideIntro: data.guideIntro,
      guidePhone: data.guidePhone,
      guideEmail: data.guideEmail,
      guideWhatsapp: data.guideWhatsapp,
      // If admin, keep the current status (e.g. APPROVED), else reset to PENDING for re-review
      status: user?.role === 'ADMIN' ? journey.status : 'PENDING'
    }
  });
};
