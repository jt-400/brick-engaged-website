import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Puzzle, Heart, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import heroImg from "@assets/ChatGPT_Image_May_18,_2026,_01_27_36_PM_1779078714442.png";
import kidsImg from "@assets/lego_kids.png";
import minifigsImg from "@assets/lego_minifigs.png";
import bricksImg from "@assets/lego_bricks_close.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section — full bleed so the fixed header overlaps it */}
      <section className="relative overflow-hidden min-h-[620px] flex items-center">
        <img
          src={heroImg}
          alt="Colorful LEGO bricks border"
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="img-hero-lego"
        />
        <div className="relative z-10 w-full flex items-center justify-center pt-32 pb-24 px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-3xl"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter text-charcoal drop-shadow-sm"
            >
              Building connections, one brick at a time
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl mb-10 font-bold text-slate-700 max-w-xl mx-auto leading-relaxed"
            >
              We believe in the transformative power of play and its ability to create positive,
              lasting change in the lives of our clients.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center">
              <Link href="/sessions">
                <Button
                  size="lg"
                  data-testid="button-view-sessions"
                  className="bg-lego-orange text-white hover:bg-charcoal text-lg h-14 px-8 rounded-full font-bold shadow-lg"
                >
                  View Sessions
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  data-testid="button-get-in-touch"
                  className="bg-charcoal text-white hover:bg-lego-orange text-lg h-14 px-8 rounded-full font-bold shadow-lg"
                >
                  Get in Touch
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission strip */}
      <section className="bg-lego-orange py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-2xl md:text-3xl font-black text-white max-w-4xl mx-auto tracking-tight">
            At Brick Engaged, our mission is to build connections, one brick at a time.
          </p>
        </div>
      </section>

      {/* Image + text feature */}
      <section className="py-0 bg-white overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[480px]">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <img
              src={kidsImg}
              alt="Children building with LEGO together"
              className="w-full h-full object-cover min-h-[320px]"
              data-testid="img-kids-building"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-charcoal text-white flex items-center px-10 md:px-16 py-16"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-tight">
                LEGO® as a tool for growth
              </h2>
              <p className="text-xl font-medium opacity-90 leading-relaxed mb-6">
                Brick Engaged conducts Mindful LEGO® Building sessions for small groups in a safe,
                welcoming and inclusive environment.
              </p>
              <p className="text-lg font-medium opacity-70 leading-relaxed">
                We focus on social skills, life skills, mental wellbeing and meaningful interactions
                while building and playing with LEGO® bricks.
              </p>
              <Link href="/sessions">
                <Button className="mt-8 bg-lego-orange hover:bg-white hover:text-charcoal text-white font-bold rounded-full h-12 px-8 text-base">
                  Explore Sessions <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
            </div>
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
            <h2 className="text-4xl md:text-5xl font-black text-charcoal mb-4 tracking-tighter">
              Who can benefit?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
              <Card className="h-full border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-lego-orange h-2"></div>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-lego-orange/10 rounded-2xl p-3">
                      <Puzzle size={28} className="text-lego-orange" />
                    </div>
                    <span className="text-xs font-black bg-lego-orange text-white px-3 py-1 rounded-full">
                      Brick-by-Brick® Programme
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-charcoal mt-4 mb-4">Children 7–12</h3>
                  <ul className="space-y-2 font-medium text-muted-foreground">
                    {[
                      "Neurodiverse (ADHD, Autistic)",
                      "Home schooled",
                      "Struggling with Mental Health",
                      "Suffered Trauma",
                      "Low self-confidence",
                      "Feeling like you don't 'fit-in'",
                    ].map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-lego-orange font-black text-lg leading-tight">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Teens */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-charcoal h-2"></div>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-charcoal/10 rounded-2xl p-3">
                      <Users size={28} className="text-charcoal" />
                    </div>
                    <span className="text-xs font-black bg-charcoal text-white px-3 py-1 rounded-full">
                      Mindful Building Sessions
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-charcoal mt-4 mb-4">Teens 13–19</h3>
                  <ul className="space-y-2 font-medium text-muted-foreground">
                    {[
                      "Neurodiverse (ADHD, Autistic)",
                      "Home schooled",
                      "Struggling with Mental Health",
                      "Suffered Trauma",
                      "Low self-confidence",
                      "Feeling like you don't 'fit-in'",
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
              <Card className="h-full border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-lego-orange h-2"></div>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-lego-orange/10 rounded-2xl p-3">
                      <Heart size={28} className="text-lego-orange" />
                    </div>
                    <span className="text-xs font-black bg-lego-orange text-white px-3 py-1 rounded-full">
                      Therapeutic Use of LEGO®
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-charcoal mt-4 mb-4">Adults 20+</h3>
                  <ul className="space-y-2 font-medium text-muted-foreground">
                    {[
                      "Neurodiverse (ADHD, Autistic)",
                      "Struggling with Mental Health",
                      "Suffered Trauma",
                      "Low self-confidence",
                      "Feeling like you don't 'fit-in'",
                      "Need a break / Lower Anxiety",
                    ].map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-lego-orange font-black text-lg leading-tight">•</span>
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

      {/* Minifigs image band */}
      <section className="relative h-72 overflow-hidden">
        <img
          src={minifigsImg}
          alt="LEGO minifigures"
          className="w-full h-full object-cover"
          data-testid="img-minifigs-band"
        />
        <div className="absolute inset-0 bg-charcoal/65 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center text-white px-4"
          >
            <p className="text-2xl md:text-4xl font-black tracking-tight">
              Everyone deserves to feel like they belong.
            </p>
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
            className="text-4xl md:text-5xl font-black text-center text-charcoal mb-14 tracking-tighter"
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
                    <div className="flex items-center gap-2 font-bold text-lego-orange">
                      <span>Learn more</span> <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link href="/foundation">
                <div
                  className="bg-lego-orange text-white rounded-3xl overflow-hidden h-full flex flex-col cursor-pointer hover:scale-105 hover:rotate-1 transition-transform duration-300 shadow-xl"
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
                    <div className="flex items-center gap-2 font-bold text-white/80">
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
