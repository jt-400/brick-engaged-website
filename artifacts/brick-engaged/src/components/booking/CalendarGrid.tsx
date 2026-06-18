import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, addMonths } from "date-fns";
import "react-day-picker/style.css";

export type AvailabilitySlot = {
  slot_id: string;
  starts_at: string;
  ends_at: string;
  capacity: number;
  remaining: number;
  status: "open" | "closed" | "full";
};

type AvailabilityResponse = {
  programme: string;
  from: string;
  to: string;
  slots: AvailabilitySlot[];
};

interface CalendarGridProps {
  /** Programme slug (e.g. "holiday"). Matches the slug column in `programmes`. */
  programme: string;
  /** Optional callback when the user picks an open day. Phase 1: omit (read-only). */
  onSelect?: (slot: AvailabilitySlot) => void;
  /** Number of months to look ahead. Defaults to 3 — enough to cover one school holiday block. */
  monthsAhead?: number;
  /** Currently selected slot id (for highlighting). */
  selectedSlotId?: string | null;
}

/**
 * Public-facing calendar: shows open days with "X spots left" badges and
 * disables full / closed days. Reads `/api/availability` via TanStack Query.
 */
export function CalendarGrid({ programme, onSelect, monthsAhead = 3 }: CalendarGridProps) {
  const today = useMemo(() => startOfMonth(new Date()), []);
  const [month, setMonth] = useState<Date>(today);

  const { data, isLoading, isError, refetch } = useQuery<AvailabilityResponse>({
    queryKey: ["availability", programme, monthsAhead],
    queryFn: async () => {
      const from = startOfMonth(today).toISOString();
      const to = addMonths(today, monthsAhead).toISOString();
      const res = await fetch(
        `/api/availability?programme=${encodeURIComponent(programme)}&from=${from}&to=${to}`,
      );
      if (!res.ok) throw new Error(`availability ${res.status}`);
      return res.json();
    },
    staleTime: 30_000,
  });

  const slots = data?.slots ?? [];

  // Lookup: yyyy-MM-dd → slot. Each holiday day is one slot; sessions/therapeutic
  // may eventually have multiple slots per day — we treat a day as "available"
  // if any of its slots has remaining > 0.
  const byDay = useMemo(() => {
    const map = new Map<string, AvailabilitySlot>();
    for (const s of slots) {
      const key = format(new Date(s.starts_at), "yyyy-MM-dd");
      const existing = map.get(key);
      if (!existing || s.remaining > existing.remaining) map.set(key, s);
    }
    return map;
  }, [slots]);

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

  return (
    <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-sm">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black tracking-tight text-charcoal">Pick a date</h3>
          <p className="text-sm font-medium text-slate-500">
            Open days are highlighted. Full or closed days are greyed out.
          </p>
        </div>
        <Legend />
      </div>

      {isLoading && <CalendarSkeleton />}

      {isError && (
        <div className="flex flex-col items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm">
          <p className="font-bold text-red-800">Couldn't load availability.</p>
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
          mode="single"
          month={month}
          onMonthChange={setMonth}
          fromMonth={today}
          toMonth={addMonths(today, monthsAhead)}
          disabled={[{ before: today }, ...fullDays]}
          modifiers={{ available: openDays, full: fullDays }}
          modifiersClassNames={{
            available: "be-day-available",
            full: "be-day-full",
          }}
          onSelect={(date) => {
            if (!date) return;
            const key = format(date, "yyyy-MM-dd");
            const slot = byDay.get(key);
            if (slot && slot.status === "open" && slot.remaining > 0) {
              onSelect?.(slot);
            }
          }}
          footer={
            <DayFooter
              slots={slots}
              month={month}
            />
          }
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
        .be-day-available { position: relative; }
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
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-3 rounded-sm bg-[#34c08e]/40" /> Open
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-3 rounded-sm bg-slate-200" /> Full / closed
      </span>
    </div>
  );
}

function DayFooter({ slots, month }: { slots: AvailabilitySlot[]; month: Date }) {
  const openInMonth = slots.filter(
    (s) =>
      s.status === "open" &&
      s.remaining > 0 &&
      new Date(s.starts_at).getMonth() === month.getMonth(),
  );
  if (openInMonth.length === 0) {
    return (
      <p className="mt-4 text-sm font-medium text-slate-500">
        No open days this month. Try the next month →
      </p>
    );
  }
  const nextThree = openInMonth.slice(0, 3);
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Next open:</span>
      {nextThree.map((s) => (
        <span
          key={s.slot_id}
          className="rounded-full bg-lego-orange/15 px-3 py-1 text-xs font-bold text-charcoal"
        >
          {format(new Date(s.starts_at), "EEE d MMM")} · {s.remaining} left
        </span>
      ))}
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

