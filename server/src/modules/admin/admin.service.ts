import { prisma as db } from '../../db';

export const getDashboardStats = async () => {
  const [
    totalUsers,
    totalDistricts,
    pendingJourneys,
    pendingGalleryItems,
    pendingDiscoverItems,
  ] = await Promise.all([
    db.user.count(),
    db.district.count(),
    db.journey.count({ where: { status: 'PENDING' } }),
    db.galleryItem.count({ where: { status: 'PENDING' } }),
    db.discoverItem.count({ where: { status: 'PENDING' } }),
  ]);

  return {
    overview: {
      totalUsers,
      totalDistricts,
    },
    pendingApprovals: {
      journeys: pendingJourneys,
      galleryItems: pendingGalleryItems,
      discoverItems: pendingDiscoverItems,
    }
  };
};

export const getPendingApprovals = async () => {
  const [journeys, galleryItems, discoverItems] = await Promise.all([
    db.journey.findMany({ where: { status: 'PENDING' }, include: { author: { select: { name: true, email: true } } } }),
    db.galleryItem.findMany({ where: { status: 'PENDING' }, include: { uploader: { select: { name: true, email: true } } } }),
    db.discoverItem.findMany({ where: { status: 'PENDING' } }),
  ]);

  return {
    journeys,
    galleryItems,
    discoverItems,
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
