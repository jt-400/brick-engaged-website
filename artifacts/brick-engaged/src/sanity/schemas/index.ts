import { siteSettings } from "./siteSettings";
import { homePage } from "./homePage";
import { sessionsHubPage } from "./sessionsHubPage";
import { programmePage } from "./programmePage";
import { foundationPage } from "./foundationPage";
import { holidayPage } from "./holidayPage";
import { aboutPage } from "./aboutPage";
import { contactPage } from "./contactPage";
import { cta, stat, faq, chip, sectionBlock } from "./objects";

export const schemaTypes = [
  // Documents
  siteSettings,
  homePage,
  sessionsHubPage,
  programmePage,
  foundationPage,
  holidayPage,
  aboutPage,
  contactPage,
  // Reusable objects
  cta,
  stat,
  faq,
  chip,
  sectionBlock,
];
