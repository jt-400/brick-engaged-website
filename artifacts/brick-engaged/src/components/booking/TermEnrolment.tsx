import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, Calendar, MapPin, Users, Mail } from "lucide-react";

import { LegoButton } from "@/components/LegoButton";
import { BookingForm } from "./BookingForm";
import type { AvailabilitySlot } from "./CalendarGrid";

type AvailabilityResponse = {
  programme: string;
  slots: AvailabilitySlot[];
};

interface TermEnrolmentProps {
  programme: string;             // slug, e.g. "brick-club"
  programmeTitle: string;        // "Brick Club"
  priceCents: number;            // 29900
  location: string;
  /**
   * Human label for the term — duration / day-of-week / time. Pre-formatted
   * because the SQL function doesn't return slot.notes today. Tweak in
   * Phase 3 admin (or read from the slot notes column directly).
   */
  termLabel: string;             // e.g. "Term 3 2026 · weekly Tuesdays 4:00–5:30pm"
  /** Short hint shown on the card — "10 weekly sessions", etc. */
  schedule: string;
  /** Fallback CTA if no term is open (e.g. mailto link). */
  enquireHref?: string;
}

/**
 * Term enrolment block. Drop into the bottom of a programme detail page.
 *
 *   • Fetches /api/availability for the programme.
 *   • Shows a "Next term" card with date range + capacity remaining.
 *   • Clicking "Enrol for this term" expands the inline BookingForm.
 *   • Falls back to an enquire CTA when no slots are open.
 */
export function TermEnrolment({
  programme,
  programmeTitle,
  priceCents,
  location,
  termLabel,
  schedule,
  enquireHref = "/contact",
}: TermEnrolmentProps) {
  const [selected, setSelected] = useState<AvailabilitySlot | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, refetch } = useQuery<AvailabilityResponse>({
    queryKey: ["availability", programme],
    queryFn: async () => {
      const res = await fetch(`/api/availability?programme=${encodeURIComponent(programme)}`);
      if (!res.ok) throw new Error(`availability ${res.status}`);
      return res.json();
    },
    staleTime: 30_000,
  });

  const nextSlot = (data?.slots ?? []).find((s) => s.status === "open" && s.remaining > 0);

  useEffect(() => {
    if (selected && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selected]);

  return (
    <section id="enrol" className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-8 text-center"
        >
          <div className="inline-block bg-lego-orange text-charcoal text-[10px] font-black px-3 py-1 rounded-md mb-3 tracking-[0.14em] uppercase">
            Enrol online
          </div>
          <h2
            className="text-3xl md:text-4xl font-black text-charcoal tracking-tight mb-2"
            style={{ letterSpacing: "-0.02em" }}
          >
            {selected ? "Confirm your enrolment" : "Next available term"}
          </h2>
          <p className="text-base font-medium text-slate-500">
            {selected
              ? "Fill the details below — payment is processed securely by Stripe."
              : "Click below to enrol. Spots are first-come-first-served."}
          </p>
        </motion.div>

        <div ref={formRef}>
          {isLoading ? (
            <CardShell>
              <div className="flex items-center gap-3 text-slate-500 font-medium">
                <Loader2 size={16} className="animate-spin" /> Checking availability…
              </div>
            </CardShell>
          ) : isError ? (
            <CardShell>
              <p className="font-bold text-red-800 mb-3">Couldn't load term availability.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
              >
                Try again
              </button>
            </CardShell>
          ) : selected ? (
            <BookingForm
              slot={selected}
              slotLabel={termLabel}
              programmeTitle={programmeTitle}
              priceCents={priceCents}
              onCancel={() => setSelected(null)}
            />
          ) : nextSlot ? (
            <TermCard
              slot={nextSlot}
              termLabel={termLabel}
              schedule={schedule}
              location={location}
              priceCents={priceCents}
              onEnrol={() => setSelected(nextSlot)}
            />
          ) : (
            <NoTermOpen enquireHref={enquireHref} />
          )}
        </div>
      </div>
    </section>
  );
}

function TermCard({
  slot,
  termLabel,
  schedule,
  location,
  priceCents,
  onEnrol,
}: {
  slot: AvailabilitySlot;
  termLabel: string;
  schedule: string;
  location: string;
  priceCents: number;
  onEnrol: () => void;
}) {
  const price = `$${(priceCents / 100).toFixed(0)}`;
  const startsLabel = new Date(slot.starts_at).toLocaleDateString("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Pacific/Auckland",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 p-6 md:p-8 items-start">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.14em] text-lego-orange mb-2">
            {termLabel.split("·")[0]?.trim()}
          </div>
          <h3
            className="text-2xl font-black text-charcoal mb-3 tracking-tight"
            style={{ letterSpacing: "-0.01em" }}
          >
            Starts {startsLabel}
          </h3>
          <dl className="space-y-2.5 text-sm">
            <Row icon={<Calendar size={15} />} label="Schedule" value={schedule} />
            <Row icon={<MapPin size={15} />} label="Where" value={location} />
            <Row icon={<Users size={15} />} label="Spots left" value={`${slot.remaining} of ${slot.capacity}`} />
          </dl>
        </div>
        <div className="md:text-center">
          <div className="inline-block rounded-2xl bg-lego-orange text-charcoal px-5 py-3 font-black shadow-md">
            <div className="text-2xl leading-none">{price}</div>
            <div className="text-[10px] uppercase tracking-wider opacity-75 mt-1">for the term</div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-slate-50 px-6 md:px-8 py-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
          Pay once · covers all 10 weekly sessions
        </p>
        <LegoButton variant="orange" onClick={onEnrol} data-testid="enrol-term">
          Enrol for this term →
        </LegoButton>
      </div>
    </motion.div>
  );
}

function NoTermOpen({ enquireHref }: { enquireHref: string }) {
  return (
    <CardShell>
      <h3
        className="text-2xl font-black text-charcoal mb-2 tracking-tight"
        style={{ letterSpacing: "-0.01em" }}
      >
        Next term not open yet
      </h3>
      <p className="text-base font-medium text-slate-600 mb-5 leading-relaxed">
        We open enrolment for the upcoming term about 6 weeks ahead of the start date. Send a
        quick note and we'll let you know the moment spots are live.
      </p>
      <div className="flex flex-wrap gap-3">
        <a href={enquireHref}>
          <LegoButton variant="orange">
            <span className="flex items-center gap-2">
              <Mail size={14} /> Get notified
            </span>
          </LegoButton>
        </a>
      </div>
    </CardShell>
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border-2 border-slate-200 bg-white shadow-sm p-6 md:p-8">
      {children}
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid place-items-center w-7 h-7 rounded-md bg-slate-100 text-charcoal/70 shrink-0">
        {icon}
      </span>
      <div>
        <div className="text-[10px] font-black uppercase tracking-[0.13em] text-slate-500">
          {label}
        </div>
        <div className="font-bold text-charcoal leading-snug">{value}</div>
      </div>
    </div>
  );
}
