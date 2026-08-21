import { z } from 'zod';

export const createProductSchema = z.object({
  businessName: z.string().min(1),
  productName: z.string().min(1),
  category: z.string().min(1),
  image: z.string().url(),
  images: z.array(z.string().url()).optional().default([]),
  description: z.string().min(1),
  address: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  mapLink: z.string().url().optional().nullable(),
  contact: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  planName: z.string().optional().nullable(),
  planDays: z.number().optional().nullable(),
  freeDisplayStartDate: z.string().optional().nullable(),
  freeDisplayEndDate: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
