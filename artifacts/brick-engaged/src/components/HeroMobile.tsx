import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { Link } from "wouter";
import { LegoButton } from "@/components/LegoButton";
import { LegoCanvas } from "@/lego/LegoCanvas";
import { LEGO_MODELS } from "@/lego/modelsData";
import type { BrickTemplate } from "@/lego/types";

interface HeroMobileProps {
  className?: string;
}

/**
 * Mobile hero (< md). Tight top-to-bottom stack, then castle anchored to the base.
 *
 * Reading flow:
 *   headline → subhead → CTA → (gap) → castle build → scroll cue
 *
 * The CTA sits in the text stack (not landing on the castle) — keeps the reading
 * path linear and the CTA immediately available on page load.
 */
export function HeroMobile({ className = "" }: HeroMobileProps) {
  const shouldReduceMotion = useReducedMotion();

  // Central tower only, gridX/gridW doubled to span full canvas width.
  // Plus 5 extra rows on top to give the tower a proper peak.
  const portraitModel = useMemo(() => {
    const centerBricks: BrickTemplate[] = LEGO_MODELS[0].bricks
      .filter((b) => b.anchor === "center")
      .map((b) => ({
        ...b,
        gridX: b.gridX * 2,
        gridW: b.gridW * 2,
      }));

    const maxGridY = centerBricks.reduce(
      (m, b) => Math.max(m, b.gridY + b.gridH),
      0
    );

    const extra: BrickTemplate[] = [
      { id: "mob-x-11", type: "rect", gridX: -8, gridY: maxGridY, gridW: 16, gridH: 1, color: "gray", anchor: "center" },
      { id: "mob-x-12", type: "rect", gridX: -8, gridY: maxGridY + 1, gridW: 16, gridH: 1, color: "dark-gray", anchor: "center" },
      { id: "mob-x-13", type: "rect", gridX: -8, gridY: maxGridY + 2, gridW: 16, gridH: 1, color: "gray", anchor: "center" },
      { id: "mob-x-14", type: "rect", gridX: -8, gridY: maxGridY + 3, gridW: 16, gridH: 1, color: "gray", anchor: "center" },
      { id: "mob-x-15a", type: "parapet", gridX: -8, gridY: maxGridY + 4, gridW: 2, gridH: 1, color: "dark-gray", anchor: "center" },
      { id: "mob-x-15b", type: "parapet", gridX: -4, gridY: maxGridY + 4, gridW: 2, gridH: 1, color: "dark-gray", anchor: "center" },
      { id: "mob-x-15c", type: "parapet", gridX: 2, gridY: maxGridY + 4, gridW: 2, gridH: 1, color: "dark-gray", anchor: "center" },
      { id: "mob-x-15d", type: "parapet", gridX: 6, gridY: maxGridY + 4, gridW: 2, gridH: 1, color: "dark-gray", anchor: "center" },
    ];

    return {
      ...LEGO_MODELS[0],
      bricks: [...centerBricks, ...extra],
    };
  }, []);

  return (
    <section
      className={`relative w-full min-h-[85vh] flex flex-col overflow-hidden bg-charcoal ${className}`}
    >
      {/* Soft warm light rising from the base */}
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

      {/* Subtle brick-dot pattern */}
      <div
        aria-hidden
        className="absolute inset-0 bg-brick-pattern opacity-[0.06] pointer-events-none z-[1]"
      />

      {/* Top content stack — sits right below the header, tight spacing */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-[88px]">
        <h1
          className="font-black text-white text-center leading-[1.04] tracking-tight text-[34px]"
          style={{ letterSpacing: "-0.025em" }}
        >
          Building connections.
          <br />
          One brick at a time.
        </h1>

        <p
          className="text-center text-white/85 font-medium leading-snug mt-3 max-w-[320px] text-[15px]"
          style={{ fontFamily: "var(--app-font-sans, Nunito), system-ui, sans-serif" }}
        >
          Using the transformative power of play to create positive, lasting change.
        </p>

        <div className="mt-5">
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

      {/* Castle area — fills the remaining vertical space, base at section bottom */}
      <div className="relative z-[2] flex-1 min-h-[260px]">
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

      {/* Subtle scroll cue */}
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
