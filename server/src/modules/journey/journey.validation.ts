import { z } from 'zod';

export const createJourneySchema = z.object({
  title: z.string().min(1),
  shortDesc: z.string().optional().nullable(),
  description: z.string().min(1),
  overviewText: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  tripDuration: z.string().optional().nullable(),
  budget: z.string().optional().nullable(),
  price: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  stops: z.array(z.string()).optional().default([]),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  difficulty: z.string().optional().nullable(),
  bestTime: z.string().optional().nullable(),
  groupSize: z.string().optional().nullable(),
  transportation: z.string().optional().nullable(),
  startPoint: z.string().optional().nullable(),
  endPoint: z.string().optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  quote: z.string().optional().nullable(),
  galleryImages: z.array(z.string()).optional().default([]),
  timeline: z.any().optional().nullable(), // Allow JSON for timeline

  // New fields from CreateJourney form
  category: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  rating: z.number().optional().nullable(),
  userRating: z.number().optional().nullable(),
  highlights: z.array(z.string()).optional().default([]),
  includedServices: z.array(z.string()).optional().default([]),
  excludedServices: z.array(z.string()).optional().default([]),
  googleMapsLink: z.string().optional().nullable(),
  
  // Guide fields
  guideName: z.string().optional().nullable(),
  guideImage: z.string().optional().nullable(),
  guideExperience: z.string().optional().nullable(),
  guideLanguages: z.array(z.string()).optional().default([]),
  guideIntro: z.string().optional().nullable(),
  guidePhone: z.string().optional().nullable(),
  guideEmail: z.string().optional().nullable(),
  guideWhatsapp: z.string().optional().nullable(),

  // Plan fields
  planName: z.string().optional().nullable(),
  planDays: z.number().optional().nullable(),
  freeDisplayStartDate: z.string().optional().nullable(),
  freeDisplayEndDate: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
});

export const updateJourneySchema = createJourneySchema.partial();

export type CreateJourneyInput = z.infer<typeof createJourneySchema>;
