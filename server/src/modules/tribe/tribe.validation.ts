import { z } from 'zod';

export const createTribeSchema = z.object({
  body: z.object({
    hindiName: z.string().min(1, 'Hindi Name is required'),
    englishName: z.string().min(1, 'English Name is required'),
    shortDesc: z.string().min(1, 'Short description is required'),
    image: z.string().optional().or(z.literal('')),
    leftTitle: z.string().optional(),
    leftDesc: z.string().optional(),
    rightTitle: z.string().optional(),
    rightDesc: z.string().optional(),
    bottomDesc: z.string().optional(),
    cultureSections: z.any().optional(), // Flexible JSON
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
  }),
});

export const updateTribeSchema = z.object({
  body: z.object({
    hindiName: z.string().optional(),
    englishName: z.string().optional(),
    shortDesc: z.string().optional(),
    image: z.string().optional().nullable().or(z.literal('')),
    leftTitle: z.string().optional().nullable(),
    leftDesc: z.string().optional().nullable(),
    rightTitle: z.string().optional().nullable(),
    rightDesc: z.string().optional().nullable(),
    bottomDesc: z.string().optional().nullable(),
    cultureSections: z.any().optional().nullable(),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
  }),
});

export const createTribalArticleSchema = z.object({
  body: z.object({
    headline: z.string().min(1, 'Headline is required'),
    description: z.string().min(1, 'Description is required'),
    image: z.string().optional().or(z.literal('')),
    images: z.array(z.string()).optional(),
    author: z.string().min(1, 'Author name is required'),
    tribe: z.string().min(1, 'Tribe name is required'),
    publishedDate: z.string().optional().nullable(),
    readTime: z.number().int().positive().optional().nullable(),
    tags: z.array(z.string()).optional(),
    location: z.string().optional().nullable().default(''),
  }),
});

export const createTribeVideoSchema = z.object({
  body: z.object({
    caption: z.string().min(1, 'Caption is required'),
    videoUrl: z.string().min(1, 'Video URL/file is required'),
    title: z.string().optional(),
    uploaderName: z.string().optional(),
    description: z.string().optional(),
    tribeId: z.string().min(1, 'Tribe ID is required'),
    tribeName: z.string().min(1, 'Tribe Name is required'),
  }),
});

export type CreateTribeInput = z.infer<typeof createTribeSchema>['body'];
export type UpdateTribeInput = z.infer<typeof updateTribeSchema>['body'];
export type CreateTribalArticleInput = z.infer<typeof createTribalArticleSchema>['body'];
export type CreateTribeVideoInput = z.infer<typeof createTribeVideoSchema>['body'];
