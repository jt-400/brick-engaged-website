// GET /api/admin/bookings
//
// Admin-only: returns every booking with slot + programme details. Uses the
// Supabase service-role key to bypass RLS, but only after the caller's JWT
// has been validated and their email matches the ADMIN_EMAILS allowlist.

import { sbFetch } from "../_lib/supabase";
import { requireAdmin, HttpError } from "../_lib/auth";

type ReqLike = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
};
type ResLike = {
  setHeader: (key: string, value: string) => void;
  status: (code: number) => ResLike;
  json: (body: unknown) => ResLike;
};

export default async function handler(req: ReqLike, res: ResLike) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  // Auth gate — only admins past this point.
  try {
    const authHeader = (req.headers.authorization ?? req.headers.Authorization) as string | undefined;
    await requireAdmin(authHeader);
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("[admin/bookings] auth check failed", err);
    return res.status(500).json({ error: "auth_failed" });
  }

  try {
    // `*` keeps us forgiving as the schema evolves. The slot embed walks through
    // to the programme so we can show "Brick Club" rather than just a UUID.
    const select = "*,slot:slot_id(starts_at,ends_at,programme:programme_id(slug,title,price_cents))";

    const rows = await sbFetch<unknown[]>(
      `/rest/v1/bookings?select=${encodeURIComponent(select)}&order=created_at.desc&limit=500`,
      { service: true },
    );

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ bookings: rows ?? [] });
  } catch (err) {
    // Surface the real Supabase error so we can debug admin issues from the page.
    const message = err instanceof Error ? err.message : String(err);
    console.error("[admin/bookings] fetch failed", err);
    return res.status(500).json({ error: "fetch_failed", detail: message });
  }
}
