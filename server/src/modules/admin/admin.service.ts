import { prisma as db } from '../../db';

export const getDashboardStats = async () => {
  const [
    totalUsers,
    totalDistricts,
    totalCommunities,
    pendingCommunities,
    pendingPosts,
    pendingJourneys,
    pendingGalleryItems,
    pendingDiscoverItems,
    pendingPersonalities
  ] = await Promise.all([
    db.user.count(),
    db.district.count(),
    db.community.count(),
    db.community.count({ where: { status: 'PENDING' } }),
    db.communityPost.count({ where: { status: 'PENDING' } }),
    db.journey.count({ where: { status: 'PENDING' } }),
    db.galleryItem.count({ where: { status: 'PENDING' } }),
    db.discoverItem.count({ where: { status: 'PENDING' } }),
    db.personality.count({ where: { status: 'PENDING' } }),
  ]);

  return {
    overview: {
      totalUsers,
      totalDistricts,
      totalCommunities,
    },
    pendingApprovals: {
      communities: pendingCommunities,
      posts: pendingPosts,
      journeys: pendingJourneys,
      galleryItems: pendingGalleryItems,
      discoverItems: pendingDiscoverItems,
      personalities: pendingPersonalities,
    }
  };
};

export const getPendingApprovals = async () => {
  const [communities, posts, journeys, galleryItems, discoverItems, personalities] = await Promise.all([
    db.community.findMany({ where: { status: 'PENDING' }, include: { creator: { select: { name: true, email: true } } } }),
    db.communityPost.findMany({ where: { status: 'PENDING' }, include: { author: { select: { name: true, email: true } } } }),
    db.journey.findMany({ where: { status: 'PENDING' }, include: { author: { select: { name: true, email: true } } } }),
    db.galleryItem.findMany({ where: { status: 'PENDING' }, include: { uploader: { select: { name: true, email: true } } } }),
    db.discoverItem.findMany({ where: { status: 'PENDING' } }),
    db.personality.findMany({ where: { status: 'PENDING' } }),
  ]);

  return {
    communities,
    posts,
    journeys,
    galleryItems,
    discoverItems,
    personalities,
  };
};

export const getSiteSettings = async () => {
  let settings = await (db.siteSettings as any).findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await (db.siteSettings as any).create({
      data: {
        id: 1,
        heroEyebrow: 'The Cradle of Enlightenment. The Soul of Heritage.',
        heroTitle: 'Unveil the Eternal Heritage of',
        heroSubtitle: 'Bihar',
        heroDescription: 'Step into a timeless realm of sacred landmarks, living traditions, authentic flavors, and enduring stories.',
        heroImage: '',
        heroVideo: '',
        statPlaces: '500+',
        statDistricts: '38',
        statCulturalSites: '100+',
        statFestivals: '50+',
        statTourists: '1000+',
        footerAbout: 'Bihar Darshan is a digital platform to explore the rich cultural heritage, historical landmarks, and vibrant communities of Bihar.',
      },
    });
  }
  return settings;
};

export const updateSiteSettings = async (data: any) => {
  const settings = await (db.siteSettings as any).upsert({
    where: { id: 1 },
    update: {
      heroEyebrow: data.heroEyebrow ?? 'The Cradle of Enlightenment. The Soul of Heritage.',
      heroTitle: data.heroTitle ?? 'Unveil the Eternal Heritage of',
      heroSubtitle: data.heroSubtitle ?? 'Bihar',
      heroDescription: data.heroDescription ?? '',
      heroImage: data.heroImage ?? '',
      heroVideo: data.heroVideo ?? '',
      statPlaces: data.statPlaces ?? '500+',
      statDistricts: data.statDistricts ?? '38',
      statCulturalSites: data.statCulturalSites ?? '100+',
      statFestivals: data.statFestivals ?? '50+',
      statTourists: data.statTourists ?? '1000+',
      footerAbout: data.footerAbout ?? '',
    },
    create: {
      id: 1,
      heroEyebrow: data.heroEyebrow ?? 'The Cradle of Enlightenment. The Soul of Heritage.',
      heroTitle: data.heroTitle ?? 'Unveil the Eternal Heritage of',
      heroSubtitle: data.heroSubtitle ?? 'Bihar',
      heroDescription: data.heroDescription ?? '',
      heroImage: data.heroImage ?? '',
      heroVideo: data.heroVideo ?? '',
      statPlaces: data.statPlaces ?? '500+',
      statDistricts: data.statDistricts ?? '38',
      statCulturalSites: data.statCulturalSites ?? '100+',
      statFestivals: data.statFestivals ?? '50+',
      statTourists: data.statTourists ?? '1000+',
      footerAbout: data.footerAbout ?? '',
    },
  });
  return settings;
};
