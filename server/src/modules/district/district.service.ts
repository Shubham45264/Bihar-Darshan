import { prisma as db } from '../../db';
import { CreateDistrictInput, UpdateDistrictInput } from './district.validation';
import { AppError } from '../../errors/AppError';

export const getAllDistricts = async () => {
  return db.district.findMany({
    include: {
      seasonalVisits: true,
      topAttractions: true,
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

  const validSeasons = seasonalVisits
    ?.filter((sv) => sv.season || sv.months || sv.weather || sv.whyVisit)
    .map((sv) => ({
      season: sv.season || 'Season',
      months: sv.months || '',
      weather: sv.weather || '',
      whyVisit: sv.whyVisit || '',
    }));

  const validAttractions = topAttractions
    ?.filter((ta) => ta.name || ta.image || ta.description)
    .map((ta) => {
      const desc = ta.description || ta.shortDescription || '';
      return {
        name: ta.name || 'Attraction',
        image: ta.image || '/images/culture/hero-artwork.png',
        description: desc,
        shortDescription: ta.shortDescription || (desc ? desc.slice(0, 100) : null),
        rating: ta.rating || 4.5,
        bestTime: ta.bestTime || 'Throughout the year',
      };
    });

  return db.district.create({
    data: {
      ...districtData,
      image: districtData.image || '/images/culture/hero-artwork.png',
      seasonalVisits: validSeasons && validSeasons.length > 0 ? { create: validSeasons } : undefined,
      topAttractions: validAttractions && validAttractions.length > 0 ? { create: validAttractions } : undefined,
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

  const updateFields: any = { ...districtData };
  if (!updateFields.image) {
    delete updateFields.image;
  }

  return db.$transaction(async (tx) => {
    // 1. Update main district columns
    await tx.district.update({
      where: { id },
      data: updateFields,
    });

    // 2. Re-create seasonalVisits if provided
    if (seasonalVisits) {
      await tx.seasonRow.deleteMany({
        where: { districtId: id },
      });
      const validSeasons = seasonalVisits
        .filter((sv) => sv.season || sv.months || sv.weather || sv.whyVisit)
        .map((sv) => ({
          season: sv.season || 'Season',
          months: sv.months || '',
          weather: sv.weather || '',
          whyVisit: sv.whyVisit || '',
          districtId: id,
        }));
      if (validSeasons.length > 0) {
        await tx.seasonRow.createMany({
          data: validSeasons,
        });
      }
    }

    // 3. Re-create topAttractions if provided
    if (topAttractions) {
      await tx.topAttraction.deleteMany({
        where: { districtId: id },
      });
      const validAttractions = topAttractions
        .filter((ta) => ta.name || ta.image || ta.description)
        .map((ta) => {
          const desc = ta.description || ta.shortDescription || '';
          return {
            name: ta.name || 'Attraction',
            image: ta.image || '/images/culture/hero-artwork.png',
            description: desc,
            shortDescription: ta.shortDescription || (desc ? desc.slice(0, 100) : null),
            rating: ta.rating || 4.5,
            bestTime: ta.bestTime || 'Throughout the year',
            districtId: id,
          };
        });
      if (validAttractions.length > 0) {
        await tx.topAttraction.createMany({
          data: validAttractions,
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
