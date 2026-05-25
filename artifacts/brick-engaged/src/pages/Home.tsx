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
                  className="bg-charcoal text-white rounded-3xl overflow-hidden h-full flex flex-col cursor-pointer hover:scale-105 hover:-rotate-1 active:scale-[1.02] transition-transform duration-300 shadow-xl"
                  data-testid="link-sessions-card"
                >
                  <img src={bricksImg} alt="LEGO bricks" className="w-full h-48 object-cover" loading="lazy" decoding="async" />
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
                  className="bg-lego-orange text-charcoal rounded-3xl overflow-hidden h-full flex flex-col cursor-pointer hover:scale-105 hover:rotate-1 active:scale-[1.02] transition-transform duration-300 shadow-xl"
                  data-testid="link-foundation-card"
                >
                  <img
                    src={minifigsImg}
                    alt="LEGO minifigures"
                    className="w-full h-48 object-cover"
                    loading="lazy"
                    decoding="async"
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
