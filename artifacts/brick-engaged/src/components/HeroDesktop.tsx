import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { LegoButton } from "@/components/LegoButton";
import { LegoCanvas } from "@/lego/LegoCanvas";
import { LEGO_MODELS } from "@/lego/modelsData";

interface HeroDesktopProps {
  className?: string;
}

/**
 * Desktop / tablet hero (md+). Cinematic, immersive, full-canvas castle build.
 * Self-contained — owns all its motion + state. No mobile branching.
 */
export function HeroDesktop({ className = "" }: HeroDesktopProps) {
  const activeModel = LEGO_MODELS[0]; // full castle
  const shouldReduceMotion = useReducedMotion();

  // CTA drops in as the final castle piece when build completes.
  const [castleComplete, setCastleComplete] = useState(false);
  const handleBrickDocked = useCallback(
    (totalDocked: number, totalModelBricks: number) => {
      if (totalModelBricks > 0 && totalDocked >= totalModelBricks) {
        setCastleComplete(true);
      }
    },
    []
  );

  // Under reduced-motion the canvas doesn't render — reveal CTA on a short timer
  useEffect(() => {
    if (shouldReduceMotion) {
      const t = setTimeout(() => setCastleComplete(true), 400);
      return () => clearTimeout(t);
    }
  }, [shouldReduceMotion]);

  return (
    <section
      className={`relative w-full h-screen overflow-hidden bg-charcoal ${className}`}
    >
      {/* Atmospheric radial glow — gentle pulse */}
      <motion.div
        aria-hidden
        animate={shouldReduceMotion ? undefined : { opacity: [0.85, 1, 0.85] }}
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 25%, rgba(255,229,39,0.08), transparent 65%)",
        }}
      />

      {/* Brick-dot pattern */}
      <div
        aria-hidden
        className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none z-[1]"
      />

      {/* Full-bleed falling-LEGO castle */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 opacity-95">
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
            onBrickDocked={handleBrickDocked}
          />
        </div>
      )}

      {/* Vignette — atmospheric depth */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-[4]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Top scrim — header legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/30 to-transparent z-[5]"
      />

      {/* Content: H1 → subhead → CTA */}
      <div className="relative z-10 w-full flex flex-col items-center px-6 pt-[129px]">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.06, delayChildren: 0.15 },
            },
          }}
          className="font-black text-white leading-none tracking-tight text-center w-full max-w-[1200px] text-[72px] lg:text-[88px] xl:text-[95px]"
          style={{ letterSpacing: "-0.02em" }}
          aria-label="Building connections. One brick at a time."
        >
          <span className="block">
            {"Building connections.".split(" ").map((word, i) => (
              <motion.span
                key={`l1-${i}`}
                variants={{
                  hidden: { opacity: 0, y: -60, rotate: -2 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    rotate: 0,
                    transition: { type: "spring", damping: 14, stiffness: 220 },
                  },
                }}
                className="inline-block"
                style={{ transformOrigin: "50% 100%" }}
              >
                {word}
                {i < 1 && " "}
              </motion.span>
            ))}
          </span>
          <span className="block">
            {"One brick at a time.".split(" ").map((word, i, arr) => (
              <motion.span
                key={`l2-${i}`}
                variants={{
                  hidden: { opacity: 0, y: -60, rotate: 2 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    rotate: 0,
                    transition: { type: "spring", damping: 14, stiffness: 220 },
                  },
                }}
                className="inline-block"
                style={{ transformOrigin: "50% 100%" }}
              >
                {word}
                {i < arr.length - 1 && " "}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="font-sans text-center text-white/85 font-medium leading-relaxed mt-7 text-xl lg:text-2xl whitespace-nowrap"
          style={{ fontFamily: "var(--app-font-sans, Nunito), system-ui, sans-serif" }}
        >
          Using the transformative power of play to create positive, lasting change.
        </motion.p>

        {/* CTA drops onto the castle as the LAST piece of the build */}
        <div className="mt-10 min-h-[66px] flex items-start justify-center">
          <AnimatePresence>
            {castleComplete && (
              <motion.div
                initial={
                  shouldReduceMotion ? false : { y: -400, opacity: 0, rotate: -6 }
                }
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: [-400, 0, -30, 0],
                        opacity: 1,
                        rotate: [-6, 0, -1.5, 0],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        duration: 0.85,
                        times: [0, 0.7, 0.85, 1],
                        ease: ["easeIn", "easeOut", "easeIn", "easeOut"],
                      }
                }
                style={{ transformOrigin: "50% 100%" }}
              >
                {/* Idle bob */}
                <motion.div
                  animate={shouldReduceMotion ? undefined : { y: [0, -3, 0] }}
                  transition={
                    shouldReduceMotion
                      ? undefined
                      : {
                          duration: 3.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1.3,
                        }
                  }
                >
                  <Link href="/sessions">
                    <LegoButton
                      variant="green"
                      data-testid="hero-cta-primary"
                      aria-label="View our sessions"
                    >
                      View Sessions
                    </LegoButton>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
