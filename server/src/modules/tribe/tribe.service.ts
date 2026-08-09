import { prisma as db } from '../../db';
import { AppError } from '../../errors/AppError';
import { CreateTribeInput, UpdateTribeInput, CreateTribalArticleInput, CreateTribeVideoInput } from './tribe.validation';
import { deleteFromCloudinary } from '../../utils/cloudinary';

// --- Initial Mock Seed Data for Auto-initialization ---
const fullTribesSeedList = [
  { id: "santhal", hindiName: "संथाल", englishName: "Santhal Tribe", shortDesc: "The largest indigenous tribe of India, known for their deep connection to nature.", image: "/images/tribals/santhal.png", leftTitle: "Cultural Roots", leftDesc: "Santhal culture is deeply rooted in nature. They revere Marang Buru and celebrate agricultural festivals like Sohrai and Baha with vibrant rhythmic dances.", rightTitle: "Attire & Art", rightDesc: "Traditional Santhal women wear Santhali Saris, while men wear Panche. Renowned for Jadopatia scroll paintings and wall art.", bottomDesc: "\"Their society is famously egalitarian, governed by a village headman (Manjhi Haram).\"" },
  { id: "oraon", hindiName: "उरांव", englishName: "Oraon Tribe", shortDesc: "Celebrated for progressive agricultural practices and dynamic community life.", image: "/images/tribals/oraon_nobg.png", leftTitle: "Dharmes & Sarnaism", leftDesc: "The Oraon follow Sarnaism worshipping nature deity Dharmes in sacred groves called Sarna.", rightTitle: "Youth Dormitories", rightDesc: "Their society features the Dhumkuria youth dormitory for cultural and moral training.", bottomDesc: "\"Sarhul and Karam festivals are celebrated with synchronized communal dancing.\"" },
  { id: "munda", hindiName: "मुंडा", englishName: "Munda Tribe", shortDesc: "Famous for their rich history of rebellion and vibrant hunting and agricultural festivals.", image: "/images/tribals/munda.png", leftTitle: "Sarna & Singbonga", leftDesc: "Believers in Singbonga (Sun God) with rituals performed in sacred Sarna groves.", rightTitle: "Akhra & Music", rightDesc: "The Akhra serves as village dance ground for folk dances like Jadur.", bottomDesc: "\"Birsa Munda led the historic Ulgulan movement against colonial oppression.\"" },
  { id: "kharwar", hindiName: "खरवार", englishName: "Kharwar Tribe", shortDesc: "A martial tribe known for their resilience and deep connection to the land.", image: "/images/tribals/kharwar.png", leftTitle: "Martial Heritage", leftDesc: "Known for martial traditions and Suryavanshi lineage with a strong code of honor.", rightTitle: "Baiga & Rituals", rightDesc: "Village priest (Baiga) leads nature and ancestor veneration rituals.", bottomDesc: "\"Modern Kharwars are peaceful agriculturalists maintaining strong community bonds.\"" },
  { id: "tharu", hindiName: "थारू", englishName: "Tharu Tribe", shortDesc: "Residing in Champaran, known for unique architecture and forest wisdom.", image: "/images/tribals/tharu.png", leftTitle: "Forest Dwellers", leftDesc: "Terai region inhabitants known for sustainable eco-friendly living.", rightTitle: "Matriarchal Influence", rightDesc: "Women hold prominent decision-making authority in households.", bottomDesc: "\"Traditional mud houses adorned with murals stay cool in Terai heat.\"" },
  { id: "gond", hindiName: "गोंड", englishName: "Gond Tribe", shortDesc: "Found in Siwan and Kaimur, world-renowned for vibrant dot art.", image: "/images/tribals/gond.png", leftTitle: "Gond Art", leftDesc: "World-famous intricate dot painting style portraying flora and fauna.", rightTitle: "Spiritual Beliefs", rightDesc: "Worship Bara Deo, believing art brings good fortune to home.", bottomDesc: "\"Pardhans preserve oral traditions through epic folk story songs.\"" },
  { id: "asur", hindiName: "असुर", englishName: "Asur Tribe", shortDesc: "Ancient Scheduled Tribe renowned for indigenous iron smelting heritage.", image: "/images/tribals/asur.png", leftTitle: "Ancient Smelters", leftDesc: "Pioneered indigenous iron extraction techniques from laterite ore.", rightTitle: "Cultural Identity", rightDesc: "Maintain Asuri language and distinct animistic spiritual customs.", bottomDesc: "\"Preserving ancient metallurgical lore is a tribal priority.\"" },
  { id: "baiga", hindiName: "बैगा", englishName: "Baiga Tribe", shortDesc: "Forest-dwelling community with vast traditional ethnobotanical knowledge.", image: "/images/tribals/baiga.png", leftTitle: "Ethnobotany", leftDesc: "Renowned medicinal plant experts and traditional forest healers.", rightTitle: "Tattoo Art", rightDesc: "Elaborate Godna geometric tattoos form vital rite of passage.", bottomDesc: "\"Revere the earth deeply, traditionally practicing sustainable Bewar agriculture.\"" },
  { id: "banjara", hindiName: "बंजारा", englishName: "Banjara Tribe", shortDesc: "Vibrant nomadic community celebrated for ornate mirrorwork embroidery.", image: "/images/tribals/banjara.png" },
  { id: "bathudi", hindiName: "बाथुड़ी", englishName: "Bathudi Tribe", shortDesc: "Agricultural community with rich folk traditions and village deities.", image: "/images/tribals/bathudi.png" },
  { id: "beriya", hindiName: "बेरिया", englishName: "Beriya Tribe", shortDesc: "Indigenous tribe contributing to the cultural tapestry of Bihar.", image: "/images/tribals/beriya.png" },
  { id: "bhejiya", hindiName: "भेजिया", englishName: "Bhejiya Tribe", shortDesc: "Traditional indigenous group known for agrarian lifestyle.", image: "/images/tribals/bhejiya.png" },
  { id: "bhumij", hindiName: "भूमिज", englishName: "Bhumij Tribe", shortDesc: "Land-owning agricultural tribe with rich Sarhul festival heritage.", image: "/images/tribals/bhumij.png" },
  { id: "binjhia", hindiName: "बिंझिया", englishName: "Binjhia Tribe", shortDesc: "Known for distinct clan structure and traditional rituals.", image: "/images/tribals/binjhia.png" },
  { id: "birhor", hindiName: "बिरहोर", englishName: "Birhor Tribe", shortDesc: "Forest nomads famed for crafting natural fiber ropes and woodwork.", image: "/images/tribals/birhor.png" },
  { id: "birjia", hindiName: "बिरजिया", englishName: "Birjia Tribe", shortDesc: "Traditional iron workers and forest gatherers of Chota Nagpur plateau.", image: "/images/tribals/birjia.png" },
  { id: "chero", hindiName: "चेरो", englishName: "Chero Tribe", shortDesc: "Historical ruler tribe known as Chawanbansi Rajputs.", image: "/images/tribals/chero.png" },
  { id: "chickbaraik", hindiName: "चिक बड़ाइक", englishName: "Chick Baraik Tribe", shortDesc: "Master weavers responsible for traditional tribal textile fabrics.", image: "/images/tribals/chickbaraik.png" },
  { id: "gorait", hindiName: "गोरैत", englishName: "Gorait Tribe", shortDesc: "Traditional musicians and drum players in tribal ceremonies.", image: "/images/tribals/gorait.png" },
  { id: "ho", hindiName: "हो", englishName: "Ho Tribe", shortDesc: "Resilient agricultural tribe following Warang Chiti script heritage.", image: "/images/tribals/ho.png" },
  { id: "karmali", hindiName: "करमाली", englishName: "Karmali Tribe", shortDesc: "Traditional blacksmiths crafting agricultural and domestic tools.", image: "/images/tribals/karmali.png" },
  { id: "kharia", hindiName: "खड़िया", englishName: "Kharia Tribe", shortDesc: "Divided into Hill, Dudh, and Delki clans with deep nature lore.", image: "/images/tribals/kharia.png" },
  { id: "khond", hindiName: "कोंध", englishName: "Khond Tribe", shortDesc: "Hill community with rich oral poetry and animistic reverence.", image: "/images/tribals/khond.png" },
  { id: "kisan", hindiName: "किसान", englishName: "Kisan Tribe", shortDesc: "Hardworking agricultural tribe dedicated to grain cultivation.", image: "/images/tribals/kisan.png" },
  { id: "kora", hindiName: "कोड़ा", englishName: "Kora Tribe", shortDesc: "Famed earth workers with expertise in canal and embankment building.", image: "/images/tribals/kora.png" },
  { id: "korba", hindiName: "कोरबा", englishName: "Korba Tribe", shortDesc: "Forest dwellers maintaining traditional hunting and gathering skills.", image: "/images/tribals/korba.png" },
  { id: "loharalohra", hindiName: "लोहरा", englishName: "Lohara/Lohra Tribe", shortDesc: "Essential artisan community providing metal craft across villages.", image: "/images/tribals/loharalohra.png" },
  { id: "mahli", hindiName: "महली", englishName: "Mahli Tribe", shortDesc: "Bamboo artisan tribe specializing in weaving baskets and traps.", image: "/images/tribals/mahli.png" },
  { id: "malpahariya", hindiName: "माल पहाड़िया", englishName: "Mal Pahariya Tribe", shortDesc: "Hill tribe practicing slash-and-burn farming and forest harvest.", image: "/images/tribals/malpahariya.png" },
  { id: "parhaiya", hindiName: "परहिया", englishName: "Parhaiya Tribe", shortDesc: "Vulnerable tribal group known for bamboo craft and honey collecting.", image: "/images/tribals/parhaiya.png" },
  { id: "sauriapaharia", hindiName: "सौरिया पहाड़िया", englishName: "Sauria Paharia Tribe", shortDesc: "Rajmahal hills inhabitants with unique Malto Dravidian language.", image: "/images/tribals/sauriapaharia.png" },
  { id: "savar", hindiName: "सवर", englishName: "Savar Tribe", shortDesc: "Ancient forest tribe mentioned in ancient scriptures.", image: "/images/tribals/savar.png" },
];

const buildDefaultCultureSections = (id: string, tribeName: string) => [
  {
    heading: 'Traditions & Culture',
    cards: [
      { image: `/images/tribals/${id}.png`, title: `${tribeName} Heritage`, description: `Rich traditional customs, nature worship, and seasonal harvest festivals celebrated by the ${tribeName}.` },
      { image: `/images/tribals/generic.png`, title: 'Communal Dance & Music', description: 'Vibrant community music and folk dances performed during sacred village celebrations.' },
    ],
  },
  {
    heading: 'Famous Personalities',
    cards: [
      { image: `/images/tribals/${id}.png`, title: `${tribeName} Leaders`, description: `Prominent figures, freedom fighters, and revered elders who shaped the identity of the ${tribeName}.` },
    ],
  },
  {
    heading: 'Arts & Handicrafts',
    cards: [
      { image: `/images/tribals/generic.png`, title: 'Tribal Handicrafts', description: `Handcrafted bamboo items, wall paintings, floor murals, and traditional textile weaving.` },
    ],
  },
  {
    heading: 'Food',
    cards: [
      { image: `/images/tribals/generic.png`, title: 'Traditional Staples', description: 'Nutritious organic meals made from wild forest produce, coarse grains, and local rice.' },
    ],
  },
  {
    heading: 'Oral Stories & Folklore',
    cards: [
      { image: `/images/tribals/${id}.png`, title: 'Ancestral Folklore', description: `Folk tales, creation myths, and oral histories handed down through generations by community elders.` },
    ],
  },
];

const syncAllTribes = async () => {
  try {
    for (const item of fullTribesSeedList) {
      const existing = await db.tribe.findUnique({ where: { id: item.id } });
      const defaultSections = buildDefaultCultureSections(item.id, item.englishName);

      if (!existing) {
        await db.tribe.create({
          data: {
            id: item.id,
            hindiName: item.hindiName,
            englishName: item.englishName,
            shortDesc: item.shortDesc,
            image: item.image,
            leftTitle: item.leftTitle || "Cultural Roots",
            leftDesc: item.leftDesc || `${item.englishName} has a rich heritage deeply connected with nature, traditional land stewardship, and community living.`,
            rightTitle: item.rightTitle || "Traditional Arts",
            rightDesc: item.rightDesc || `Renowned for unique folk arts, traditional attire, and music celebrated across generations.`,
            bottomDesc: item.bottomDesc || `"Community harmony, nature worship, and ancestral wisdom form the cornerstone of ${item.englishName} life."`,
            cultureSections: defaultSections as any,
            isActive: true,
            isFeatured: false,
          }
        });
      } else if (!existing.cultureSections || (Array.isArray(existing.cultureSections) && existing.cultureSections.length === 0)) {
        await db.tribe.update({
          where: { id: item.id },
          data: { cultureSections: defaultSections as any }
        });
      }
    }
  } catch (err) {
    console.error("Error auto-syncing tribes:", err);
  }
};

// --- Tribes ---
export const getAllTribes = async (includeInactive = false) => {
  const count = await db.tribe.count();
  if (count < fullTribesSeedList.length) {
    await syncAllTribes();
  }

  return db.tribe.findMany({
    where: includeInactive ? {} : { isActive: true },
    select: {
      id: true,
      hindiName: true,
      englishName: true,
      shortDesc: true,
      image: true,
      leftTitle: true,
      leftDesc: true,
      rightTitle: true,
      rightDesc: true,
      bottomDesc: true,
      cultureSections: true,
      isActive: true,
      isFeatured: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: [{ isFeatured: 'desc' }, { englishName: 'asc' }],
  });
};

export const getTribeById = async (id: string) => {
  const tribe = await db.tribe.findUnique({ where: { id } });
  if (!tribe) throw new AppError('Tribe not found', 404);
  return tribe;
};

export const createTribe = async (data: CreateTribeInput) => {
  let cultureSections = data.cultureSections;
  if (typeof cultureSections === 'string') {
    try { cultureSections = JSON.parse(cultureSections); } catch (e) {}
  }
  return db.tribe.create({
    data: {
      ...data,
      cultureSections: cultureSections ? (cultureSections as any) : undefined,
    } as any
  });
};

export const updateTribe = async (id: string, data: UpdateTribeInput) => {
  const existing = await db.tribe.findUnique({ where: { id } });
  
  let cultureSections = data.cultureSections;
  if (typeof cultureSections === 'string') {
    try { cultureSections = JSON.parse(cultureSections); } catch (e) {}
  }

  if (!existing) {
    // Create if not present in DB
    return db.tribe.create({
      data: {
        id,
        hindiName: data.hindiName || '',
        englishName: data.englishName || '',
        shortDesc: data.shortDesc || '',
        image: data.image || '',
        leftTitle: data.leftTitle || null,
        leftDesc: data.leftDesc || null,
        rightTitle: data.rightTitle || null,
        rightDesc: data.rightDesc || null,
        bottomDesc: data.bottomDesc || null,
        cultureSections: cultureSections ? (cultureSections as any) : undefined,
        isActive: data.isActive !== undefined ? data.isActive : true,
        isFeatured: data.isFeatured !== undefined ? data.isFeatured : false,
      }
    });
  }

  return db.tribe.update({
    where: { id },
    data: {
      hindiName: data.hindiName,
      englishName: data.englishName,
      shortDesc: data.shortDesc,
      image: data.image,
      leftTitle: data.leftTitle,
      leftDesc: data.leftDesc,
      rightTitle: data.rightTitle,
      rightDesc: data.rightDesc,
      bottomDesc: data.bottomDesc,
      cultureSections: cultureSections !== undefined ? (cultureSections as any) : undefined,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
    } as any,
  });
};

export const deleteTribe = async (id: string) => {
  const existing = await db.tribe.findUnique({ where: { id } });
  if (!existing) {
    return { id, message: 'Tribe deleted' };
  }
  return db.tribe.delete({ where: { id } });
};

// --- Tribal Articles ---
export const getApprovedArticles = async (tribeName?: string, status?: string) => {
  const whereClause: any = {};
  if (status && status !== 'all') {
    whereClause.status = status;
  } else if (!status) {
    whereClause.status = 'APPROVED';
  }
  if (tribeName && tribeName.trim().length > 0) {
    const sanitizedTribe = tribeName.replace(/\s+tribe$/i, '').trim();
    whereClause.OR = [
      { tribe: { equals: tribeName, mode: 'insensitive' } },
      { tribe: { contains: sanitizedTribe, mode: 'insensitive' } },
    ];
  }
  return db.tribalArticle.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
};

export const getAllArticlesAdmin = async () => {
  return db.tribalArticle.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getPendingArticles = async () => {
  return db.tribalArticle.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
  });
};

export const createTribalArticle = async (data: CreateTribalArticleInput, userRole: string = 'USER') => {
  // If the user is an ADMIN, auto-approve the article
  const status = userRole === 'ADMIN' ? 'APPROVED' : 'PENDING';
  
  // Provide defaults for image if missing
  const image = data.image || (data.images && data.images.length > 0 ? data.images[0] : '');
  
  const createData = {
    ...data,
    image,
    status: status as any,
  };
  
  return db.tribalArticle.create({ data: createData as any });
};

export const approveArticle = async (id: string) => {
  const article = await db.tribalArticle.findUnique({ where: { id } });
  if (!article) throw new AppError('Article not found', 404);
  
  const updatedArticle = await db.tribalArticle.update({
    where: { id },
    data: { status: 'APPROVED' },
  });

  if (article.author) {
    try {
      const user = await db.user.findFirst({
        where: {
          OR: [
            { email: { equals: article.author, mode: 'insensitive' } },
            { name: { equals: article.author, mode: 'insensitive' } },
          ]
        }
      });

      if (user) {
        await db.user.update({
          where: { id: user.id },
          data: { rewardPoints: { increment: 15 } }
        });
      }
    } catch (err) {
      console.error('Failed to increment user reward points:', err);
    }
  }

  return updatedArticle;
};

export const rejectArticle = async (id: string) => {
  const article = await db.tribalArticle.findUnique({ where: { id } });
  if (!article) throw new AppError('Article not found', 404);
  
  return db.tribalArticle.update({
    where: { id },
    data: { status: 'REJECTED' },
  });
};

export const deleteArticle = async (id: string) => {
  const article = await db.tribalArticle.findUnique({ where: { id } });
  if (!article) throw new AppError('Article not found', 404);
  
  return db.tribalArticle.delete({ where: { id } });
};

// --- Tribe Videos ---
export const getApprovedTribeVideos = async (tribeId?: string, tribeName?: string) => {
  const whereClause: any = { status: 'APPROVED' };
  if (tribeId) whereClause.tribeId = tribeId;
  else if (tribeName) whereClause.tribeName = { equals: tribeName, mode: 'insensitive' };
  
  return (db as any).tribeVideo.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
};

export const getPendingTribeVideos = async () => {
  return (db as any).tribeVideo.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
  });
};

export const createTribeVideo = async (data: CreateTribeVideoInput, userRole: string = 'USER') => {
  const status = userRole === 'ADMIN' ? 'APPROVED' : 'PENDING';
  const caption = data.caption || data.title || '';
  const title = data.title || caption;
  const uploaderName = data.uploaderName || 'Community Member';

  return (db as any).tribeVideo.create({
    data: {
      title,
      caption,
      videoUrl: data.videoUrl,
      publicId: (data as any).publicId || null,
      uploaderName,
      description: data.description || null,
      tribeId: data.tribeId,
      tribeName: data.tribeName,
      status,
    },
  });
};

export const getAllTribeVideos = async (status?: string) => {
  const whereClause: any = {};
  if (status && status !== 'all') {
    whereClause.status = status.toUpperCase();
  }
  return (db as any).tribeVideo.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
};

export const approveTribeVideo = async (id: string) => {
  const video = await (db as any).tribeVideo.findUnique({ where: { id } });
  if (!video) throw new AppError('Video not found', 404);
  return (db as any).tribeVideo.update({
    where: { id },
    data: { status: 'APPROVED', rejectionReason: null },
  });
};

export const rejectTribeVideo = async (id: string, rejectionReason?: string) => {
  const video = await (db as any).tribeVideo.findUnique({ where: { id } });
  if (!video) throw new AppError('Video not found', 404);
  return (db as any).tribeVideo.update({
    where: { id },
    data: {
      status: 'REJECTED',
      rejectionReason: rejectionReason || 'Content does not meet site community guidelines.',
    },
  });
};

export const deleteTribeVideo = async (id: string) => {
  const video = await (db as any).tribeVideo.findUnique({ where: { id } });
  if (!video) throw new AppError('Video not found', 404);
  if (video.publicId) {
    await deleteFromCloudinary(video.publicId, 'video').catch(() => null);
  }
  return (db as any).tribeVideo.delete({ where: { id } });
};
