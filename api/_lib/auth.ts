// Auth helper for admin endpoints. Validates a Supabase user JWT and checks
// the user's email against the ADMIN_EMAILS allowlist.

const URL = process.env.SUPABASE_URL;
const ANON = process.env.SUPABASE_ANON_KEY;
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export interface AdminUser {
  id: string;
  email: string;
}

/**
 * Given the authorization header from a Vercel Node-style request, validate
 * the bearer token with Supabase and confirm the user's email is in the
 * admin allowlist.
 *
 * Returns the admin user on success, or throws HttpError(status, message).
 */
export async function requireAdmin(authorizationHeader: string | undefined): Promise<AdminUser> {
  if (!URL || !ANON) throw new HttpError(500, "Supabase env not configured");

  const token = authorizationHeader?.startsWith("Bearer ")
    ? authorizationHeader.slice(7)
    : "";
  if (!token) throw new HttpError(401, "Missing bearer token");

  const res = await fetch(`${URL}/auth/v1/user`, {
    headers: { apikey: ANON, Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new HttpError(401, "Invalid token");

  const user = (await res.json()) as { id?: string; email?: string };
  if (!user.id || !user.email) throw new HttpError(401, "Token has no user");

  if (!ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    throw new HttpError(403, "Not an admin");
  }
  return { id: user.id, email: user.email };
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
