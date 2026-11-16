import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "businessName", title: "Business name", type: "string", initialValue: "Brick Engaged" }),
    defineField({ name: "tagline", title: "Tagline / strapline", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "address", title: "Physical address", type: "text", rows: 2 }),
    defineField({ name: "facebookUrl", title: "Facebook URL", type: "url" }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url" }),
    defineField({ name: "footerNote", title: "Footer note", type: "text", rows: 2 }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
