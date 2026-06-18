import { motion } from "framer-motion";
import { Calendar, Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { LegoButton } from "@/components/LegoButton";
import { CalendarGrid, type AvailabilitySlot } from "@/components/booking/CalendarGrid";
import { BookingForm } from "@/components/booking/BookingForm";

export default function Holiday() {
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null,
  );

  const handleBookingComplete = (url: string) => {
    // Redirect to Stripe Checkout
    window.location.href = url;
  };

  const handleClearSelection = () => {
    setSelectedSlot(null);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="bg-charcoal text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 flex items-center justify-center">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block bg-lego-orange text-charcoal text-xs font-black px-4 py-1.5 rounded-lg mb-6 tracking-widest uppercase">
              School Holidays
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
              LEGO® Based School Holiday Programme
            </h1>
            <p className="text-xl md:text-2xl font-medium text-white/80 mb-8 leading-relaxed">
              Led by LEGO® Master Dan LMNZ S1. Small groups, meaningful interaction, fun, safe and inclusive!
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://forms.gle/cD8ZQ5oT7Pzq1djG9"
                target="_blank"
                rel="noreferrer"
              >
                <LegoButton variant="orange" data-testid="button-enrol-holiday">
                  Enrolment Form
                </LegoButton>
              </a>
              <a href="tel:0212700301">
                <LegoButton variant="white" data-testid="button-call-dan">
                  <span className="flex items-center gap-2"><Phone size={14} /> Call 021 270 0301</span>
                </LegoButton>
              </a>
              <a href="mailto:info@brickengaged.org">
                <LegoButton variant="charcoal" data-testid="button-email-holiday">
                  <span className="flex items-center gap-2"><Mail size={14} /> Email Us</span>
                </LegoButton>
              </a>
              <a href="sms:0212700301">
                <LegoButton variant="white" data-testid="button-text-dan">
                  Text Dan
                </LegoButton>
              </a>
            </div>
            <p className="mt-6 text-sm font-medium text-white/70">Limited to 10 kids per day! Register for as many days as you like.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white text-charcoal rounded-3xl p-8 md:p-10 shadow-2xl relative">
              <div className="absolute -top-4 -right-4 md:-top-5 md:-right-5 bg-lego-orange text-charcoal w-20 h-20 md:w-24 md:h-24 rounded-2xl flex flex-col items-center justify-center font-black rotate-6 shadow-xl">
                <span className="text-2xl">$115</span>
                <span className="text-xs">per day</span>
              </div>

              <h2 className="text-2xl font-black mb-6 border-b-2 border-slate-100 pb-4 tracking-tight">Programme Details</h2>

              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="bg-lego-orange/15 p-3 rounded-xl text-charcoal shrink-0">
                    <Calendar size={22} />
                  </div>
                  <div>
                    <strong className="block text-lg font-black">Ages 8–14</strong>
                    <span className="text-slate-500 font-medium">Perfect for primary and intermediate age</span>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="bg-charcoal/10 p-3 rounded-xl text-charcoal shrink-0">
                    <Clock size={22} />
                  </div>
                  <div>
                    <strong className="block text-lg font-black">9am – 4pm weekdays</strong>
                    <span className="text-slate-500 font-medium">Full day of building and activities</span>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="bg-lego-orange/15 p-3 rounded-xl text-charcoal shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <strong className="block text-lg font-black">Massive selection</strong>
                    <span className="text-slate-500 font-medium">100s of sets, 1000s of pieces to build with</span>
                  </div>
                </li>
              </ul>

              <div className="mt-8 bg-slate-50 p-4 rounded-xl text-center text-sm font-bold text-slate-500">
                Book now to secure your spot!
              </div>
            </div>
          </motion.div>

        </div>
      </div>
      </section>

      {/* Availability calendar (Phase 1: read-only) */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <div className="inline-block bg-lego-orange text-charcoal text-xs font-black px-4 py-1.5 rounded-lg mb-4 tracking-widest uppercase">
              Live availability
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-charcoal tracking-tight mb-3" style={{ letterSpacing: '-0.02em' }}>
              See which days are open
            </h2>
            <p className="text-base md:text-lg text-slate-500 font-medium">
              Pick an open day below to book online.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <CalendarGrid
              programme="holiday"
              monthsAhead={3}
              onSelect={setSelectedSlot}
              selectedSlotId={selectedSlot?.slot_id ?? null}
            />
          </motion.div>

          {selectedSlot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BookingForm
                slotId={selectedSlot.slot_id}
                date={new Date(selectedSlot.starts_at).toLocaleDateString(
                  "en-NZ",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
                priceCents={11500}
                onComplete={handleBookingComplete}
              />
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="text-sm font-bold text-slate-400 hover:text-slate-600 underline underline-offset-2"
                >
                  Cancel — pick a different day
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
