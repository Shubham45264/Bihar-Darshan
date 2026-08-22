import { prisma as db } from '../../db';
import { CreateJourneyInput } from './journey.validation';
import { AppError } from '../../errors/AppError';
import { ApprovalStatus } from '../../db';
import { sendApprovalEmail } from '../../utils/emailService';

export const getApprovedJourneys = async (page?: number, limit?: number) => {
  const take = limit && limit > 0 ? limit : undefined;
  const skip = page && limit && page > 0 ? (page - 1) * limit : undefined;

  return db.journey.findMany({
    where: { status: 'APPROVED' },
    take,
    skip,
    include: {
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
  if (!journey) throw new AppError('Submission not found', 404);

  return db.journey.update({
    where: { id },
    data: { status }
  });
};

export const approveJourneyWithEmail = async (id: string) => {
  const journey = await db.journey.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  if (!journey) {
    throw new AppError('Submission not found', 404);
  }

  const isValidEmail = (e?: string | null): boolean => {
    if (!e) return false;
    const trimmed = e.trim().toLowerCase();
    if (trimmed.endsWith('@example.com') || trimmed.endsWith('@test.com') || trimmed.includes('contributor@example.com')) return false;
    return trimmed.includes('@') && trimmed.includes('.');
  };

  const candidateEmails = [
    journey.guideEmail,
    journey.email,
    journey.author?.email,
  ];
  const targetEmail = candidateEmails.find(isValidEmail);

  // Prevent sending duplicate emails if already approved and email sent
  if (journey.status === 'APPROVED' && journey.approvalEmailSent) {
    return {
      journey,
      emailStatus: 'ALREADY_SENT',
      message: `Listing already approved and notification email already sent to ${targetEmail || journey.guideEmail || 'guide'}.`,
      recipientEmail: targetEmail || null,
    };
  }

  const now = new Date();
  const startDate = journey.freeDisplayStartDate || now;
  // Calculate 10-day free display period
  const endDate = journey.freeDisplayEndDate || new Date(startDate.getTime() + 10 * 24 * 60 * 60 * 1000);

  // Format expiration date string (e.g., "August 29, 2026")
  const formattedEndDate = endDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // 1. Update listing publication status and dates in DB
  const updatedJourney = await db.journey.update({
    where: { id },
    data: {
      status: 'APPROVED',
      approvedAt: journey.approvedAt || now,
      freeDisplayStartDate: startDate,
      freeDisplayEndDate: endDate,
    },
    include: {
      author: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  const userName = updatedJourney.guideName || updatedJourney.author?.name || 'Contributor';

  if (!targetEmail) {
    return {
      journey: updatedJourney,
      emailStatus: 'NO_USER_EMAIL',
      message: 'Listing approved ✓ User email address not found or not provided.',
      recipientEmail: null,
    };
  }

  // 2. Send approval email
  const emailResult = await sendApprovalEmail({
    to: targetEmail,
    userName,
    listingTitle: updatedJourney.title,
    freePeriodEndDate: formattedEndDate,
  });

  if (emailResult.success) {
    // 3. Store email sent status in DB
    const finalJourney = await db.journey.update({
      where: { id },
      data: {
        approvalEmailSent: true,
        approvalEmailSentAt: new Date(),
      }
    });

    return {
      journey: finalJourney,
      emailStatus: 'SENT',
      message: `Listing approved ✓ Notification email sent to ${targetEmail}`,
      recipientEmail: targetEmail,
    };
  } else {
    // Email failed, approval remains valid for safe retry
    return {
      journey: updatedJourney,
      emailStatus: 'FAILED',
      message: `Listing approved ✓ Notification email failed: ${emailResult.error || 'Unknown error'}`,
      recipientEmail: targetEmail,
    };
  }
};

export const getAllJourneys = async (page?: number, limit?: number) => {
  const take = limit && limit > 0 ? limit : undefined;
  const skip = page && limit && page > 0 ? (page - 1) * limit : undefined;

  return db.journey.findMany({
    take,
    skip,
    include: {
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
      planName: data.planName !== undefined ? data.planName : (journey as any).planName,
      planDays: data.planDays !== undefined ? Number(data.planDays) : (journey as any).planDays,
      freeDisplayStartDate: data.planDays !== undefined ? new Date() : (data.freeDisplayStartDate ? new Date(data.freeDisplayStartDate) : (journey as any).freeDisplayStartDate),
      freeDisplayEndDate: data.planDays !== undefined ? new Date(Date.now() + Number(data.planDays) * 24 * 60 * 60 * 1000) : (data.freeDisplayEndDate ? new Date(data.freeDisplayEndDate) : (journey as any).freeDisplayEndDate),
      // If admin, keep the current status (e.g. APPROVED), else reset to PENDING for re-review
      status: user?.role === 'ADMIN' ? (data.status || journey.status) : 'PENDING'
    } as any
  });
};

export const deleteJourney = async (id: string) => {
  const journey = await db.journey.findUnique({ where: { id } });
  if (!journey) throw new AppError('Journey not found', 404);
  return db.journey.delete({ where: { id } });
};
