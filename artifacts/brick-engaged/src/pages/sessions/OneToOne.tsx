import { motion } from "framer-motion";
import { Sparkles, GraduationCap, Wrench } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/motion";

import { CategoryHero } from "@/components/category/CategoryHero";
import { TrustStrip } from "@/components/category/TrustStrip";
import { FAQ } from "@/components/category/FAQ";
import { CategoryCta } from "@/components/category/CategoryCta";

const PERFECT_FOR = [
  {
    icon: <Sparkles size={22} />,
    title: "Adults who want to build and chat",
    body:
      "A quiet hour of building and conversation. Bring a topic or let it find you — Dan is good company.",
  },
  {
    icon: <GraduationCap size={22} />,
    title: "Kids who want to learn from a LEGO® Master",
    body:
      "Techniques, advanced builds, complex sets — Dan can teach what you want to learn, at your pace.",
  },
  {
    icon: <Wrench size={22} />,
    title: "Anyone with a build project to finish",
    body:
      "An old set with missing instructions. A MoC you've started and stalled on. A complex Icons set to assemble. Bring it in.",
  },
];

export default function OneToOne() {
  return (
    <div className="flex flex-col w-full">
      <CategoryHero
        kicker="By appointment · 1-hour timeslot"
        title="One-to-One"
        tagline="The best way to get all the attention you need. Whether you just want to chat while building, or learn new techniques from LEGO® Masters NZ Finalist Dan, you have it all to yourself."
        facts={[
          { label: "Ages", value: "All ages" },
          { label: "Format", value: "1-hour booked slot" },
          { label: "With", value: "Dan Mulholland — LEGO® Masters NZ S1 Finalist" },
          { label: "Access to", value: "Thousands of sets · tens of thousands of bricks" },
          { label: "Location", value: "Lane Park Business Centre, Upper Hutt" },
        ]}
        primaryCta={{ label: "Send an enquiry", href: "/contact" }}
        secondaryCta={{ label: "Email Dan", href: "mailto:info@brickengaged.org", external: true }}
      />

      {/* Intro / context */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="inline-block bg-lego-orange text-charcoal text-[10px] font-black px-3 py-1 rounded-md mb-4 tracking-[0.14em] uppercase">
              What it is
            </div>
            <h2
              className="text-3xl md:text-4xl font-black text-charcoal tracking-tight mb-5"
              style={{ letterSpacing: "-0.02em" }}
            >
              An hour of focused, undivided LEGO® time.
            </h2>
            <p className="text-base md:text-lg font-medium text-slate-600 leading-relaxed">
              One-to-One sessions are an opportunity to just hang out and build, work on a
              project, or learn from a LEGO® Master. You have access to thousands of sets and
              tens of thousands of bricks and pieces to build with — and Dan's full attention
              for the hour.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Perfect for */}
      <section className="py-16 md:py-24 bg-slate-50">
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
              These sessions are perfect for…
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {PERFECT_FOR.map((p) => (
              <motion.div
                key={p.title}
                variants={fadeInUp}
                className="rounded-2xl border-2 border-slate-200 bg-white p-6 hover:border-slate-300 transition-colors"
              >
                <div className="inline-grid place-items-center w-12 h-12 rounded-xl bg-lego-orange/15 text-charcoal mb-4">
                  {p.icon}
                </div>
                <h3
                  className="text-lg font-black text-charcoal mb-2 leading-snug"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {p.title}
                </h3>
                <p className="text-[15px] font-medium text-slate-600 leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <TrustStrip
        kicker="With"
        stats={[
          { value: "LMNZ S1", label: "LEGO® Masters NZ Finalist" },
          { value: "12+ yrs", label: "Of LEGO® experience" },
          { value: "1 hour", label: "Booked timeslot" },
          { value: "All ages", label: "Welcome" },
        ]}
      />

      <FAQ
        items={[
          {
            q: "How long are the sessions?",
            a: "Sessions are booked for a one-hour timeslot. See the calendar (coming next) for available days and times — or send Dan a message to discuss the slot you're after.",
          },
          {
            q: "What does it cost?",
            a: "Pricing depends on the type of session — chat-and-build, tutoring, or project work. Send a quick note about what you're after and Dan will confirm the cost.",
          },
          {
            q: "Can I bring my own set or project to work on?",
            a: "Absolutely. Bring an old set with missing instructions, a stalled MoC, a complex Icons set — whatever you'd like Dan's help with.",
          },
          {
            q: "Are these sessions just for adults?",
            a: "No — all ages. Plenty of kids book One-to-One sessions to level up their building, learn techniques, or work on something specific. Parents are welcome to stay or step out.",
          },
          {
            q: "How do I book?",
            a: "Send Dan a quick message with what you'd like to do and roughly when. The booking calendar for One-to-One is coming in the next update.",
          },
        ]}
      />

      <CategoryCta
        heading="Tell Dan what you're after"
        body="A chat-and-build, a tutoring session, or help finishing a project — drop a quick note with the rough shape and timing and Dan will sort the details."
        primary={{ label: "Send an enquiry", href: "/contact" }}
        secondary={{ label: "Back to sessions", href: "/sessions" }}
      />
    </div>
  );
}
