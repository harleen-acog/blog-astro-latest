import Database from "better-sqlite3";
import path from "path";

// always resolve from project root
const dbPath = path.resolve("db.sqlite");

export const db = new Database(dbPath);