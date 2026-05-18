import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Holiday() {
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-lego-blue text-white overflow-hidden">
      <div className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 flex-grow flex items-center justify-center">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block bg-lego-yellow text-black font-black px-4 py-2 rounded-xl text-sm mb-6 rotate-[-2deg] shadow-md">
              School Holidays
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
              LEGO Based School Holiday Programme
            </h1>
            <p className="text-xl md:text-2xl font-medium opacity-90 mb-8 leading-relaxed">
              Led by LEGO Master Dan LMNZ S1. Small groups, meaningful interaction, fun, safe and inclusive!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-lego-yellow text-black hover:bg-white text-lg h-14 px-8 rounded-full font-bold shadow-xl border-none">
                <Phone className="mr-2" size={20} />
                Call 021 270 0301
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-lego-blue text-lg h-14 px-8 rounded-full font-bold">
                Text Dan
              </Button>
            </div>
            <p className="mt-4 text-sm font-medium opacity-80">Limited to four kids per day! Register for as many days as you like.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white text-slate-800 rounded-3xl p-8 shadow-2xl relative border-4 border-lego-yellow">
              <div className="absolute -top-6 -right-6 bg-lego-red text-white w-24 h-24 rounded-full flex flex-col items-center justify-center font-black rotate-12 shadow-lg">
                <span className="text-2xl">$110</span>
                <span className="text-xs">per day</span>
              </div>
              
              <h2 className="text-2xl font-black mb-6 border-b-2 border-slate-100 pb-4">Programme Details</h2>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="bg-lego-blue/10 p-3 rounded-xl text-lego-blue shrink-0">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <strong className="block text-lg">Ages 8-14</strong>
                    <span className="text-muted-foreground font-medium">Perfect for primary and intermediate age</span>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="bg-lego-green/10 p-3 rounded-xl text-lego-green shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <strong className="block text-lg">9am - 4pm weekdays</strong>
                    <span className="text-muted-foreground font-medium">Full day of building and activities</span>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="bg-lego-orange/10 p-3 rounded-xl text-lego-orange shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <strong className="block text-lg">Massive Selection</strong>
                    <span className="text-muted-foreground font-medium">100's of sets to choose from!<br/>1000's of pieces to build with!</span>
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
