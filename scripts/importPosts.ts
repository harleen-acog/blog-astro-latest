import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Database from "better-sqlite3";

const db = new Database("db.sqlite");

const postsDir = path.join(process.cwd(), "content/posts");
const files = fs.readdirSync(postsDir);

//looping through each file
for (const file of files) {
  //check if markdown
  if (!file.endsWith(".md")) continue;
  //create the filepath
  const filePath = path.join(postsDir, file);
  const raw = fs.readFileSync(filePath, "utf-8");

  const { data, content } = matter(raw);

  // Required fields
  if (!data.title || !data.slug || !data.email || !data.author) {
    console.warn(`Skipping ${file} — missing required fields`);
    continue;
  }

  // Get user
  const user = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(data.email);

  if (!user) {
    console.warn(`User not found for ${data.email} in ${file}`);
    continue;
  }

  // Normalize date safely
  let date: string;
  try {
    date = data.date
      ? new Date(data.date).toISOString()
      : new Date().toISOString();
  } catch {
    date = new Date().toISOString();
  }

  // Excerpt fallback
  const excerpt =
    data.excerpt ||
    content.replace(/\n/g, " ").slice(0, 160) + "...";

  // Tags normalization
  const tags = Array.isArray(data.tags)
    ? JSON.stringify(data.tags)
    : JSON.stringify([]);

  // Insert (UPDATED)
  db.prepare(`
    INSERT OR REPLACE INTO posts 
    (title, slug, content, author_id, author_name, date, excerpt, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.title,
    data.slug,
    content,
    user.id,
    data.author, // important addition
    date,
    excerpt,
    tags
  );

  console.log(`Imported: ${data.title}`);
}

db.close();