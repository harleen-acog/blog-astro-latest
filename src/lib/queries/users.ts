import { db } from "../db";
import { UserSchema, type User } from "../schema";

export function getUsers(): User[] {
  const rows = db.prepare("SELECT id, username, name, email, role, about FROM users").all();
  return rows.map(row => UserSchema.parse(row));
}

export function getUserByUsername(username: string): User | undefined {
  const row = db
    .prepare("SELECT id, username, name, email, role, about FROM users WHERE username = ?")
    .get(username);

  if (!row) return undefined;

  return UserSchema.parse(row);
}