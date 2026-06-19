import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/motion";

export interface RhythmStep {
  duration: string; // "0–10 min", "10–25 min", etc.
  title: string;
  body: string;
}

interface SessionRhythmProps {
  heading?: string;
  intro?: string;
  steps: RhythmStep[];
}

/**
 * Linear visual of what a single session looks like minute-by-minute. Helps
 * parents picture the experience before they commit. Reuses the staggered
 * fade-in pattern from the homepage.
 */
export function SessionRhythm({
  heading = "What a session looks like",
  intro = "Each session has a predictable rhythm so kids know what to expect — that's where the safety comes from.",
  steps,
}: SessionRhythmProps) {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-10 max-w-2xl"
        >
          <h2
            className="text-3xl md:text-4xl font-black text-charcoal tracking-tight mb-3"
            style={{ letterSpacing: "-0.02em" }}
          >
            {heading}
          </h2>
          {intro && <p className="text-base md:text-lg font-medium text-slate-500 leading-relaxed">{intro}</p>}
        </motion.div>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="relative grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-3"
        >
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              variants={fadeInUp}
              className="relative rounded-2xl bg-white border-2 border-slate-200 p-5 md:p-6"
            >
              <div className="text-[10px] font-black uppercase tracking-[0.14em] text-lego-orange mb-2">
                Step {i + 1} · {s.duration}
              </div>
              <h3 className="text-base md:text-lg font-black text-charcoal mb-2 leading-snug" style={{ letterSpacing: "-0.01em" }}>
                {s.title}
              </h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">{s.body}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
