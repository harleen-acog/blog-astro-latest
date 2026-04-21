import Database from "better-sqlite3";
import bcrypt from "bcrypt";

const db = new Database("db.sqlite");

// Reset tables (so you can reseed cleanly)
db.exec(`
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
`);

// Create tables
db.exec(`
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  about TEXT NOT NULL
);

CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL,

  author_id INTEGER NOT NULL,
  author_name TEXT NOT NULL,

  date TEXT,
  excerpt TEXT,
  tags TEXT,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(slug, author_id),

  FOREIGN KEY (author_id) REFERENCES users(id)
);
`);
const hashedPassword = bcrypt.hashSync("password123", 10);

// Seed users with better "about"
db.prepare(`
  INSERT INTO users (username, name, email, password, role, about)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(
  "john",
  "John Doe",
  "john@example.com",
  hashedPassword,
  "Full Stack Developer",
  "John is a full stack developer who enjoys building scalable web applications and clean user experiences. He works across the stack, from designing APIs to crafting intuitive frontends. Passionate about performance and simplicity, he spends his time learning new technologies, writing technical blogs, and contributing to open-source projects."
);

db.prepare(`
   INSERT INTO users (username, name, email, password, role, about)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(
  "jane",
  "Jane Smith",
  "jane@example.com",
  hashedPassword,
  "Product Designer",
  "Jane is a product designer focused on creating thoughtful and user-centered digital experiences. She blends design, research, and storytelling to build products that are both functional and delightful. With a strong eye for detail, she enjoys working closely with developers and continuously iterating based on real user feedback."
);

console.log("DB reset + seeded successfully");

db.close();