import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies }) => {
  cookies.delete("user", { path: "/" });

  return new Response(JSON.stringify({ success: true }));
};