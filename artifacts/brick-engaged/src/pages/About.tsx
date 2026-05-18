import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function About() {
  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      <section className="bg-lego-green text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-brick-pattern opacity-20 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-4 tracking-tighter"
          >
            About Dan
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-medium"
          >
            Daniel Mulholland — Facilitator (He/Him)
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100"
        >
          <div className="space-y-6 text-lg text-slate-700 leading-relaxed font-medium">
            <p>
              I joined the NZ Army as a Medic at 17. When I left the Army, I traveled overseas with my wife before finally settling in Upper Hutt where we started our family and raised our three children. I worked in Emergency Services (Paramedic) and Allied Health (Laboratory) for nearly 20 years. I have gained vast experience in life and social skills, managing people, developing education and communication.
            </p>
            
            <p>
              LEGO became an important part of my life again in 2014. My passion for LEGO and sharing the experience of LEGO Play has provided me with many opportunities. I started a LEGO User Group (LUG) in Wellington which is still thriving today (Well-LUG). After five years as the LUG's President, I stepped down to pursue another direction, Content Creation which went on to become New Zealand's only Recognized LEGO Fan Media (RLFM) with Between the Bricks.
            </p>

            <div className="bg-slate-50 border-l-4 border-lego-blue p-6 rounded-r-2xl text-slate-800 my-8">
              <p>
                Around the same time as starting Between the Bricks, I had a Mental Health Crisis and was diagnosed with PTSD. LEGO now became part of my therapy and recovery playing a very important role in my rehabilitation. This experience has shaped me and who I am today and the direction I wish to take for the rest of my life.
              </p>
            </div>

            <p>
              I started working on the Brick Engaged concept in mid 2021, completing training in LEGO Serious Play®, LEGO-Based Therapy then furthering this in 2022 with Brick-by-Brick® facilitator training. In 2023, to ensure we remain accessible to all children and families no matter their financial situation I formed Brick Engaged Foundation a charity whose sole aim is to seek funding that will enable more children to have access to the service.
            </p>

            <div className="mt-12 p-8 bg-lego-yellow/20 rounded-2xl border-2 border-lego-yellow">
              <h3 className="text-2xl font-black text-slate-900 mb-4">Our Mission</h3>
              <p className="text-xl font-medium text-slate-800">
                Our mission is to facilitate fun, meaningful social interactions, learning and support for Neurodivergent people through building with LEGO® Bricks in a safe and inclusive environment.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Credentials</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="text-sm py-2 px-4 border-lego-blue text-lego-blue bg-lego-blue/5 rounded-full font-bold">Certified Facilitator — LEGO® SERIOUS PLAY®</Badge>
                <Badge variant="outline" className="text-sm py-2 px-4 border-lego-green text-lego-green bg-lego-green/5 rounded-full font-bold">LEGO-Based Therapy Facilitator Training</Badge>
                <Badge variant="outline" className="text-sm py-2 px-4 border-lego-orange text-lego-orange bg-lego-orange/5 rounded-full font-bold">Brick-by-Brick® Programme Foundation Course</Badge>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
