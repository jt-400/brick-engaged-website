import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DayPicker } from "react-day-picker";
import { motion } from "framer-motion";
import { format, startOfMonth, addMonths } from "date-fns";
import { X } from "lucide-react";
import "react-day-picker/style.css";

import { BookingForm } from "./BookingForm";
import type { AvailabilitySlot } from "./CalendarGrid";

const PROGRAMME = {
  slug: "holiday",
  title: "School Holiday Programme",
  priceCents: 11500,
  location: "Lane Park Business Centre, Upper Hutt",
};

type AvailabilityResponse = {
  programme: string;
  slots: AvailabilitySlot[];
};

/**
 * Multi-day Holiday booking flow.
 *
 *   • Calendar lets the parent toggle multiple open days on/off.
 *   • A "basket" panel shows every selected day with × to remove, plus the
 *     running total ($115 × N).
 *   • When at least one day is selected they tap "Continue to details" → the
 *     BookingForm opens with all slot ids → single Stripe Checkout.
 */
export function HolidayBooking() {
  const today = useMemo(() => startOfMonth(new Date()), []);
  const [month, setMonth] = useState<Date>(today);
  const [selectedSlots, setSelectedSlots] = useState<AvailabilitySlot[]>([]);
  const [showForm, setShowForm] = useState(false);
  const formAnchorRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, refetch } = useQuery<AvailabilityResponse>({
    queryKey: ["availability", PROGRAMME.slug, "multi"],
    queryFn: async () => {
      const from = startOfMonth(today).toISOString();
      const to = addMonths(today, 3).toISOString();
      const res = await fetch(
        `/api/availability?programme=${encodeURIComponent(PROGRAMME.slug)}&from=${from}&to=${to}`,
      );
      if (!res.ok) throw new Error(`availability ${res.status}`);
      return res.json();
    },
    staleTime: 30_000,
  });

  // Lookup: yyyy-MM-dd → slot
  const byDay = useMemo(() => {
    const map = new Map<string, AvailabilitySlot>();
    for (const s of data?.slots ?? []) {
      const key = format(new Date(s.starts_at), "yyyy-MM-dd");
      const existing = map.get(key);
      if (!existing || s.remaining > existing.remaining) map.set(key, s);
    }
    return map;
  }, [data]);

  const openDays = useMemo(
    () =>
      Array.from(byDay.values())
        .filter((s) => s.status === "open" && s.remaining > 0)
        .map((s) => new Date(s.starts_at)),
    [byDay],
  );
  const fullDays = useMemo(
    () =>
      Array.from(byDay.values())
        .filter((s) => s.status !== "open" || s.remaining <= 0)
        .map((s) => new Date(s.starts_at)),
    [byDay],
  );
  const selectedDates = useMemo(() => selectedSlots.map((s) => new Date(s.starts_at)), [selectedSlots]);

  useEffect(() => {
    if (showForm && formAnchorRef.current) {
      formAnchorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm]);

  function toggleDate(date: Date) {
    const key = format(date, "yyyy-MM-dd");
    const slot = byDay.get(key);
    if (!slot || slot.status !== "open" || slot.remaining <= 0) return;
    setSelectedSlots((prev) => {
      const exists = prev.some((p) => p.slot_id === slot.slot_id);
      if (exists) return prev.filter((p) => p.slot_id !== slot.slot_id);
      return [...prev, slot].sort((a, b) => a.starts_at.localeCompare(b.starts_at));
    });
  }

  function removeSlot(slotId: string) {
    setSelectedSlots((prev) => prev.filter((p) => p.slot_id !== slotId));
  }

  const totalCents = selectedSlots.length * PROGRAMME.priceCents;
  const totalLabel = `$${(totalCents / 100).toFixed(0)}`;

  return (
    <div ref={formAnchorRef}>
      {showForm && selectedSlots.length > 0 ? (
        <BookingForm
          slots={selectedSlots}
          slotLabels={selectedSlots.map(formatSlotLabel)}
          programmeTitle={PROGRAMME.title}
          totalCents={totalCents}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <>
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-charcoal">Pick your days</h3>
                <p className="text-sm font-medium text-slate-500">
                  Tap any green day to add it to your booking. Tap again to remove.
                </p>
              </div>
              <Legend />
            </div>

            {isLoading && <CalendarSkeleton />}

            {isError && (
              <div className="flex flex-col items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm">
                <p className="font-bold text-red-800">Couldn't load holiday availability.</p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
                >
                  Try again
                </button>
              </div>
            )}

            {!isLoading && !isError && (
              <DayPicker
                mode="multiple"
                month={month}
                onMonthChange={setMonth}
                fromMonth={today}
                toMonth={addMonths(today, 3)}
                selected={selectedDates}
                onSelect={(dates) => {
                  // DayPicker's onSelect gives the *full* new array of dates; we
                  // diff against current selection and toggle through our handler
                  // so we keep a single source of truth (slot rows, not dates).
                  const incoming = (dates ?? []) as Date[];
                  const incomingKeys = new Set(incoming.map((d) => format(d, "yyyy-MM-dd")));
                  const currentKeys = new Set(selectedDates.map((d) => format(d, "yyyy-MM-dd")));
                  // Newly added (in incoming, not in current)
                  for (const d of incoming) {
                    if (!currentKeys.has(format(d, "yyyy-MM-dd"))) toggleDate(d);
                  }
                  // Newly removed (in current, not in incoming)
                  for (const d of selectedDates) {
                    if (!incomingKeys.has(format(d, "yyyy-MM-dd"))) toggleDate(d);
                  }
                }}
                disabled={[{ before: today }, ...fullDays]}
                modifiers={{ available: openDays, full: fullDays }}
                modifiersClassNames={{
                  available: "be-day-available",
                  full: "be-day-full",
                }}
              />
            )}

            <style>{`
              .rdp-root {
                --rdp-accent-color: #f4c542;
                --rdp-accent-background-color: rgba(244, 197, 66, 0.18);
                --rdp-today-color: #1E293B;
                font-family: var(--app-font-sans, Nunito), system-ui, sans-serif;
              }
              .rdp-day { font-weight: 600; }
              .be-day-available .rdp-day_button {
                background: rgba(52, 192, 142, 0.16);
                color: #06281d;
                font-weight: 800;
                border-radius: 10px;
              }
              .be-day-available .rdp-day_button:hover {
                background: rgba(52, 192, 142, 0.30);
              }
              .be-day-full .rdp-day_button {
                background: rgba(15, 23, 42, 0.05);
                color: rgba(15, 23, 42, 0.35);
                text-decoration: line-through;
                border-radius: 10px;
              }
              .rdp-day_selected .rdp-day_button,
              .rdp-day_selected .rdp-day_button:hover {
                background: #f4c542 !important;
                color: #3a2a06 !important;
              }
            `}</style>
          </div>

          {/* Basket */}
          <motion.div
            initial={false}
            animate={{ opacity: selectedSlots.length > 0 ? 1 : 0.55 }}
            className="mt-5 rounded-3xl border-2 border-slate-200 bg-white p-5 md:p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-lego-orange mb-1">
                  Your booking
                </p>
                <h4
                  className="text-lg font-black text-charcoal leading-snug"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {selectedSlots.length === 0
                    ? "No days selected yet"
                    : `${selectedSlots.length} ${selectedSlots.length === 1 ? "day" : "days"} selected`}
                </h4>
              </div>
              <div className="rounded-xl bg-lego-orange text-charcoal px-3.5 py-2 font-black shadow-sm">
                <div className="text-lg leading-none">{totalLabel}</div>
                <div className="text-[10px] uppercase tracking-wider opacity-75 mt-0.5">
                  total
                </div>
              </div>
            </div>

            {selectedSlots.length > 0 && (
              <ul className="space-y-1.5 mb-4">
                {selectedSlots.map((s) => (
                  <li
                    key={s.slot_id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2"
                  >
                    <span className="text-sm font-bold text-charcoal">
                      {format(new Date(s.starts_at), "EEEE d MMMM")}
                      <span className="ml-2 text-xs font-medium text-slate-500">9am–4pm</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSlot(s.slot_id)}
                      className="grid place-items-center w-7 h-7 rounded-md text-slate-500 hover:bg-white hover:text-charcoal transition-colors"
                      aria-label={`Remove ${format(new Date(s.starts_at), "EEEE d MMMM")}`}
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowForm(true)}
                disabled={selectedSlots.length === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-charcoal text-white px-5 py-3 font-black text-xs uppercase tracking-[0.12em] hover:bg-lego-orange hover:text-charcoal disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Continue to details →
              </button>
              {selectedSlots.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedSlots([])}
                  className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500 hover:text-charcoal"
                >
                  Clear all
                </button>
              )}
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Each day is $115. You'll pay the total once at the next step.
            </p>
          </motion.div>
        </>
      )}
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-3 rounded-sm bg-[#34c08e]/40" /> Open
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-3 rounded-sm bg-lego-orange" /> Selected
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-3 rounded-sm bg-slate-200" /> Full / closed
      </span>
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 35 }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded-md bg-slate-100" />
      ))}
    </div>
  );
}

function formatSlotLabel(slot: AvailabilitySlot): string {
  const s = new Date(slot.starts_at);
  return s.toLocaleDateString("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Pacific/Auckland",
  }) + " · 9am–4pm";
}

