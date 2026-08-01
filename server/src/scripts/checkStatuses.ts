import '../config/env';
import { prisma } from '../db';

async function checkStatuses() {
  const discover = await prisma.discoverItem.findMany({ select: { id: true, title: true, status: true } });
  console.log('DiscoverItems:', discover);

  const journeys = await prisma.journey.findMany({ select: { id: true, title: true, status: true } });
  console.log('Journeys:', journeys);

  const products = await prisma.marketplaceProduct.findMany({ select: { id: true, productName: true, status: true } });
  console.log('MarketplaceProducts:', products);

  await prisma.$disconnect();
}

checkStatuses().catch(console.error);
