import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useMemo, useState, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { LegoButton } from "@/components/LegoButton";
import { LegoCanvas } from "@/lego/LegoCanvas";
import { LEGO_MODELS } from "@/lego/modelsData";
import type { BrickTemplate } from "@/lego/types";

interface HeroMobileProps {
  className?: string;
}

const HEADER_H = 64; // matches the fixed header height in Layout.tsx
const CASTLE_H = 380; // canvas area height — castle lives here
const CTA_TOP_FROM_CASTLE_BOTTOM = 285; // tuned: CTA bottom edge sits at tower peak

/**
 * Mobile hero (< md).
 *
 * Layout (top → bottom):
 *   [ header (fixed, 64px) ]
 *   [ text area — flex-1, vertically centred between header and castle ]
 *     headline
 *     subhead
 *   [ castle area — fixed height, taller central tower spans full width ]
 *     [CTA drops onto tower top as final piece]
 *   [ scroll cue ]
 */
export function HeroMobile({ className = "" }: HeroMobileProps) {
  const shouldReduceMotion = useReducedMotion();

  // Central tower only, gridX/gridW doubled to span full canvas width.
  // PLUS extra wall rows on top so the tower is taller — gives the CTA a real
  // "peak" to land on and fills more of the castle area.
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

    // Extension: 5 extra rows on top — alternating gray / dark-gray walls,
    // capped with parapets so the silhouette stays "fortress-like".
    const extra: BrickTemplate[] = [
      { id: "mob-x-11", type: "rect", gridX: -8, gridY: maxGridY, gridW: 16, gridH: 1, color: "gray", anchor: "center" },
      { id: "mob-x-12", type: "rect", gridX: -8, gridY: maxGridY + 1, gridW: 16, gridH: 1, color: "dark-gray", anchor: "center" },
      { id: "mob-x-13", type: "rect", gridX: -8, gridY: maxGridY + 2, gridW: 16, gridH: 1, color: "gray", anchor: "center" },
      { id: "mob-x-14", type: "rect", gridX: -8, gridY: maxGridY + 3, gridW: 16, gridH: 1, color: "gray", anchor: "center" },
      // Parapet cap row
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

  // Reduced-motion: skip the animation, show CTA after a tick
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

      {/* Text area — fills space between header and castle, vertically centred */}
      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-4"
        style={{ paddingTop: `${HEADER_H}px` }}
      >
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

      {/* Castle area — fixed height, taller central tower, CTA lands at peak */}
      <div
        className="relative z-[2] w-full"
        style={{ height: `${CASTLE_H}px` }}
      >
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
            onBrickDocked={handleBrickDocked}
          />
        </div>

        {/* CTA — drops onto the tower top as the final piece.
            Positioned by 'bottom' so it sits ON the castle peak regardless of section height. */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-10"
          style={{ bottom: `${CTA_TOP_FROM_CASTLE_BOTTOM}px` }}
        >
          <AnimatePresence>
            {castleComplete && (
              <motion.div
                initial={
                  shouldReduceMotion ? false : { y: -240, opacity: 0, rotate: -5 }
                }
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: [-240, 0, -16, 0],
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
