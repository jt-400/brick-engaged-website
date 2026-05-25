import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useMemo, useState, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { LegoButton } from "@/components/LegoButton";
import { LegoCanvas } from "@/lego/LegoCanvas";
import { LEGO_MODELS } from "@/lego/modelsData";

interface HeroMobileProps {
  className?: string;
}

/**
 * Mobile hero (< md). Headline + subhead at top, central tower spread full-width
 * across the lower half, green CTA drops onto the top of the tower as the final piece.
 *
 * Reading flow:
 *   headline → subhead → (castle build) → CTA lands on top → scroll cue
 */
export function HeroMobile({ className = "" }: HeroMobileProps) {
  const shouldReduceMotion = useReducedMotion();

  // Central tower only (no red/blue side towers — they don't fit phone aspect)
  const portraitModel = useMemo(
    () => ({
      ...LEGO_MODELS[0],
      bricks: LEGO_MODELS[0].bricks.filter((b) => b.anchor === "center"),
    }),
    []
  );

  // CTA drops in when castle build completes (same UX as desktop)
  const [castleComplete, setCastleComplete] = useState(false);
  const handleBrickDocked = useCallback(
    (totalDocked: number, totalModelBricks: number) => {
      if (totalModelBricks > 0 && totalDocked >= totalModelBricks) {
        setCastleComplete(true);
      }
    },
    []
  );

  // Reduced-motion: skip the animation, just show the CTA after a tick
  useEffect(() => {
    if (shouldReduceMotion) {
      const t = setTimeout(() => setCastleComplete(true), 400);
      return () => clearTimeout(t);
    }
  }, [shouldReduceMotion]);

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

      {/* Top content — headline + subhead only (CTA moved onto castle below) */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-[96px] pb-6">
        <h1
          className="font-black text-white text-center leading-[1.04] tracking-tight text-[34px]"
          style={{ letterSpacing: "-0.025em" }}
        >
          Building connections.
          <br />
          One brick at a time.
        </h1>

        <p
          className="text-center text-white/90 font-medium leading-snug mt-4 max-w-[320px] text-[15px]"
          style={{ fontFamily: "var(--app-font-sans, Nunito), system-ui, sans-serif" }}
        >
          Using the transformative power of play to create positive, lasting change.
        </p>
      </div>

      {/* Castle area — central tower scaled to fill full width, CTA drops on top */}
      <div className="relative z-[2] flex-1 min-h-[300px]">
        {/* Scaled canvas wrapper — origin bottom-centre so tower stays anchored,
            scale ~1.7x makes the central tower span full mobile width */}
        <div
          className="absolute inset-0"
          style={{
            transform: "scale(1.7)",
            transformOrigin: "50% 100%",
          }}
        >
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
            onBrickDocked={handleBrickDocked}
          />
        </div>

        {/* CTA — lands on top of the castle as the final piece, smaller (sm) so it sits cleanly */}
        <div className="absolute left-1/2 -translate-x-1/2 z-10" style={{ bottom: "52%" }}>
          <AnimatePresence>
            {castleComplete && (
              <motion.div
                initial={
                  shouldReduceMotion ? false : { y: -260, opacity: 0, rotate: -5 }
                }
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: [-260, 0, -18, 0],
                        opacity: 1,
                        rotate: [-5, 0, -1, 0],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        duration: 0.75,
                        times: [0, 0.7, 0.86, 1],
                        ease: ["easeIn", "easeOut", "easeIn", "easeOut"],
                      }
                }
                style={{ transformOrigin: "50% 100%" }}
              >
                <Link href="/sessions">
                  <LegoButton
                    variant="green"
                    size="sm"
                    aria-label="View our sessions"
                    data-testid="hero-mobile-cta"
                  >
                    View Sessions
                  </LegoButton>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
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
