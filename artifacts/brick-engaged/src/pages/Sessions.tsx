import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import kidsImg from "@assets/lego_kids.webp";
import handsImg from "@assets/lego_hands.webp";
import therapyImg from "@assets/lego_therapy.webp";
import bricksImg from "@assets/lego_bricks_close.webp";

const PROGRAMMES = [
  {
    href: "/sessions/brick-club",
    image: kidsImg,
    alt: "Children doing Brick Club",
    chip: { label: "Ages 7–18", bg: "bg-emerald-100", text: "text-emerald-900" },
    title: "Brick Club",
    summary:
      "Afterschool programme where kids build, learn, and create their own mini masterpieces. Particularly well suited to neurodivergent kids who love LEGO®.",
    facts: ["10-week term", "$299", "Max 8–10 kids"],
  },
  {
    href: "/sessions/home-schoolers",
    image: handsImg,
    alt: "Hands building with LEGO",
    chip: { label: "Mixed ages", bg: "bg-amber-100", text: "text-amber-900" },
    title: "Home schoolers sessions",
    summary:
      "Explore learning through the practical application of LEGO® building and play. Maths, sciences, arts, environment — built, shared, refined.",
    facts: ["10-week term · 2 hours weekly", "$150", "Min 5 · Max 12"],
  },
  {
    href: "/sessions/peer-to-peer",
    image: therapyImg,
    alt: "Adults building LEGO together",
    chip: { label: "18+", bg: "bg-sky-100", text: "text-sky-900" },
    title: "Peer-to-Peer Support",
    summary:
      "A casual way to relax and be mindful while building with LEGO® and talking with other like-minded people about whatever comes up.",
    facts: ["3 weekly groups · 2 hours", "Koha ($10 suggested)", "Max 10"],
  },
  {
    href: "/sessions/one-to-one",
    image: bricksImg,
    alt: "LEGO bricks close-up",
    chip: { label: "All ages", bg: "bg-rose-100", text: "text-rose-900" },
    title: "One-to-One",
    summary:
      "The best way to get all the attention you need. Chat-and-build, learn techniques from a LEGO® Master, or finish a project — you have it all to yourself.",
    facts: ["1-hour booked timeslot", "By appointment", "Adults & kids"],
  },
];

export default function Sessions() {
  return (
    <div className="flex flex-col w-full pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal text-white">
        <div className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none" />
        <div className="container relative z-10 mx-auto max-w-4xl px-4 pt-20 pb-14 md:pt-28 md:pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-lego-orange text-charcoal text-xs font-black px-4 py-1.5 rounded-lg mb-6 tracking-widest uppercase"
          >
            Weekly sessions
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6 tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Four programmes. One brick-built rhythm.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl font-medium text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            Pick the programme that fits your stage — kids, home-schooled crew, or quiet teens
            and adults. Tap any tile for the full breakdown of what it is, who it's for, and
            what a session looks like.
          </motion.p>
        </div>
      </section>

      {/* Chooser */}
      <section className="container mx-auto max-w-6xl px-4 mt-12 md:mt-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6"
        >
          {PROGRAMMES.map((p) => (
            <motion.div key={p.href} variants={fadeInUp}>
              <Link href={p.href}>
                <div className="group h-full overflow-hidden rounded-3xl bg-white border-2 border-slate-200 cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.alt}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className={`absolute top-4 left-4 ${p.chip.bg} ${p.chip.text} text-[10px] font-black uppercase tracking-[0.14em] px-2.5 py-1 rounded`}>
                      {p.chip.label}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h2 className="text-2xl font-black text-charcoal mb-3 tracking-tight" style={{ letterSpacing: "-0.01em" }}>
                      {p.title}
                    </h2>
                    <p className="text-[15px] font-medium text-slate-600 mb-5 leading-relaxed">
                      {p.summary}
                    </p>
                    <ul className="space-y-1.5 mb-6 text-xs font-bold uppercase tracking-wider text-slate-500">
                      {p.facts.map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <span className="inline-block w-1.5 h-1.5 rounded-sm bg-lego-orange" /> {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-charcoal">
                      <span>Explore programme</span>
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Bottom helper */}
      <section className="container mx-auto max-w-3xl px-4 mt-16 md:mt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="rounded-3xl border-2 border-slate-200 bg-slate-50 p-8 md:p-10"
        >
          <p className="text-xs font-black uppercase tracking-[0.13em] text-slate-500 mb-2">
            Not sure which one?
          </p>
          <h3 className="text-2xl md:text-3xl font-black text-charcoal mb-3 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            Send Dan a quick message — he'll point you to the right fit.
          </h3>
          <p className="text-base font-medium text-slate-600 mb-6 leading-relaxed">
            Most parents land here unsure whether Brick Club or Home schoolers is right, or
            whether their teen would benefit from the therapeutic group. Dan replies within a
            day or two with a steer.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact">
              <button className="px-5 py-3 rounded-lg bg-charcoal text-white font-black text-xs uppercase tracking-[0.12em] hover:bg-lego-orange hover:text-charcoal transition-colors">
                Get in touch
              </button>
            </Link>
            <Link href="/about">
              <button className="px-5 py-3 rounded-lg border-2 border-slate-300 text-charcoal font-black text-xs uppercase tracking-[0.12em] hover:border-charcoal transition-colors">
                Meet Dan first
              </button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
