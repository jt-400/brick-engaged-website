import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { Boxes, Wand2, Layers } from "lucide-react";

import { CategoryHero } from "@/components/category/CategoryHero";
import { OutcomeGrid } from "@/components/category/OutcomeGrid";
import { TrustStrip } from "@/components/category/TrustStrip";
import { FAQ } from "@/components/category/FAQ";
import { CategoryCta } from "@/components/category/CategoryCta";
import { TermEnrolment } from "@/components/booking/TermEnrolment";
import { MidTermEnquiry } from "@/components/booking/MidTermEnquiry";
import { useSanityDoc } from "@/lib/useSanityDoc";
import { PROGRAMME_QUERY } from "@/lib/sanityQueries";

interface ProgrammeData {
  kicker?: string;
  title?: string;
  subtitle?: string;
  heroPrice?: string;
  heroPriceCadence?: string;
  heroFacts?: Array<{ label: string; value: string }>;
  buildModesHeading?: string;
  buildModesIntro?: string;
  buildModes?: Array<{ iconKey?: string; title: string; body: string }>;
  trustStripKicker?: string;
  trustStripStats?: Array<{ value: string; label: string }>;
  outcomesHeading?: string;
  outcomesIntro?: string;
  outcomes?: Array<{ title: string; body: string }>;
  faqs?: Array<{ q: string; a: string }>;
}

const BUILD_MODE_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  Boxes, Wand2, Layers,
};

const BUILD_MODES = [
  {
    icon: <Boxes size={24} />,
    title: "LEGO® Sets",
    body:
      "Build a set with instructions — from very small to very large. The range is vast: City, Friends, Creator, Minecraft, Monkey Kid, Icons, Star Wars, Harry Potter, and more.",
  },
  {
    icon: <Wand2 size={24} />,
    title: "Free Build / MoC",
    body:
      "From tens of thousands of parts, kids can free-build or make their own creation. Bricks, Technic gears and motors, wheels, windows, minifigures, road plates — whatever they can imagine.",
  },
  {
    icon: <Layers size={24} />,
    title: "Fixed build & play stations",
    body:
      "Low-level (knee-high) build table with mixed elements. Fixed build wall for mosaics and horizontal building. Custom Minecraft build-and-play table. Quiet corner with beanbag chairs for self-centring.",
  },
];

export default function BrickClub() {
  const { data } = useSanityDoc<ProgrammeData>("programme-brick-club", PROGRAMME_QUERY, { slug: "brick-club" });

  const facts = data?.heroFacts?.length ? data.heroFacts : [
    { label: "Ages", value: "7–18" },
    { label: "Group size", value: "Max 8–10" },
    { label: "Format", value: "10-week term · weekly" },
    { label: "Location", value: "Lane Park Business Centre, Upper Hutt" },
    { label: "Well suited to", value: "ADHD · Autistic · Mental health support" },
  ];

  const buildModesData: Array<{ icon: React.ReactNode; title: string; body: string }> = data?.buildModes?.length
    ? data.buildModes.map((m) => {
        const Icon = BUILD_MODE_ICONS[m.iconKey ?? "Boxes"] ?? Boxes;
        return { icon: <Icon size={24} />, title: m.title, body: m.body };
      })
    : BUILD_MODES;

  return (
    <div className="flex flex-col w-full">
      <CategoryHero
        kicker={data?.kicker ?? "Afterschool · 10-week term"}
        title={data?.title ?? "Brick Club"}
        tagline={data?.subtitle ?? "An afterschool programme where kids get to just be themselves — building, learning, and creating their own mini masterpieces in a safe, inclusive group."}
        facts={facts}
        price={data?.heroPrice ?? "$299"}
        priceCadence={data?.heroPriceCadence ?? "10-week term"}
        primaryCta={{ label: "Enrol for next term", anchor: "enrol" }}
        secondaryCta={{ label: "Email Dan", href: "mailto:info@brickengaged.org", external: true }}
      />

      {/* What is on offer */}
      <section className="py-16 md:py-24 bg-white">
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
              {data?.buildModesHeading ?? "What's on offer"}
            </h2>
            <p className="text-base md:text-lg font-medium text-slate-500 leading-relaxed">
              {data?.buildModesIntro ?? "From an extensive quantity of loose LEGO® bricks and pieces to a massive range of LEGO® sets, kids get to choose their project — guided and supported either way."}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {buildModesData.map((m) => (
              <motion.div
                key={m.title}
                variants={fadeInUp}
                className="rounded-2xl border-2 border-slate-200 bg-white p-6 hover:border-slate-300 transition-colors"
              >
                <div className="inline-grid place-items-center w-12 h-12 rounded-xl bg-lego-orange/15 text-charcoal mb-4">
                  {m.icon}
                </div>
                <h3
                  className="text-lg font-black text-charcoal mb-2 leading-snug"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {m.title}
                </h3>
                <p className="text-[15px] font-medium text-slate-600 leading-relaxed">{m.body}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="mt-6 text-sm font-medium text-slate-500 italic"
          >
            Books and other resources are available too — and Dan's constantly adding new
            things to keep the imagination and learning fresh.
          </motion.p>
        </div>
      </section>

      {/* Why */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="inline-block bg-lego-orange text-charcoal text-[10px] font-black px-3 py-1 rounded-md mb-4 tracking-[0.14em] uppercase">
              Why
            </div>
            <h2
              className="text-3xl md:text-4xl font-black text-charcoal tracking-tight mb-5"
              style={{ letterSpacing: "-0.02em" }}
            >
              It takes a village.
            </h2>
            <p className="text-base md:text-lg font-medium text-slate-600 leading-relaxed">
              Neurodiversity — whether it's diagnosed or not — can be challenging. We've taken
              a family-favourite brick, our own passion for LEGO®, and our lived experience of
              life and neurodiversity to create a place where we can be part of the village.
            </p>
            <p className="mt-5 text-base md:text-lg font-medium text-slate-600 leading-relaxed">
              A safe and fun environment with loads of opportunities for learning through play
              — with a particular focus on life and social skills.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How is it helpful — skills outcomes */}
      <OutcomeGrid
        heading={data?.outcomesHeading ?? "How it's helpful"}
        intro={data?.outcomesIntro ?? "Building with LEGO® encourages learning through play and develops cognitive and social skills. Participants are encouraged, guided, and assisted by our experienced LEGO® Play Specialist."}
        outcomes={data?.outcomes?.length ? data.outcomes : [
          { title: "Fine motor skills", body: "Hands-on building, sorting, and connecting fine pieces — every session is a workout for small muscle control." },
          { title: "Problem solving & perseverance", body: "Builds don't always go to plan. Managing frustration and finding a way through is the whole point." },
          { title: "Communication & teamwork", body: "Sharing pieces, negotiating ideas, asking for help, explaining a build — all practised in a small, supported group." },
          { title: "Creativity & self-confidence", body: "Finishing a project no-one helped you with builds a kind of confidence that's hard to fake or fast-forward." },
          { title: "Basic mathematics", body: "Counting pieces, working out symmetry, measuring stud-grids — maths shows up in every build whether kids notice it or not." },
          { title: "Lowering anxiety & stress", body: "The repetitive, tactile, predictable nature of LEGO® play has a measurable calming effect. Many parents notice this most." },
        ]}
      />

      <TrustStrip
        kicker={data?.trustStripKicker ?? "Why parents trust Brick Club"}
        stats={data?.trustStripStats?.length ? data.trustStripStats : [
          { value: "Since 2021", label: "Running in Upper Hutt" },
          { value: "15+ yrs", label: "Dan's serious LEGO® years" },
          { value: "LMNZ S1", label: "LEGO® Master credential" },
          { value: "Max 10", label: "Per group, always" },
        ]}
      />

      <FAQ
        items={data?.faqs?.length ? data.faqs : [
          {
            q: "My child is shy / new to groups. Will they be ok?",
            a: "Yes. Brick Club is built for kids who find groups hard. The size is capped at 8–10, the structure is the same every week, and there's no pressure to perform. Most quieter kids settle in within a few sessions.",
          },
          {
            q: "What if my child doesn't connect with the group?",
            a: "We'll keep an eye on it together. If after a couple of weeks it's not the right fit, Dan will be honest about that — and we'll either find a different group, a 1:1 alternative, or refund the unused weeks.",
          },
          {
            q: "How are kids grouped?",
            a: "By age or age-appropriate needs. Different sessions tend to have kids grouped accordingly — see the calendar for available days and times.",
          },
          {
            q: "Is it just for neurodivergent kids?",
            a: "Brick Club is particularly well suited to kids who love LEGO® and who are ADHD, autistic, or need mental health support or respite. But it works for any kid who loves building and wants a steady, low-pressure group.",
          },
          {
            q: "Can my child bring their own LEGO®?",
            a: "We stick to the club LEGO® during the session — it keeps the sharing dynamic alive and prevents the 'that's mine' tangles. Kids are welcome to bring a small build to show off at the start.",
          },
          {
            q: "How do I enrol?",
            a: "Use the calendar below to see which days and times are open, then book the term. If you'd like to chat first, send Dan a message via the contact form.",
          },
        ]}
      />

      <TermEnrolment
        programme="brick-club"
        programmeTitle="Brick Club"
        priceCents={29900}
        location="Lane Park Business Centre, Upper Hutt"
        termHeading="Term 3 2026 — pick a session"
      />

      <MidTermEnquiry programmeTitle="Brick Club" />

      <CategoryCta
        heading="Want to chat first?"
        body="Happy to talk through your child's situation and confirm Brick Club is the right group before you enrol."
        primary={{ label: "Send an enquiry", href: "/contact" }}
        secondary={{ label: "Back to sessions", href: "/sessions" }}
      />
    </div>
  );
}
