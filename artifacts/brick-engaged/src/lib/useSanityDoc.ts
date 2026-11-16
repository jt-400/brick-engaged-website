import { useQuery } from "@tanstack/react-query";
import { sanityFetch } from "@/lib/sanity";

/**
 * Fetch a single Sanity document. Returns null if Sanity is misconfigured or
 * the document doesn't exist yet — callers should fall back to hard-coded
 * defaults so the page still renders.
 */
export function useSanityDoc<T>(
  key: string,
  query: string,
  params?: Record<string, unknown>,
) {
  return useQuery<T | null>({
    queryKey: ["sanity", key, params ?? null],
    queryFn: () => sanityFetch<T>(query, params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
