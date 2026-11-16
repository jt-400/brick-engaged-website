import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin } from "lucide-react";
import danImg from "@assets/dan_headshot.webp";
import { useSanityDoc } from "@/lib/useSanityDoc";
import { ABOUT_QUERY } from "@/lib/sanityQueries";

interface AboutBlock {
  _key?: string;
  _type?: string;
  style?: string;
  children?: Array<{ _type?: string; text?: string }>;
}
interface AboutData {
  kicker?: string;
  title?: string;
  subtitle?: string;
  danBio?: AboutBlock[];
  missionHeading?: string;
  missionStatement?: string;
  credentialsHeading?: string;
  credentials?: Array<{ text: string; accent: "orange" | "charcoal" }>;
}

function renderBlock(block: AboutBlock, fallbackKey: string) {
  const text = (block.children ?? []).map((c) => c.text ?? "").join("");
  if (block.style === "blockquote") {
    return (
      <div key={block._key ?? fallbackKey} className="bg-lego-orange/8 border-l-4 border-lego-orange p-6 rounded-r-2xl text-slate-800 my-8">
        <p>{text}</p>
      </div>
    );
  }
  return <p key={block._key ?? fallbackKey}>{text}</p>;
}

export default function About() {
  const { data } = useSanityDoc<AboutData>("aboutPage", ABOUT_QUERY);
  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 pt-20 pb-14 md:pt-28 md:pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-lego-orange text-charcoal text-xs font-black px-4 py-1.5 rounded-lg mb-6 tracking-widest uppercase"
          >
            {data?.kicker ?? "Facilitator"}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-4 tracking-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            {data?.title ?? "About Dan"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-medium text-white/80"
          >
            {data?.subtitle ?? "Daniel Mulholland — Facilitator (He/Him)"}
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Profile section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          <div className="rounded-3xl overflow-hidden shadow-xl border-2 border-slate-200">
            <img
              src={danImg}
              alt="Daniel Mulholland — Brick Engaged Facilitator"
              className="w-full h-80 md:h-full object-cover"
              style={{ objectPosition: "50% 15%" }}
              loading="eager"
              decoding="async"
              data-testid="img-about-dan"
            />
          </div>
          <div className="bg-charcoal text-white rounded-3xl p-8 md:p-10 flex flex-col justify-center shadow-xl">
            <h2 className="text-3xl font-black mb-2 tracking-tight">Daniel Mulholland</h2>
            <p className="text-lego-orange font-bold text-lg mb-6">Facilitator · He/Him</p>
            <div className="space-y-4 text-base font-medium text-white/80">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-lego-orange/20 text-lego-orange shrink-0">
                  <Phone size={16} strokeWidth={2.5} />
                </span>
                <a href="tel:0212700301" className="text-white font-black hover:text-lego-orange transition-colors">
                  021 270 0301
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-lego-orange/20 text-lego-orange shrink-0">
                  <Mail size={16} strokeWidth={2.5} />
                </span>
                <a href="mailto:info@brickengaged.org" className="text-white font-black hover:text-lego-orange transition-colors">
                  info@brickengaged.org
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-lego-orange/20 text-lego-orange shrink-0">
                  <MapPin size={16} strokeWidth={2.5} />
                </span>
                <span className="text-white/80">Lane Park Business Centre, Upper Hutt</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100"
        >
          <h3
            className="text-3xl font-black text-charcoal mb-8 tracking-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            A Bit About Me
          </h3>

          <div className="space-y-6 text-lg text-slate-700 leading-relaxed font-medium">
            {data?.danBio?.length ? (
              data.danBio.map((block, i) => renderBlock(block, `bio-${i}`))
            ) : (
              <>
                <p>
                  I joined the NZ Army as a Medic at 17. When I left the Army, I traveled overseas with
                  my wife before finally settling in Upper Hutt where we started our family and raised
                  our three children. I worked in Emergency Services (Paramedic) and Allied Health
                  (Laboratory) for nearly 20 years. I have gained vast experience in life and social
                  skills, managing people, developing education and communication.
                </p>
                <p>
                  LEGO became an important part of my life again in 2014. My passion for LEGO and
                  sharing the experience of LEGO Play has provided me with many opportunities. I started
                  a LEGO User Group (LUG) in Wellington which is still thriving today (Well-LUG). After
                  five years as the LUG's President, I stepped down to pursue another direction, Content
                  Creation which went on to become New Zealand's only Recognized LEGO Fan Media (RLFM)
                  with Between the Bricks.
                </p>
                <div className="bg-lego-orange/8 border-l-4 border-lego-orange p-6 rounded-r-2xl text-slate-800 my-8">
                  <p>
                    Around the same time as starting Between the Bricks, I had a Mental Health Crisis
                    and was diagnosed with PTSD. LEGO now became part of my therapy and recovery
                    playing a very important role in my rehabilitation. This experience has shaped me
                    and who I am today and the direction I wish to take for the rest of my life.
                  </p>
                </div>
                <p>
                  I started working on the Brick Engaged concept in mid 2021, completing training in
                  LEGO Serious Play®, LEGO-Based Therapy then furthering this in 2022 with
                  Brick-by-Brick® facilitator training. In 2023, to ensure we remain accessible to all
                  children and families no matter their financial situation I formed Brick Engaged
                  Foundation a charity whose sole aim is to seek funding that will enable more children
                  to have access to the service.
                </p>
              </>
            )}

            <div className="mt-8 p-8 bg-charcoal text-white rounded-2xl">
              <h4
                className="text-2xl font-black mb-3 tracking-tight"
                style={{ letterSpacing: '-0.02em' }}
              >
                {data?.missionHeading ?? "Our Mission"}
              </h4>
              <p className="text-xl font-medium text-white/85">
                {data?.missionStatement ?? "Our mission is to facilitate fun, meaningful social interactions, learning and support for Neurodivergent people through building with LEGO® Bricks in a safe and inclusive environment."}
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <h4
                className="text-xl font-black text-charcoal mb-5 tracking-tight"
                style={{ letterSpacing: '-0.02em' }}
              >
                {data?.credentialsHeading ?? "Credentials"}
              </h4>
              <div className="flex flex-wrap gap-3">
                {(data?.credentials?.length ? data.credentials : [
                  { text: "Certified Facilitator — LEGO® SERIOUS PLAY®", accent: "orange" as const },
                  { text: "LEGO-Based Therapy Facilitator Training", accent: "charcoal" as const },
                  { text: "Brick-by-Brick® Programme Foundation Course", accent: "orange" as const },
                ]).map((cred) => (
                  <Badge
                    key={cred.text}
                    variant="outline"
                    className={cred.accent === "charcoal"
                      ? "text-sm py-2 px-4 border-charcoal text-charcoal bg-charcoal/5 rounded-lg font-bold"
                      : "text-sm py-2 px-4 border-lego-orange text-charcoal bg-lego-orange/15 rounded-lg font-bold"}
                  >
                    {cred.text}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
