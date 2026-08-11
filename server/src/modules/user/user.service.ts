import { prisma as db } from '../../db';
import { UpdateProfileInput } from './user.validation';
import { AppError } from '../../errors/AppError';

export const getUserById = async (id: string) => {
  const user = await db.user.findFirst({
    where: {
      OR: [
        { id },
        { firebaseUid: id }
      ]
    },
    include: {
      journeys: true,
      galleryItems: true,
      categoryStories: true,
    }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

export const updateUserProfile = async (id: string, data: UpdateProfileInput) => {
  const updatedUser = await db.user.update({
    where: { id },
    data,
  });

  return updatedUser;
};

export const getLeaderboardUsers = async (limit = 100) => {
  const users = await db.user.findMany({
    take: limit,
    orderBy: [
      { rewardPoints: 'desc' },
      { badges: 'desc' },
      { createdAt: 'asc' },
    ],
    select: {
      id: true,
      firebaseUid: true,
      name: true,
      email: true,
      avatar: true,
      title: true,
      bio: true,
      rewardPoints: true,
      badges: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          journeys: true,
          galleryItems: true,
          categoryStories: true,
        },
      },
    },
  });

  // Calculate ranks and return formatted user list
  return users.map((user, index) => {
    let tier = 'Cultural Explorer';
    if (index === 0) tier = 'Heritage Sovereign';
    else if (index < 3) tier = 'Culture Champion';
    else if (index < 10) tier = 'Vedic Scholar';
    else if (index < 25) tier = 'Patliputra Pioneer';

    return {
      ...user,
      rank: index + 1,
      tier,
      totalContributions:
        user._count.journeys + user._count.galleryItems + user._count.categoryStories,
    };
  });
};

