import { z } from 'zod';

export const seasonRowSchema = z.object({
  season: z.string().optional().nullable().default(''),
  months: z.string().optional().nullable().default(''),
  weather: z.string().optional().nullable().default(''),
  whyVisit: z.string().optional().nullable().default(''),
});

export const topAttractionSchema = z.object({
  name: z.string().optional().nullable().default(''),
  image: z.string().optional().nullable().default(''),
  description: z.string().optional().nullable().default(''),
  shortDescription: z.string().optional().nullable(),
  rating: z.number().min(0).max(5).optional().nullable(),
  bestTime: z.string().optional().nullable(),
});

export const createDistrictSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  image: z.string().optional().default('/images/culture/hero-artwork.png'),
  tagline: z.string().optional().nullable(),
  introduction: z.string().optional().nullable(),
  richHistory: z.string().optional().nullable(),
  topTouristName: z.string().optional().nullable(),
  topTouristDetails: z.string().optional().nullable(),
  howToReachAir: z.string().optional().nullable(),
  howToReachRail: z.string().optional().nullable(),
  howToReachRoad: z.string().optional().nullable(),
  whyInTouristList: z.array(z.string()).optional().default([]),

  seasonalVisits: z.array(seasonRowSchema).optional().default([]),
  topAttractions: z.array(topAttractionSchema).optional().default([]),
});

export const updateDistrictSchema = createDistrictSchema.partial();

export type CreateDistrictInput = z.infer<typeof createDistrictSchema>;
export type UpdateDistrictInput = z.infer<typeof updateDistrictSchema>;
