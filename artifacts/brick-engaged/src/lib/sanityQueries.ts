// GROQ queries — one per page. Use with sanityFetch().

export const HOME_PAGE_QUERY = `*[_type == "homePage"][0]{
  heroEyebrow,
  heroHeadline,
  heroSubhead,
  heroMetaLine,
  heroPrimaryCta,
  heroSecondaryCta,
  trustStrip[]{ value, label },
  pathwaysHeading,
  pathwaysSubtitle,
  pathways[]{
    kicker,
    title,
    blurb,
    chips[]{ text },
    href,
    accent
  },
  growthHeading,
  growthBody1,
  growthBody2,
  growthCtaLabel,
  growthCtaHref,
  whoBenefitHeading,
  whoBenefitSubtitle,
  whoBenefitCards[]{ badgeText, title, accent, items }
}`;

export const SESSIONS_HUB_QUERY = `*[_type == "sessionsHubPage"][0]{
  kicker, title, subtitle,
  cards[]{
    kicker, title, blurb,
    chips[]{ text },
    href, accent
  }
}`;

export const PROGRAMME_QUERY = `*[_type == "programmePage" && slug.current == $slug][0]{
  kicker, title, subtitle,
  heroChips[]{ text },
  heroPrice, heroPriceCadence,
  heroFacts[]{ label, value },
  bodySections[]{ heading, kicker, body },
  buildModesHeading, buildModesIntro,
  buildModes[]{ iconKey, title, body },
  outcomesHeading, outcomesIntro,
  outcomes[]{ title, body },
  rhythmHeading, rhythmIntro,
  rhythmSteps[]{ duration, title, body },
  trustStripKicker,
  trustStripStats[]{ value, label },
  groupsByDayHeading, groupsByDayIntro,
  groupsByDay[]{ day, name, kicker, description },
  faqs[]{ "q": question, "a": answer },
  ctaLabel, ctaHref
}`;

export const FOUNDATION_QUERY = `*[_type == "foundationPage"][0]{
  kicker, title, subtitle,
  missionStatement,
  howItWorksHeading,
  howItWorksSteps[]{ iconKey, title, body },
  bodySections[]{ heading, kicker, body },
  donateCtaLabel, donateCtaHref,
  applyCtaLabel, applyCtaHref
}`;

export const HOLIDAY_QUERY = `*[_type == "holidayPage"][0]{
  kicker, title, subtitle,
  heroChips[]{ text },
  bodySections[]{ heading, kicker, body },
  faqs[]{ question, answer }
}`;

export const ABOUT_QUERY = `*[_type == "aboutPage"][0]{
  kicker, title, subtitle,
  danName, danRole, danBio,
  missionHeading, missionStatement,
  credentialsHeading,
  credentials[]{ text, accent },
  bodySections[]{ heading, kicker, body }
}`;

export const CONTACT_QUERY = `*[_type == "contactPage"][0]{
  title, subtitle, introCopy,
  bodySections[]{ heading, kicker, body }
}`;

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  businessName, tagline, phone, email, address,
  facebookUrl, instagramUrl, footerNote
}`;
