import { motion } from "framer-motion";
import { LegoButton } from "@/components/LegoButton";
import bricksImg from "@assets/lego_bricks_close.png";

export default function Foundation() {
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)]">
      {/* Hero */}
      <section className="bg-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 pt-28 pb-20 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-lego-orange text-charcoal text-xs font-black px-4 py-1.5 rounded-lg mb-6 tracking-widest uppercase"
          >
            Charitable Organisation
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black mb-4 tracking-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            Brick Engaged Foundation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-xl font-medium text-white/80"
          >
            Building a brighter future for neurodivergent children
          </motion.p>
        </div>
      </section>

      {/* Two-col layout */}
      <section className="py-0 bg-white overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[420px]">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-lego-orange text-charcoal flex items-center px-10 md:px-16 py-16"
          >
            <div className="space-y-5 text-lg font-medium leading-relaxed">
              <p>
                <strong className="font-black text-charcoal">Brick Engaged Foundation</strong> is a
                charitable organisation that conducts Mindful LEGO® Building sessions specifically
                for neurodivergent children and children with mental health and/or mental
                disability.
              </p>
              <p>
                Sessions are conducted in small groups in a safe, welcoming and inclusive
                environment.
              </p>
              <div className="bg-charcoal/10 border border-charcoal/15 rounded-2xl p-5 font-bold">
                Sessions are paid for by the foundation. Some conditions apply — please get in
                touch for details.
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <img
              src={bricksImg}
              alt="Colorful LEGO bricks"
              className="w-full h-full object-cover min-h-[300px]"
              data-testid="img-foundation-bricks"
            />
          </motion.div>
        </div>
      </section>

      {/* Mission blockquote */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-12 h-1 bg-lego-orange mx-auto mb-8 rounded-lg"></div>
            <blockquote className="text-2xl md:text-3xl font-black text-charcoal leading-relaxed tracking-tight">
              "The Brick Engaged Foundation's mission is to build connections, one brick at a time.
              We believe in the transformative power of play and its ability to create positive,
              lasting change in the lives of neurodivergent children."
            </blockquote>
            <p className="mt-8 text-lg font-medium text-slate-600 max-w-3xl mx-auto">
              Through our LEGO-based program, we are committed to helping children reach their full
              potential and achieve meaningful social, emotional, and cognitive growth. Join us in
              making a difference — together, let's build a brighter future.
            </p>
            <div className="mt-10">
              <LegoButton variant="orange" data-testid="button-donate">
                Make a Donation
              </LegoButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
