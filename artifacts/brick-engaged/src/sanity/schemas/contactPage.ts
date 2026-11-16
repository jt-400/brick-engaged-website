import { defineType, defineField } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Hero title", type: "string" }),
    defineField({ name: "subtitle", title: "Hero subtitle", type: "text", rows: 3 }),
    defineField({ name: "introCopy", title: "Intro copy above contact form/info", type: "text", rows: 4 }),
    defineField({
      name: "bodySections",
      title: "Body sections",
      type: "array",
      of: [{ type: "sectionBlock" }],
    }),
  ],
  preview: { prepare: () => ({ title: "Contact page" }) },
});
