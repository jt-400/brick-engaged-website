import { defineType, defineField } from "sanity";

export const foundationPage = defineType({
  name: "foundationPage",
  title: "Foundation page",
  type: "document",
  fields: [
    defineField({ name: "kicker", title: "Hero kicker", type: "string" }),
    defineField({ name: "title", title: "Hero title", type: "string" }),
    defineField({ name: "subtitle", title: "Hero subtitle", type: "text", rows: 3 }),
    defineField({ name: "missionStatement", title: "Mission statement", type: "text", rows: 4 }),
    defineField({
      name: "howItWorksHeading",
      title: "How it works — heading",
      type: "string",
      initialValue: "How it works",
    }),
    defineField({
      name: "howItWorksSteps",
      title: "How it works — steps (usually 4)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "iconKey",
              type: "string",
              title: "Icon",
              options: {
                list: [
                  { title: "Document / File", value: "FileText" },
                  { title: "Sparkles", value: "Sparkles" },
                  { title: "Hand + Heart", value: "HandHeart" },
                  { title: "Heart", value: "Heart" },
                  { title: "Calendar", value: "Calendar" },
                  { title: "Mail", value: "Mail" },
                  { title: "Phone", value: "Phone" },
                  { title: "Checkmark", value: "CheckCircle2" },
                ],
              },
              initialValue: "FileText",
            },
            { name: "title", type: "string", title: "Title" },
            { name: "body", type: "text", title: "Body", rows: 3 },
          ],
          preview: { select: { title: "title", subtitle: "iconKey" } },
        },
      ],
    }),
    defineField({
      name: "bodySections",
      title: "Body sections",
      type: "array",
      of: [{ type: "sectionBlock" }],
    }),
    defineField({ name: "donateCtaLabel", title: "Donate CTA label", type: "string" }),
    defineField({ name: "donateCtaHref", title: "Donate CTA link", type: "string" }),
    defineField({ name: "applyCtaLabel", title: "Apply CTA label", type: "string" }),
    defineField({ name: "applyCtaHref", title: "Apply CTA link", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Foundation page" }) },
});
