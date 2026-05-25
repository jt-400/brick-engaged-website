import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LegoButton } from "@/components/LegoButton";
import { LegoCanvas } from "@/lego/LegoCanvas";
import { LEGO_MODELS } from "@/lego/modelsData";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import happyMinifigsImg from "@assets/lego_happy_minifigs.png";
import minifigsImg from "@assets/lego_minifigs.png";
import bricksImg from "@assets/lego_bricks_close.png";

export default function Home() {
  // Castle builds once and stays — flags keep waving, no loop.
  const activeModel = LEGO_MODELS[0]; // castle only

  return (
    <div className="flex flex-col w-full">
      {/* Hero — full viewport, canvas edge-to-edge, text + social overlaid */}
      <section className="relative w-full h-screen overflow-hidden bg-charcoal">

        {/* Atmospheric radial glow — adds depth, brings text forward, gently pulses */}
        <motion.div
          aria-hidden
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 25%, rgba(255,229,39,0.08), transparent 65%)',
          }}
        />

        {/* Subtle brick-dot pattern overlay (matches other pages) */}
        <div aria-hidden className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none z-[1]"></div>

        {/* Full-bleed falling-LEGO canvas — builds once, flags keep waving */}
        <div className="absolute inset-0 opacity-90 md:opacity-95">
          <LegoCanvas
            key="castle"
            activeModel={activeModel}
            buildSpeed={1.35}
            bounceForce={0.55}
            gravity={0.65}
            spawnStagger={260}
            debugGrid={false}
            isPlaying={true}
            clickToPop={true}
            onBrickDocked={() => {}}
          />
        </div>

        {/* Vignette: subtle darkening at edges adds atmospheric depth */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-[4]"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)',
          }}
        />

        {/* Subtle off-axis brand accent (breaks symmetry, adds personality) */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.6, rotate: -25 }}
          animate={{ opacity: 0.8, scale: 1, rotate: -18 }}
          transition={{ delay: 1.4, duration: 0.8, type: 'spring', damping: 16 }}
          className="hidden md:block absolute top-[18%] right-[6%] z-[3] pointer-events-none"
        >
          <div className="grid grid-cols-2 gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-[2px]" />
            <div className="w-3 h-3 bg-blue-500 rounded-[2px]" />
            <div className="w-3 h-3 bg-lego-orange rounded-[2px]" />
            <div className="w-3 h-3 bg-emerald-500 rounded-[2px]" />
          </div>
        </motion.div>

        {/* Subtle dark scrim at top so white header text stays readable */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/30 to-transparent z-[5]" />

        <div className="relative z-10 w-full flex flex-col items-center px-5 sm:px-6 pt-[85px] sm:pt-[105px] md:pt-[129px]">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
            }}
            className="font-black text-white leading-none tracking-tight text-center w-full max-w-[1200px] text-[34px] sm:text-[52px] md:text-[72px] lg:text-[88px] xl:text-[95px]"
            style={{ letterSpacing: '-0.02em' }}
            aria-label="Building connections. One brick at a time."
          >
            <span className="block">
              {"Building connections.".split(" ").map((word, i) => (
                <motion.span
                  key={`l1-${i}`}
                  variants={{
                    hidden: { opacity: 0, y: -60, rotate: -2 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      rotate: 0,
                      transition: { type: "spring", damping: 14, stiffness: 220 },
                    },
                  }}
                  className="inline-block"
                  style={{ transformOrigin: "50% 100%" }}
                >
                  {word}
                  {i < 1 && " "}
                </motion.span>
              ))}
            </span>
            <span className="block">
              {"One brick at a time.".split(" ").map((word, i, arr) => (
                <motion.span
                  key={`l2-${i}`}
                  variants={{
                    hidden: { opacity: 0, y: -60, rotate: 2 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      rotate: 0,
                      transition: { type: "spring", damping: 14, stiffness: 220 },
                    },
                  }}
                  className="inline-block"
                  style={{ transformOrigin: "50% 100%" }}
                >
                  {word}
                  {i < arr.length - 1 && " "}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          {/* Subheadline — body font, explains the mission */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="font-sans text-center text-white/85 font-medium leading-relaxed mt-5 sm:mt-7 text-sm sm:text-base md:text-lg md:whitespace-nowrap"
            style={{ fontFamily: 'var(--app-font-sans, Nunito), system-ui, sans-serif' }}
          >
            Using the transformative power of play to create positive, lasting change.
          </motion.p>

          {/* Primary CTA — highest visual priority in the hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.6 }}
            className="mt-8 sm:mt-10"
          >
            <Link href="/sessions">
              <LegoButton variant="green" data-testid="hero-cta-primary">
                View Sessions
              </LegoButton>
            </Link>
          </motion.div>
        </div>

        {/* Subtle scroll cue — secondary, low-emphasis */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-[2px] h-5 bg-white/25 rounded-full"
          />
        </motion.div>
      </section>

      {/* Trust strip — impact stats */}
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6"
          >
            {[
              { value: "3", label: "Specialised programmes" },
              { value: "12+", label: "Years of LEGO® experience" },
              { value: "Since 2021", label: "Building brighter futures" },
              { value: "Upper Hutt", label: "Lane Park Business Centre" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
                className="text-center md:text-left flex flex-col gap-2"
              >
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span
                    className="text-4xl md:text-5xl font-black text-charcoal tracking-tight leading-none"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    {stat.value}
                  </span>
                  {i === 0 && <span className="text-lego-orange text-2xl md:text-3xl font-black leading-none">.</span>}
                </div>
                <p className="text-xs md:text-sm font-bold uppercase tracking-[0.15em] text-charcoal/55">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Text + image feature — text panel first (left), image right */}
      <section className="py-0 bg-white overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[480px]">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-charcoal text-white flex items-center px-10 md:px-16 py-16 order-2 md:order-1"
          >
            <div>
              <h2
                className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight"
                style={{ letterSpacing: '-0.02em' }}
              >
                LEGO® as a tool for growth
              </h2>
              <p className="text-lg font-normal opacity-85 leading-relaxed mb-6">
                Brick Engaged conducts Mindful LEGO® Building sessions for small groups in a safe,
                welcoming and inclusive environment.
              </p>
              <p className="text-base font-normal opacity-65 leading-relaxed">
                We focus on social skills, life skills, mental wellbeing and meaningful interactions
                while building and playing with LEGO® bricks.
              </p>
              <div className="mt-8">
                <Link href="/sessions">
                  <LegoButton variant="orange">
                    <span className="flex items-center gap-2">Explore Sessions <ArrowRight size={16} /></span>
                  </LegoButton>
                </Link>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative order-1 md:order-2"
          >
            <img
              src={happyMinifigsImg}
              alt="Two smiling LEGO minifigures against a brick wall"
              className="w-full h-full object-cover min-h-[320px]"
              data-testid="img-happy-minifigs"
            />
          </motion.div>
        </div>
      </section>

      {/* Who can benefit */}
      <section className="py-24 bg-slate-50 text-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mb-16 text-center"
          >
            <h2
              className="text-4xl md:text-5xl font-black text-charcoal mb-4 tracking-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              Who can benefit?
            </h2>
            <p className="text-lg font-normal text-muted-foreground max-w-2xl mx-auto">
              Our programmes are designed for a wide range of individuals seeking growth and
              connection.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Children */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="bg-lego-orange h-2"></div>
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    <span className="text-xs font-black bg-lego-orange text-charcoal px-3 py-1 rounded-lg">
                      Brick-by-Brick® Programme
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-charcoal mb-4">Children 7–12</h3>
                  <ul className="space-y-2 font-medium text-muted-foreground">
                    {[
                      "Neurodiverse kids (ADHD, Autistic)",
                      "Home-schooled learners",
                      "Building friendships & social skills",
                      "Processing tough experiences",
                      "Growing confidence through play",
                      "Finding their tribe",
                    ].map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-charcoal/40 font-black text-lg leading-tight">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Teens */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="bg-charcoal h-2"></div>
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    <span className="text-xs font-black bg-charcoal text-white px-3 py-1 rounded-lg">
                      Mindful Building Sessions
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-charcoal mb-4">Teens 13–19</h3>
                  <ul className="space-y-2 font-medium text-muted-foreground">
                    {[
                      "Navigating anxiety or low mood",
                      "Feeling disconnected at school",
                      "Recovering from trauma",
                      "Quiet space for big feelings",
                      "Peer-to-peer connection",
                      "Calm focus through hands-on play",
                    ].map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-charcoal font-black text-lg leading-tight">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Adults */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="bg-lego-orange h-2"></div>
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    <span className="text-xs font-black bg-lego-orange text-charcoal px-3 py-1 rounded-lg">
                      Therapeutic Use of LEGO®
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-charcoal mb-4">Adults 20+</h3>
                  <ul className="space-y-2 font-medium text-muted-foreground">
                    {[
                      "Respite from a busy mind",
                      "Mindful, screen-free downtime",
                      "Wellbeing & mental health support",
                      "Reconnecting with creativity",
                      "Small-group or 1:1 sessions",
                      "A reset for tough weeks",
                    ].map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-charcoal/40 font-black text-lg leading-tight">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Pathways */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-center text-charcoal mb-14 tracking-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            Find your path
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            <motion.div variants={fadeInUp}>
              <Link href="/sessions">
                <div
                  className="bg-charcoal text-white rounded-3xl overflow-hidden h-full flex flex-col cursor-pointer hover:scale-105 hover:-rotate-1 transition-transform duration-300 shadow-xl"
                  data-testid="link-sessions-card"
                >
                  <img src={bricksImg} alt="LEGO bricks" className="w-full h-48 object-cover" />
                  <div className="p-8 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-3xl font-black mb-3">Brick Engaged Sessions</h3>
                      <p className="text-lg opacity-80 mb-6 font-medium">
                        Discover our specialised LEGO-based programmes tailored for different age
                        groups and needs.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-white">
                      <span>Learn more</span> <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link href="/foundation">
                <div
                  className="bg-lego-orange text-charcoal rounded-3xl overflow-hidden h-full flex flex-col cursor-pointer hover:scale-105 hover:rotate-1 transition-transform duration-300 shadow-xl"
                  data-testid="link-foundation-card"
                >
                  <img
                    src={minifigsImg}
                    alt="LEGO minifigures"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-8 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-3xl font-black mb-3">Brick Engaged Foundation</h3>
                      <p className="text-lg opacity-90 mb-6 font-medium">
                        Our charitable arm providing fully-funded sessions to neurodivergent
                        children.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-charcoal/70">
                      <span>Learn more</span> <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
