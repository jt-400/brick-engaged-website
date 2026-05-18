import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Puzzle, Heart, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import heroImg from "@assets/lego_hero.png";
import kidsImg from "@assets/lego_kids.png";
import minifigsImg from "@assets/lego_minifigs.png";
import bricksImg from "@assets/lego_bricks_close.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="bg-lego-blue text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-brick-pattern opacity-20 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px] items-center gap-0">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="py-16 md:py-24 pr-0 md:pr-8"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter"
              >
                Building connections, one brick at a time
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl mb-10 font-medium opacity-90 max-w-lg leading-relaxed"
              >
                We believe in the transformative power of play and its ability to create positive, lasting change in the lives of our clients.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <Link href="/sessions">
                  <Button size="lg" data-testid="button-view-sessions" className="bg-lego-yellow text-black hover:bg-white text-lg h-14 px-8 rounded-full font-bold">
                    View Sessions
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" data-testid="button-get-in-touch" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-lego-blue text-lg h-14 px-8 rounded-full font-bold">
                    Get in Touch
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative h-[400px] md:h-full min-h-[400px]"
            >
              <img
                src={heroImg}
                alt="Colorful LEGO bricks"
                className="w-full h-full object-cover"
                data-testid="img-hero-lego"
              />
              <div className="absolute inset-0 bg-lego-blue/20"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission strip */}
      <section className="bg-lego-yellow py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-2xl md:text-3xl font-black text-black max-w-4xl mx-auto tracking-tight">
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
            className="bg-lego-red text-white flex items-center px-10 md:px-16 py-16"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-tight">LEGO® as a tool for growth</h2>
              <p className="text-xl font-medium opacity-90 leading-relaxed mb-6">
                Brick Engaged conducts Mindful LEGO® Building sessions for small groups in a safe, welcoming and inclusive environment.
              </p>
              <p className="text-lg font-medium opacity-80 leading-relaxed">
                We focus on social skills, life skills, mental wellbeing and meaningful interactions while building and playing with LEGO® bricks.
              </p>
              <Link href="/sessions">
                <Button className="mt-8 bg-white text-lego-red hover:bg-lego-yellow hover:text-black font-bold rounded-full h-12 px-8 text-base">
                  Explore Sessions <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who can benefit */}
      <section className="py-24 bg-white text-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-black text-lego-blue mb-4 tracking-tighter">Who can benefit?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Our programmes are designed for a wide range of individuals seeking growth and connection.</p>
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
              <Card className="h-full border-4 border-lego-yellow rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-lego-yellow h-2"></div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="bg-lego-yellow rounded-2xl p-3">
                      <Puzzle size={32} className="text-black" />
                    </div>
                    <h3 className="text-2xl font-bold">Children 7-12</h3>
                  </div>
                  <ul className="space-y-3 font-medium text-muted-foreground">
                    <li className="flex gap-2"><span className="text-lego-yellow font-black text-lg leading-tight">•</span> Neurodiverse (ADHD, Autistic)</li>
                    <li className="flex gap-2"><span className="text-lego-yellow font-black text-lg leading-tight">•</span> Home schooled</li>
                    <li className="flex gap-2"><span className="text-lego-yellow font-black text-lg leading-tight">•</span> Struggling with Mental Health</li>
                    <li className="flex gap-2"><span className="text-lego-yellow font-black text-lg leading-tight">•</span> Suffered Trauma</li>
                    <li className="flex gap-2"><span className="text-lego-yellow font-black text-lg leading-tight">•</span> Low self-confidence</li>
                    <li className="flex gap-2"><span className="text-lego-yellow font-black text-lg leading-tight">•</span> Feeling like you don't 'fit-in'</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Teens */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-4 border-lego-orange rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-lego-orange h-2"></div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="bg-lego-orange rounded-2xl p-3">
                      <Users size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Teens 13-19</h3>
                  </div>
                  <ul className="space-y-3 font-medium text-muted-foreground">
                    <li className="flex gap-2"><span className="text-lego-orange font-black text-lg leading-tight">•</span> Neurodiverse (ADHD, Autistic)</li>
                    <li className="flex gap-2"><span className="text-lego-orange font-black text-lg leading-tight">•</span> Home schooled</li>
                    <li className="flex gap-2"><span className="text-lego-orange font-black text-lg leading-tight">•</span> Struggling with Mental Health</li>
                    <li className="flex gap-2"><span className="text-lego-orange font-black text-lg leading-tight">•</span> Suffered Trauma</li>
                    <li className="flex gap-2"><span className="text-lego-orange font-black text-lg leading-tight">•</span> Low self-confidence</li>
                    <li className="flex gap-2"><span className="text-lego-orange font-black text-lg leading-tight">•</span> Feeling like you don't 'fit-in'</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Adults */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-4 border-lego-green rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-lego-green h-2"></div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="bg-lego-green rounded-2xl p-3">
                      <Heart size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Adults</h3>
                  </div>
                  <ul className="space-y-3 font-medium text-muted-foreground">
                    <li className="flex gap-2"><span className="text-lego-green font-black text-lg leading-tight">•</span> Neurodiverse (ADHD, Autistic)</li>
                    <li className="flex gap-2"><span className="text-lego-green font-black text-lg leading-tight">•</span> Struggling with Mental Health</li>
                    <li className="flex gap-2"><span className="text-lego-green font-black text-lg leading-tight">•</span> Suffered Trauma</li>
                    <li className="flex gap-2"><span className="text-lego-green font-black text-lg leading-tight">•</span> Low self-confidence</li>
                    <li className="flex gap-2"><span className="text-lego-green font-black text-lg leading-tight">•</span> Feeling like you don't 'fit-in'</li>
                    <li className="flex gap-2"><span className="text-lego-red font-black text-lg leading-tight">•</span> Need a break</li>
                    <li className="flex gap-2"><span className="text-lego-red font-black text-lg leading-tight">•</span> Lowering Anxiety and stress</li>
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
        <div className="absolute inset-0 bg-lego-blue/60 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center text-white px-4"
          >
            <p className="text-2xl md:text-4xl font-black tracking-tight">Everyone deserves to feel like they belong.</p>
          </motion.div>
        </div>
      </section>

      {/* Pathways */}
      <section className="bg-lego-yellow py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-center text-black mb-14 tracking-tighter"
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
                <div className="bg-lego-blue text-white rounded-3xl overflow-hidden h-full flex flex-col cursor-pointer hover:scale-105 hover:-rotate-1 transition-transform duration-300 shadow-xl" data-testid="link-sessions-card">
                  <img src={bricksImg} alt="LEGO bricks" className="w-full h-48 object-cover" />
                  <div className="p-8 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-3xl font-black mb-3">Brick Engaged Sessions</h3>
                      <p className="text-lg opacity-90 mb-6 font-medium">Discover our specialized LEGO-based programmes tailored for different age groups and needs.</p>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-lego-yellow">
                      <span>Learn more</span> <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link href="/foundation">
                <div className="bg-lego-red text-white rounded-3xl overflow-hidden h-full flex flex-col cursor-pointer hover:scale-105 hover:rotate-1 transition-transform duration-300 shadow-xl" data-testid="link-foundation-card">
                  <img src={minifigsImg} alt="LEGO minifigures" className="w-full h-48 object-cover" />
                  <div className="p-8 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-3xl font-black mb-3">Brick Engaged Foundation</h3>
                      <p className="text-lg opacity-90 mb-6 font-medium">Our charitable arm providing fully-funded sessions to neurodivergent children.</p>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-lego-yellow">
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
