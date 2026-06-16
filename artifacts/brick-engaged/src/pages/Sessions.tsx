import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { LegoButton } from "@/components/LegoButton";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import kidsImg from "@assets/lego_kids.webp";
import handsImg from "@assets/lego_hands.webp";
import therapyImg from "@assets/lego_therapy.webp";

export default function Sessions() {
  return (
    <div className="flex flex-col w-full pb-24">
      {/* Hero */}
      <section className="bg-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 pt-20 pb-14 md:pt-28 md:pb-20 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-lego-orange text-charcoal text-xs font-black px-4 py-1.5 rounded-lg mb-6 tracking-widest uppercase"
          >
            Programmes
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6 tracking-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            Brick Engaged Sessions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-medium text-white/80"
          >
            Therapeutic and mindful LEGO® building programmes for all ages
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-16 max-w-5xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-16"
        >
          {/* Programme 1 — Brick-by-Brick */}
          <motion.div
            variants={fadeInUp}
            className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <img
                src={kidsImg}
                alt="Children doing Brick-by-Brick programme"
                className="w-full h-48 md:h-full object-cover"
                loading="lazy"
                decoding="async"
                data-testid="img-brick-by-brick"
              />
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-5">
                  <span className="bg-lego-orange text-charcoal text-xs font-black px-3 py-1.5 rounded-lg">
                    Ages 7–13
                  </span>
                </div>
                <h2 className="text-3xl font-black text-charcoal mb-4 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                  Brick Club
                </h2>
                <div className="space-y-3 text-base text-muted-foreground font-medium mb-6">
                  <p>
                    Children build LEGO® models together, making friends and developing skills along
                    the way.
                  </p>
                  <p>
                    Each session weaves in communication, problem-solving and shared fun — the
                    perfect mix for confident, connected kids.
                  </p>
                </div>
                <div className="mb-5">
                  <p className="font-bold text-sm text-charcoal mb-2">Skills developed:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "ADHD",
                      "Autistic",
                      "Communication",
                      "Life skills",
                      "Social Skills",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="bg-lego-orange/15 text-charcoal rounded-full text-xs font-bold px-3 py-1.5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm space-y-1.5 mb-6 font-medium">
                  <p>
                    <span className="font-bold text-charcoal">Location:</span> Lane Park Business
                    Centre
                  </p>
                  <p>
                    <span className="font-bold text-charcoal">Group size:</span> Up to Ten
                  </p>
                  <p>
                    <span className="font-bold text-charcoal">Price:</span> $299 per 10 week term
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://forms.gle/cD8ZQ5oT7Pzq1djG9"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LegoButton variant="orange" data-testid="button-enrol-bbk">
                      Enrolment Form
                    </LegoButton>
                  </a>
                  <a href="mailto:info@brickengaged.org">
                    <LegoButton variant="charcoal" data-testid="button-email-bbk">
                      <span className="flex items-center gap-2"><Mail size={14} /> Email Us</span>
                    </LegoButton>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Programme 2 — Mindful Building */}
          <motion.div
            variants={fadeInUp}
            className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-10 order-2 md:order-1">
                <div className="flex items-center gap-3 mb-5">
                  <span className="bg-charcoal text-white text-xs font-black px-3 py-1.5 rounded-lg">
                    Ages 7–14
                  </span>
                </div>
                <h2 className="text-3xl font-black text-charcoal mb-4 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                  Home schoolers sessions
                </h2>
                <div className="space-y-3 text-base text-muted-foreground font-medium mb-4">
                  <p>
                    Home school groups explore and learn by building and observing. This course
                    targets curriculum areas such as Maths, Physics, Arts and Environment, while
                    nurturing all the fundamental life and social skills.
                  </p>
                </div>
                <div className="mb-5">
                  <p className="font-bold text-sm text-charcoal mb-2">Skills developed:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Maths",
                      "Science",
                      "Physics",
                      "STEAM",
                      "Home-school",
                      "Communication",
                      "Teamwork",
                      "Problem solving",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="bg-lego-orange/15 text-charcoal rounded-full text-xs font-bold px-3 py-1.5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm space-y-1.5 mb-6 font-medium">
                  <p>
                    <span className="font-bold text-charcoal">Location:</span> Lane Park Business
                    Centre
                  </p>
                  <p>
                    <span className="font-bold text-charcoal">Group size:</span> Min 5, Max 12
                  </p>
                  <p>
                    <span className="font-bold text-charcoal">Price:</span> $150 per 10 week term
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://forms.gle/cD8ZQ5oT7Pzq1djG9"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LegoButton variant="orange" data-testid="button-enrol-mindful">
                      Enrolment Form
                    </LegoButton>
                  </a>
                  <a href="mailto:info@brickengaged.org">
                    <LegoButton variant="charcoal" data-testid="button-email-mindful">
                      <span className="flex items-center gap-2"><Mail size={14} /> Email Us</span>
                    </LegoButton>
                  </a>
                </div>
              </div>
              <img
                src={handsImg}
                alt="Child building with LEGO mindfully"
                className="w-full h-48 md:h-full object-cover order-1 md:order-2"
                loading="lazy"
                decoding="async"
                data-testid="img-mindful-building"
              />
            </div>
          </motion.div>

          {/* Programme 3 — Therapeutic */}
          <motion.div
            variants={fadeInUp}
            className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <img
                src={therapyImg}
                alt="Adult building LEGO therapeutically"
                className="w-full h-48 md:h-full object-cover"
                loading="lazy"
                decoding="async"
                data-testid="img-therapeutic"
              />
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-5">
                  <span className="bg-lego-orange text-charcoal text-xs font-black px-3 py-1.5 rounded-lg">
                    Ages 15+
                  </span>
                </div>
                <h2 className="text-3xl font-black text-charcoal mb-4 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                  Therapeutic Use of LEGO®
                </h2>
                <div className="space-y-3 text-base text-muted-foreground font-medium mb-6">
                  <p>
                    Same methods as Mindful Building but tailored for teenagers and adults, with a
                    focus on respite, mental health and peer to peer support.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm space-y-1.5 mb-6 font-medium">
                  <p>
                    <span className="font-bold text-charcoal">Location:</span> Lane Park Business
                    Centre
                  </p>
                  <p>
                    <span className="font-bold text-charcoal">Group size:</span> Max 10
                  </p>
                  <p>
                    <span className="font-bold text-charcoal">Price:</span> Donation (recommended $10)
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://forms.gle/cD8ZQ5oT7Pzq1djG9"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LegoButton variant="orange" data-testid="button-enrol-therapeutic">
                      Enrolment Form
                    </LegoButton>
                  </a>
                  <a href="mailto:info@brickengaged.org">
                    <LegoButton variant="charcoal" data-testid="button-email-therapeutic">
                      <span className="flex items-center gap-2"><Mail size={14} /> Email Us</span>
                    </LegoButton>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
