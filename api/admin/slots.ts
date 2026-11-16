// /api/admin/slots
//
// Admin-only slot CRUD. All methods gated on the admin allowlist.
//
//   GET     — list every slot within an optional date window (?from=&to=)
//             with embedded programme + a computed booking count so the UI
//             can show "3 / 12 booked".
//   POST    — create one slot: { programme_id, starts_at, ends_at, capacity_override?, notes?, status? }
//   PATCH   — update one slot: { id, status?, capacity_override?, notes?, starts_at?, ends_at? }
//   DELETE  — remove one slot (fails safely at PostgREST if bookings still reference it — bookings.slot_id is set null on cascade, so this is safe).

import { sbFetch } from "../_lib/supabase";
import { requireAdmin, HttpError } from "../_lib/auth";

type ReqLike = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
  body?: unknown;
};
type ResLike = {
  setHeader: (key: string, value: string) => void;
  status: (code: number) => ResLike;
  json: (body: unknown) => ResLike;
};

type SlotStatus = "open" | "closed" | "full";
const ALLOWED_STATUS: SlotStatus[] = ["open", "closed", "full"];

export default async function handler(req: ReqLike, res: ResLike) {
  // Auth first — every method requires admin.
  let admin;
  try {
    const authHeader = (req.headers.authorization ?? req.headers.Authorization) as string | undefined;
    admin = await requireAdmin(authHeader);
  } catch (err) {
    if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
    console.error("[admin/slots] auth failed", err);
    return res.status(500).json({ error: "auth_failed" });
  }

  if (req.method === "GET") return handleList(req, res);
  if (req.method === "POST") return handleCreate(req, res, admin.email);
  if (req.method === "PATCH") return handleUpdate(req, res, admin.email);
  if (req.method === "DELETE") return handleDelete(req, res, admin.email);

  res.setHeader("Allow", "GET, POST, PATCH, DELETE");
  return res.status(405).json({ error: "method_not_allowed" });
}

/* -------------------------------------------------------------- LIST -- */

async function handleList(req: ReqLike, res: ResLike) {
  const from = String(req.query.from ?? "");
  const to = String(req.query.to ?? "");
  const programmeSlug = String(req.query.programme ?? "");

  const filters: string[] = [];
  if (from) filters.push(`starts_at=gte.${encodeURIComponent(from)}`);
  if (to) filters.push(`starts_at=lte.${encodeURIComponent(to)}`);

  const select = "id,starts_at,ends_at,status,capacity_override,notes,programme_id,programmes:programme_id(id,slug,title,default_capacity,price_cents)";

  try {
    let path = `/rest/v1/slots?select=${encodeURIComponent(select)}&order=starts_at.asc&limit=500`;
    if (filters.length) path += `&${filters.join("&")}`;
    if (programmeSlug) path += `&programmes.slug=eq.${encodeURIComponent(programmeSlug)}`;

    const slots = await sbFetch<Array<{ id: string; programme_id: string; capacity_override: number | null; programmes: { default_capacity: number | null } | null }>>(
      path,
      { service: true },
    );

    // Booking counts per slot — one small extra query, keeps the schedule
    // page honest ("3 of 12 booked, 2 pending").
    const ids = (slots ?? []).map((s) => s.id);
    let counts: Record<string, { paid: number; pending: number }> = {};
    if (ids.length) {
      const idList = ids.map(encodeURIComponent).join(",");
      const bookings = await sbFetch<Array<{ slot_id: string; status: string }>>(
        `/rest/v1/bookings?select=slot_id,status&slot_id=in.(${idList})&status=in.(paid,pending)`,
        { service: true },
      );
      counts = (bookings ?? []).reduce<Record<string, { paid: number; pending: number }>>((acc, b) => {
        if (!b.slot_id) return acc;
        if (!acc[b.slot_id]) acc[b.slot_id] = { paid: 0, pending: 0 };
        if (b.status === "paid") acc[b.slot_id].paid++;
        else if (b.status === "pending") acc[b.slot_id].pending++;
        return acc;
      }, {});
    }

    const enriched = (slots ?? []).map((s) => ({
      ...s,
      effective_capacity: s.capacity_override ?? s.programmes?.default_capacity ?? null,
      booking_count_paid: counts[s.id]?.paid ?? 0,
      booking_count_pending: counts[s.id]?.pending ?? 0,
    }));

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ slots: enriched });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[admin/slots] list failed", err);
    return res.status(500).json({ error: "list_failed", detail: message });
  }
}

/* ----------------------------------------------------------- CREATE -- */

async function handleCreate(req: ReqLike, res: ResLike, actor: string) {
  const p = (req.body ?? {}) as {
    programme_id?: string;
    starts_at?: string;
    ends_at?: string;
    capacity_override?: number | null;
    notes?: string | null;
    status?: SlotStatus;
  };
  if (!p.programme_id || !p.starts_at || !p.ends_at) {
    return res.status(400).json({ error: "programme_id, starts_at, ends_at required" });
  }

  try {
    const row = {
      programme_id: p.programme_id,
      starts_at: p.starts_at,
      ends_at: p.ends_at,
      capacity_override: p.capacity_override ?? null,
      notes: p.notes ?? null,
      status: (p.status && ALLOWED_STATUS.includes(p.status)) ? p.status : "open",
    };
    const created = await sbFetch<unknown[]>(`/rest/v1/slots`, {
      method: "POST",
      body: row,
      service: true,
    });
    console.log(`[admin/slots] ${actor} created slot at ${p.starts_at} for programme ${p.programme_id}`);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ slot: Array.isArray(created) ? created[0] : created });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[admin/slots] create failed", err);
    // Common failure: duplicate (programme_id, starts_at)
    const status = /duplicate|unique/i.test(message) ? 409 : 500;
    return res.status(status).json({ error: "create_failed", detail: message });
  }
}

/* ----------------------------------------------------------- UPDATE -- */

async function handleUpdate(req: ReqLike, res: ResLike, actor: string) {
  const p = (req.body ?? {}) as {
    id?: string;
    status?: SlotStatus;
    capacity_override?: number | null;
    notes?: string | null;
    starts_at?: string;
    ends_at?: string;
  };
  const id = String(p.id ?? "").trim();
  if (!id) return res.status(400).json({ error: "id_required" });

  const patch: Record<string, unknown> = {};
  if (p.status !== undefined) {
    if (!ALLOWED_STATUS.includes(p.status)) return res.status(400).json({ error: "invalid_status" });
    patch.status = p.status;
  }
  if (p.capacity_override !== undefined) patch.capacity_override = p.capacity_override;
  if (p.notes !== undefined) patch.notes = p.notes;
  if (p.starts_at !== undefined) patch.starts_at = p.starts_at;
  if (p.ends_at !== undefined) patch.ends_at = p.ends_at;

  if (Object.keys(patch).length === 0) return res.status(400).json({ error: "no_fields" });

  try {
    await sbFetch(`/rest/v1/slots?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: patch,
      service: true,
    });
    console.log(`[admin/slots] ${actor} patched ${id} → ${JSON.stringify(patch)}`);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[admin/slots] update failed", err);
    return res.status(500).json({ error: "update_failed", detail: message });
  }
}

/* ----------------------------------------------------------- DELETE -- */

async function handleDelete(req: ReqLike, res: ResLike, actor: string) {
  const p = (req.body ?? {}) as { id?: string };
  const id = String(p.id ?? "").trim();
  if (!id) return res.status(400).json({ error: "id_required" });

  try {
    await sbFetch(`/rest/v1/slots?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      service: true,
    });
    console.log(`[admin/slots] ${actor} deleted slot ${id}`);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[admin/slots] delete failed", err);
    return res.status(500).json({ error: "delete_failed", detail: message });
  }
}
