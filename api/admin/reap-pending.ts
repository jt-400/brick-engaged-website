// POST /api/admin/reap-pending
//
// Admin-only: flip every booking with status="pending" and created_at older
// than N minutes to "cancelled". Solves the "abandoned checkout stays pending
// forever" problem — anyone who closed the Stripe tab without paying leaves a
// pending row that never resolves.
//
// Default cutoff: 30 minutes. Body can override with `minutesOld` for testing.

import { sbFetch, sbPatch } from "../_lib/supabase";
import { requireAdmin, HttpError } from "../_lib/auth";

type ReqLike = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};
type ResLike = {
  setHeader: (key: string, value: string) => void;
  status: (code: number) => ResLike;
  json: (body: unknown) => ResLike;
};

const DEFAULT_CUTOFF_MIN = 30;

export default async function handler(req: ReqLike, res: ResLike) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  let admin;
  try {
    const authHeader = (req.headers.authorization ?? req.headers.Authorization) as string | undefined;
    admin = await requireAdmin(authHeader);
  } catch (err) {
    if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
    console.error("[admin/reap-pending] auth failed", err);
    return res.status(500).json({ error: "auth_failed" });
  }

  const payload = (req.body ?? {}) as { minutesOld?: number };
  const cutoffMin = Math.max(1, Number(payload.minutesOld ?? DEFAULT_CUTOFF_MIN));
  const cutoff = new Date(Date.now() - cutoffMin * 60 * 1000).toISOString();

  try {
    // Grab the set we're about to touch so we can report the count back.
    const stale = await sbFetch<Array<{ id: string }>>(
      `/rest/v1/bookings?select=id&status=eq.pending&created_at=lt.${encodeURIComponent(cutoff)}`,
      { service: true },
    );
    const count = stale?.length ?? 0;

    if (count > 0) {
      await sbPatch(
        `/rest/v1/bookings?status=eq.pending&created_at=lt.${encodeURIComponent(cutoff)}`,
        { status: "cancelled" },
      );
    }

    console.log(`[admin/reap-pending] ${admin.email} cancelled ${count} stale pending bookings older than ${cutoffMin}m`);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ ok: true, cancelled: count, cutoffMinutes: cutoffMin });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[admin/reap-pending] failed", err);
    return res.status(500).json({ error: "reap_failed", detail: message });
  }
}
