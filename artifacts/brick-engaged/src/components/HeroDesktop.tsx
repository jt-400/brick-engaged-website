import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { LegoCanvas } from "@/lego/LegoCanvas";
import { LEGO_MODELS } from "@/lego/modelsData";
import { useSanityDoc } from "@/lib/useSanityDoc";
import { HOME_PAGE_QUERY } from "@/lib/sanityQueries";

interface HeroData {
  heroEyebrow?: string;
  heroHeadline?: string;
  heroSubhead?: string;
  heroMetaLine?: string;
  heroPrimaryCta?: { label?: string; href?: string };
  heroSecondaryCta?: { label?: string; href?: string };
}

interface HeroDesktopProps {
  className?: string;
}

// Minifigure colours for the ground strip
const MINIFIG_COLORS = [
  "#34c08e",
  "#f4c542",
  "#d94f3d",
  "#3a78c4",
  "#34c08e",
  "#f4c542",
  "#d94f3d",
  "#3a78c4",
];

export function HeroDesktop({ className = "" }: HeroDesktopProps) {
  const activeModel = LEGO_MODELS[0];
  const shouldReduceMotion = useReducedMotion();
  const { data } = useSanityDoc<HeroData>("homePage", HOME_PAGE_QUERY);
  const eyebrow = data?.heroEyebrow ?? "LEGO®-based sessions";
  const headline = data?.heroHeadline ?? "Building connections.\nOne brick at a time.";
  const subhead = data?.heroSubhead ?? "Using the transformative power of play to create positive, lasting change.";
  const metaLine = data?.heroMetaLine ?? "Weekly Brick Club · school-holiday programmes · peer-to-peer support sessions";
  const primaryLabel = data?.heroPrimaryCta?.label ?? "View Sessions";
  const primaryHref = data?.heroPrimaryCta?.href ?? "/sessions";
  const secondaryLabel = data?.heroSecondaryCta?.label ?? "Book a holiday session";
  const secondaryHref = data?.heroSecondaryCta?.href ?? "/holiday";

  return (
    <section
      className={`relative w-full min-h-[88vh] flex flex-col overflow-hidden ${className}`}
      style={{ backgroundColor: "#1b2731" }}
    >
      {/* Main content area: 1 col → 2 col at 900px */}
      <div
        className="relative z-10 flex-1 w-full max-w-[1440px] mx-auto px-6 lg:px-14 pt-20 lg:pt-24 pb-6 grid grid-cols-1 gap-10 min-[900px]:grid-cols-[1.05fr_0.95fr] min-[900px]:gap-12 min-[900px]:items-end"
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
            className="inline-flex self-start items-center text-[12px] font-bold uppercase tracking-[0.13em] px-4 py-2 rounded-full mb-6"
            style={{
              backgroundColor: "rgba(52,192,142,0.16)",
              color: "#5fd6aa",
            }}
          >
            {eyebrow}
          </span>

          {/* Headline — left-aligned, big */}
          <h1
            className="text-white font-black leading-[0.98] mb-6"
            style={{
              fontSize: "clamp(40px, 6vw, 80px)",
              letterSpacing: "-0.025em",
              fontFamily:
                "var(--app-font-display, Outfit), system-ui, sans-serif",
            }}
          >
            {headline.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < headline.split("\n").length - 1 && <br />}
              </span>
            ))}
          </h1>

          {/* Subhead — larger, wider max-width */}
          <p
            className="leading-[1.5] font-normal mb-8"
            style={{
              color: "#9fb0bd",
              fontSize: "clamp(16px, 1.3vw, 20px)",
              maxWidth: "480px",
              fontFamily: "var(--app-font-sans, Nunito), system-ui, sans-serif",
            }}
          >
            {subhead}
          </p>

          {/* CTA row — chunky, properly tappable */}
          <div className="flex gap-4 items-center flex-wrap">
            {/* Primary — solid green brick-button */}
            <Link href={primaryHref}>
              <a
                className="inline-flex items-center gap-2.5 font-semibold rounded-[10px] transition-all hover:brightness-110 active:translate-y-[2px] active:border-b-2 cursor-pointer"
                style={{
                  backgroundColor: "#34c08e",
                  color: "#06281d",
                  borderBottom: "4px solid #1f9c6f",
                  padding: "18px 32px",
                  fontSize: "17px",
                  letterSpacing: "0.04em",
                  minHeight: "56px",
                }}
                data-testid="hero-cta-primary"
                aria-label={primaryLabel}
              >
                {primaryLabel}
                <ArrowRight size={20} strokeWidth={2.5} aria-hidden />
              </a>
            </Link>

            {/* Secondary — yellow brick-button */}
            <Link href={secondaryHref}>
              <a
                className="inline-flex items-center gap-2.5 font-semibold rounded-[10px] transition-all hover:brightness-110 active:translate-y-[2px] active:border-b-2 cursor-pointer"
                style={{
                  backgroundColor: "#f4c542",
                  color: "#3a2a06",
                  borderBottom: "4px solid #c69a1c",
                  padding: "18px 32px",
                  fontSize: "17px",
                  letterSpacing: "0.04em",
                  minHeight: "56px",
                }}
                data-testid="hero-cta-secondary"
              >
                {secondaryLabel}
              </a>
            </Link>
          </div>

          {/* Meta line */}
          <p
            className="mt-7 text-[13px] uppercase font-medium"
            style={{
              color: "#6f7e89",
              letterSpacing: "0.07em",
            }}
          >
            {metaLine}
          </p>
        </motion.div>

        {/* Right column: LEGO castle — bottom-aligned with left column meta line */}
        <div className="relative w-full self-end overflow-hidden min-h-[420px] min-[900px]:min-h-[520px] lg:min-h-[580px]">
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

      {/* Ground strip with minifigure decals — chunkier */}
      <div
        className="relative z-[3] w-full border-t flex justify-around items-end px-8 lg:px-16 py-5"
        style={{
          backgroundColor: "#16212a",
          borderColor: "rgba(40,53,64,0.6)",
        }}
        aria-hidden
      >
        {MINIFIG_COLORS.map((color, i) => (
          <div key={i} className="flex flex-col items-center gap-[2px]">
            <span
              className="block w-[22px] h-[22px] rounded-full"
              style={{ backgroundColor: "#f4c542" }}
            />
            <span
              className="block w-[28px] h-[28px]"
              style={{
                backgroundColor: color,
                borderRadius: "5px 5px 4px 4px",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
