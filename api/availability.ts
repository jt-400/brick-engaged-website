// GET /api/availability?programme=<slug>&from=YYYY-MM-DD&to=YYYY-MM-DD
//
// Public endpoint: returns one row per open slot in the window, with the
// number of remaining seats derived from confirmed + recent-pending bookings.
//
// All capacity logic lives in the SQL function `availability_for` so the same
// rules apply whether the request comes from the website, an admin tool, or a
// future mobile client.

import { sbRpc } from "./_lib/supabase";

type AvailabilityRow = {
  slot_id: string;
  starts_at: string;
  ends_at: string;
  capacity: number;
  remaining: number;
  status: "open" | "closed" | "full";
};

const DEFAULT_WINDOW_DAYS = 90;

// Vercel passes Node IncomingMessage/ServerResponse-shaped objects in the
// default Node runtime. Using a minimal structural type avoids a hard
// dependency on @vercel/node — easier to install and faster cold start.
type ReqLike = {
  method?: string;
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

  const programme = String(req.query.programme ?? "").trim();
  if (!programme) {
    return res.status(400).json({ error: "programme_required" });
  }

  const now = new Date();
  const from = parseDate(req.query.from) ?? startOfDay(now);
  const to =
    parseDate(req.query.to) ??
    new Date(from.getTime() + DEFAULT_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  if (to <= from) {
    return res.status(400).json({ error: "invalid_window" });
  }

  try {
    const rows = await sbRpc<AvailabilityRow[]>("availability_for", {
      p_slug: programme,
      p_from: from.toISOString(),
      p_to: to.toISOString(),
    });

    // Cache for 30s at the edge — keeps the calendar snappy without showing
    // stale availability for more than half a minute.
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=30, stale-while-revalidate=60",
    );
    return res.status(200).json({
      programme,
      from: from.toISOString(),
      to: to.toISOString(),
      slots: rows ?? [],
    });
  } catch (err) {
    console.error("[availability] rpc failed", err);
    return res.status(500).json({ error: "availability_failed" });
  }
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== "string" || !value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
