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
        kicker="Weekly · 2-hour sessions"
        title="Home schoolers sessions"
        tagline="Explore learning through the practical application of LEGO®. An idea is presented, kids build their answer, then share the thinking behind it — and we go from there."
        facts={[
          { label: "Group size", value: "Min 5 · Max 12" },
          { label: "Format", value: "2-hour weekly sessions" },
          { label: "Subjects", value: "Maths · Sciences · Arts · Environment" },
          { label: "Plus", value: "Core life & social skills" },
          { label: "Location", value: "Lane Park Business Centre, Upper Hutt" },
        ]}
        price="$150"
        priceCadence="10-week term"
        primaryCta={{ label: "Enrol for next term", anchor: "enrol" }}
        secondaryCta={{ label: "Email Dan", href: "mailto:info@brickengaged.org", external: true }}
      />

      <OutcomeGrid
        heading="What kids and whānau take away"
        intro="Sessions are designed for the practical application of curriculum subjects — built, shared, refined — alongside the core life and social skills home-schooled kids don't always get from solo work."
        outcomes={[
          {
            title: "Curriculum that sticks because they built it",
            body: "Maths, sciences, arts, environment — concepts are explored through LEGO® and then defended out loud. Kids remember what they made next week, not what they were told.",
          },
          {
            title: "Critical thinking through build → share → revise",
            body: "Each build has a reason. Kids explain the story and thinking behind it, take collective feedback, and iterate. That's the loop we work in.",
          },
          {
            title: "Social practice in a steady weekly group",
            body: "Mixed ages, same faces, two hours a week. For families whose week is otherwise individual learning, this is the consistent peer time kids need.",
          },
          {
            title: "Two hours of structured learning that isn't on you",
            body: "Many home educators use the time for their own deep work, errands, or a coffee with another parent. The kids are fully engaged.",
          },
        ]}
      />

      <SessionRhythm
        intro="Sessions follow a predictable plan — present, build, share, refine — and may take several weeks to complete a topic or task."
        steps={[
          {
            duration: "First 15 min",
            title: "Idea or concept presented",
            body: "Dan introduces the topic — could be forces and motion, an ecosystem, a maths challenge, a story arc. We talk through what we're exploring.",
          },
          {
            duration: "15–80 min",
            title: "Build the answer",
            body: "Kids build their thoughts and answers with LEGO® bricks and pieces. Ample parts are provided. On some sessions a selected number of parts or a kit is used.",
          },
          {
            duration: "80–105 min",
            title: "Share & explain",
            body: "Each build is shared. Kids explain the story, the reason, and the critical thinking behind it. The others listen, ask questions, take it in.",
          },
          {
            duration: "Last 15 min",
            title: "Feedback & refine",
            body: "Collective and constructive feedback. If the build needs revision, refinement, or further exploration, we pick it up next week.",
          },
        ]}
      />

      <TrustStrip
        kicker="Designed with home-school families"
        stats={[
          { value: "12 max", label: "Per group" },
          { value: "2 hours", label: "Per session" },
          { value: "10 weeks", label: "Per term · 1 day a week" },
          { value: "STEAM", label: "Maths · Sciences · Arts · Environment" },
        ]}
      />

      <FAQ
        items={[
          {
            q: "How long are the sessions?",
            a: "Two hours, weekly. A topic or task may take several weeks to complete. See the calendar below for available days and times.",
          },
          {
            q: "Can the kids just build what they want?",
            a: "Yes and no. Kids use our extensive LEGO® parts collection to build the answer to the topic we're studying. Ample pieces are provided. Sometimes the task uses a selected number of parts or a kit. The expectation is the kids will participate in the session as designed — we have other programmes that cater to fully free building, LEGO® sets, and tutoring.",
          },
          {
            q: "Will kids build regular LEGO® sets with instructions?",
            a: "Not in these sessions. The home-schoolers programme is about exploring concepts through building, not following instructions. If your child wants the instruction-following experience, Brick Club is a better fit.",
          },
          {
            q: "What age range works best?",
            a: "Mixed-age groups from around 6 to 14 work well. Older kids mentor younger ones; younger ones stretch. The dynamic is one of the things home-school families value most.",
          },
          {
            q: "Does this align with the NZ Curriculum?",
            a: "Themes map to NZC strands (Science, Technology, Maths, English, The Arts), but sessions aren't a formal substitute for any one subject. Most home-school families use Brick Engaged as one of several weekly anchors.",
          },
          {
            q: "Can siblings attend together?",
            a: "Yes, and we recommend it. Siblings often work as a built-in support pair, especially in the early weeks.",
          },
          {
            q: "How do I enrol?",
            a: "Use the calendar below to enrol for the upcoming term, or send a quick message if you'd like to chat first about fit.",
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
