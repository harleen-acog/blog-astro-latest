// lib/auth.ts
export function getCurrentUser(cookies: any) {
  const userCookie = cookies.get("user");

  if (!userCookie) return null;

  try {
    return JSON.parse(userCookie.value);
  } catch {
    return null;
  }
}