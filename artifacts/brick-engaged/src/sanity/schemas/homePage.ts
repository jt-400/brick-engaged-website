import { defineType, defineField } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    // Hero — desktop + mobile share copy
    defineField({ name: "heroEyebrow", title: "Hero eyebrow pill", type: "string", description: "Small pill text above headline" }),
    defineField({ name: "heroHeadline", title: "Hero headline", type: "text", rows: 2 }),
    defineField({ name: "heroSubhead", title: "Hero subhead", type: "text", rows: 3 }),
    defineField({ name: "heroMetaLine", title: "Hero meta line (small uppercase below CTAs)", type: "string" }),
    defineField({ name: "heroPrimaryCta", title: "Primary CTA", type: "cta" }),
    defineField({ name: "heroSecondaryCta", title: "Secondary CTA", type: "cta" }),

    // Trust strip stats (4 items)
    defineField({
      name: "trustStrip",
      title: "Trust strip stats",
      type: "array",
      of: [{ type: "stat" }],
      validation: (r) => r.length(4),
    }),

    // Pathways section
    defineField({ name: "pathwaysHeading", title: "Pathways heading", type: "string" }),
    defineField({ name: "pathwaysSubtitle", title: "Pathways subtitle", type: "string" }),
    defineField({
      name: "pathways",
      title: "Pathway tiles",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "kicker", title: "Kicker", type: "string" },
            { name: "title", title: "Title", type: "string" },
            { name: "blurb", title: "Blurb", type: "text", rows: 3 },
            { name: "chips", title: "Chips (3)", type: "array", of: [{ type: "chip" }] },
            { name: "href", title: "Link", type: "string" },
            {
              name: "accent",
              title: "Accent colour",
              type: "string",
              options: { list: ["emerald", "amber", "sky"], layout: "radio" },
            },
          ],
          preview: { select: { title: "title", subtitle: "kicker" } },
        },
      ],
    }),

    // === LEGO as a tool for growth section ===
    defineField({ name: "growthHeading", title: "Growth section heading", type: "string", initialValue: "LEGO® as a tool for growth" }),
    defineField({ name: "growthBody1", title: "Growth section paragraph 1", type: "text", rows: 3 }),
    defineField({ name: "growthBody2", title: "Growth section paragraph 2", type: "text", rows: 3 }),
    defineField({ name: "growthCtaLabel", title: "Growth section CTA label", type: "string", initialValue: "Explore Sessions" }),
    defineField({ name: "growthCtaHref", title: "Growth section CTA link", type: "string", initialValue: "/sessions" }),

    // === Who can benefit cards ===
    defineField({ name: "whoBenefitHeading", title: "Who can benefit — heading", type: "string", initialValue: "Who can benefit?" }),
    defineField({ name: "whoBenefitSubtitle", title: "Who can benefit — subtitle", type: "text", rows: 2 }),
    defineField({
      name: "whoBenefitCards",
      title: "Who can benefit cards (3)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "badgeText", title: "Top badge (e.g. \"Brick-by-Brick® Programme\")", type: "string" },
            { name: "title", title: "Card title (e.g. \"Children 7–12\")", type: "string" },
            {
              name: "accent",
              title: "Top stripe colour",
              type: "string",
              options: { list: [{ title: "Orange", value: "orange" }, { title: "Charcoal", value: "charcoal" }], layout: "radio" },
              initialValue: "orange",
            },
            { name: "items", title: "Bullet list items", type: "array", of: [{ type: "string" }] },
          ],
          preview: { select: { title: "title", subtitle: "badgeText" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
