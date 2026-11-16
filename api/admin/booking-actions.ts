// POST /api/admin/booking-actions
//
// Admin-only actions on a single booking. Body: { id, action }
//   action = "delete"    — remove the row entirely (test cleanup)
//   action = "mark_paid" — flip status to "paid" (manual reconciliation if Stripe
//                          webhook didn't fire)
//   action = "cancel"    — flip status to "cancelled" (frees the slot)

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

type Action = "delete" | "mark_paid" | "cancel";
const ALLOWED: Action[] = ["delete", "mark_paid", "cancel"];

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
    console.error("[admin/booking-actions] auth failed", err);
    return res.status(500).json({ error: "auth_failed" });
  }

  const payload = (req.body ?? {}) as { id?: string; action?: string };
  const id = String(payload.id ?? "").trim();
  const action = String(payload.action ?? "").trim() as Action;

  if (!id) return res.status(400).json({ error: "id_required" });
  if (!ALLOWED.includes(action)) return res.status(400).json({ error: "unknown_action" });

  try {
    if (action === "delete") {
      // Hard delete. Only for test data cleanup — production bookings should be cancelled + refunded.
      await sbFetch(`/rest/v1/bookings?id=eq.${encodeURIComponent(id)}`, {
        method: "DELETE",
        service: true,
      });
    } else if (action === "mark_paid") {
      await sbPatch(`/rest/v1/bookings?id=eq.${encodeURIComponent(id)}`, {
        status: "paid",
        paid_at: new Date().toISOString(),
      });
    } else if (action === "cancel") {
      await sbPatch(`/rest/v1/bookings?id=eq.${encodeURIComponent(id)}`, {
        status: "cancelled",
      });
    }
    console.log(`[admin/booking-actions] ${admin.email} → ${action} → ${id}`);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[admin/booking-actions] failed", err);
    return res.status(500).json({ error: "action_failed", detail: message });
  }
}
