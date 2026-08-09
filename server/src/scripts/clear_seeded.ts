import 'dotenv/config';
import { prisma as db } from '../db';

async function main() {
  console.log("Cleaning seeded/static Admin entries from Database...");

  const deletedDiscover = await db.discoverItem.deleteMany({
    where: {
      OR: [
        { author: 'Admin' },
        { author: 'admin' },
        { author: null }
      ]
    }
  });
  console.log(`Deleted ${deletedDiscover.count} discover items.`);

  console.log("Cleanup complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
