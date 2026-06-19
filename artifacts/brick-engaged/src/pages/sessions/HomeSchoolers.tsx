import { CategoryHero } from "@/components/category/CategoryHero";
import { OutcomeGrid } from "@/components/category/OutcomeGrid";
import { SessionRhythm } from "@/components/category/SessionRhythm";
import { TrustStrip } from "@/components/category/TrustStrip";
import { FAQ } from "@/components/category/FAQ";
import { CategoryCta } from "@/components/category/CategoryCta";
import { TermEnrolment } from "@/components/booking/TermEnrolment";

export default function HomeSchoolers() {
  return (
    <div className="flex flex-col w-full">
      <CategoryHero
        kicker="Weekly · 10-week term"
        title="Home schoolers sessions"
        tagline="A weekly LEGO®-based group built around curriculum threads — maths, physics, environment, arts — alongside the social practice home-schooled kids don't always get from a single co-op."
        facts={[
          { label: "Group size", value: "Min 5 · Max 12" },
          { label: "Format", value: "10-week term · weekly" },
          { label: "Themes", value: "Maths · Science · Physics · STEAM · Arts" },
          { label: "Location", value: "Lane Park Business Centre, Upper Hutt" },
          { label: "Best for", value: "Mixed-age home-school groups" },
        ]}
        price="$150"
        priceCadence="10-week term"
        primaryCta={{ label: "Enrol for next term", anchor: "enrol" }}
        secondaryCta={{ label: "Email Dan", href: "mailto:info@brickengaged.org", external: true }}
      />

      <OutcomeGrid
        heading="What home-school families take away"
        intro="Designed around curriculum threads home-schoolers already cover — but built for the social layer that's harder to engineer at home."
        outcomes={[
          {
            title: "Curriculum that sticks because they built it",
            body: "Pulleys, gear ratios, forces, structures, ecosystems — kids learn a concept by building it, then explaining their build to the group. They remember it next week.",
          },
          {
            title: "Mixed-age groups that actually work",
            body: "Older kids mentor younger ones. Younger kids stretch. The group dynamic mirrors a small village, which is how most learning happens outside school anyway.",
          },
          {
            title: "Weekly social practice in a safe group",
            body: "For families whose week is otherwise individual learning, a steady weekly group gives kids consistent peer time — same faces, same time, every week.",
          },
          {
            title: "A break for the home educator",
            body: "Two and a half hours of structured, supervised learning that's not on you. Many parents use the time for their own deep work, errands, or coffee with another parent.",
          },
        ]}
      />

      <SessionRhythm
        steps={[
          { duration: "First 10 min", title: "Today's theme", body: "Dan introduces the curriculum thread — e.g. 'forces and motion' — and a related build challenge for the day." },
          { duration: "10–35 min", title: "Investigation", body: "Kids try things: what makes a tower stable? Can it hold weight? Build, test, rebuild. Mistakes are the point." },
          { duration: "35–70 min", title: "Group build", body: "Pairs or small groups tackle a connected piece — bridge, vehicle, ecosystem. Sharing, negotiating, problem-solving in real time." },
          { duration: "Last 10 min", title: "Share & reflect", body: "Each group walks the others through what they built and what they tried. Reflection cements the concept." },
        ]}
      />

      <TrustStrip
        kicker="Designed with home-school families"
        stats={[
          { value: "12 max", label: "Per group" },
          { value: "5+ ages", label: "Mixed in one session" },
          { value: "10 weeks", label: "Per term · 1 day a week" },
          { value: "STEAM", label: "Maths · Science · Arts" },
        ]}
      />

      <FAQ
        items={[
          {
            q: "Does this align with the NZ Curriculum / NZC?",
            a: "Themes map to NZC strands (Science, Technology, Maths, English, The Arts), but sessions aren't a formal substitute for any one subject. Most home-school families use Brick Engaged as one of several weekly anchors.",
          },
          {
            q: "What age range works best?",
            a: "We've successfully run mixed groups from 6 to 14. The dynamic works because older kids mentor younger ones and the build complexity scales — every kid finds their level.",
          },
          {
            q: "Can siblings attend together?",
            a: "Yes, and we recommend it. Siblings in the same session often work as a built-in support pair, especially in the early weeks.",
          },
          {
            q: "What if my child has additional needs?",
            a: "Just let Dan know upfront — sensory, social, regulation, anything. Sessions are already structured for predictability, low overload, and self-paced participation, so most additional needs are easy to accommodate.",
          },
          {
            q: "Do parents stay during the session?",
            a: "Up to you. Most parents drop and run — there's a quiet corner if you'd rather work on your laptop while you wait.",
          },
          {
            q: "How do I enrol?",
            a: "Get in touch via the contact form or email. We'll let you know what term is next, whether the current group has space, and answer any questions about fit.",
          },
        ]}
      />

      <TermEnrolment
        programme="home-schoolers"
        programmeTitle="Home schoolers sessions"
        priceCents={15000}
        location="Lane Park Business Centre, Upper Hutt"
        termLabel="Term 3 2026 · weekly Thursdays 10:00am–12:30pm"
        schedule="10 weekly sessions · Thursdays 10:00am–12:30pm"
      />

      <CategoryCta
        heading="Got a home-school co-op?"
        body="If you've already got a group of 5+ kids together, we can also discuss tailored block-bookings on a different day. Send a message and Dan will get back within a day or two."
        primary={{ label: "Talk to Dan about a group booking", href: "/contact" }}
        secondary={{ label: "Back to sessions", href: "/sessions" }}
      />
    </div>
  );
}
