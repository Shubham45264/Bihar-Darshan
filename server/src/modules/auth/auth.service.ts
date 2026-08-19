import { prisma as db } from '../../db';

export const verifyAndSyncUser = async (firebaseUid: string, email?: string, name?: string, avatar?: string) => {
  // Check if user exists
  let user = await db.user.findUnique({
    where: { firebaseUid },
  });

  if (!user) {
    const isSystemAdmin = email?.toLowerCase() === 'bihardarshanofficial@gmail.com';
    const targetRole = isSystemAdmin ? 'ADMIN' : 'USER';
    // Create new user
    user = await db.user.create({
      data: {
        firebaseUid,
        email,
        name: name || 'User',
        avatar,
        role: targetRole,
      },
    });
  } else {
    const isSystemAdmin = email?.toLowerCase() === 'bihardarshanofficial@gmail.com';
    const updateData: any = {};
    if (isSystemAdmin && user.role !== 'ADMIN') {
      updateData.role = 'ADMIN';
    }
    if (email && user.email !== email) {
      updateData.email = email;
    }
    if (name && (!user.name || user.name === 'User') && name !== 'User') {
      updateData.name = name;
    }
    if (avatar && !user.avatar) {
      updateData.avatar = avatar;
    }

    if (Object.keys(updateData).length > 0) {
      user = await db.user.update({
        where: { id: user.id },
        data: updateData,
      });
    }
  }

  return user;
};
