import { CategoryHero } from "@/components/category/CategoryHero";
import { OutcomeGrid } from "@/components/category/OutcomeGrid";
import { SessionRhythm } from "@/components/category/SessionRhythm";
import { TrustStrip } from "@/components/category/TrustStrip";
import { FAQ } from "@/components/category/FAQ";
import { CategoryCta } from "@/components/category/CategoryCta";

export default function Therapeutic() {
  return (
    <div className="flex flex-col w-full">
      <CategoryHero
        kicker="Drop-in · donation-based"
        title="Therapeutic Use of LEGO®"
        tagline="Same mindful-building method, tailored for teens and adults. A quiet, non-judgemental hour for respite, regulation, and peer connection — no agenda, no performance."
        facts={[
          { label: "Ages", value: "15+" },
          { label: "Group size", value: "Max 10" },
          { label: "Format", value: "Drop-in · 60 min" },
          { label: "Location", value: "Lane Park Business Centre, Upper Hutt" },
          { label: "Best for", value: "Anxiety · burnout · neurodivergent adults" },
        ]}
        price="Koha"
        priceCadence="$10 suggested"
        primaryCta={{ label: "Send an enquiry", href: "/contact" }}
        secondaryCta={{ label: "Email Dan", href: "mailto:info@brickengaged.org", external: true }}
      />

      <OutcomeGrid
        heading="What people come for"
        intro="Most attendees aren't here for LEGO® specifically — they're here for what an hour of focused, low-pressure hand-work does to a busy mind."
        outcomes={[
          {
            title: "A genuine break from the noise",
            body: "An hour where you don't have to be productive, articulate, or 'on'. Your hands work and your mind quiets — many people describe it as their only real downtime that week.",
          },
          {
            title: "Co-regulation in a shared room",
            body: "You're not alone, but you're not expected to socialise either. The presence of others doing the same gentle thing has its own calming effect — especially for neurodivergent adults.",
          },
          {
            title: "Optional, easy connection",
            body: "Conversation happens when it happens. Many regulars have made friendships organically with people they'd never have met otherwise.",
          },
          {
            title: "Permission to be a beginner",
            body: "No-one is expected to be good. The point is the practice, not the product. People often discover they're more creative than they thought.",
          },
        ]}
      />

      <SessionRhythm
        intro="A predictable, low-demand rhythm. You're welcome to participate as little or as much as feels good."
        steps={[
          { duration: "First 5 min", title: "Arrive at your own pace", body: "Doors open 10 minutes early. Find a seat, pick a tray. No introductions required." },
          { duration: "5–25 min", title: "Settle into a build", body: "Free-build from the open pile, or pick a set. Build alone or alongside — whatever you need today." },
          { duration: "25–55 min", title: "Deep work", body: "The room goes quiet. Most people drop into a focused state. Dan moves around quietly, available if you'd like to chat." },
          { duration: "Last 5 min", title: "Wind down", body: "Casual reflection if you'd like — or just pack down and head out. No pressure to share." },
        ]}
      />

      <TrustStrip
        kicker="Built for adults who need a low-key place to land"
        stats={[
          { value: "Max 10", label: "Per session" },
          { value: "60 min", label: "Drop-in length" },
          { value: "Koha", label: "Donation-based" },
          { value: "No agenda", label: "No performance" },
        ]}
      />

      <FAQ
        items={[
          {
            q: "Is this therapy? Counselling?",
            a: "No. Dan is a LEGO® Master and group facilitator, not a clinician. These sessions are therapeutic in their effect — calming, regulating, connecting — but they're not a substitute for therapy. They sit alongside it well.",
          },
          {
            q: "Do I need a referral?",
            a: "No referral, no diagnosis, no paperwork. Just turn up.",
          },
          {
            q: "I'm autistic / have ADHD / have social anxiety. Will I feel ok here?",
            a: "These sessions were designed with neurodivergent adults in mind. Lighting is gentle, the room is calm, conversation is optional, sensory load is low. Most regulars are neurodivergent in some way.",
          },
          {
            q: "How is this different from doing LEGO® at home?",
            a: "Two things: the room (a calm, low-stim space designed for focus) and the presence of others doing the same. Co-regulation is real — even when you're not talking, just being in a room with quietly focused people changes the experience.",
          },
          {
            q: "What's the koha / donation?",
            a: "$10 is the suggested contribution per session — it keeps the lights on. Pay what you can. If $10 is a stretch this week, come anyway and pay next time, or not at all. The door is the same either way.",
          },
          {
            q: "Can I bring a friend / partner / support person?",
            a: "Yes. Many people come in pairs. There's no extra cost for a support person who isn't building.",
          },
        ]}
      />

      <CategoryCta
        heading="Drop in this week"
        body="Sessions run weekly. Send a quick message to get the upcoming schedule and confirm there's space — capacity is small so a heads-up helps."
        primary={{ label: "Send an enquiry", href: "/contact" }}
        secondary={{ label: "Back to sessions", href: "/sessions" }}
      />
    </div>
  );
}
