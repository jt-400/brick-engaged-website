// Minimal Supabase REST helper for the booking serverless functions.
// We hit PostgREST directly with fetch — no SDK needed for the simple
// availability + RPC calls Phase 1/2 require, which keeps Vercel cold-starts
// fast and the deps list small.

const URL = process.env.SUPABASE_URL;
const ANON = process.env.SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !ANON) {
  // Don't throw at import time — Vercel runs the bundle even for unrelated
  // routes during local dev; surface the issue when the handler is actually invoked.
  console.warn("[supabase] SUPABASE_URL / SUPABASE_ANON_KEY missing");
}

type FetchOpts = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** Use the service-role key (bypasses RLS). Only for trusted server code. */
  service?: boolean;
};

export async function sbFetch<T = unknown>(path: string, opts: FetchOpts = {}): Promise<T> {
  if (!URL) throw new Error("SUPABASE_URL not configured");
  const key = opts.service ? SERVICE : ANON;
  if (!key) throw new Error(opts.service ? "SUPABASE_SERVICE_ROLE_KEY not configured" : "SUPABASE_ANON_KEY not configured");

  const res = await fetch(`${URL}${path}`, {
    method: opts.method ?? "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase ${res.status}: ${text}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Call a SECURITY DEFINER function defined in the schema. */
export function sbRpc<T = unknown>(fnName: string, args: Record<string, unknown>, opts: { service?: boolean } = {}) {
  return sbFetch<T>(`/rest/v1/rpc/${fnName}`, {
    method: "POST",
    body: args,
    service: opts.service,
  });
}

/** PATCH a resource (e.g. update a booking row). */
export function sbPatch(path: string, body: Record<string, unknown>) {
  return sbFetch<undefined>(path, {
    method: "PATCH",
    body,
    service: true,
  });
}
