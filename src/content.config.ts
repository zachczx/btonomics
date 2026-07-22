// 1. Import utilities from `astro:content`
import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'
import { fileURLToPath } from 'node:url'

// 2. Define your collection(s)
const blog = defineCollection({
    loader: glob({ pattern: '**/[^_]*.mdx', base: './src/data/blog' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            pubDate: z.date(),
            // Required because every post uses this as its unique search description.
            description: z.string().min(1),
            category: z.string(),
            author: z.string(),
            image: image().optional(),
            coverImagePosition: z.enum(['top', 'center', 'bottom']).optional(),
            tags: z.array(z.string()).optional(),
            slug: z.string().optional(),
            mood: z.string().optional(),
            updated: z.date().optional(),
            // --- optional "review" fields: drive the verdict receipt ---
            verdict: z.string().optional(),
            recommend: z.enum(['yes', 'no', 'maybe']).optional(),
            rating: z.number().min(0).max(5).optional(),
            cost: z.string().optional(),
            pros: z.array(z.string()).optional(),
            cons: z.array(z.string()).optional(),
        }),
})

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = { blog }
