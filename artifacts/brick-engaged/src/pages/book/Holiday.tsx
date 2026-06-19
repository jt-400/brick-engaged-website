import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Calendar, MapPin, ShieldCheck } from "lucide-react";

import { CalendarGrid, type AvailabilitySlot } from "@/components/booking/CalendarGrid";
import { BookingForm } from "@/components/booking/BookingForm";

// Hard-coded match for the seeded `holiday` programme so we don't need an
// extra round-trip just to render the page header. In Phase 5 (term sessions)
// we'll switch to fetching from /api/programmes.
const PROGRAMME = {
  slug: "holiday",
  title: "School Holiday Programme",
  priceCents: 11500,
  location: "Lane Park Business Centre, Upper Hutt",
};

export default function BookHoliday() {
  const [selected, setSelected] = useState<AvailabilitySlot | null>(null);

  function slotLabel(slot: AvailabilitySlot) {
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
        hour12: true,
        timeZone: "Pacific/Auckland",
      });
    return `${date} · ${time(s)}–${time(e)}`;
  }

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="bg-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none" />
        <div className="container relative z-10 mx-auto max-w-5xl px-4 pt-20 pb-12 md:pt-28 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Link href="/holiday">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-white/70 hover:text-white cursor-pointer">
                <ArrowLeft size={14} /> Back to Holidays
              </span>
            </Link>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Book a holiday session
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-3 max-w-2xl text-base md:text-lg text-white/80 font-medium"
          >
            Pick a day below. We'll take you through a quick form, then to a secure Stripe
            checkout. You'll get a confirmation email within minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl"
          >
            <InfoChip icon={<Calendar size={14} />} label="9am – 4pm weekdays" />
            <InfoChip icon={<MapPin size={14} />} label="Upper Hutt" />
            <InfoChip icon={<ShieldCheck size={14} />} label="Payment via Stripe" />
          </motion.div>
        </div>
      </section>

      {/* Booking workspace */}
      <section className="bg-slate-50 py-12 md:py-16">
        <div className="container mx-auto max-w-3xl px-4">
          {!selected ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CalendarGrid
                programme={PROGRAMME.slug}
                monthsAhead={3}
                onSelect={(slot) => setSelected(slot)}
              />
              <p className="mt-4 text-center text-sm font-medium text-slate-500">
                Click an open day to start your booking.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={selected.slot_id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <BookingForm
                slot={selected}
                slotLabel={slotLabel(selected)}
                programmeTitle={PROGRAMME.title}
                priceCents={PROGRAMME.priceCents}
                onCancel={() => setSelected(null)}
              />
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

function InfoChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-white/90 backdrop-blur">
      <span className="text-lego-orange">{icon}</span> {label}
    </div>
  );
}
