import type { APIRoute } from "astro";
import bcrypt from "bcrypt";
import { db } from "../../lib/db";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();

    const { username, name, email, password, role, about } = body;

    if (!username || !name || !email || !password || !role || !about) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user (use hashed password)
    const result = db
      .prepare(
        `
        INSERT INTO users (username, name, email, role, about, password)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      )
      .run(username, name, email, role, about, hashedPassword);

    const userId = result.lastInsertRowid;

    //  Set consistent cookie (same as login)
    cookies.set(
      "user",
      JSON.stringify({
        id: userId,
        username,
        name,
      }),
      {
        path: "/",
        httpOnly: true,
      },
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
};
