// import type { APIRoute } from "astro";
// import { db } from "../../../lib/db";
// import { getCurrentUser } from "../../../lib/auth";

// export const POST: APIRoute = async ({ request, cookies }) => {
//   const user = getCurrentUser(cookies);

//   if (!user) {
//     return new Response(JSON.stringify({ error: "Unauthorized" }), {
//       status: 401,
//     });
//   }

//   const body = await request.json();
//   const { title, slug, content, excerpt, tags } = body;

//   if (!title || !content) {
//     return new Response(JSON.stringify({ error: "Missing fields" }), {
//       status: 400,
//     });
//   }

//   //  auto-slug (fallback)
//   const safeSlug =
//     slug ||
//     title
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/(^-|-$)/g, "");

//   const date = new Date().toISOString();
//   const safeExcerpt = excerpt || content.slice(0, 160);
//   const safeTags = Array.isArray(tags)
//     ? JSON.stringify(tags)
//     : JSON.stringify([]);

//   try {
//     db.prepare(`
//       INSERT INTO posts 
//       (title, slug, content, author_id, author_name, date, excerpt, tags)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `).run(
//       title,
//       safeSlug,
//       content,
//       user.id,
//       user.name, //  NEW FIELD
//       date,
//       safeExcerpt,
//       safeTags
//     );

//     return new Response(JSON.stringify({ success: true, slug: safeSlug, username: user.username }), {
//       status: 201,
//     });
//   } catch (err: any) {
//     if (err.message.includes("UNIQUE")) {
//       return new Response(
//         JSON.stringify({ error: "Slug already exists for this user" }),
//         { status: 400 }
//       );
//     }

//     return new Response(JSON.stringify({ error: "Server error" }), {
//       status: 500,
//     });
//   }
// };

import type { APIRoute } from "astro";
import { db } from "../../../lib/db";
import { getCurrentUser } from "../../../lib/auth";
import fs from "fs";
import path from "path";

export const POST: APIRoute = async ({ request, cookies }) => {
  const user = getCurrentUser(cookies);

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await request.json();
  const { title, slug, content, excerpt, tags } = body;

  if (!title || !content) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
    });
  }

  // Auto-slug fallback
  const safeSlug =
    slug ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const date = new Date().toISOString();

  // Auto-excerpt — strip markdown symbols if no excerpt provided
  const safeExcerpt =
    excerpt ||
    content
      .replace(/#{1,6}\s/g, "")
      .replace(/[*_`>~\[\]]/g, "")
      .replace(/\n+/g, " ")
      .trim()
      .slice(0, 160) + "...";

  const tagsArray = Array.isArray(tags) ? tags : [];
  const safeTags = JSON.stringify(tagsArray);

  // ─── Write .md file ───────────────────────────────────────────
  try {
    const frontmatter = [
      "---",
      `title: ${title.trim()}`,
      `slug: ${safeSlug}`,
      `date: ${date}`,
      `author: ${user.name}`,
      `email: ${user.email}`,
      `excerpt: ${safeExcerpt}`,
      `tags: [${tagsArray.join(", ")}]`,
      "---",
      "",
    ].join("\n");

    const fileContent = frontmatter + content.trim();

    const postsDir = path.join(process.cwd(), "content", "posts");

    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(postsDir, `${safeSlug}.md`),
      fileContent,
      "utf-8"
    );
  } catch (fileErr) {
    console.error("Failed to write .md file:", fileErr);
    // Non-fatal — DB insert still proceeds
    // Remove this catch block if you want file writing to be mandatory
  }

  // ─── Insert into DB ───────────────────────────────────────────
  try {
    db.prepare(`
      INSERT INTO posts 
      (title, slug, content, author_id, author_name, date, excerpt, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title,
      safeSlug,
      content,
      user.id,
      user.name,
      date,
      safeExcerpt,
      safeTags
    );

    return new Response(
      JSON.stringify({ success: true, slug: safeSlug, username: user.username }),
      { status: 201 }
    );
  } catch (err: any) {
    console.log("Error",err)
    // If DB insert fails, clean up the .md file we just wrote
    try {
      const filePath = path.join(process.cwd(), "content", "posts", `${safeSlug}.md`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (_) {}

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