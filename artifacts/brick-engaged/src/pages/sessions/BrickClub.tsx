import { CategoryHero } from "@/components/category/CategoryHero";
import { OutcomeGrid } from "@/components/category/OutcomeGrid";
import { SessionRhythm } from "@/components/category/SessionRhythm";
import { TrustStrip } from "@/components/category/TrustStrip";
import { FAQ } from "@/components/category/FAQ";
import { CategoryCta } from "@/components/category/CategoryCta";
import { TermEnrolment } from "@/components/booking/TermEnrolment";

export default function BrickClub() {
  return (
    <div className="flex flex-col w-full">
      <CategoryHero
        kicker="Weekly · 10-week term"
        title="Brick Club"
        tagline="A small group of kids building LEGO® models together every week — making friends, finding their rhythm, and quietly building confidence one brick at a time."
        facts={[
          { label: "Ages", value: "7–13" },
          { label: "Group size", value: "Up to 10" },
          { label: "Format", value: "10-week term · weekly" },
          { label: "Location", value: "Lane Park Business Centre, Upper Hutt" },
          { label: "Suited to", value: "ADHD · Autistic · social-skills focus" },
        ]}
        price="$299"
        priceCadence="10-week term"
        primaryCta={{ label: "Enrol for next term", anchor: "enrol" }}
        secondaryCta={{ label: "Email Dan", href: "mailto:info@brickengaged.org", external: true }}
      />

      <OutcomeGrid
        heading="What kids and whānau take away"
        intro="Brick Club isn't a class — it's a steady, low-pressure group where kids learn to be themselves around peers. After a term we hear the same things from parents:"
        outcomes={[
          {
            title: "More comfortable in group settings",
            body: "Kids who usually find groups overwhelming start to relax in ours — the predictable structure and small size let them join in without performing.",
          },
          {
            title: "Better communication with peers",
            body: "Negotiating who builds what, sharing pieces, asking for help — Brick Club is communication practice disguised as play.",
          },
          {
            title: "A weekly anchor in the week",
            body: "Something to look forward to. Kids leave proud of what they built and excited to come back. Parents notice the difference at home.",
          },
          {
            title: "New friendships that travel home",
            body: "Many Brick Club kids stay in touch outside sessions — playdates, birthday invites, LEGO swaps. The group becomes a tribe.",
          },
        ]}
      />

      <SessionRhythm
        steps={[
          { duration: "First 10 min", title: "Settle in", body: "Kids arrive, find their seat, get a quick chat with Dan. No pressure — some join in straight away, some take ten minutes to warm up." },
          { duration: "10–25 min", title: "Today's challenge", body: "Dan introduces a build prompt or theme. Could be a vehicle, a dream room, a vending machine — whatever sparks the group." },
          { duration: "25–55 min", title: "Build time", body: "Kids work side-by-side, ask each other for pieces, riff off each other's ideas. Dan moves around supporting, asking questions, never directing." },
          { duration: "Last 5 min", title: "Show & pack", body: "Quick gallery walk — each kid shares one thing they made. Pack down together. Kids leave proud of what they built." },
        ]}
      />

      <TrustStrip
        kicker="Why parents trust Brick Club"
        stats={[
          { value: "Since 2021", label: "Running in Upper Hutt" },
          { value: "12+ yrs", label: "Dan's LEGO® experience" },
          { value: "LMNZ S1", label: "LEGO® Master credential" },
          { value: "Max 10", label: "Per group, always" },
        ]}
      />

      <FAQ
        items={[
          {
            q: "My child is shy / new to groups. Will they be ok?",
            a: "Yes. Brick Club is built for kids who find groups hard. The size is capped at 10, the structure is the same every week, and there's no pressure to perform. Most quiet kids settle in by week three.",
          },
          {
            q: "What if my child doesn't connect with the group?",
            a: "We'll keep an eye on it together. If after a couple of weeks it's not the right fit, Dan will be honest about that — and we'll either find a different group, a 1:1 alternative, or refund the unused weeks.",
          },
          {
            q: "Is this a LEGO® class — do you teach them building?",
            a: "Not really. Brick Club is about the kids more than the bricks. Dan introduces gentle prompts and themes, but the kids drive what they build. The LEGO® is the excuse for the real work: confidence, communication, connection.",
          },
          {
            q: "How are disagreements handled?",
            a: "Calmly and out loud. When two kids want the same piece, Dan slows the moment down and walks them through asking, offering, and compromise. It's modelled, not enforced — and kids get a lot of practice.",
          },
          {
            q: "Can my child bring their own LEGO®?",
            a: "We stick to the club LEGO® during the session — it keeps the sharing dynamic alive and prevents the 'that's mine' tangles. But kids are welcome to bring a small build to show off at the start.",
          },
          {
            q: "How do I enrol?",
            a: "Send Dan a quick message via the contact form or email — he'll let you know which term has space and whether the group is the right age/fit. Payment is for the full term once you're in.",
          },
        ]}
      />

      <TermEnrolment
        programme="brick-club"
        programmeTitle="Brick Club"
        priceCents={29900}
        location="Lane Park Business Centre, Upper Hutt"
        termLabel="Term 3 2026 · weekly Tuesdays 4:00–5:30pm"
        schedule="10 weekly sessions · Tuesdays 4:00–5:30pm"
      />

      <CategoryCta
        heading="Not sure if it's the right fit?"
        body="Send Dan a quick note before you enrol — happy to chat through your child's situation and confirm Brick Club is the right group."
        primary={{ label: "Send an enquiry", href: "/contact" }}
        secondary={{ label: "Back to sessions", href: "/sessions" }}
      />
    </div>
  );
}
