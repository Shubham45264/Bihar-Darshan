import { prisma as db } from '../../db';
import { UpdateProfileInput } from './user.validation';
import { AppError } from '../../errors/AppError';
import { getBadgeFromPoints } from '../../utils/badgeUtils';
import { sendAchievementEmail } from '../../utils/emailService';
import { logger } from '../../utils/logger';

const MILESTONES = [
  { points: 100, badgeName: 'Culture Champion', icon: '🪷' },
  { points: 250, badgeName: 'Heritage Guardian', icon: '🏛️' },
  { points: 500, badgeName: 'Heritage Sovereign', icon: '👑' },
  { points: 1000, badgeName: 'Bihar Legend', icon: '🌟' },
];

export const checkAndUpdateUserMilestones = async (
  userId: string,
  userEmail: string | null,
  userName: string,
  totalPoints: number
) => {
  try {
    const existingHistories = await db.userBadgeHistory.findMany({
      where: { userId },
    });

    const recordedMilestones = new Set(existingHistories.map((h) => h.milestonePoints));
    const crossedMilestones = MILESTONES.filter((m) => totalPoints >= m.points);

    // If no histories exist yet, this is an existing user being migrated on first load
    const isFirstTimeInit = existingHistories.length === 0 && crossedMilestones.length > 0;

    let highestNewMilestone: (typeof MILESTONES)[0] | null = null;

    for (const m of crossedMilestones) {
      if (!recordedMilestones.has(m.points)) {
        try {
          await db.userBadgeHistory.create({
            data: {
              userId,
              milestonePoints: m.points,
              badgeName: m.badgeName,
              emailSent: isFirstTimeInit, // don't send emails for historical pre-existing points on first load
              emailSentAt: isFirstTimeInit ? new Date() : null,
            },
          });
        } catch (dbErr) {
          // Idempotency constraint protection
        }

        if (!isFirstTimeInit) {
          highestNewMilestone = m;
        }
      }
    }

    // Send email ONLY for newly crossed highest milestone during an active points update
    if (highestNewMilestone && userEmail) {
      const badgeInfo = getBadgeFromPoints(totalPoints);
      sendAchievementEmail({
        to: userEmail,
        userName: userName || 'Cultural Explorer',
        badgeName: highestNewMilestone.badgeName,
        badgeIcon: highestNewMilestone.icon,
        milestonePoints: highestNewMilestone.points,
        badgeMeaning: badgeInfo.meaning,
      })
        .then((res) => {
          if (res.success) {
            db.userBadgeHistory
              .updateMany({
                where: { userId, milestonePoints: highestNewMilestone!.points },
                data: { emailSent: true, emailSentAt: new Date() },
              })
              .catch(() => {});
          }
        })
        .catch((err) => logger.error('Failed sending achievement email:', err));
    }

    return await db.userBadgeHistory.findMany({
      where: { userId },
      orderBy: { milestonePoints: 'asc' },
    });
  } catch (err) {
    logger.error(`Error in checkAndUpdateUserMilestones for ${userId}:`, err);
    return [];
  }
};

export const getUserById = async (id: string) => {
  const user = await db.user.findFirst({
    where: {
      OR: [
        { id },
        { firebaseUid: id }
      ]
    },
    include: {
      journeys: { where: { status: 'APPROVED' } },
      galleryItems: { where: { status: 'APPROVED' } },
      categoryStories: { where: { status: 'APPROVED' } },
      marketplaceProducts: { where: { status: 'APPROVED' } },
      badgeHistories: { orderBy: { milestonePoints: 'asc' } }
    }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const userName = user.name.toLowerCase().trim();
  const userEmail = (user.email || '').toLowerCase().trim();

  const [approvedArticles, approvedVideos, approvedDiscover, approvedStories, approvedMarketplace] = await Promise.all([
    db.tribalArticle.findMany({
      where: { status: 'APPROVED' },
      select: { author: true },
    }).catch(() => []),
    db.tribeVideo.findMany({
      where: { status: 'APPROVED' },
      select: { userId: true, uploaderName: true },
    }).catch(() => []),
    db.discoverItem.findMany({
      where: { status: 'APPROVED' },
      select: { author: true },
    }).catch(() => []),
    db.categoryStory.findMany({
      where: { status: 'APPROVED' },
      select: { authorId: true, authorName: true },
    }).catch(() => []),
    db.marketplaceProduct.findMany({
      where: { status: 'APPROVED' },
      select: { userId: true, email: true, businessName: true },
    }).catch(() => []),
  ]);

  const approvedArticlesCount = approvedArticles.filter((art) => {
    if (!art.author) return false;
    const authorStr = art.author.toLowerCase().trim();
    return (
      authorStr === userName ||
      (userEmail && authorStr === userEmail) ||
      (userName && authorStr.includes(userName))
    );
  }).length;

  const approvedVideosCount = approvedVideos.filter((vid) => {
    if (vid.userId && (vid.userId === user.id || vid.userId === user.firebaseUid)) return true;
    if (!vid.uploaderName) return false;
    const uploaderStr = vid.uploaderName.toLowerCase().trim();
    return (
      uploaderStr === userName ||
      (userEmail && uploaderStr === userEmail) ||
      (userName && uploaderStr.includes(userName))
    );
  }).length;

  const approvedDiscoverCount = approvedDiscover.filter((disc) => {
    if (!disc.author) return false;
    const authorStr = disc.author.toLowerCase().trim();
    return (
      authorStr === userName ||
      (userEmail && authorStr === userEmail) ||
      (userName && authorStr.includes(userName))
    );
  }).length;

  const approvedCategoryStoriesCount = approvedStories.filter((s) => {
    if (s.authorId && (s.authorId === user.id || s.authorId === user.firebaseUid)) return true;
    if (!s.authorName) return false;
    const authorStr = s.authorName.toLowerCase().trim();
    return (
      authorStr === userName ||
      (userEmail && authorStr === userEmail) ||
      (userName && authorStr.includes(userName)) ||
      (userName && userName.includes(authorStr))
    );
  }).length;

  const matchedMarketplaceCount = approvedMarketplace.filter((p) => {
    if (p.userId && (p.userId === user.id || p.userId === user.firebaseUid)) return true;
    if (p.email && userEmail && p.email.toLowerCase().trim() === userEmail) return true;
    if (p.businessName && userName && p.businessName.toLowerCase().trim().includes(userName)) return true;
    return false;
  }).length;

  const approvedJourneysCount = user.journeys.length;
  const approvedGalleryCount = user.galleryItems.length;
  const approvedStoriesCount = Math.max(user.categoryStories.length, approvedCategoryStoriesCount);
  const approvedMarketplaceCount = Math.max(user.marketplaceProducts.length, matchedMarketplaceCount);

  const totalContributions =
    approvedJourneysCount +
    approvedGalleryCount +
    approvedStoriesCount +
    approvedDiscoverCount +
    approvedArticlesCount +
    approvedVideosCount +
    approvedMarketplaceCount;

  // Award 10 points for each contribution
  const dynamicContributionPoints = totalContributions * 10;
  const totalPoints = (user.rewardPoints || 0) + dynamicContributionPoints;

  // Check and record badge milestones idempotently
  const badgeHistory = await checkAndUpdateUserMilestones(user.id, user.email, user.name, totalPoints);
  const badge = getBadgeFromPoints(totalPoints);

  return {
    ...user,
    rewardPoints: totalPoints,
    totalContributions,
    badge,
    currentBadge: badge.fullName,
    badgeHistory,
  };
};

export const updateUserProfile = async (id: string, data: UpdateProfileInput) => {
  const updatedUser = await db.user.update({
    where: { id },
    data,
  });

  return updatedUser;
};

export const getLeaderboardUsers = async (limit = 100) => {
  // Fetch all users
  const users = await db.user.findMany({
    include: {
      journeys: {
        where: { status: 'APPROVED' },
        select: { id: true },
      },
      galleryItems: {
        where: { status: 'APPROVED' },
        select: { id: true },
      },
      categoryStories: {
        where: { status: 'APPROVED' },
        select: { id: true },
      },
      marketplaceProducts: {
        where: { status: 'APPROVED' },
        select: { id: true },
      },
      badgeHistories: { orderBy: { milestonePoints: 'asc' } },
    },
  });

  const [approvedArticles, approvedVideos, approvedDiscover, approvedStories, approvedMarketplace] = await Promise.all([
    db.tribalArticle.findMany({
      where: { status: 'APPROVED' },
      select: { author: true },
    }).catch(() => []),
    db.tribeVideo.findMany({
      where: { status: 'APPROVED' },
      select: { userId: true, uploaderName: true },
    }).catch(() => []),
    db.discoverItem.findMany({
      where: { status: 'APPROVED' },
      select: { author: true },
    }).catch(() => []),
    db.categoryStory.findMany({
      where: { status: 'APPROVED' },
      select: { authorId: true, authorName: true },
    }).catch(() => []),
    db.marketplaceProduct.findMany({
      where: { status: 'APPROVED' },
      select: { userId: true, email: true, businessName: true },
    }).catch(() => []),
  ]);

  const formattedUsers = users.map((user) => {
    const userName = user.name.toLowerCase().trim();
    const userEmail = (user.email || '').toLowerCase().trim();

    const approvedJourneysCount = user.journeys.length;
    const approvedGalleryCount = user.galleryItems.length;

    const approvedCategoryStoriesCount = approvedStories.filter((s) => {
      if (s.authorId && (s.authorId === user.id || s.authorId === user.firebaseUid)) return true;
      if (!s.authorName) return false;
      const authorStr = s.authorName.toLowerCase().trim();
      return (
        authorStr === userName ||
        (userEmail && authorStr === userEmail) ||
        (userName && authorStr.includes(userName)) ||
        (userName && userName.includes(authorStr))
      );
    }).length;

    const approvedStoriesCount = Math.max(user.categoryStories.length, approvedCategoryStoriesCount);

    const approvedArticlesCount = approvedArticles.filter((art) => {
      if (!art.author) return false;
      const authorStr = art.author.toLowerCase().trim();
      return (
        authorStr === userName ||
        (userEmail && authorStr === userEmail) ||
        (userName && authorStr.includes(userName))
      );
    }).length;

    const approvedVideosCount = approvedVideos.filter((vid) => {
      if (vid.userId && (vid.userId === user.id || vid.userId === user.firebaseUid)) return true;
      if (!vid.uploaderName) return false;
      const uploaderStr = vid.uploaderName.toLowerCase().trim();
      return (
        uploaderStr === userName ||
        (userEmail && uploaderStr === userEmail) ||
        (userName && uploaderStr.includes(userName))
      );
    }).length;

    const approvedDiscoverCount = approvedDiscover.filter((disc) => {
      if (!disc.author) return false;
      const authorStr = disc.author.toLowerCase().trim();
      return (
        authorStr === userName ||
        (userEmail && authorStr === userEmail) ||
        (userName && authorStr.includes(userName))
      );
    }).length;

    const matchedMarketplaceCount = approvedMarketplace.filter((p) => {
      if (p.userId && (p.userId === user.id || p.userId === user.firebaseUid)) return true;
      if (p.email && userEmail && p.email.toLowerCase().trim() === userEmail) return true;
      if (p.businessName && userName && p.businessName.toLowerCase().trim().includes(userName)) return true;
      return false;
    }).length;

    const approvedMarketplaceCount = Math.max(user.marketplaceProducts.length, matchedMarketplaceCount);

    const totalContributions =
      approvedJourneysCount +
      approvedGalleryCount +
      approvedStoriesCount +
      approvedDiscoverCount +
      approvedArticlesCount +
      approvedVideosCount +
      approvedMarketplaceCount;

    // Award 10 points per contribution
    const dynamicContributionPoints = totalContributions * 10;
    const totalPoints = (user.rewardPoints || 0) + dynamicContributionPoints;
    const badge = getBadgeFromPoints(totalPoints);

    return {
      id: user.id,
      firebaseUid: user.firebaseUid,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      title: user.title,
      bio: user.bio,
      rewardPoints: totalPoints,
      badges: user.badges || 0,
      badge,
      currentBadge: badge.fullName,
      badgeHistory: user.badgeHistories,
      role: user.role,
      createdAt: user.createdAt,
      totalContributions,
    };
  });

  // Sort by rewardPoints DESC, badges DESC, createdAt ASC
  formattedUsers.sort((a, b) => {
    if (b.rewardPoints !== a.rewardPoints) return b.rewardPoints - a.rewardPoints;
    if (b.badges !== a.badges) return b.badges - a.badges;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  // Assign rank
  const rankedUsers = formattedUsers.slice(0, limit).map((user, index) => {
    return {
      ...user,
      rank: index + 1,
    };
  });

  return rankedUsers;
};

