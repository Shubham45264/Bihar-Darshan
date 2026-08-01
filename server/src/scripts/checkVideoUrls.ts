import '../config/env';
import { prisma } from '../db';

async function checkVideoUrls() {
  const videos = await (prisma as any).tribeVideo.findMany();
  console.log('🎬 Tribe Videos in DB:\n');
  videos.forEach((v: any) => {
    console.log(`ID: ${v.id}`);
    console.log(`Title/Caption: ${v.caption || v.title}`);
    console.log(`videoUrl: ${v.videoUrl}`);
    console.log(`publicId: ${v.publicId}`);
    console.log('---');
  });
  await prisma.$disconnect();
}

checkVideoUrls().catch(console.error);
