import { lazy, Suspense } from "react";

// Sanity Studio is heavy (~5 MB gzipped) — code-split so the main bundle stays light.
const SanityStudio = lazy(async () => {
  const [{ Studio }, { sanityConfig }] = await Promise.all([
    import("sanity"),
    import("@/sanity/config"),
  ]);
  return { default: () => <Studio config={sanityConfig} /> };
});

export default function StudioPage() {
  return (
    <div style={{ height: "100vh", width: "100vw", background: "#fff" }}>
      <Suspense
        fallback={
          <div className="min-h-screen bg-charcoal text-white flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-lego-orange mb-4 animate-pulse">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-black tracking-tight">Loading Studio…</h1>
              <p className="text-white/60 font-medium text-sm mt-2">First load is ~5–10 seconds.</p>
            </div>
          </div>
        }
      >
        <SanityStudio />
      </Suspense>
    </div>
  );
}
