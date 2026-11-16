import { createClient } from "@sanity/client";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID ?? "1hlznrcy";
const dataset = import.meta.env.VITE_SANITY_DATASET ?? "production";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  useCdn: true, // Public read traffic served via Sanity's CDN — fast + cheap.
  perspective: "published",
});

/** Fetch a single document by GROQ query. Returns null if nothing matches. */
export async function sanityFetch<T = unknown>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  try {
    return await sanityClient.fetch<T>(query, params);
  } catch (err) {
    console.warn("[sanity] fetch failed — falling back to defaults", err);
    return null;
  }
}
