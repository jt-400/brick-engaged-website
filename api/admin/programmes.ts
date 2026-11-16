// GET /api/admin/programmes
//
// Admin-only: returns every programme (id + slug + title + default capacity +
// default price) so the schedule editor can offer a programme picker when
// creating a new slot.

import { sbFetch } from "../_lib/supabase";
import { requireAdmin, HttpError } from "../_lib/auth";

type ReqLike = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
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

  try {
    const authHeader = (req.headers.authorization ?? req.headers.Authorization) as string | undefined;
    await requireAdmin(authHeader);
  } catch (err) {
    if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
    console.error("[admin/programmes] auth failed", err);
    return res.status(500).json({ error: "auth_failed" });
  }

  try {
    const rows = await sbFetch<unknown[]>(
      `/rest/v1/programmes?select=*&order=title.asc`,
      { service: true },
    );
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ programmes: rows ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[admin/programmes] fetch failed", err);
    return res.status(500).json({ error: "fetch_failed", detail: message });
  }
}
