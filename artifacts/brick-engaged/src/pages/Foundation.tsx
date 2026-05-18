import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Foundation() {
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-slate-50">
      <section className="bg-lego-red text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-brick-pattern opacity-20 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl"
          >
            <Heart size={40} className="text-lego-red fill-lego-red" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black mb-6 tracking-tighter"
          >
            Brick Engaged Foundation
          </motion.h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-3xl flex-grow">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100"
        >
          <div className="space-y-6 text-xl text-slate-700 leading-relaxed font-medium">
            <p>
              <strong className="text-lego-red font-black">Brick Engaged Foundation</strong> is a charitable organisation that conducts Mindful LEGO® Building sessions specifically for neurodivergent children and children with mental health and/or mental disability.
            </p>
            
            <p>
              Sessions are conducted in small groups in a safe, welcoming and inclusive environment. We focus on social skills, life skills, mental wellbeing and meaningful interactions while building and playing with LEGO® bricks.
            </p>

            <div className="bg-lego-red/10 p-6 rounded-2xl text-lego-red border border-lego-red/20">
              Sessions are paid for by the foundation; some conditions apply.
            </div>

            <blockquote className="border-l-4 border-lego-yellow pl-6 py-2 italic text-slate-600 bg-slate-50/50">
              "The Brick Engaged Foundation's mission is to build connections, one brick at a time. We believe in the transformative power of play and its ability to create positive, lasting change in the lives of neurodivergent children. Through our Lego-based program, we are committed to helping these children reach their full potential and achieve meaningful social, emotional, and cognitive growth. Join us in making a difference in the lives of neurodivergent children and together, let's build a brighter future."
            </blockquote>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center">
            <Button size="lg" className="bg-lego-red hover:bg-lego-red/90 text-white rounded-full font-bold h-14 px-10 text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              Make a Donation
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
