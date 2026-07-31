import 'dotenv/config';
import { prisma as db } from '../db';

async function main() {
  const stories = await db.categoryStory.findMany({
    select: { id: true, authorName: true, authorAvatar: true },
  });
  console.log("Current CategoryStory authorAvatars:", JSON.stringify(stories, null, 2));

  // If any story has dicebear or bottts or placeholder avatar, clear it to null
  for (const s of stories) {
    if (s.authorAvatar && (s.authorAvatar.includes('dicebear') || s.authorAvatar.includes('bottts') || s.authorAvatar.includes('placeholder'))) {
      await db.categoryStory.update({
        where: { id: s.id },
        data: { authorAvatar: null },
      });
      console.log(`Cleared default avatar for story ${s.id}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
