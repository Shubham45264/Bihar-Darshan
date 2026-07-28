import { z } from 'zod';

export const discoverCategoryEnum = z.enum(['FOOD', 'FESTIVAL', 'CRAFT', 'HERITAGE', 'WILDLIFE']);

export const createDiscoverSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  image: z.string().min(1),
  description: z.string().min(1),
  featured: z.boolean().optional().default(false),
  author: z.string().optional().default('Admin'),
  district: z.string().optional().default('Bihar'),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional().default('PENDING'),
  longDescription: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  galleryImages: z.array(z.string()).optional().default([]),
  extendedDetails: z.array(z.string()).optional().default([]),
});

export const updateDiscoverSchema = createDiscoverSchema.partial();

export type CreateDiscoverInput = z.infer<typeof createDiscoverSchema>;
export type UpdateDiscoverInput = z.infer<typeof updateDiscoverSchema>;
