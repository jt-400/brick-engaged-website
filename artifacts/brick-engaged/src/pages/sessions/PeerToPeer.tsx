import { motion } from "framer-motion";
import { Coffee, BookOpen, Box } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/motion";

import { CategoryHero } from "@/components/category/CategoryHero";
import { OutcomeGrid } from "@/components/category/OutcomeGrid";
import { TrustStrip } from "@/components/category/TrustStrip";
import { FAQ } from "@/components/category/FAQ";
import { CategoryCta } from "@/components/category/CategoryCta";
import { PeerToPeerBooking } from "@/components/booking/PeerToPeerBooking";

const GROUPS = [
  {
    day: "Monday",
    name: "Men's Group",
    time: "6:30 – 8:30pm",
    accent: "bg-sky-100 text-sky-900",
  },
  {
    day: "Tuesday",
    name: "Couples Group",
    time: "6:30 – 8:30pm",
    accent: "bg-rose-100 text-rose-900",
  },
  {
    day: "Wednesday",
    name: "Women's Group",
    time: "6:30 – 8:30pm",
    accent: "bg-emerald-100 text-emerald-900",
  },
];

const PARTICIPATION_OPTIONS = [
  {
    icon: <BookOpen size={20} />,
    title: "Build with instructions",
    body: "Choose a theme · choose the set · build · take pictures · admire/play · dismantle back into numbered bags.",
  },
  {
    icon: <Box size={20} />,
    title: "Build a MoC",
    body: "Hatch an idea · find the parts · build · refine and polish · take pics · dismantle and return parts to drawers.",
  },
  {
    icon: <Coffee size={20} />,
    title: "Sort, unbuild, or BYO",
    body: "Bring your own sets from home. Or unbuild — there are always sets that need to be returned to their numbered bags. Or sort by colour or type if that's your thing.",
  },
];

export default function PeerToPeer() {
  return (
    <div className="flex flex-col w-full">
      <CategoryHero
        kicker="Drop-in · 2-hour sessions"
        title="Peer-to-Peer Support"
        tagline="A casual way to relax and be mindful while building with LEGO® and talking with other like-minded people about whatever comes up."
        facts={[
          { label: "Ages", value: "18+" },
          { label: "Group size", value: "Max 10" },
          { label: "Format", value: "Drop-in · 2 hours · weekly" },
          { label: "Donation", value: "$10 suggested · tap-to-pay" },
          { label: "Location", value: "Lane Park Business Centre, Upper Hutt" },
        ]}
        primaryCta={{ label: "Book a session", anchor: "book" }}
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
              Informal. Easy-going. Social if you want it to be.
            </h2>
            <div className="space-y-4 text-base md:text-lg font-medium text-slate-600 leading-relaxed">
              <p>
                Peer-to-Peer support sessions are designed to be informal and social, where you
                can come to the Brick Engaged LEGO® space and participate at whatever level
                feels appropriate.
              </p>
              <p>
                <strong className="text-charcoal">There is no expectation to discuss
                anything you don't want to.</strong> Anything shared during any Peer-to-Peer
                session is treated as confidential unless otherwise stated.
              </p>
              <p>Respect others. Respect the LEGO®. Respect the space.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The three groups */}
      <section id="groups" className="py-16 md:py-24 bg-slate-50">
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
              Three groups, three nights
            </h2>
            <p className="text-base md:text-lg font-medium text-slate-500 leading-relaxed">
              All three groups run weekly during term time. Drop in for the full two hours or
              just part of it — but please book or let us know, as group size is limited.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {GROUPS.map((g) => (
              <motion.div
                key={g.name}
                variants={fadeInUp}
                className="rounded-2xl border-2 border-slate-200 bg-white p-6 hover:border-slate-300 transition-colors"
              >
                <div className={`inline-block text-[10px] font-black uppercase tracking-[0.14em] px-2.5 py-1 rounded ${g.accent} mb-4`}>
                  {g.day}
                </div>
                <h3
                  className="text-xl font-black text-charcoal mb-1.5 leading-snug"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {g.name}
                </h3>
                <p className="text-sm font-bold text-slate-500 mb-4">{g.time}</p>
                <p className="text-[15px] font-medium text-slate-600 leading-relaxed">
                  Max 10 people. Drop in for some or all of the two hours. Booking required so
                  we know to expect you.
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Inline booking — pick group → pick night → register */}
      <PeerToPeerBooking />

      {/* Participation options */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="mb-10 max-w-2xl"
          >
            <div className="inline-block bg-lego-orange text-charcoal text-[10px] font-black px-3 py-1 rounded-md mb-4 tracking-[0.14em] uppercase">
              What you can do
            </div>
            <h2
              className="text-3xl md:text-4xl font-black text-charcoal tracking-tight mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              As much or as little as you like.
            </h2>
            <p className="text-base md:text-lg font-medium text-slate-500 leading-relaxed">
              It's up to you. A few ways people use the time:
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PARTICIPATION_OPTIONS.map((o) => (
              <div
                key={o.title}
                className="rounded-2xl border-2 border-slate-200 bg-white p-6"
              >
                <div className="inline-grid place-items-center w-10 h-10 rounded-lg bg-lego-orange/15 text-charcoal mb-3">
                  {o.icon}
                </div>
                <h3
                  className="text-lg font-black text-charcoal mb-2 leading-snug"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {o.title}
                </h3>
                <p className="text-[15px] font-medium text-slate-600 leading-relaxed">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refreshments */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="rounded-2xl border-2 border-slate-200 bg-white p-6 md:p-8"
          >
            <div className="flex items-start gap-3 mb-4">
              <Coffee size={22} className="text-lego-orange shrink-0" />
              <h3
                className="text-2xl font-black text-charcoal tracking-tight"
                style={{ letterSpacing: "-0.01em" }}
              >
                Refreshments
              </h3>
            </div>
            <ul className="space-y-2.5 text-[15px] font-medium text-slate-600">
              <li className="flex justify-between gap-3 border-b border-slate-100 pb-2.5">
                <span>Cans / soda / pop in the fridge</span>
                <span className="font-bold text-charcoal shrink-0">$2 each</span>
              </li>
              <li className="flex justify-between gap-3 border-b border-slate-100 pb-2.5">
                <span>Bottled water (cold or room temp)</span>
                <span className="font-bold text-charcoal shrink-0">$1 each</span>
              </li>
              <li className="flex justify-between gap-3 border-b border-slate-100 pb-2.5">
                <span>Coffee · tea · hot chocolate · single-flavour sachets</span>
                <span className="font-bold text-charcoal shrink-0">Included in donation</span>
              </li>
              <li className="text-sm italic text-slate-500 pt-2">
                Feel free to BYO snacks or drinks — please make sure hands are clean when
                handling the LEGO®.
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Outcomes */}
      <OutcomeGrid
        heading="What people come for"
        intro="Most attendees aren't here for the LEGO® specifically — they're here for what an evening of focused, low-pressure hand-work does to a busy mind, in a room with like-minded people."
        outcomes={[
          {
            title: "A genuine break from the noise",
            body: "Two hours where you don't have to be productive, articulate, or 'on'. Your hands work and your mind quiets — many people describe it as their only real downtime that week.",
          },
          {
            title: "Co-regulation in a shared room",
            body: "You're not alone, but you're not expected to socialise either. The presence of others doing the same gentle thing has its own calming effect.",
          },
          {
            title: "Optional, easy connection",
            body: "Conversation happens when it happens. Many regulars have made friendships with people they'd never have met otherwise.",
          },
          {
            title: "Permission to be a beginner",
            body: "No-one is expected to be good. The point is the practice, not the product. People often discover they're more creative than they thought.",
          },
        ]}
      />

      <TrustStrip
        kicker="The format that works"
        stats={[
          { value: "Max 10", label: "Per session" },
          { value: "2 hrs", label: "Drop in any time" },
          { value: "$10 koha", label: "Suggested · pay what you can" },
          { value: "Tap to pay", label: "Or BYO snacks" },
        ]}
      />

      <FAQ
        items={[
          {
            q: "Is this therapy or counselling?",
            a: "No. Dan is a LEGO® Master and group facilitator, not a clinician. These sessions are therapeutic in their effect — calming, regulating, connecting — but they're not a substitute for therapy. They sit alongside it well.",
          },
          {
            q: "Do I need a referral?",
            a: "No referral, no diagnosis, no paperwork. Just book and turn up.",
          },
          {
            q: "Do I have to talk?",
            a: "No expectation at all. Anything shared during a session is treated as confidential unless you say otherwise. Plenty of people come and barely speak — that's completely fine.",
          },
          {
            q: "Can I come for part of the night?",
            a: "Yes. The session runs two hours but you're welcome to come for some of it. Just please book or let us know, because group size is capped at 10 and others may be on the wait list.",
          },
          {
            q: "What's the donation actually for?",
            a: "Donations go towards the coffee bar, rent, and running costs. $10 is the suggested contribution — pay what you can. Tap-to-pay is available on the night.",
          },
          {
            q: "Can I bring my own LEGO® / sets / projects?",
            a: "Yes, all of the above. Bring sets to build, build a MoC, sort pieces, or just chat. Some people come specifically to dismantle our sets back into numbered bags — there's always a backlog.",
          },
        ]}
      />

      <CategoryCta
        heading="Pick a night and we'll save you a spot"
        body="Send a quick note with which group fits — Men's (Mon), Couples (Tue), or Women's (Wed). Dan will confirm a spot and the address details."
        primary={{ label: "Send an enquiry", href: "/contact" }}
        secondary={{ label: "Back to sessions", href: "/sessions" }}
      />
    </div>
  );
}
