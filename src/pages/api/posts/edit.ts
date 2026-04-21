import type { APIRoute } from "astro";
import { db } from "../../../lib/db";
import { getCurrentUser } from "../../../lib/auth";

export const POST: APIRoute = async ({ request, cookies }) => {
  const user = getCurrentUser(cookies);

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await request.json();
  const { id, title, slug, content, excerpt, tags } = body;

  if (!id || !title || !content) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
    });
  }

  // Ensure post belongs to user
  const existing = db
    .prepare("SELECT * FROM posts WHERE id = ? AND author_id = ?")
    .get(id, user.id);

  if (!existing) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  const safeSlug =
    slug ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const safeExcerpt = excerpt || content.slice(0, 160);
  const safeTags = Array.isArray(tags)
    ? JSON.stringify(tags)
    : JSON.stringify([]);

  try {
    db.prepare(`
      UPDATE posts
      SET title = ?, slug = ?, content = ?, excerpt = ?, tags = ?
      WHERE id = ? AND author_id = ?
    `).run(
      title,
      safeSlug,
      content,
      safeExcerpt,
      safeTags,
      id,
      user.id
    );

    return new Response(
      JSON.stringify({
        success: true,
        slug: safeSlug,
        username: user.username,
      }),
      { status: 200 }
    );
  } catch (err: any) {
    if (err.message.includes("UNIQUE")) {
      return new Response(
        JSON.stringify({ error: "Slug already exists for this user" }),
        { status: 400 }
      );
    }

    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
};