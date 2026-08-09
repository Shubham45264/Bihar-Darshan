import "dotenv/config";
import { prisma } from './db';

async function main() {
  console.log("Starting DB connection test...");
  try {
    const userCount = await prisma.user.count();
    const discoverCount = await prisma.discoverItem.count();
    const categoryCount = await prisma.category.count();
    const districtCount = await prisma.district.count();
    const categories = await prisma.category.findMany({ select: { id: true, title: true } });
    console.log("✅ Current DB categories count:", categories.length);
    console.log("Categories list:", categories);
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
