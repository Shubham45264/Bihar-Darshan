import '../config/env';
import { prisma } from '../db';
import { uploadToCloudinary } from '../utils/cloudinary';

/**
 * Migration Script: Migrate existing database media URLs to Cloudinary
 */
async function migrateMediaToCloudinary() {
  console.log('🚀 Starting media migration to Cloudinary...\n');

  let totalMigrated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  const isCloudinaryUrl = (url: string | null | undefined): boolean => {
    if (!url) return false;
    return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
  };

  const uploadMediaUrl = async (url: string, folder: string, resourceType: 'auto' | 'image' | 'video' = 'auto') => {
    if (!url || isCloudinaryUrl(url)) return null;

    try {
      if (url.startsWith('data:')) {
        // Base64 data string
        const result = await uploadToCloudinary(url, { folder, resourceType });
        totalMigrated++;
        return result;
      } else if (url.startsWith('http://') || url.startsWith('https://')) {
        // Remote URL (Supabase storage or external)
        const result = await uploadToCloudinary(url, { folder, resourceType });
        totalMigrated++;
        return result;
      }
    } catch (err) {
      console.error(`❌ Error uploading URL to Cloudinary (${url.slice(0, 50)}...):`, err);
      totalErrors++;
    }
    return null;
  };

  // 1. Migrate GalleryItems
  console.log('📦 Migrating GalleryItems...');
  const galleryItems = await prisma.galleryItem.findMany();
  for (const item of galleryItems) {
    if (!isCloudinaryUrl(item.image)) {
      console.log(`Uploading gallery item "${item.title}"...`);
      const uploaded = await uploadMediaUrl(item.image, 'gallery', 'image');
      if (uploaded) {
        await prisma.galleryItem.update({
          where: { id: item.id },
          data: { image: uploaded.secure_url, publicId: uploaded.public_id },
        });
      }
    } else {
      totalSkipped++;
    }
  }

  // 2. Migrate TribeVideos
  console.log('📦 Migrating TribeVideos...');
  const tribeVideos = await (prisma as any).tribeVideo.findMany();
  for (const video of tribeVideos) {
    if (!isCloudinaryUrl(video.videoUrl)) {
      console.log(`Uploading tribe video "${video.title || video.id}"...`);
      const uploaded = await uploadMediaUrl(video.videoUrl, 'tribe_videos', 'video');
      if (uploaded) {
        await (prisma as any).tribeVideo.update({
          where: { id: video.id },
          data: { videoUrl: uploaded.secure_url, publicId: uploaded.public_id },
        });
      }
    } else {
      totalSkipped++;
    }
  }

  // 3. Migrate CategoryStories
  console.log('📦 Migrating CategoryStories...');
  const stories = await prisma.categoryStory.findMany();
  for (const story of stories) {
    if (story.mediaUrl && !isCloudinaryUrl(story.mediaUrl)) {
      console.log(`Uploading story media "${story.title}"...`);
      const resourceType = story.mediaType === 'VIDEO' ? 'video' : 'image';
      const uploaded = await uploadMediaUrl(story.mediaUrl, 'stories', resourceType);
      if (uploaded) {
        await prisma.categoryStory.update({
          where: { id: story.id },
          data: { mediaUrl: uploaded.secure_url, publicId: uploaded.public_id },
        });
      }
    } else {
      totalSkipped++;
    }
  }

  // 4. Migrate DiscoverItems
  console.log('📦 Migrating DiscoverItems...');
  const discoverItems = await prisma.discoverItem.findMany();
  for (const item of discoverItems) {
    if (!isCloudinaryUrl(item.image)) {
      console.log(`Uploading discover item image "${item.title}"...`);
      const uploaded = await uploadMediaUrl(item.image, 'discover', 'image');
      if (uploaded) {
        await prisma.discoverItem.update({
          where: { id: item.id },
          data: { image: uploaded.secure_url, publicId: uploaded.public_id },
        });
      }
    } else {
      totalSkipped++;
    }
  }

  // 5. Migrate Personalities
  console.log('📦 Migrating Personalities...');
  const personalities = await prisma.personality.findMany();
  for (const p of personalities) {
    if (!isCloudinaryUrl(p.imageUrl)) {
      console.log(`Uploading personality image "${p.name}"...`);
      const uploaded = await uploadMediaUrl(p.imageUrl, 'personalities', 'image');
      if (uploaded) {
        await prisma.personality.update({
          where: { id: p.id },
          data: { imageUrl: uploaded.secure_url, publicId: uploaded.public_id },
        });
      }
    } else {
      totalSkipped++;
    }
  }

  // 6. Migrate Journeys
  console.log('📦 Migrating Journeys...');
  const journeys = await prisma.journey.findMany();
  for (const j of journeys) {
    if (j.image && !isCloudinaryUrl(j.image)) {
      console.log(`Uploading journey image "${j.title}"...`);
      const uploaded = await uploadMediaUrl(j.image, 'journeys', 'image');
      if (uploaded) {
        await prisma.journey.update({
          where: { id: j.id },
          data: { image: uploaded.secure_url, publicId: uploaded.public_id },
        });
      }
    } else {
      totalSkipped++;
    }
  }

  // 7. Migrate MarketplaceProducts
  console.log('📦 Migrating MarketplaceProducts...');
  const products = await prisma.marketplaceProduct.findMany();
  for (const prod of products) {
    if (!isCloudinaryUrl(prod.image)) {
      console.log(`Uploading product image "${prod.productName}"...`);
      const uploaded = await uploadMediaUrl(prod.image, 'marketplace', 'image');
      if (uploaded) {
        await prisma.marketplaceProduct.update({
          where: { id: prod.id },
          data: { image: uploaded.secure_url, publicId: uploaded.public_id },
        });
      }
    } else {
      totalSkipped++;
    }
  }

  console.log('\n✅ Media Migration Complete!');
  console.log(`- Migrated to Cloudinary: ${totalMigrated}`);
  console.log(`- Already on Cloudinary: ${totalSkipped}`);
  console.log(`- Errors: ${totalErrors}`);

  await prisma.$disconnect();
}

migrateMediaToCloudinary().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
