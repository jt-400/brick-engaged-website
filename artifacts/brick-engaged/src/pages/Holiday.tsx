import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Phone } from "lucide-react";
import { LegoButton } from "@/components/LegoButton";

export default function Holiday() {
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-charcoal text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 flex-grow flex items-center justify-center">
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
              <a href="tel:0212700301">
                <LegoButton variant="orange" data-testid="button-call-dan">
                  <span className="flex items-center gap-2"><Phone size={14} /> Call 021 270 0301</span>
                </LegoButton>
              </a>
              <a href="sms:0212700301">
                <LegoButton variant="charcoal" data-testid="button-text-dan">
                  Text Dan
                </LegoButton>
              </a>
            </div>
            <p className="mt-6 text-sm font-medium text-white/70">Limited to four kids per day! Register for as many days as you like.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white text-charcoal rounded-3xl p-8 md:p-10 shadow-2xl relative">
              <div className="absolute -top-5 -right-5 bg-lego-orange text-charcoal w-24 h-24 rounded-2xl flex flex-col items-center justify-center font-black rotate-6 shadow-xl">
                <span className="text-2xl">$110</span>
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
    </div>
  );
}
