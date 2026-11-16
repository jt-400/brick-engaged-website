import { defineType, defineField } from "sanity";

export const programmePage = defineType({
  name: "programmePage",
  title: "Programme page",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL part — e.g. \"brick-club\" for /sessions/brick-club",
      options: { source: "title", maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "kicker", title: "Hero kicker", type: "string" }),
    defineField({ name: "title", title: "Hero title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "Hero subtitle / blurb", type: "text", rows: 3 }),

    defineField({
      name: "heroChips",
      title: "Hero info chips (3-4 items like \"Ages 7-12\", \"$150 / term\")",
      type: "array",
      of: [{ type: "chip" }],
    }),
    defineField({ name: "heroPrice", title: "Hero price (e.g. \"$150\")", type: "string" }),
    defineField({ name: "heroPriceCadence", title: "Hero price cadence (e.g. \"10-week term\")", type: "string" }),

    // === Hero facts table (Ages, Group size, Format, Location, etc.) ===
    defineField({
      name: "heroFacts",
      title: "Hero facts table",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label (e.g. \"Ages\")", type: "string" },
            { name: "value", title: "Value (e.g. \"7-12\")", type: "string" },
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
    }),

    // === Build modes / "What's on offer" cards ===
    defineField({ name: "buildModesHeading", title: "Build modes heading", type: "string" }),
    defineField({ name: "buildModesIntro", title: "Build modes intro", type: "text", rows: 2 }),
    defineField({
      name: "buildModes",
      title: "Build modes / \"What's on offer\" cards",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "iconKey",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Boxes (set/kit)", value: "Boxes" },
                  { title: "Wand (creative)", value: "Wand2" },
                  { title: "Layers (stations)", value: "Layers" },
                  { title: "Coffee (drop-in)", value: "Coffee" },
                  { title: "Book", value: "BookOpen" },
                  { title: "Box", value: "Box" },
                  { title: "Sparkles", value: "Sparkles" },
                  { title: "Graduation cap", value: "GraduationCap" },
                  { title: "Wrench", value: "Wrench" },
                ],
              },
            },
            { name: "title", title: "Title", type: "string" },
            { name: "body", title: "Body", type: "text", rows: 3 },
          ],
          preview: { select: { title: "title", subtitle: "iconKey" } },
        },
      ],
    }),

    // === Trust strip ===
    defineField({ name: "trustStripKicker", title: "Trust strip kicker (small text above stats)", type: "string" }),
    defineField({
      name: "trustStripStats",
      title: "Trust strip stats (usually 4)",
      type: "array",
      of: [{ type: "stat" }],
    }),

    // === Groups-by-day grid (PeerToPeer) ===
    defineField({ name: "groupsByDayHeading", title: "Groups-by-day heading", type: "string" }),
    defineField({ name: "groupsByDayIntro", title: "Groups-by-day intro", type: "text", rows: 2 }),
    defineField({
      name: "groupsByDay",
      title: "Groups by day",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "day", title: "Day (e.g. \"Monday\")", type: "string" },
            { name: "name", title: "Group name (e.g. \"Men's Group\")", type: "string" },
            { name: "kicker", title: "Kicker (e.g. \"7-9 PM\")", type: "string" },
            { name: "description", title: "Short description", type: "text", rows: 2 },
          ],
          preview: { select: { title: "name", subtitle: "day" } },
        },
      ],
    }),

    defineField({
      name: "bodySections",
      title: "Body sections",
      type: "array",
      of: [{ type: "sectionBlock" }],
      description: "Add one section per topic — overview, what we do, schedule, pricing, etc.",
    }),

    defineField({
      name: "outcomesHeading",
      title: "Outcomes heading",
      type: "string",
      initialValue: "What kids and whānau take away",
    }),
    defineField({
      name: "outcomesIntro",
      title: "Outcomes intro (optional)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "outcomes",
      title: "Outcome cards",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "body", type: "text", title: "Body", rows: 3 },
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        },
      ],
    }),

    defineField({
      name: "rhythmHeading",
      title: "Session rhythm heading",
      type: "string",
      initialValue: "What a session looks like",
    }),
    defineField({
      name: "rhythmIntro",
      title: "Session rhythm intro (optional)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "rhythmSteps",
      title: "Session rhythm steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "duration", type: "string", title: "Duration (e.g. \"0-10 min\")" },
            { name: "title", type: "string", title: "Title" },
            { name: "body", type: "text", title: "Body", rows: 3 },
          ],
          preview: { select: { title: "title", subtitle: "duration" } },
        },
      ],
    }),

    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [{ type: "faq" }],
    }),

    defineField({ name: "ctaLabel", title: "Booking CTA label", type: "string", initialValue: "Reserve a spot" }),
    defineField({ name: "ctaHref", title: "Booking CTA link", type: "string" }),
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
