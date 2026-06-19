import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export interface FAQItem {
  q: string;
  a: string;
}

interface FAQProps {
  heading?: string;
  items: FAQItem[];
}

export function FAQ({ heading = "Common questions", items }: FAQProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-3xl md:text-4xl font-black text-charcoal tracking-tight mb-8"
          style={{ letterSpacing: "-0.02em" }}
        >
          {heading}
        </motion.h2>
        <ul className="divide-y divide-slate-200 rounded-2xl border-2 border-slate-200 bg-white overflow-hidden">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start gap-4 text-left px-5 md:px-6 py-4 md:py-5 hover:bg-slate-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="flex-1 font-black text-charcoal text-base md:text-lg leading-snug">{item.q}</span>
                  <span className="mt-1 shrink-0 grid place-items-center w-6 h-6 rounded-md bg-slate-100 text-charcoal">
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6 pr-10 md:pr-12 text-[15px] font-medium text-slate-600 leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
