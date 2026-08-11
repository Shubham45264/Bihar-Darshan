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

const defaultPopularPlaces = [
  {
    id: "bodh-gaya",
    name: "Bodh Gaya",
    district: "Gaya District",
    image: "/src/assets/bodh-gaya.png",
    description: "The sacred site where Siddhartha Gautama attained enlightenment under the Bodhi Tree. Home to the magnificent Mahabodhi Temple, a UNESCO World Heritage Site drawing pilgrims from across the globe."
  },
  {
    id: "nalanda",
    name: "Nalanda",
    district: "Nalanda District",
    image: "/src/assets/nalanda.png",
    description: "Once the world's greatest centre of learning, Nalanda University flourished from the 5th to 12th century AD. Its sprawling ruins and ancient manuscripts tell the story of a golden era of knowledge."
  },
  {
    id: "rajgir",
    name: "Rajgir",
    district: "Nalanda District",
    image: "/src/assets/rajgir.png",
    description: "Nestled among lush green hills, Rajgir was the first capital of the Magadha Empire. Famous for its hot springs, the Vishwa Shanti Stupa, and its deep Buddhist and Jain heritage."
  },
  {
    id: "vaishali",
    name: "Vaishali",
    district: "Vaishali District",
    image: "/src/assets/vaishali.png",
    description: "One of the world's earliest republics and the birthplace of Lord Mahavira. Vaishali's ancient pillars, stupas, and serene excavated sites transport visitors back to a remarkable civilisation."
  },
  {
    id: "patna-sahib",
    name: "Patna Sahib",
    district: "Patna District",
    image: "/src/assets/patna-sahib.png",
    description: "The revered birthplace of Guru Gobind Singh Ji, the tenth Sikh Guru. Patna Sahib's golden Gurudwara stands as a beacon of devotion, attracting thousands of Sikh pilgrims every year."
  },
  {
    id: "pawapuri",
    name: "Pawapuri",
    district: "Nalanda District",
    image: "/src/assets/pawapuri.png",
    description: "The sacred Jain pilgrimage town where Lord Mahavira attained nirvana. The stunning Jal Mandir, a marble temple set in the middle of a lotus-filled pond, is its most iconic landmark."
  }
];

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
        popularPlaces: defaultPopularPlaces,
      },
    });
  } else if (!settings.popularPlaces) {
    settings = await (db.siteSettings as any).update({
      where: { id: 1 },
      data: { popularPlaces: defaultPopularPlaces },
    });
  }
  return settings;
};

export const updateSiteSettings = async (data: any) => {
  const updateData: any = {};
  if (data.heroEyebrow !== undefined) updateData.heroEyebrow = data.heroEyebrow;
  if (data.heroTitle !== undefined) updateData.heroTitle = data.heroTitle;
  if (data.heroSubtitle !== undefined) updateData.heroSubtitle = data.heroSubtitle;
  if (data.heroDescription !== undefined) updateData.heroDescription = data.heroDescription;
  if (data.heroImage !== undefined) updateData.heroImage = data.heroImage;
  if (data.heroVideo !== undefined) updateData.heroVideo = data.heroVideo;
  if (data.statPlaces !== undefined) updateData.statPlaces = data.statPlaces;
  if (data.statDistricts !== undefined) updateData.statDistricts = data.statDistricts;
  if (data.statCulturalSites !== undefined) updateData.statCulturalSites = data.statCulturalSites;
  if (data.statFestivals !== undefined) updateData.statFestivals = data.statFestivals;
  if (data.statTourists !== undefined) updateData.statTourists = data.statTourists;
  if (data.footerAbout !== undefined) updateData.footerAbout = data.footerAbout;
  if (data.popularPlaces !== undefined) updateData.popularPlaces = data.popularPlaces;

  const defaultData = {
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
  };

  const settings = await (db.siteSettings as any).upsert({
    where: { id: 1 },
    update: updateData,
    create: {
      id: 1,
      ...defaultData,
      ...updateData
    },
  });
  return settings;
};

export const awardUserPoints = async (
  userId: string,
  points: number,
  badges: number = 0,
  reason: string = 'Community Contribution Award'
) => {
  const user = await db.user.findFirst({
    where: {
      OR: [{ id: userId }, { firebaseUid: userId }],
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      rewardPoints: { increment: points },
      badges: { increment: badges },
    },
  });

  // Create notification for user
  await db.notification.create({
    data: {
      userId: user.id,
      title: '🎉 Points & Rewards Awarded!',
      message: `You earned +${points} reward points${badges > 0 ? ` and +${badges} badge(s)` : ''}! Reason: ${reason}`,
      type: 'REWARD',
    },
  });

  return updatedUser;
};

