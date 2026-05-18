import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Puzzle, Heart, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      <section className="bg-lego-blue text-white py-24 md:py-32 overflow-hidden relative">
        <div className="absolute inset-0 bg-brick-pattern opacity-20 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter"
            >
              Building connections, one brick at a time
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl mb-10 font-medium opacity-90 max-w-2xl leading-relaxed"
            >
              At Brick Engaged, our mission is to build connections, one brick at a time. We believe in the transformative power of play and its ability to create positive, lasting change in the lives of our clients.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link href="/sessions">
                <Button size="lg" className="bg-lego-yellow text-black hover:bg-white text-lg h-14 px-8 rounded-full font-bold">
                  View Sessions
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-lego-blue text-lg h-14 px-8 rounded-full font-bold">
                  Get in Touch
                </Button>
              </Link>
            </motion.div>
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
            <h2 className="text-4xl md:text-5xl font-black text-lego-red mb-4 tracking-tighter">Who can benefit?</h2>
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
                <div className="bg-lego-yellow p-6 flex justify-center items-center">
                  <Puzzle size={48} className="text-black" />
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Children 7-12</h3>
                  <ul className="space-y-3 font-medium text-muted-foreground">
                    <li className="flex gap-2"><span className="text-lego-blue font-bold">•</span> Neurodiverse (ADHD, Autistic)</li>
                    <li className="flex gap-2"><span className="text-lego-blue font-bold">•</span> Home schooled</li>
                    <li className="flex gap-2"><span className="text-lego-blue font-bold">•</span> Struggling with Mental Health</li>
                    <li className="flex gap-2"><span className="text-lego-blue font-bold">•</span> Suffered Trauma</li>
                    <li className="flex gap-2"><span className="text-lego-blue font-bold">•</span> Low self-confidence</li>
                    <li className="flex gap-2"><span className="text-lego-blue font-bold">•</span> Feeling like you don't 'fit-in'</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Teens */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-4 border-lego-orange rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-lego-orange p-6 flex justify-center items-center">
                  <Users size={48} className="text-white" />
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Teens 13-19</h3>
                  <ul className="space-y-3 font-medium text-muted-foreground">
                    <li className="flex gap-2"><span className="text-lego-blue font-bold">•</span> Neurodiverse (ADHD, Autistic)</li>
                    <li className="flex gap-2"><span className="text-lego-blue font-bold">•</span> Home schooled</li>
                    <li className="flex gap-2"><span className="text-lego-blue font-bold">•</span> Struggling with Mental Health</li>
                    <li className="flex gap-2"><span className="text-lego-blue font-bold">•</span> Suffered Trauma</li>
                    <li className="flex gap-2"><span className="text-lego-blue font-bold">•</span> Low self-confidence</li>
                    <li className="flex gap-2"><span className="text-lego-blue font-bold">•</span> Feeling like you don't 'fit-in'</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Adults */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-4 border-lego-green rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-lego-green p-6 flex justify-center items-center">
                  <Heart size={48} className="text-white" />
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Adults</h3>
                  <ul className="space-y-3 font-medium text-muted-foreground">
                    <li className="flex gap-2"><span className="text-lego-blue font-bold">•</span> Neurodiverse (ADHD, Autistic)</li>
                    <li className="flex gap-2"><span className="text-lego-blue font-bold">•</span> Struggling with Mental Health</li>
                    <li className="flex gap-2"><span className="text-lego-blue font-bold">•</span> Suffered Trauma</li>
                    <li className="flex gap-2"><span className="text-lego-blue font-bold">•</span> Low self-confidence</li>
                    <li className="flex gap-2"><span className="text-lego-blue font-bold">•</span> Feeling like you don't 'fit-in'</li>
                    <li className="flex gap-2"><span className="text-lego-red font-bold">•</span> Need a break</li>
                    <li className="flex gap-2"><span className="text-lego-red font-bold">•</span> Lowering Anxiety and stress</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Pathways */}
      <section className="bg-lego-yellow py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            <motion.div variants={fadeInUp}>
              <Link href="/sessions">
                <div className="bg-lego-blue text-white rounded-3xl p-10 h-full flex flex-col justify-between cursor-pointer hover:scale-105 hover:-rotate-1 transition-transform duration-300 shadow-xl">
                  <div>
                    <h3 className="text-3xl font-black mb-4">Brick Engaged Sessions</h3>
                    <p className="text-lg opacity-90 mb-8 font-medium">Discover our specialized LEGO-based programmes tailored for different age groups and needs.</p>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-lego-yellow">
                    <span>Learn more</span> <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link href="/foundation">
                <div className="bg-lego-red text-white rounded-3xl p-10 h-full flex flex-col justify-between cursor-pointer hover:scale-105 hover:rotate-1 transition-transform duration-300 shadow-xl">
                  <div>
                    <h3 className="text-3xl font-black mb-4">Brick Engaged Foundation</h3>
                    <p className="text-lg opacity-90 mb-8 font-medium">Learn about our charitable arm providing fully-funded sessions to neurodivergent children.</p>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-lego-yellow">
                    <span>Learn more</span> <ArrowRight size={20} />
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
