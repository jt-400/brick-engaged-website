import { motion } from "framer-motion";
import { Link } from "wouter";
import { LegoButton } from "@/components/LegoButton";

interface CategoryCtaProps {
  heading: string;
  body?: string;
  primary: { label: string; href?: string; anchor?: string };
  secondary?: { label: string; href: string; external?: boolean };
}

export function CategoryCta({ heading, body, primary, secondary }: CategoryCtaProps) {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="rounded-3xl bg-charcoal text-white p-8 md:p-12 text-center shadow-xl"
        >
          <h2
            className="text-3xl md:text-4xl font-black tracking-tight mb-3"
            style={{ letterSpacing: "-0.02em" }}
          >
            {heading}
          </h2>
          {body && <p className="text-base md:text-lg font-medium text-white/80 max-w-xl mx-auto mb-8 leading-relaxed">{body}</p>}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {primary.anchor ? (
              <a
                href={`#${primary.anchor}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(primary.anchor!)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                <LegoButton variant="orange">{primary.label}</LegoButton>
              </a>
            ) : (
              <Link href={primary.href ?? "#"}>
                <LegoButton variant="orange">{primary.label}</LegoButton>
              </Link>
            )}
            {secondary &&
              (secondary.external ? (
                <a href={secondary.href} target="_blank" rel="noreferrer">
                  <LegoButton variant="white">{secondary.label}</LegoButton>
                </a>
              ) : (
                <Link href={secondary.href}>
                  <LegoButton variant="white">{secondary.label}</LegoButton>
                </Link>
              ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
