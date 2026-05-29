import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { LegoCanvas } from "@/lego/LegoCanvas";
import { LEGO_MODELS } from "@/lego/modelsData";

interface HeroDesktopProps {
  className?: string;
}

// Minifigure colours for the ground strip — playful but restrained palette
const MINIFIG_COLORS = [
  "#34c08e", // green
  "#f4c542", // yellow
  "#d94f3d", // red
  "#3a78c4", // blue
  "#34c08e", // green
  "#f4c542", // yellow
];

/**
 * Desktop / tablet hero (md+). Two-column asymmetric layout (≥900px),
 * collapses to single column below 900px.
 *
 * Left: eyebrow + headline + subhead + primary/secondary CTA + meta
 * Right: animated LEGO castle (unchanged, just repositioned)
 * Bottom: full-width ground strip with minifigure decals tying both halves
 */
export function HeroDesktop({ className = "" }: HeroDesktopProps) {
  const activeModel = LEGO_MODELS[0];
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className={`relative w-full min-h-screen flex flex-col overflow-hidden ${className}`}
      style={{ backgroundColor: "#1b2731" }}
    >
      {/* Subtle brick-dot pattern */}
      <div
        aria-hidden
        className="absolute inset-0 bg-brick-pattern opacity-[0.07] pointer-events-none z-[1]"
      />

      {/* Soft warm glow weighted toward the castle side */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 78% 55%, rgba(255,229,39,0.06), transparent 70%)",
        }}
      />

      {/* Main content area: 1 col → 2 col at 900px */}
      <div
        className="relative z-10 flex-1 w-full max-w-[1280px] mx-auto px-6 lg:px-10 pt-24 lg:pt-28 pb-8 grid grid-cols-1 gap-10 min-[900px]:grid-cols-[1.12fr_0.88fr] min-[900px]:gap-8 min-[900px]:items-center"
      >
        {/* Left column: text content */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={
            shouldReduceMotion ? undefined : { duration: 0.55, ease: "easeOut" }
          }
          className="flex flex-col"
        >
          {/* Eyebrow pill */}
          <span
            className="inline-flex self-start items-center text-[11px] font-bold uppercase tracking-[0.13em] px-3 py-1.5 rounded-full mb-4"
            style={{
              backgroundColor: "rgba(52,192,142,0.16)",
              color: "#5fd6aa",
            }}
          >
            LEGO®-based sessions
          </span>

          {/* Headline — left-aligned, much smaller, tight line-height */}
          <h1
            className="text-white font-black leading-[1.0] mb-4"
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              letterSpacing: "-0.01em",
              fontFamily:
                "var(--app-font-display, Outfit), system-ui, sans-serif",
            }}
          >
            Building connections.
            <br />
            One brick at a time.
          </h1>

          {/* Subhead */}
          <p
            className="text-[15px] leading-[1.5] font-normal mb-6 max-w-[330px]"
            style={{
              color: "#9fb0bd",
              fontFamily: "var(--app-font-sans, Nunito), system-ui, sans-serif",
            }}
          >
            Using the transformative power of play to create positive, lasting
            change.
          </p>

          {/* CTA row */}
          <div className="flex gap-3 items-center flex-wrap">
            {/* Primary — solid green brick-button */}
            <Link href="/sessions">
              <a
                className="inline-flex items-center gap-2 font-semibold text-[14px] tracking-wide rounded-[9px] transition-all hover:brightness-110 active:translate-y-[2px] active:border-b-2"
                style={{
                  backgroundColor: "#34c08e",
                  color: "#06281d",
                  borderBottom: "4px solid #1f9c6f",
                  padding: "13px 22px",
                  letterSpacing: "0.04em",
                  minHeight: "44px",
                }}
                data-testid="hero-cta-primary"
                aria-label="View our sessions"
              >
                View Sessions
                <ArrowRight size={16} strokeWidth={2.5} aria-hidden />
              </a>
            </Link>

            {/* Secondary — outlined ghost */}
            <Link href="/holiday">
              <a
                className="inline-flex items-center gap-2 font-medium text-[14px] tracking-wide rounded-[9px] transition-colors hover:border-slate-400 hover:text-white"
                style={{
                  color: "#cdd8e0",
                  border: "1.5px solid #38444f",
                  padding: "11.5px 18px",
                  letterSpacing: "0.04em",
                  minHeight: "44px",
                }}
                data-testid="hero-cta-secondary"
              >
                Book a holiday session
              </a>
            </Link>
          </div>

          {/* Meta line */}
          <p
            className="mt-5 text-[12px] uppercase font-medium"
            style={{
              color: "#6f7e89",
              letterSpacing: "0.06em",
            }}
          >
            Weekly Brick Club · school-holiday programmes
          </p>
        </motion.div>

        {/* Right column: LEGO castle — anchored to bottom of column */}
        <div className="relative w-full self-end min-h-[380px] min-[900px]:min-h-[460px]">
          <div className="absolute inset-0">
            {!shouldReduceMotion && (
              <LegoCanvas
                key="castle-desktop"
                activeModel={activeModel}
                buildSpeed={1.35}
                bounceForce={0.55}
                gravity={0.65}
                spawnStagger={260}
                debugGrid={false}
                isPlaying={true}
                clickToPop={true}
                onBrickDocked={() => {}}
              />
            )}
          </div>
        </div>
      </div>

      {/* Ground strip with minifigure decals — ties left + right halves */}
      <div
        className="relative z-[3] w-full border-t flex justify-around items-end px-6 lg:px-12 py-3"
        style={{
          backgroundColor: "#16212a",
          borderColor: "rgba(40,53,64,0.6)",
        }}
        aria-hidden
      >
        {MINIFIG_COLORS.map((color, i) => (
          <div key={i} className="flex flex-col items-center gap-[1px]">
            <span
              className="block w-[14px] h-[14px] rounded-full"
              style={{ backgroundColor: "#f4c542" }}
            />
            <span
              className="block w-[18px] h-[18px]"
              style={{
                backgroundColor: color,
                borderRadius: "4px 4px 3px 3px",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
