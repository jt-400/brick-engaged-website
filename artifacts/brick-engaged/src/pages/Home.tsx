import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LegoButton } from "@/components/LegoButton";
import { HeroDesktop } from "@/components/HeroDesktop";
import { HeroMobile } from "@/components/HeroMobile";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import happyMinifigsImg from "@assets/lego_happy_minifigs.webp";
import minifigsImg from "@assets/lego_minifigs.webp";
import bricksImg from "@assets/lego_bricks_close.webp";
import kidsImg from "@assets/lego_kids.webp";

const PATHWAYS = [
  {
    href: "/sessions",
    testId: "link-sessions-card",
    image: bricksImg,
    alt: "LEGO bricks close-up",
    kicker: "Weekly sessions",
    accentBg: "bg-emerald-100",
    accentText: "text-emerald-900",
    title: "Brick Club, Home schoolers & Therapeutic",
    blurb:
      "Term-long groups for kids, teens and home-schooled families building friendships, focus, and confidence — one brick at a time.",
    chips: ["10-week terms", "From $150", "Ages 7–18"],
  },
  {
    href: "/holiday",
    testId: "link-holiday-card",
    image: kidsImg,
    alt: "Children playing with LEGO",
    kicker: "School holidays",
    accentBg: "bg-amber-100",
    accentText: "text-amber-900",
    title: "Holiday Programme",
    blurb:
      "Full-day school holiday sessions, 9am–4pm. Massive LEGO® selection, small groups, safe and inclusive environment.",
    chips: ["Ages 8–14", "$115 / day", "Book online"],
  },
  {
    href: "/foundation",
    testId: "link-foundation-card",
    image: minifigsImg,
    alt: "LEGO minifigures",
    kicker: "Charity arm",
    accentBg: "bg-sky-100",
    accentText: "text-sky-900",
    title: "Brick Engaged Foundation",
    blurb:
      "Fully-funded sessions for neurodivergent tamariki whose whānau couldn't otherwise access them. Apply for a place or donate.",
    chips: ["Funded sessions", "Apply or refer", "Donate"],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Two heroes — each designed for its viewport, swapped via CSS only */}
      <HeroDesktop className="hidden md:block" />
      <HeroMobile className="md:hidden" />
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
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
                className="text-center flex flex-col gap-2"
              >
                <span
                  className="text-4xl md:text-5xl font-black text-charcoal tracking-tight leading-none"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {stat.value}
                </span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[420px] md:min-h-[480px]">
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
              className="w-full h-full object-cover min-h-[240px] md:min-h-[320px]"
              loading="lazy"
              decoding="async"
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
              <Card className="h-full border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] active:translate-y-0 transition-all duration-300">
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
              <Card className="h-full border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] active:translate-y-0 transition-all duration-300">
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
              <Card className="h-full border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] active:translate-y-0 transition-all duration-300">
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


      {/* Pathways — 3 routes into the programme */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <h2
              className="text-4xl md:text-5xl font-black text-charcoal tracking-tight mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              Find your path
            </h2>
            <p className="text-base md:text-lg font-medium text-slate-500 max-w-xl mx-auto">
              Three ways into Brick Engaged. Tap one to see how it works and what's available.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
          >
            {PATHWAYS.map((p) => (
              <motion.div key={p.href} variants={fadeInUp}>
                <Link href={p.href}>
                  <div
                    className="group h-full overflow-hidden rounded-3xl bg-white border-2 border-slate-200 cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex flex-col"
                    data-testid={p.testId}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.alt}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className={`absolute top-4 left-4 ${p.accentBg} ${p.accentText} text-[10px] font-black uppercase tracking-[0.14em] px-2.5 py-1 rounded`}>
                        {p.kicker}
                      </div>
                    </div>
                    <div className="p-7 flex flex-col flex-1">
                      <h3 className="text-2xl font-black text-charcoal mb-3 tracking-tight" style={{ letterSpacing: "-0.01em" }}>
                        {p.title}
                      </h3>
                      <p className="text-[15px] leading-relaxed font-medium text-slate-600 mb-5">
                        {p.blurb}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {p.chips.map((c) => (
                          <span key={c} className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                            {c}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto flex items-center gap-2 font-black text-charcoal text-sm uppercase tracking-[0.12em]">
                        <span>Learn more</span>
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
