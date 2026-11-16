import type { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Brick Engaged Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.listItem()
        .title("Home page")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Sessions hub")
        .id("sessionsHubPage")
        .child(S.document().schemaType("sessionsHubPage").documentId("sessionsHubPage")),
      S.listItem()
        .title("Foundation page")
        .id("foundationPage")
        .child(S.document().schemaType("foundationPage").documentId("foundationPage")),
      S.listItem()
        .title("Holiday page")
        .id("holidayPage")
        .child(S.document().schemaType("holidayPage").documentId("holidayPage")),
      S.listItem()
        .title("About page")
        .id("aboutPage")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.listItem()
        .title("Contact page")
        .id("contactPage")
        .child(S.document().schemaType("contactPage").documentId("contactPage")),
      S.divider(),
      S.listItem()
        .title("Programme pages")
        .child(
          S.documentTypeList("programmePage").title("Programmes")
        ),
    ]);
