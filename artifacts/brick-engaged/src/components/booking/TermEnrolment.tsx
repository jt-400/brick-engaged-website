import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, Calendar, MapPin, Users, Mail, ArrowLeft } from "lucide-react";

import { LegoButton } from "@/components/LegoButton";
import { BookingForm } from "./BookingForm";
import type { AvailabilitySlot } from "./CalendarGrid";

type AvailabilityResponse = {
  programme: string;
  slots: AvailabilitySlot[];
};

interface TermEnrolmentProps {
  programme: string;                // slug, e.g. "brick-club"
  programmeTitle: string;           // "Brick Club"
  priceCents: number;               // 29900
  location: string;
  /** Shown above the chooser to set context (term label, etc.). */
  termHeading?: string;             // e.g. "Term 3 2026 — pick a session"
  /** Optional fallback URL when no slots are open. */
  enquireHref?: string;
}

/**
 * Term enrolment block (multi-slot chooser).
 *
 *   • Fetches /api/availability for the programme.
 *   • Lists every open slot as a card — Dan can now run Mon/Tue/Wed groups
 *     with different capacities and age-suitability labels.
 *   • Click a slot → inline BookingForm for that slot.
 *   • Click "← Pick a different slot" → returns to the chooser.
 *   • Falls back to an enquire CTA when no slots are open.
 */
export function TermEnrolment({
  programme,
  programmeTitle,
  priceCents,
  location,
  termHeading = "Pick a session",
  enquireHref = "/contact",
}: TermEnrolmentProps) {
  const [selected, setSelected] = useState<AvailabilitySlot | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, refetch } = useQuery<AvailabilityResponse>({
    queryKey: ["availability", programme],
    queryFn: async () => {
      const res = await fetch(`/api/availability?programme=${encodeURIComponent(programme)}`);
      if (!res.ok) throw new Error(`availability ${res.status}`);
      return res.json();
    },
    staleTime: 30_000,
  });

  const openSlots = (data?.slots ?? []).filter((s) => s.status === "open" && s.remaining > 0);

  useEffect(() => {
    if (selected && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selected]);

  return (
    <section id="enrol" className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-3xl" ref={sectionRef}>
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
            {selected ? "Confirm your enrolment" : termHeading}
          </h2>
          <p className="text-base font-medium text-slate-500">
            {selected
              ? "Fill the details below — payment is processed securely by Stripe."
              : "Spots are first-come, first-served. Pick the session that fits your child best."}
          </p>
        </motion.div>

        {isLoading && (
          <CardShell>
            <div className="flex items-center gap-3 text-slate-500 font-medium">
              <Loader2 size={16} className="animate-spin" /> Checking availability…
            </div>
          </CardShell>
        )}

        {isError && (
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
        )}

        {!isLoading && !isError && selected && (
          <div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.13em] text-slate-500 hover:text-charcoal"
            >
              <ArrowLeft size={14} /> Pick a different session
            </button>
            <BookingForm
              slot={selected}
              slotLabel={slotLabel(selected)}
              programmeTitle={programmeTitle}
              priceCents={priceCents}
              onCancel={() => setSelected(null)}
            />
          </div>
        )}

        {!isLoading && !isError && !selected && openSlots.length === 0 && (
          <NoTermOpen enquireHref={enquireHref} />
        )}

        {!isLoading && !isError && !selected && openSlots.length > 0 && (
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-3"
          >
            {openSlots.map((s) => (
              <SlotCard
                key={s.slot_id}
                slot={s}
                location={location}
                priceCents={priceCents}
                onPick={() => setSelected(s)}
              />
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}

function SlotCard({
  slot,
  location,
  priceCents,
  onPick,
}: {
  slot: AvailabilitySlot;
  location: string;
  priceCents: number;
  onPick: () => void;
}) {
  const price = `$${(priceCents / 100).toFixed(0)}`;
  const label = slot.notes || slotLabel(slot);
  const startDate = new Date(slot.starts_at).toLocaleDateString("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Pacific/Auckland",
  });

  // If the admin wrote a friendly label, use it as the headline.
  // Otherwise fall back to the formatted date/time.
  const headline = slot.notes ? slot.notes : `Starts ${startDate}`;

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      className="rounded-2xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 p-5 md:p-6 items-start">
        <div>
          <h3
            className="text-lg md:text-xl font-black text-charcoal mb-2 leading-snug"
            style={{ letterSpacing: "-0.01em" }}
          >
            {headline}
          </h3>
          {slot.notes && (
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 mb-3">
              Starts {startDate}
            </p>
          )}
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            <Row icon={<Calendar size={14} />} label="When" value={label} />
            <Row icon={<MapPin size={14} />} label="Where" value={location} />
            <Row icon={<Users size={14} />} label="Spots left" value={`${slot.remaining} of ${slot.capacity}`} />
          </dl>
        </div>
        <div className="md:text-right flex md:block items-center gap-3">
          <div className="inline-block rounded-xl bg-lego-orange text-charcoal px-3.5 py-2 font-black shadow-sm">
            <div className="text-lg leading-none">{price}</div>
            <div className="text-[10px] uppercase tracking-wider opacity-75 mt-0.5">/ term</div>
          </div>
          <LegoButton variant="orange" onClick={onPick} data-testid={`enrol-${slot.slot_id}`}>
            Enrol →
          </LegoButton>
        </div>
      </div>
    </motion.li>
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
    <div className="flex items-start gap-2">
      <span className="mt-0.5 grid place-items-center w-6 h-6 rounded-md bg-slate-100 text-charcoal/70 shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[10px] font-black uppercase tracking-[0.13em] text-slate-500">
          {label}
        </div>
        <div className="font-bold text-charcoal leading-snug text-sm truncate">{value}</div>
      </div>
    </div>
  );
}

/** Fallback label when the slot has no admin-written notes. */
function slotLabel(slot: AvailabilitySlot): string {
  const s = new Date(slot.starts_at);
  const e = new Date(slot.ends_at);
  const date = s.toLocaleDateString("en-NZ", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Pacific/Auckland",
  });
  const time = (d: Date) =>
    d.toLocaleTimeString("en-NZ", {
      hour: "numeric",
      hour12: true,
      timeZone: "Pacific/Auckland",
    });
  return `${date} · ${time(s)}–${time(e)}`;
}
