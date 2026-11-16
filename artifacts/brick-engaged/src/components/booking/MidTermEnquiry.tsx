import { motion } from "framer-motion";
import { Mail } from "lucide-react";

interface MidTermEnquiryProps {
  /** Programme name to mention in the prefilled email subject. */
  programmeTitle: string;
}

/**
 * Small enquiry card to soften term-only enrolment. Dan invoices pro-rata
 * for mid-term joiners manually until we have enough volume to warrant
 * automating it.
 */
export function MidTermEnquiry({ programmeTitle }: MidTermEnquiryProps) {
  const subject = encodeURIComponent(`Mid-term enrolment — ${programmeTitle}`);
  const body = encodeURIComponent(
    `Hi Dan,\n\nI'd like to enrol in ${programmeTitle} mid-term — can you let me know what's possible?\n\nThanks,\n`,
  );

  return (
    <section className="bg-slate-50 pb-12 md:pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="rounded-2xl border-2 border-slate-200 bg-white p-5 md:p-6 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex-1 min-w-[220px]">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-lego-orange mb-1">
              Joining mid-term?
            </p>
            <p className="text-sm md:text-base font-bold text-charcoal leading-snug">
              No problem. Dan invoices pro-rata for the remaining weeks — send a quick note and
              we'll sort it out.
            </p>
          </div>
          <a href={`mailto:info@brickengaged.org?subject=${subject}&body=${body}`}>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-charcoal text-white px-4 py-2.5 font-black text-xs uppercase tracking-[0.12em] hover:bg-lego-orange hover:text-charcoal transition-colors"
            >
              <Mail size={14} /> Email Dan
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
