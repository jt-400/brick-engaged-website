import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/motion";

export interface Outcome {
  title: string;
  body: string;
}

interface OutcomeGridProps {
  heading?: string;
  intro?: string;
  outcomes: Outcome[];
}

/**
 * Four-up grid of expected outcomes. Sits under the hero. The copy should be
 * specific — "After a term, parents tell us X" — not generic claims.
 */
export function OutcomeGrid({ heading = "What kids and whānau take away", intro, outcomes }: OutcomeGridProps) {
  return (
    <section className="py-16 md:py-24 bg-white">
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

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {outcomes.map((o, i) => (
            <motion.div
              key={o.title}
              variants={fadeInUp}
              className="rounded-2xl border-2 border-slate-200 bg-white p-6 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 grid place-items-center w-9 h-9 rounded-lg bg-lego-orange text-charcoal font-black text-sm shadow-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-lg font-black text-charcoal mb-1.5 leading-snug" style={{ letterSpacing: "-0.01em" }}>
                    {o.title}
                  </h3>
                  <p className="text-[15px] font-medium text-slate-600 leading-relaxed">{o.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
