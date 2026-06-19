import { motion } from "framer-motion";
import { Link } from "wouter";
import { Heart, FileText, Sparkles, HandHeart } from "lucide-react";
import { LegoButton } from "@/components/LegoButton";
import { OutcomeGrid } from "@/components/category/OutcomeGrid";
import { TrustStrip } from "@/components/category/TrustStrip";
import { FAQ } from "@/components/category/FAQ";

const HOW_IT_WORKS = [
  {
    icon: <FileText size={22} />,
    title: "Whānau gets in touch",
    body: "Caregivers (or referring clinicians, teachers, support workers) send a short note describing the child and what they're hoping for.",
  },
  {
    icon: <Sparkles size={22} />,
    title: "Quick fit conversation",
    body: "Dan has a no-pressure chat — usually 15 minutes by phone or email — to understand the child, the family situation, and what a good fit looks like.",
  },
  {
    icon: <HandHeart size={22} />,
    title: "Funded sessions begin",
    body: "When there's a match, the foundation covers the cost of a 10-week Brick Club term, or therapeutic drop-ins, or a holiday day. No family pays.",
  },
  {
    icon: <Heart size={22} />,
    title: "Whānau stays in the loop",
    body: "Brief check-ins partway through and at term end. We follow whether the sessions are landing — and adjust together if they're not.",
  },
];

export default function Foundation() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal text-white">
        <div className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none" />
        <div className="container relative z-10 mx-auto max-w-4xl px-4 pt-20 pb-14 md:pt-28 md:pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-lego-orange text-charcoal text-xs font-black px-4 py-1.5 rounded-lg mb-6 tracking-widest uppercase"
          >
            Charity arm
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black mb-5 tracking-tight leading-[1.02]"
            style={{ letterSpacing: "-0.025em" }}
          >
            Brick Engaged Foundation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-lg md:text-xl font-medium text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            Fully-funded LEGO®-based sessions for neurodivergent tamariki whose whānau couldn't
            otherwise reach them. Apply for a place, refer a family, or help fund a term.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#apply"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <LegoButton variant="orange" data-testid="foundation-apply">Apply for a place</LegoButton>
            </a>
            <a
              href="#donate"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("donate")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <LegoButton variant="white" data-testid="foundation-donate">Help fund a term</LegoButton>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Mission statement */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="w-12 h-1 bg-lego-orange mx-auto mb-6 rounded-full" />
            <blockquote
              className="text-2xl md:text-3xl font-black text-charcoal leading-snug tracking-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              "We believe in the transformative power of play. The Foundation exists so a
              child's access to it isn't decided by their parents' bank balance."
            </blockquote>
            <p className="mt-6 text-base md:text-lg font-medium text-slate-500 leading-relaxed">
              We fund 10-week terms, therapeutic drop-ins, and holiday days for neurodivergent
              children whose families face financial, geographic, or systemic barriers to
              accessing what we do.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Outcomes */}
      <OutcomeGrid
        heading="What funded sessions look like in practice"
        intro="Foundation-funded kids attend the same sessions as everyone else — no separate room, no labels. The funding is invisible. The experience is identical."
        outcomes={[
          {
            title: "Same room, same Dan, same dignity",
            body: "Kids on funded places are folded into existing groups. Other kids don't know who's funded and who isn't. That matters — labels stick.",
          },
          {
            title: "Travel costs covered when needed",
            body: "We can cover petrol or bus fare for families travelling in. Removing the small frictions matters as much as removing the big one.",
          },
          {
            title: "Term-long commitment, not one-off",
            body: "Drop-ins help, but real change comes from showing up every week. We fund full terms so kids get the consistency that makes the difference.",
          },
          {
            title: "Family stays in the loop, not just the child",
            body: "Brief weekly notes home, check-ins partway through, end-of-term debrief. Parents leave informed, not in the dark.",
          },
        ]}
      />

      {/* How it works */}
      <section id="apply" className="bg-slate-50 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="mb-10 max-w-2xl"
          >
            <h2
              className="text-3xl md:text-4xl font-black text-charcoal tracking-tight mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              How to apply
            </h2>
            <p className="text-base md:text-lg font-medium text-slate-500 leading-relaxed">
              Four steps. No long forms. The first conversation costs nothing.
            </p>
          </motion.div>
          <motion.ol
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {HOW_IT_WORKS.map((step, i) => (
              <li
                key={step.title}
                className="rounded-2xl border-2 border-slate-200 bg-white p-6 flex items-start gap-4"
              >
                <div className="shrink-0 grid place-items-center w-11 h-11 rounded-xl bg-lego-orange/20 text-charcoal">
                  {step.icon}
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.14em] text-lego-orange mb-1">
                    Step {i + 1}
                  </div>
                  <h3 className="text-lg font-black text-charcoal mb-1.5 leading-snug" style={{ letterSpacing: "-0.01em" }}>
                    {step.title}
                  </h3>
                  <p className="text-[15px] font-medium text-slate-600 leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </motion.ol>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/contact">
              <LegoButton variant="orange">Start the conversation</LegoButton>
            </Link>
            <a href="mailto:info@brickengaged.org">
              <LegoButton variant="white">Email Dan</LegoButton>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Trust */}
      <TrustStrip
        kicker="The Foundation in numbers"
        stats={[
          { value: "Since 2021", label: "Operating" },
          { value: "Charity", label: "Registered NZ trust" },
          { value: "100%", label: "Of donations fund sessions" },
          { value: "Upper Hutt", label: "Local & in-person" },
        ]}
      />

      {/* Donate */}
      <section id="donate" className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="rounded-3xl bg-lego-orange p-8 md:p-12 text-center"
          >
            <h2
              className="text-3xl md:text-4xl font-black text-charcoal tracking-tight mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              Fund a term
            </h2>
            <p className="text-base md:text-lg font-medium text-charcoal/80 max-w-xl mx-auto mb-8 leading-relaxed">
              $299 funds a full 10-week Brick Club term for one child. $1,500 covers a small
              group for a term. 100% of donations go directly to sessions.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact">
                <LegoButton variant="charcoal">Get in touch about donating</LegoButton>
              </Link>
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-charcoal/60">
              Tax-deductible · NZ-registered charity
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ
        items={[
          {
            q: "Who is the Foundation for?",
            a: "Neurodivergent children — autistic, ADHD, anxious, or otherwise — whose families face barriers (financial, geographic, system-related) to accessing what we do. There's no diagnosis requirement; we look at the family situation alongside the child.",
          },
          {
            q: "Do I need a referral or paperwork?",
            a: "No formal paperwork. A short note from a parent, clinician, teacher, or support worker is plenty. Dan handles intake personally.",
          },
          {
            q: "Are funded kids treated differently in sessions?",
            a: "No. Funding is invisible — other families don't know, the kids don't know. Everyone's in the same group, doing the same thing.",
          },
          {
            q: "How is the Foundation funded?",
            a: "Private donations, occasional grants, and a portion of paid-session revenue. We don't take government funding so we can stay nimble and local.",
          },
          {
            q: "How can I help?",
            a: "Three ways: donate (one-off or recurring), refer a family who'd benefit, or share what we do with your network. All three matter.",
          },
          {
            q: "Where can I see your accounts?",
            a: "Annual returns are filed with the NZ Charities Register and available on request. Send Dan a note — he'll share.",
          },
        ]}
      />
    </div>
  );
}
