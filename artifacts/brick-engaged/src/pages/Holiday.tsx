import { motion } from "framer-motion";
import { Calendar, Clock, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LegoButton } from "@/components/LegoButton";
import { CalendarGrid, type AvailabilitySlot } from "@/components/booking/CalendarGrid";
import { BookingForm } from "@/components/booking/BookingForm";
import { OutcomeGrid } from "@/components/category/OutcomeGrid";
import { SessionRhythm } from "@/components/category/SessionRhythm";
import { TrustStrip } from "@/components/category/TrustStrip";
import { FAQ } from "@/components/category/FAQ";

const HOLIDAY_PROGRAMME = {
  title: "School Holiday Programme",
  priceCents: 11500,
  location: "Lane Park Business Centre, Upper Hutt",
};

function formatSlotLabel(slot: AvailabilitySlot) {
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

export default function Holiday() {
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // When the user picks a day, scroll the form into view so they can see the
  // fields without hunting for them — important on phones where the calendar
  // already fills the viewport.
  useEffect(() => {
    if (selectedSlot && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedSlot]);

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
                href="#book-calendar"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("book-calendar")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                <LegoButton variant="orange" data-testid="button-enrol-holiday">
                  Book a day
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

      {/* Outcomes */}
      <OutcomeGrid
        heading="What kids take home"
        intro="A holiday day is a full day — but the outcomes go beyond just 'tired and happy'."
        outcomes={[
          { title: "A massive build under their belt", body: "Kids leave proud of something they made — usually bigger than anything they'd attempt at home, because of the sheer selection of pieces." },
          { title: "Practice negotiating with new kids", body: "Small group, shared pile, mixed ages. Plenty of natural reps in sharing, asking, and resolving the inevitable 'I had it first.'" },
          { title: "A break from screens that doesn't feel like one", body: "Six hours hands-on, mindful, focused — kids don't even notice they haven't touched a device." },
          { title: "An anchor in the school break", body: "Holidays are long. One full day with a clear rhythm and other kids gives whānau a useful structural anchor — and you a real day off." },
        ]}
      />

      {/* Rhythm */}
      <SessionRhythm
        heading="What the day looks like"
        intro="Predictable rhythm, low overload. Kids settle quickly because they know what to expect."
        steps={[
          { duration: "9:00 – 9:30", title: "Arrival & free explore", body: "Kids arrive, find a tray, start poking through the LEGO® selection. Casual chats, low demand." },
          { duration: "9:30 – 12:00", title: "Morning build", body: "Dan introduces the day's challenge or theme. Kids work in pairs or solo on big builds." },
          { duration: "12:00 – 1:00", title: "Lunch & runaround", body: "Eat together, then a proper break — kids stretch their legs while their builds wait." },
          { duration: "1:00 – 4:00", title: "Afternoon project", body: "Bigger collaborative builds, gallery time at 3:45, pack down. Pickup at 4." },
        ]}
      />

      {/* Trust */}
      <TrustStrip
        kicker="Why parents come back"
        stats={[
          { value: "9–4", label: "Full day · pickup at 4pm" },
          { value: "10 max", label: "Per day, always" },
          { value: "$115", label: "Per day, all inclusive" },
          { value: "LMNZ S1", label: "Dan's LEGO® Master cred" },
        ]}
      />

      {/* Live availability calendar + inline booking form */}
      <section id="book-calendar" className="bg-slate-50 py-16 md:py-24">
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
              {selectedSlot ? "Confirm your booking" : "See which days are open"}
            </h2>
            <p className="text-base md:text-lg text-slate-500 font-medium">
              {selectedSlot
                ? "Fill the details below — payment is processed securely by Stripe."
                : "Pick an open day below to start your booking."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            ref={formRef}
          >
            {selectedSlot ? (
              <BookingForm
                slot={selectedSlot}
                slotLabel={formatSlotLabel(selectedSlot)}
                programmeTitle={HOLIDAY_PROGRAMME.title}
                priceCents={HOLIDAY_PROGRAMME.priceCents}
                onCancel={() => setSelectedSlot(null)}
              />
            ) : (
              <CalendarGrid
                programme="holiday"
                monthsAhead={3}
                onSelect={setSelectedSlot}
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ
        items={[
          {
            q: "What does my kid need to bring?",
            a: "Packed lunch, drink bottle, and a snack or two. Clothes you don't mind getting LEGO-dust on. That's it — LEGO® is all provided.",
          },
          {
            q: "What if my child has dietary or sensory needs?",
            a: "Let Dan know on the booking form. We can accommodate most needs — quiet corner for breaks, alternative activities during noisier moments, allergy-aware lunch handling.",
          },
          {
            q: "Can I drop off / pick up at different times?",
            a: "Doors open 8:45am and we need everyone collected by 4pm sharp. If your day looks different, message Dan first — flexibility is usually possible.",
          },
          {
            q: "What if my child doesn't connect with the group?",
            a: "Dan watches for this. If a day really isn't working, you'll get a call and we'll refund the day. Kids are different the next holiday — it's worth trying again.",
          },
          {
            q: "Can siblings come together?",
            a: "Yes, very common. Book separately so each gets their own spot, but they can sit together if they want to.",
          },
          {
            q: "Can I get a refund if something comes up?",
            a: "Full refund 7+ days out, 50% refund 2–7 days out, no refund 48h out unless the day is cancelled by us. We'll always try to re-book you onto another day first.",
          },
        ]}
      />
    </div>
  );
}
