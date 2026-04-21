import { db } from "../db";
import { PostSchema, type Post } from "../schema";

export function getPostsByUser(userId: number): Post[] {
  const rows = db
    .prepare(`
      SELECT 
        id,
        title,
        slug,
        excerpt,
        date,
        author_name,
        tags,
        created_at,
        author_id,
        content
      FROM posts 
      WHERE author_id = ?
      ORDER BY date DESC
    `)
    .all(userId);

  return rows.map((row: any) =>
    PostSchema.parse({
      ...row,
      tags: JSON.parse(row.tags || "[]"),
    })
  );
}
export function getPostBySlugAndUser(
  slug: string,
  username: string
): Post | undefined {
  const row = db
    .prepare(`
      SELECT posts.*
      FROM posts
      JOIN users ON posts.author_id = users.id
      WHERE posts.slug = ? AND users.username = ?
    `)
    .get(slug, username);

  if (!row) return undefined;

  return PostSchema.parse({
    ...row,
    tags: JSON.parse(row.tags || "[]"),
  });
}

export function getAllPosts() {
  return db.prepare(`
    SELECT posts.*, users.username
    FROM posts
    JOIN users ON posts.author_id = users.id
    ORDER BY date DESC
  `).all();
}

export function getPostById(postId: number) {
  return db
    .prepare(`
      SELECT posts.*, users.username
      FROM posts
      JOIN users ON posts.author_id = users.id
      WHERE posts.id = ?
    `)
    .get(postId);
}