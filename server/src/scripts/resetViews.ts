import 'dotenv/config';
import { prisma as db } from '../db';

async function main() {
  console.log("Resetting views and viewedBy arrays in CategoryStory...");

  const storyResult = await db.categoryStory.updateMany({
    data: {
      views: 0,
      viewedBy: [],
    },
  });
  console.log(`Reset views for ${storyResult.count} CategoryStory records.`);

  console.log("Reset views complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
