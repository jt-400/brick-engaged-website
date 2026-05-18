import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import kidsImg from "@assets/lego_kids.png";
import handsImg from "@assets/lego_hands.png";
import therapyImg from "@assets/lego_therapy.png";
import heroImg from "@assets/lego_bricks_close.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Sessions() {
  return (
    <div className="flex flex-col w-full pb-24">
      <section className="bg-lego-orange text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-brick-pattern opacity-20 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 py-20 text-center max-w-3xl">
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
            Therapeutic and mindful LEGO® building programmes for all ages
          </motion.p>
        </div>
        <div className="h-56 overflow-hidden">
          <img src={heroImg} alt="LEGO bricks" className="w-full h-full object-cover opacity-60" />
        </div>
      </section>

      <div className="container mx-auto px-4 mt-16 max-w-5xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-16"
        >
          {/* Programme 1 */}
          <motion.div variants={fadeInUp} className="bg-white border-4 border-lego-blue rounded-3xl overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <img
                src={kidsImg}
                alt="Children doing Brick-by-Brick programme"
                className="w-full h-64 md:h-full object-cover"
                data-testid="img-brick-by-brick"
              />
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="bg-lego-blue text-white p-2 rounded-xl text-xs font-black px-3 py-1">Ages 7-13</div>
                </div>
                <h2 className="text-3xl font-black text-lego-blue mb-4 tracking-tight">Brick-by-Brick® Programme</h2>

                <div className="space-y-3 text-base text-muted-foreground font-medium mb-6">
                  <p>Young people collaborate together to build LEGO® models — making friends and developing skills all whilst having fun.</p>
                  <p>Children work together to collaborate, communicate, problem-solve and share fun experiences all through collaborative LEGO® play.</p>
                </div>

                <div className="bg-lego-blue/5 border border-lego-blue/20 p-4 rounded-2xl text-sm space-y-1.5 mb-6 font-medium">
                  <p><span className="font-bold text-lego-blue">Location:</span> Lane Park Business Centre or your school</p>
                  <p><span className="font-bold text-lego-blue">Group size:</span> Min 2, optimal in groups of 3</p>
                  <p><span className="font-bold text-lego-blue">Price:</span> $250 per term</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="bg-lego-blue hover:bg-lego-blue/90 text-white rounded-full font-bold h-11 px-6" data-testid="button-enrol-bbk">
                    Enrolment Form
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-lego-blue text-lego-blue rounded-full font-bold h-11 px-6" data-testid="button-email-bbk">
                    <Mail className="mr-2" size={16} /> Email Us
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Programme 2 */}
          <motion.div variants={fadeInUp} className="bg-white border-4 border-lego-green rounded-3xl overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-10 order-2 md:order-1">
                <div className="flex items-center gap-3 mb-5">
                  <div className="bg-lego-green text-white p-2 rounded-xl text-xs font-black px-3 py-1">Ages 7-14</div>
                </div>
                <h2 className="text-3xl font-black text-lego-green mb-4 tracking-tight">Mindful Building Sessions</h2>

                <div className="space-y-3 text-base text-muted-foreground font-medium mb-4">
                  <p>Small groups up to five participants. Free building from a pile of bricks or LEGO® sets.</p>
                </div>

                <div className="mb-5">
                  <p className="font-bold text-sm text-slate-800 mb-2">Skills developed:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Fine motor skills", "Problem solving", "Communication", "Teamwork", "Creativity", "Self-Confidence", "Lowering Anxiety"].map(skill => (
                      <span key={skill} className="bg-lego-green/10 text-lego-green border border-lego-green/30 rounded-full text-xs font-bold px-3 py-1">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-lego-green/5 border border-lego-green/20 p-4 rounded-2xl text-sm space-y-1.5 mb-6 font-medium">
                  <p><span className="font-bold text-lego-green">Location:</span> Lane Park Business Centre or your school</p>
                  <p><span className="font-bold text-lego-green">Price:</span> $250 per term</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="bg-lego-green hover:bg-lego-green/90 text-white rounded-full font-bold h-11 px-6" data-testid="button-enrol-mindful">
                    Enrolment Form
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-lego-green text-lego-green rounded-full font-bold h-11 px-6" data-testid="button-email-mindful">
                    <Mail className="mr-2" size={16} /> Email Us
                  </Button>
                </div>
              </div>
              <img
                src={handsImg}
                alt="Child building with LEGO mindfully"
                className="w-full h-64 md:h-full object-cover order-1 md:order-2"
                data-testid="img-mindful-building"
              />
            </div>
          </motion.div>

          {/* Programme 3 */}
          <motion.div variants={fadeInUp} className="bg-white border-4 border-lego-yellow rounded-3xl overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <img
                src={therapyImg}
                alt="Adult building LEGO therapeutically"
                className="w-full h-64 md:h-full object-cover"
                data-testid="img-therapeutic"
              />
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="bg-lego-yellow text-black p-2 rounded-xl text-xs font-black px-3 py-1">Ages 15+</div>
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Therapeutic Use of LEGO®</h2>

                <div className="space-y-3 text-base text-muted-foreground font-medium mb-6">
                  <p>Same methods as Mindful Building but tailored for teenagers and adults, with a focus on respite, mental health and peer to peer support.</p>
                  <p>Available in small groups (max 5) or one-to-one sessions.</p>
                </div>

                <div className="bg-lego-yellow/10 border border-lego-yellow/40 p-4 rounded-2xl text-sm space-y-1.5 mb-6 font-medium">
                  <p><span className="font-bold text-slate-900">Single session:</span> $25</p>
                  <p><span className="font-bold text-slate-900">Ten trip:</span> $225</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold h-11 px-6" data-testid="button-enrol-therapeutic">
                    Enrolment Form
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-slate-400 text-slate-700 rounded-full font-bold h-11 px-6" data-testid="button-email-therapeutic">
                    <Mail className="mr-2" size={16} /> Email Us
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
