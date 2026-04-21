import type { APIRoute } from "astro";
import bcrypt from "bcrypt";
import { db } from "../../lib/db";
import type { User } from "../../lib/schema";
export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  const user= db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email);

  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
  }


  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
  }

  // Store session (simple cookie)
  cookies.set(
    "user",
    JSON.stringify({
      id: user.id,
      username: user.username,
      name: user.name,
    }),
    {
      path: "/",
      httpOnly: true,
    }
  );

  return new Response(JSON.stringify({ success: true }));
};