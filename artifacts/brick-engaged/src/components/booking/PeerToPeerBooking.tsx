import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, Users, Calendar as CalIcon } from "lucide-react";

import { AdultRegistrationForm } from "./AdultRegistrationForm";
import type { AvailabilitySlot } from "./CalendarGrid";

type AvailabilityResponse = {
  programme: string;
  slots: AvailabilitySlot[];
};

interface Group {
  slug: string;
  day: string;
  name: string;
  time: string;
  accent: string;
}

const GROUPS: Group[] = [
  { slug: "peer-to-peer-mens", day: "Monday", name: "Men's Group", time: "6:30 – 8:30pm", accent: "bg-sky-100 text-sky-900" },
  { slug: "peer-to-peer-couples", day: "Tuesday", name: "Couples Group", time: "6:30 – 8:30pm", accent: "bg-rose-100 text-rose-900" },
  { slug: "peer-to-peer-womens", day: "Wednesday", name: "Women's Group", time: "6:30 – 8:30pm", accent: "bg-emerald-100 text-emerald-900" },
];

const KOHA = "$10";

/**
 * Peer-to-Peer booking flow:
 *   1. Show 3 group cards (Mon Men's / Tue Couples / Wed Women's)
 *   2. Pick a group → reveal next available dates for that group (next 6)
 *   3. Pick a date → AdultRegistrationForm
 *   4. Submit → /api/bookings/hold ($0 fast-path) → confirmation page
 */
export function PeerToPeerBooking() {
  const [group, setGroup] = useState<Group | null>(null);
  const [slot, setSlot] = useState<AvailabilitySlot | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ((group || slot) && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [group, slot]);

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
            {slot ? "Confirm your spot" : group ? `${group.name} · pick a night` : "Which group fits you?"}
          </h2>
          <p className="text-base font-medium text-slate-500">
            {slot
              ? `Quick details — payment isn't needed online. ${KOHA} suggested koha is paid in person.`
              : group
                ? "All sessions are 6:30 – 8:30pm. Drop in for some or all."
                : "Pick one of the three weekly groups to see available nights."}
          </p>
        </motion.div>

        {!group && <GroupChooser onPick={setGroup} />}

        {group && !slot && (
          <DatePicker
            group={group}
            onPick={setSlot}
            onBack={() => setGroup(null)}
          />
        )}

        {group && slot && (
          <AdultRegistrationForm
            slot={slot}
            slotLabel={formatSessionLabel(slot, group)}
            programmeTitle={`Peer-to-Peer · ${group.name}`}
            koha={KOHA}
            onCancel={() => setSlot(null)}
          />
        )}
      </div>
    </section>
  );
}

function GroupChooser({ onPick }: { onPick: (g: Group) => void }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {GROUPS.map((g) => (
        <button
          key={g.slug}
          type="button"
          onClick={() => onPick(g)}
          className="text-left rounded-2xl border-2 border-slate-200 bg-white p-5 md:p-6 hover:border-charcoal hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <div className={`inline-block text-[10px] font-black uppercase tracking-[0.14em] px-2.5 py-1 rounded mb-4 ${g.accent}`}>
            {g.day}
          </div>
          <h3
            className="text-lg font-black text-charcoal mb-1.5 leading-snug"
            style={{ letterSpacing: "-0.01em" }}
          >
            {g.name}
          </h3>
          <p className="text-sm font-bold text-slate-500 mb-2">{g.time}</p>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal/60">
            See available nights →
          </p>
        </button>
      ))}
    </motion.div>
  );
}

function DatePicker({
  group,
  onPick,
  onBack,
}: {
  group: Group;
  onPick: (slot: AvailabilitySlot) => void;
  onBack: () => void;
}) {
  const { data, isLoading, isError, refetch } = useQuery<AvailabilityResponse>({
    queryKey: ["availability", group.slug],
    queryFn: async () => {
      const res = await fetch(`/api/availability?programme=${encodeURIComponent(group.slug)}`);
      if (!res.ok) throw new Error(`availability ${res.status}`);
      return res.json();
    },
    staleTime: 30_000,
  });

  const open = (data?.slots ?? []).filter((s) => s.status === "open" && s.remaining > 0).slice(0, 8);

  return (
    <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-sm">
      <button
        type="button"
        onClick={onBack}
        className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500 hover:text-charcoal mb-5"
      >
        ← Different group
      </button>

      {isLoading && (
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <Loader2 size={16} className="animate-spin" /> Loading available nights…
        </div>
      )}

      {isError && (
        <div>
          <p className="text-sm font-bold text-red-800 mb-2">Couldn't load nights for this group.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && open.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5">
          <p className="font-bold text-charcoal">No nights open in the next while.</p>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Send Dan a quick note and we'll get you added to the waitlist.
          </p>
        </div>
      )}

      {!isLoading && !isError && open.length > 0 && (
        <ul className="space-y-2">
          {open.map((s) => (
            <li key={s.slot_id}>
              <button
                type="button"
                onClick={() => onPick(s)}
                className="w-full flex items-center justify-between gap-4 rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 hover:border-charcoal hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <CalIcon size={16} className="text-lego-orange shrink-0" />
                  <span className="font-bold text-charcoal">{formatDateLabel(s.starts_at)}</span>
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Users size={12} /> {s.remaining} left
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatDateLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Pacific/Auckland",
  });
}

function formatSessionLabel(slot: AvailabilitySlot, group: Group) {
  return `${formatDateLabel(slot.starts_at)} · ${group.time}`;
}
