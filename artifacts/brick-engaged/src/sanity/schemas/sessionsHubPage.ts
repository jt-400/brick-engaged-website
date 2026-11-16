import { defineType, defineField } from "sanity";

export const sessionsHubPage = defineType({
  name: "sessionsHubPage",
  title: "Sessions hub page",
  type: "document",
  fields: [
    defineField({ name: "kicker", title: "Hero kicker", type: "string" }),
    defineField({ name: "title", title: "Hero title", type: "string" }),
    defineField({ name: "subtitle", title: "Hero subtitle", type: "text", rows: 3 }),

    defineField({
      name: "cards",
      title: "Programme cards (4 tiles)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "kicker", title: "Kicker", type: "string" },
            { name: "title", title: "Title", type: "string" },
            { name: "blurb", title: "Blurb", type: "text", rows: 3 },
            { name: "chips", title: "Chips", type: "array", of: [{ type: "chip" }] },
            { name: "href", title: "Link", type: "string" },
            { name: "accent", title: "Accent colour", type: "string" },
          ],
          preview: { select: { title: "title", subtitle: "kicker" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Sessions hub" }) },
});
