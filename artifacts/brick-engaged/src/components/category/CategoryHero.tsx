import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { LegoButton } from "@/components/LegoButton";

export interface CategoryHeroFact {
  label: string;
  value: string;
}

interface CategoryHeroProps {
  kicker: string;
  title: string;
  tagline: string;
  /** Quick facts shown as chips in the hero (age, group size, duration, etc.) */
  facts: CategoryHeroFact[];
  price?: string;
  priceCadence?: string; // e.g. "per 10-week term"
  primaryCta?: { label: string; href?: string; anchor?: string };
  secondaryCta?: { label: string; href: string; external?: boolean };
  backHref?: string;
  backLabel?: string;
}

/**
 * Shared hero for every programme detail page. Charcoal background with the
 * lego-orange accent — matches the existing visual language but tighter than
 * the bespoke per-page heroes that grew organically.
 */
export function CategoryHero({
  kicker,
  title,
  tagline,
  facts,
  price,
  priceCadence,
  primaryCta,
  secondaryCta,
  backHref = "/sessions",
  backLabel = "Back to sessions",
}: CategoryHeroProps) {
  return (
    <section className="relative overflow-hidden bg-charcoal text-white">
      <div className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none" />
      <div className="container relative z-10 mx-auto max-w-5xl px-4 pt-20 pb-12 md:pt-28 md:pb-20">
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <Link href={backHref}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-white/70 hover:text-white cursor-pointer">
              <ArrowLeft size={14} /> {backLabel}
            </span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block bg-lego-orange text-charcoal text-xs font-black px-3 py-1 rounded-md mb-5 tracking-[0.13em] uppercase">
              {kicker}
            </span>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.02] mb-5"
              style={{ letterSpacing: "-0.025em" }}
            >
              {title}
            </h1>
            <p className="text-lg md:text-xl font-medium text-white/80 leading-relaxed max-w-xl">
              {tagline}
            </p>

            {(primaryCta || secondaryCta) && (
              <div className="mt-7 flex flex-wrap gap-3">
                {primaryCta ? (
                  primaryCta.anchor ? (
                    <a
                      href={`#${primaryCta.anchor}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(primaryCta.anchor!)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    >
                      <LegoButton variant="orange" data-testid="hero-cta-primary">{primaryCta.label}</LegoButton>
                    </a>
                  ) : (
                    <Link href={primaryCta.href ?? "#"}>
                      <LegoButton variant="orange" data-testid="hero-cta-primary">{primaryCta.label}</LegoButton>
                    </Link>
                  )
                ) : null}
                {secondaryCta ? (
                  secondaryCta.external ? (
                    <a href={secondaryCta.href} target="_blank" rel="noreferrer">
                      <LegoButton variant="white" data-testid="hero-cta-secondary">{secondaryCta.label}</LegoButton>
                    </a>
                  ) : (
                    <Link href={secondaryCta.href}>
                      <LegoButton variant="white" data-testid="hero-cta-secondary">{secondaryCta.label}</LegoButton>
                    </Link>
                  )
                ) : null}
              </div>
            )}
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative"
          >
            <div className="relative rounded-3xl bg-white text-charcoal p-7 md:p-8 shadow-2xl">
              {price && (
                <div className="absolute -top-4 -right-4 md:-top-5 md:-right-5 bg-lego-orange text-charcoal w-20 h-20 md:w-24 md:h-24 rounded-2xl flex flex-col items-center justify-center font-black rotate-6 shadow-xl">
                  <span className="text-2xl leading-none">{price}</span>
                  {priceCadence && (
                    <span className="text-[10px] text-center mt-1 px-2 leading-tight uppercase tracking-wider">
                      {priceCadence}
                    </span>
                  )}
                </div>
              )}
              <h2 className="text-xl font-black tracking-tight border-b-2 border-slate-100 pb-3 mb-4">
                Quick facts
              </h2>
              <dl className="space-y-3">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-start gap-3">
                    <dt className="w-24 shrink-0 text-[11px] font-bold uppercase tracking-wider text-slate-500 pt-0.5">
                      {f.label}
                    </dt>
                    <dd className="text-sm font-bold leading-snug">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
