// src/content.config.ts

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// POSTS collection (markdown)
const posts = defineCollection({
  loader: glob({
    base: './src/content/posts',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).optional().default([]),
    draft: z.boolean().optional().default(false),
    contributors: z.array(z.string()).optional().default([]),
  }),
});

// AUTHORS collection (json/yaml)
const authors = defineCollection({
  loader: glob({
    base: './src/content/authors',
    pattern: '**/*.{json,yaml,yml}',
  }),
  schema: z.object({
    name: z.string(),
    login: z.string(),
    avatar_url: z.string(),
    bio: z.string().nullable().optional(),
  }),
});

export const collections = { posts, authors };