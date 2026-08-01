import '../config/env';
import { prisma } from '../db';

async function updateHeroTitle() {
  console.log('Updating SiteSettings heroTitle in database...');
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      heroTitle: 'Explore the Rich Heritage of',
    },
    create: {
      id: 1,
      heroTitle: 'Explore the Rich Heritage of',
      heroSubtitle: 'Bihar',
      heroDescription: 'Step into a timeless realm of sacred landmarks, living traditions, authentic flavors, and enduring stories.',
    },
  });
  console.log('✅ SiteSettings heroTitle successfully updated to "Explore the Rich Heritage of"');
  await prisma.$disconnect();
}

updateHeroTitle().catch(console.error);
