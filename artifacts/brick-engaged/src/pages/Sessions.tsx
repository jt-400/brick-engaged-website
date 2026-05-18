import { motion } from "framer-motion";
import { Puzzle, ArrowRight, Mail } from "lucide-react";
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

export default function Sessions() {
  return (
    <div className="flex flex-col w-full pb-24">
      <section className="bg-lego-orange text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-brick-pattern opacity-20 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6 tracking-tighter"
          >
            Brick Engaged Sessions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-medium"
          >
            Therapeutic and mindful LEGO® building programmes
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-16 max-w-4xl">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-12"
        >
          {/* Programme 1 */}
          <motion.div variants={fadeInUp} className="bg-white border-4 border-lego-blue rounded-3xl p-8 md:p-10 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-lego-blue text-white p-3 rounded-xl">
                <Puzzle size={32} />
              </div>
              <h2 className="text-3xl font-black text-lego-blue">Brick-by-Brick® Programme</h2>
            </div>
            
            <div className="space-y-4 text-lg text-muted-foreground font-medium mb-8">
              <p>Young people collaborate together to build LEGO® models — making friends and developing skills all whilst having fun.</p>
              <p>Children work together to collaborate, communicate, problem-solve and share fun experiences all through collaborative LEGO® play.</p>
              <div className="bg-slate-50 p-4 rounded-xl text-slate-800 space-y-2 mt-6">
                <p><strong>Location:</strong> Lane Park Business Centre room OR in your school</p>
                <p><strong>Group size:</strong> Minimum 2, optimal in groups of 3</p>
                <p><strong>Ages:</strong> 7-13</p>
                <p><strong>Pricing:</strong> $250 per term (adjusted for public holidays)</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
              <Button size="lg" className="bg-lego-blue hover:bg-lego-blue/90 text-white rounded-full font-bold h-12 px-6">
                Enrolment Form
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-slate-300 text-slate-700 hover:border-lego-blue hover:text-lego-blue rounded-full font-bold h-12 px-6">
                <Mail className="mr-2" size={18} /> Email Us
              </Button>
            </div>
          </motion.div>

          {/* Programme 2 */}
          <motion.div variants={fadeInUp} className="bg-white border-4 border-lego-green rounded-3xl p-8 md:p-10 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-lego-green text-white p-3 rounded-xl">
                <Puzzle size={32} />
              </div>
              <h2 className="text-3xl font-black text-lego-green">Mindful Building Sessions</h2>
            </div>
            
            <div className="space-y-4 text-lg text-muted-foreground font-medium mb-8">
              <p>Small groups up to five participants. Free building from a pile of bricks or building LEGO® sets with instructions.</p>
              <p><strong>Develops:</strong> Fine motor skills, Problem solving, Sense of Accomplishment, Basic Mathematics, Communication, Teamwork, Creativity, Perseverance and Management of Frustrations, Self-Confidence, Lowering Anxiety and Stress.</p>
              <div className="bg-slate-50 p-4 rounded-xl text-slate-800 space-y-2 mt-6">
                <p><strong>Location:</strong> Lane Park Business Centre OR in your school</p>
                <p><strong>Ages:</strong> 7-14</p>
                <p><strong>Pricing:</strong> $250 per term</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
              <Button size="lg" className="bg-lego-green hover:bg-lego-green/90 text-white rounded-full font-bold h-12 px-6">
                Enrolment Form
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-slate-300 text-slate-700 hover:border-lego-green hover:text-lego-green rounded-full font-bold h-12 px-6">
                <Mail className="mr-2" size={18} /> Email Us
              </Button>
            </div>
          </motion.div>

          {/* Programme 3 */}
          <motion.div variants={fadeInUp} className="bg-white border-4 border-lego-yellow rounded-3xl p-8 md:p-10 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-lego-yellow text-black p-3 rounded-xl">
                <Puzzle size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Therapeutic Use of LEGO®</h2>
            </div>
            
            <div className="space-y-4 text-lg text-muted-foreground font-medium mb-8">
              <p>Same methods as Mindful Building but for teenagers and adults. Focus on respite, mental health and peer to peer support.</p>
              <div className="bg-slate-50 p-4 rounded-xl text-slate-800 space-y-2 mt-6">
                <p><strong>Group size:</strong> Small groups (max 5) or one-to-one</p>
                <p><strong>Ages:</strong> 15+</p>
                <p><strong>Pricing:</strong> $25 per session OR $225 ten trip</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold h-12 px-6">
                Enrolment Form
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-slate-300 text-slate-700 hover:border-slate-900 hover:text-slate-900 rounded-full font-bold h-12 px-6">
                <Mail className="mr-2" size={18} /> Email Us
              </Button>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
