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
      journeys: { where: { status: 'APPROVED' } },
      galleryItems: { where: { status: 'APPROVED' } },
      categoryStories: { where: { status: 'APPROVED' } },
    }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const userName = user.name.toLowerCase().trim();
  const userEmail = (user.email || '').toLowerCase().trim();

  const [approvedArticles, approvedVideos, approvedDiscover, approvedStories] = await Promise.all([
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

  const approvedJourneysCount = user.journeys.length;
  const approvedGalleryCount = user.galleryItems.length;
  const approvedStoriesCount = Math.max(user.categoryStories.length, approvedCategoryStoriesCount);

  const totalContributions =
    approvedJourneysCount +
    approvedGalleryCount +
    approvedStoriesCount +
    approvedDiscoverCount +
    approvedArticlesCount +
    approvedVideosCount;

  // Award 10 points for each contribution
  const dynamicContributionPoints = totalContributions * 10;
  const totalPoints = (user.rewardPoints || 0) + dynamicContributionPoints;

  return {
    ...user,
    rewardPoints: totalPoints,
    totalContributions,
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
    },
  });

  const [approvedArticles, approvedVideos, approvedDiscover, approvedStories] = await Promise.all([
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

    const totalContributions =
      approvedJourneysCount +
      approvedGalleryCount +
      approvedStoriesCount +
      approvedDiscoverCount +
      approvedArticlesCount +
      approvedVideosCount;

    // Award 10 points per contribution
    const dynamicContributionPoints = totalContributions * 10;
    const totalPoints = (user.rewardPoints || 0) + dynamicContributionPoints;

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

  // Assign rank and tier
  const rankedUsers = formattedUsers.slice(0, limit).map((user, index) => {
    let tier = 'Cultural Explorer';
    if (index === 0) tier = 'Heritage Sovereign';
    else if (index < 3) tier = 'Culture Champion';
    else if (index < 10) tier = 'Vedic Scholar';
    else if (index < 25) tier = 'Patliputra Pioneer';

    return {
      ...user,
      rank: index + 1,
      tier,
    };
  });

  return rankedUsers;
};

