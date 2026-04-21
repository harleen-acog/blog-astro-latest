import { z } from "zod";

export const UserDBSchema = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string(),
  email: z.email(),
  password: z.string(),
  role: z.string(),
  about: z.string(),
});
export const UserSchema = UserDBSchema.omit({
  password: true,
});
export type User = z.infer<typeof UserSchema>;
export type PostUser = Omit<z.infer<typeof UserSchema>, "password">;
export const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),

  author_id: z.number(),
  author_name: z.string(),

  date: z.string(), // ISO string
  excerpt: z.string(),
  tags: z.array(z.string()),

  created_at: z.string(),
});

export type Post = z.infer<typeof PostSchema>;