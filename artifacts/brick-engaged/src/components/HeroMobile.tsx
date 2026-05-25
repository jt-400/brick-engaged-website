import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { Link } from "wouter";
import { LegoButton } from "@/components/LegoButton";
import { LegoCanvas } from "@/lego/LegoCanvas";
import { LEGO_MODELS } from "@/lego/modelsData";

interface HeroMobileProps {
  className?: string;
}

/**
 * Mobile hero (< md). Clarity, warmth, immediate action.
 * NOT a compressed desktop hero — designed mobile-first.
 *
 * Reading flow:
 *   headline → subhead → CTA → visual → subtle scroll cue
 *
 * Visual: portrait-cropped central tower, anchored bottom.
 * Motion: subtle, ambient. prefers-reduced-motion renders static tower.
 * Hero height: 85vh so next section peeks in (no dead-stop feel).
 */
export function HeroMobile({ className = "" }: HeroMobileProps) {
  const shouldReduceMotion = useReducedMotion();

  // Portrait visual: only the centre tower of the castle
  const portraitModel = useMemo(
    () => ({
      ...LEGO_MODELS[0],
      bricks: LEGO_MODELS[0].bricks.filter((b) => b.anchor === "center"),
    }),
    []
  );

  return (
    <section
      className={`relative w-full min-h-[85vh] flex flex-col overflow-hidden bg-charcoal ${className}`}
    >
      {/* Soft warm light rising from the base — emotional warmth */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 110% 55% at 50% 100%, rgba(255,229,39,0.14), transparent 70%)",
        }}
      />

      {/* Top scrim — header legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/35 to-transparent z-[5]"
      />

      {/* Subtle brick-dot pattern, lighter on mobile */}
      <div
        aria-hidden
        className="absolute inset-0 bg-brick-pattern opacity-[0.06] pointer-events-none z-[1]"
      />

      {/* Content — directly into reading flow, no decorative element above */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-[96px]">
        {/* Headline — tighter than desktop, 2 lines */}
        <h1
          className="font-black text-white text-center leading-[1.04] tracking-tight text-[34px]"
          style={{ letterSpacing: "-0.025em" }}
        >
          Building connections.
          <br />
          One brick at a time.
        </h1>

        {/* Subhead — highly legible, increased contrast */}
        <p
          className="text-center text-white/90 font-medium leading-snug mt-4 max-w-[320px] text-[15px]"
          style={{ fontFamily: "var(--app-font-sans, Nunito), system-ui, sans-serif" }}
        >
          Using the transformative power of play to create positive, lasting change.
        </p>

        {/* Primary CTA — directly under subhead, dominant, separate from castle */}
        <div className="mt-7">
          <Link href="/sessions">
            <LegoButton
              variant="green"
              aria-label="View our sessions"
              data-testid="hero-mobile-cta"
            >
              View Sessions
            </LegoButton>
          </Link>
        </div>
      </div>

      {/* Supporting visual — central tower anchored to the base */}
      <div className="relative z-[2] flex-1 mt-6 min-h-[220px]">
        <div className="absolute inset-0">
          <LegoCanvas
            key={`mobile-castle-${shouldReduceMotion ? "static" : "live"}`}
            activeModel={portraitModel}
            buildSpeed={shouldReduceMotion ? 999 : 2.6}
            spawnStagger={shouldReduceMotion ? 0 : 100}
            bounceForce={0.55}
            gravity={0.65}
            debugGrid={false}
            isPlaying={true}
            clickToPop={false}
            onBrickDocked={() => {}}
          />
        </div>
      </div>

      {/* Subtle scroll cue — sits at the very base, ambient */}
      <motion.div
        aria-hidden
        animate={shouldReduceMotion ? undefined : { y: [0, 4, 0] }}
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 1.9, repeat: Infinity, ease: "easeInOut" }
        }
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      >
        <span className="block w-[2px] h-4 bg-white/40 rounded-full" />
      </motion.div>
    </section>
  );
}
