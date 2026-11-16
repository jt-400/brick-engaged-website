import { defineType, defineField } from "sanity";

export const cta = defineType({
  name: "cta",
  title: "Call-to-action button",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "href", title: "Link / URL", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "variant",
      title: "Style",
      type: "string",
      options: { list: ["primary", "secondary", "ghost"], layout: "radio" },
      initialValue: "primary",
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const stat = defineType({
  name: "stat",
  title: "Trust-strip stat",
  type: "object",
  fields: [
    defineField({ name: "value", title: "Value (e.g. \"15+\")", type: "string", validation: (r) => r.required() }),
    defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "value", subtitle: "label" } },
});

export const faq = defineType({
  name: "faq",
  title: "FAQ item",
  type: "object",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "question" } },
});

export const chip = defineType({
  name: "chip",
  title: "Chip / tag",
  type: "object",
  fields: [defineField({ name: "text", title: "Text", type: "string", validation: (r) => r.required() })],
  preview: { select: { title: "text" } },
});

export const sectionBlock = defineType({
  name: "sectionBlock",
  title: "Page section",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "kicker", title: "Kicker (small uppercase label above heading)", type: "string" }),
    defineField({
      name: "body",
      title: "Body copy",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: { select: { title: "heading", subtitle: "kicker" } },
});
