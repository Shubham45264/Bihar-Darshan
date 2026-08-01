import { prisma as db } from '../../db';
import { UpdateProfileInput } from './user.validation';
import { AppError } from '../../errors/AppError';

export const getUserById = async (id: string) => {
  const user = await db.user.findUnique({
    where: { id },
    include: {
      communityPosts: {
        include: {
          community: true
        }
      },
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
