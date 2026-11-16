import { defineType, defineField } from "sanity";

export const holidayPage = defineType({
  name: "holidayPage",
  title: "Holiday programme page",
  type: "document",
  fields: [
    defineField({ name: "kicker", title: "Hero kicker", type: "string" }),
    defineField({ name: "title", title: "Hero title", type: "string" }),
    defineField({ name: "subtitle", title: "Hero subtitle", type: "text", rows: 3 }),
    defineField({
      name: "heroChips",
      title: "Hero info chips",
      type: "array",
      of: [{ type: "chip" }],
    }),
    defineField({
      name: "bodySections",
      title: "Body sections",
      type: "array",
      of: [{ type: "sectionBlock" }],
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [{ type: "faq" }],
    }),
  ],
  preview: { prepare: () => ({ title: "Holiday page" }) },
});
