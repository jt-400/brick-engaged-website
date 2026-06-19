import { motion } from "framer-motion";

export interface TrustStat {
  value: string;
  label: string;
}

interface TrustStripProps {
  stats: TrustStat[];
  /** Optional small one-liner above the stats — e.g. "Why parents trust Dan". */
  kicker?: string;
}

export function TrustStrip({ stats, kicker }: TrustStripProps) {
  return (
    <section className="py-12 md:py-16 bg-charcoal text-white">
      <div className="container mx-auto px-4 max-w-5xl">
        {kicker && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="text-center text-[11px] font-black uppercase tracking-[0.15em] text-lego-orange mb-6"
          >
            {kicker}
          </motion.p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              className="text-center"
            >
              <div
                className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-none mb-2"
                style={{ letterSpacing: "-0.02em" }}
              >
                {s.value}
              </div>
              <div className="text-[11px] md:text-xs font-bold uppercase tracking-[0.13em] text-white/60">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
