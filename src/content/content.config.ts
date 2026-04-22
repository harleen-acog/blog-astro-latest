// src/content/config.ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

// Blog posts — lives in src/content/posts/{github-username}/{slug}.md
const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).optional().default([]),
    draft: z.boolean().optional().default(false),
  }),
});

// Author profiles — auto-created by GitHub Action from GitHub API
// lives in src/content/authors/{github-username}.json
const authors = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    login: z.string(),          // github username
    avatar_url: z.string(),
    bio: z.string().nullable().optional(),
  }),
});

export const collections = { posts, authors };
