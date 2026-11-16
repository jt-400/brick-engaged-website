import { defineType, defineField } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  fields: [
    defineField({ name: "kicker", title: "Hero kicker", type: "string" }),
    defineField({ name: "title", title: "Hero title", type: "string" }),
    defineField({ name: "subtitle", title: "Hero subtitle", type: "text", rows: 3 }),
    defineField({ name: "danName", title: "Dan's display name", type: "string", initialValue: "Daniel Mulholland" }),
    defineField({ name: "danRole", title: "Dan's role", type: "string", initialValue: "Facilitator · He/Him" }),
    defineField({
      name: "danBio",
      title: "Dan's bio",
      type: "array",
      of: [{ type: "block" }],
    }),

    // === Mission box (the dark callout below bio) ===
    defineField({ name: "missionHeading", title: "Mission box heading", type: "string", initialValue: "Our Mission" }),
    defineField({ name: "missionStatement", title: "Mission statement", type: "text", rows: 4 }),

    // === Credentials badges ===
    defineField({ name: "credentialsHeading", title: "Credentials heading", type: "string", initialValue: "Credentials" }),
    defineField({
      name: "credentials",
      title: "Credential badges",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "text", title: "Badge text", type: "string" },
            {
              name: "accent",
              title: "Style",
              type: "string",
              options: { list: [{ title: "Orange", value: "orange" }, { title: "Charcoal", value: "charcoal" }], layout: "radio" },
              initialValue: "orange",
            },
          ],
          preview: { select: { title: "text", subtitle: "accent" } },
        },
      ],
    }),

    defineField({
      name: "bodySections",
      title: "Other sections",
      type: "array",
      of: [{ type: "sectionBlock" }],
    }),
  ],
  preview: { prepare: () => ({ title: "About page" }) },
});
