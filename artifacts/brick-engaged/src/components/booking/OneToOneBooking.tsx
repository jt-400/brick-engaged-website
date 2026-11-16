import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

import { LegoButton } from "@/components/LegoButton";
import { AdultRegistrationForm } from "./AdultRegistrationForm";
import type { AvailabilitySlot } from "./CalendarGrid";

type AvailabilityResponse = {
  programme: string;
  slots: AvailabilitySlot[];
};

interface OneToOneBookingProps {
  /** Price per session in cents. */
  priceCents?: number;
}

/**
 * One-to-One booking — date+time picker for $45/hr appointments with Dan.
 *
 *   • Fetches /api/availability for the `one-to-one` programme.
 *   • Groups upcoming slots by date.
 *   • User picks a date → time buttons appear for that day.
 *   • Click a time → AdultRegistrationForm (paid) → Stripe Checkout.
 */
export function OneToOneBooking({ priceCents = 4500 }: OneToOneBookingProps) {
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, refetch } = useQuery<AvailabilityResponse>({
    queryKey: ["availability", "one-to-one"],
    queryFn: async () => {
      const res = await fetch("/api/availability?programme=one-to-one");
      if (!res.ok) throw new Error(`availability ${res.status}`);
      return res.json();
    },
    staleTime: 30_000,
  });

  // Group open slots by yyyy-MM-dd (Pacific/Auckland) so the UI can render
  // "Monday 23 June" → [9:00, 12:15, 1:30, …] grids.
  const grouped = useMemo(() => {
    const out = new Map<string, AvailabilitySlot[]>();
    (data?.slots ?? [])
      .filter((s) => s.status === "open" && s.remaining > 0)
      .forEach((s) => {
        const key = new Date(s.starts_at).toLocaleDateString("en-NZ", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "Pacific/Auckland",
        });
        const arr = out.get(key) ?? [];
        arr.push(s);
        out.set(key, arr);
      });
    return out;
  }, [data]);

  const orderedDayKeys = useMemo(() => Array.from(grouped.keys()).slice(0, 14), [grouped]);

  useEffect(() => {
    if ((selectedDayKey || selectedSlot) && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedDayKey, selectedSlot]);

  return (
    <section id="book" className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-3xl" ref={scrollRef}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-8 text-center"
        >
          <div className="inline-block bg-lego-orange text-charcoal text-[10px] font-black px-3 py-1 rounded-md mb-3 tracking-[0.14em] uppercase">
            Book a session
          </div>
          <h2
            className="text-3xl md:text-4xl font-black text-charcoal tracking-tight mb-2"
            style={{ letterSpacing: "-0.02em" }}
          >
            {selectedSlot
              ? "Confirm your booking"
              : selectedDayKey
                ? "Pick a time"
                : "Pick a day"}
          </h2>
          <p className="text-base font-medium text-slate-500">
            {selectedSlot
              ? "Fill the details below — payment is processed securely by Stripe."
              : `One-hour booked LEGO® time with Dan. $${(priceCents / 100).toFixed(0)} per session.`}
          </p>
        </motion.div>

        {isLoading && (
          <CardShell>
            <div className="flex items-center gap-3 text-slate-500 font-medium">
              <Loader2 size={16} className="animate-spin" /> Checking available times…
            </div>
          </CardShell>
        )}

        {isError && (
          <CardShell>
            <p className="font-bold text-red-800 mb-3">Couldn't load availability.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
            >
              Try again
            </button>
          </CardShell>
        )}

        {!isLoading && !isError && selectedSlot && (
          <div>
            <button
              type="button"
              onClick={() => setSelectedSlot(null)}
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.13em] text-slate-500 hover:text-charcoal"
            >
              <ArrowLeft size={14} /> Pick a different time
            </button>
            <AdultRegistrationForm
              slot={selectedSlot}
              slotLabel={formatSlotLabel(selectedSlot)}
              programmeTitle="One-to-One Session"
              priceCents={priceCents}
              onCancel={() => setSelectedSlot(null)}
            />
          </div>
        )}

        {!isLoading && !isError && !selectedSlot && selectedDayKey && (
          <TimeGrid
            slots={grouped.get(selectedDayKey) ?? []}
            onPick={setSelectedSlot}
            onBack={() => setSelectedDayKey(null)}
          />
        )}

        {!isLoading && !isError && !selectedSlot && !selectedDayKey && (
          <>
            {orderedDayKeys.length === 0 ? (
              <NoneOpen />
            ) : (
              <DayGrid
                dayKeys={orderedDayKeys}
                grouped={grouped}
                onPick={(key) => setSelectedDayKey(key)}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}

function DayGrid({
  dayKeys,
  grouped,
  onPick,
}: {
  dayKeys: string[];
  grouped: Map<string, AvailabilitySlot[]>;
  onPick: (key: string) => void;
}) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
    >
      {dayKeys.map((key) => {
        const slots = grouped.get(key) ?? [];
        const first = slots[0];
        if (!first) return null;
        const date = new Date(first.starts_at);
        return (
          <motion.li
            key={key}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
          >
            <button
              type="button"
              onClick={() => onPick(key)}
              className="w-full text-left rounded-2xl border-2 border-slate-200 bg-white p-5 hover:border-charcoal hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="text-[10px] font-black uppercase tracking-[0.14em] text-lego-orange mb-1.5">
                {date.toLocaleDateString("en-NZ", {
                  weekday: "long",
                  timeZone: "Pacific/Auckland",
                })}
              </div>
              <div
                className="text-lg font-black text-charcoal mb-1 leading-snug"
                style={{ letterSpacing: "-0.01em" }}
              >
                {date.toLocaleDateString("en-NZ", {
                  day: "numeric",
                  month: "long",
                  timeZone: "Pacific/Auckland",
                })}
              </div>
              <p className="text-xs font-bold text-slate-500">
                {slots.length} {slots.length === 1 ? "slot" : "slots"} available →
              </p>
            </button>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

function TimeGrid({
  slots,
  onPick,
  onBack,
}: {
  slots: AvailabilitySlot[];
  onPick: (s: AvailabilitySlot) => void;
  onBack: () => void;
}) {
  const first = slots[0];
  const dateLabel = first
    ? new Date(first.starts_at).toLocaleDateString("en-NZ", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "Pacific/Auckland",
      })
    : "";
  return (
    <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 md:p-6 shadow-sm">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.13em] text-slate-500 hover:text-charcoal mb-4"
      >
        <ArrowLeft size={14} /> Different day
      </button>
      <h3
        className="text-xl font-black text-charcoal mb-4 tracking-tight"
        style={{ letterSpacing: "-0.01em" }}
      >
        {dateLabel}
      </h3>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {slots.map((s) => (
          <li key={s.slot_id}>
            <button
              type="button"
              onClick={() => onPick(s)}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-3 text-sm font-black text-charcoal hover:border-charcoal hover:bg-slate-50 transition-colors"
            >
              {new Date(s.starts_at).toLocaleTimeString("en-NZ", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZone: "Pacific/Auckland",
              })}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NoneOpen() {
  return (
    <CardShell>
      <h3
        className="text-xl font-black text-charcoal mb-2 tracking-tight"
        style={{ letterSpacing: "-0.01em" }}
      >
        No times open right now
      </h3>
      <p className="text-base font-medium text-slate-600 mb-5 leading-relaxed">
        Send Dan a quick message with what you're after and rough timing — he'll find a
        slot that works.
      </p>
      <a href="/contact">
        <LegoButton variant="orange">
          <span className="flex items-center gap-2">
            <Mail size={14} /> Send an enquiry
          </span>
        </LegoButton>
      </a>
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

function formatSlotLabel(slot: AvailabilitySlot): string {
  const s = new Date(slot.starts_at);
  const e = new Date(slot.ends_at);
  const date = s.toLocaleDateString("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Pacific/Auckland",
  });
  const time = (d: Date) =>
    d.toLocaleTimeString("en-NZ", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Pacific/Auckland",
    });
  return `${date} · ${time(s)}–${time(e)}`;
}
