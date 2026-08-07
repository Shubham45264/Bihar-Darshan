import { prisma as db } from '../../db';
import { CreateDistrictInput, UpdateDistrictInput } from './district.validation';
import { AppError } from '../../errors/AppError';

export const getAllDistricts = async () => {
  return db.district.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      tagline: true,
      introduction: true,
      topTouristName: true,
      topTouristDetails: true,
      topAttractions: {
        select: {
          id: true,
          name: true,
          image: true,
          shortDescription: true,
          rating: true,
        }
      }
    },
    orderBy: { name: 'asc' },
  });
};

export const getDistrictById = async (id: string) => {
  const district = await db.district.findUnique({
    where: { id },
    include: {
      seasonalVisits: true,
      topAttractions: true,
    },
  });

  if (!district) {
    throw new AppError('District not found', 404);
  }

  return district;
};

export const createDistrict = async (data: CreateDistrictInput) => {
  const { seasonalVisits, topAttractions, ...districtData } = data;

  return db.district.create({
    data: {
      ...districtData,
      seasonalVisits: {
        create: seasonalVisits,
      },
      topAttractions: {
        create: topAttractions,
      },
    },
    include: {
      seasonalVisits: true,
      topAttractions: true,
    },
  });
};

export const updateDistrict = async (id: string, data: UpdateDistrictInput) => {
  const { seasonalVisits, topAttractions, ...districtData } = data;

  // Verify existence
  await getDistrictById(id);

  return db.$transaction(async (tx) => {
    // 1. Update main district columns
    await tx.district.update({
      where: { id },
      data: districtData,
    });

    // 2. Re-create seasonalVisits if provided
    if (seasonalVisits) {
      await tx.seasonRow.deleteMany({
        where: { districtId: id },
      });
      if (seasonalVisits.length > 0) {
        await tx.seasonRow.createMany({
          data: seasonalVisits.map((sv) => ({
            season: sv.season,
            months: sv.months,
            weather: sv.weather,
            whyVisit: sv.whyVisit,
            districtId: id,
          })),
        });
      }
    }

    // 3. Re-create topAttractions if provided
    if (topAttractions) {
      await tx.topAttraction.deleteMany({
        where: { districtId: id },
      });
      if (topAttractions.length > 0) {
        await tx.topAttraction.createMany({
          data: topAttractions.map((ta) => ({
            name: ta.name,
            image: ta.image,
            description: ta.description,
            shortDescription: ta.shortDescription || ta.description.slice(0, 100),
            rating: ta.rating || 4.5,
            bestTime: ta.bestTime || 'Throughout the year',
            districtId: id,
          })),
        });
      }
    }

    return tx.district.findUniqueOrThrow({
      where: { id },
      include: {
        seasonalVisits: true,
        topAttractions: true,
      },
    });
  });
};

export const deleteDistrict = async (id: string) => {
  // Verify existence
  await getDistrictById(id);

  await db.district.delete({
    where: { id },
  });
};
