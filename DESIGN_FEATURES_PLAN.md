# Brick Engaged — Design Features Roadmap

Massive list of additional design features we could layer on top of the current build, organised by impact tier and effort. Pick any to implement next.

**Effort key:** S = ≤30min · M = 1–3hrs · L = half day +

---

## Tier 1 — Must-Have Foundations (ship before going live)

These are baseline polish items that any production-quality site should have. Highest impact, lowest effort.

| # | Feature | Effort | Why |
|---|---|---|---|
| 1.1 | **Custom favicon** — brick-mark in browser tab | S | Currently 404s. Design a 32×32 + SVG version using the 4-square brick logo. |
| 1.2 | **Open Graph share image** — 1200×630 hero card | S | Right now sharing the URL produces a blank preview on FB/Slack/WhatsApp. |
| 1.3 | **404 page** — on-brand with falling bricks | S | Already have `not-found.tsx` but it's barebones. |
| 1.4 | **`prefers-reduced-motion` support** | S | Disable canvas + hero text animations for users who request reduced motion (accessibility requirement). |
| 1.5 | **Image optimisation** — PNG → WebP + lazy loading | M | Dan headshot is 2.2MB, lego_kids is 1.8MB. Massive mobile win. |
| 1.6 | **Skip-to-content link** | S | A11y baseline — first focusable element on page. |

---

## Tier 2 — High-Impact Polish (visible, brand-elevating)

Each one materially raises the perceived quality of the site.

| # | Feature | Effort | Why |
|---|---|---|---|
| 2.1 | **Page transitions** — fade/slide between routes | M | Wouter + Framer Motion. Each route change feels seamless instead of a hard cut. |
| 2.2 | **Stats counter** — "X kids served · Y sessions" with animated count-up | M | Builds credibility instantly. Put between "Who can benefit?" and "Find your path". |
| 2.3 | **Testimonials section** — quote cards in brick shapes | M | Parents'/educators' words = best social proof. Carousel or 3-up grid. |
| 2.4 | **Photo gallery on About or Sessions** — masonry grid w/ lightbox | L | Show real sessions in action. Massive trust signal. |
| 2.5 | **FAQ accordion** — common parent questions, brick-style expand | M | "What's a session like?" "Is it just for autistic kids?" etc. |
| 2.6 | **Map embed on Contact** — Lane Park Business Centre w/ custom brick marker | S | People always want to know where you are. |
| 2.7 | **Sticky "Enrol now" CTA** — floating bottom-right on scroll | M | Big conversion lever — primary action always reachable. |
| 2.8 | **Mouse-parallax on castle** — subtle ±8px depth tilt | S | Adds liveliness to the hero without distracting. |

---

## Tier 3 — Brand Sprinkles (delight, personality)

These are the moments that make people screenshot and share.

| # | Feature | Effort | Why |
|---|---|---|---|
| 3.1 | **Confetti bricks on form submit** | M | After Contact form success — bricks fall from the top of the screen. |
| 3.2 | **Custom cursor on hero** — tiny brick that follows the mouse | M | Strong brand moment. Reduce on touch devices. |
| 3.3 | **Click-pop sound** — soft brick "click" when LegoButton clicked | S | Optional via mute toggle. Connects with the physical brick experience. |
| 3.4 | **Brick scatter pattern** on Foundation hero | S | Variant of `bg-brick-pattern` with bigger, irregular bricks for visual variety. |
| 3.5 | **Animated badges** — subtle shimmer/glow on "Programmes", "Charitable Organisation" badges every 4s | S | Draws attention without being aggressive. |
| 3.6 | **Brand timeline on About** — horizontal scroll of Dan's journey 2014 → today | L | Currently the bio is a wall of paragraphs. Timeline = much more engaging. |
| 3.7 | **Brick-shaped quote marks** in Foundation blockquote | S | Replace " with a small brick icon — subtle theme reinforcement. |
| 3.8 | **Section dividers** — vary the brick row colour/pattern between sections | M | Right now it's only at the footer. Insert smaller dividers between major sections. |
| 3.9 | **Ken Burns on images** — slow zoom/pan on Foundation + About photos | S | Static images come alive. |

---

## Tier 4 — Engagement Features (deeper investment)

Functional additions that go beyond visual polish.

| # | Feature | Effort | Why |
|---|---|---|---|
| 4.1 | **Newsletter signup** — slide-in panel after 30s or scroll-bottom | M | Capture leads, send programme updates / holiday dates. |
| 4.2 | **Live availability indicator** on Contact — "Dan typically replies within X" | S | Sets expectations, feels human. |
| 4.3 | **Programme comparison table** on Sessions | M | Side-by-side: Brick-by-Brick vs Mindful vs Therapeutic. Easier to choose. |
| 4.4 | **Donation progress bar** on Foundation | M | Visual goal tracker — "We've funded 47 / 100 sessions this year". |
| 4.5 | **Filter pills on Sessions** — by age group, by programme type | M | If more programmes added later. |
| 4.6 | **Holiday calendar widget** — show next 3 holiday dates with availability | L | "Sept 30 — 2 spots left" etc. Requires booking back-end if dynamic. |
| 4.7 | **Press/Mentions strip** — RLFM logo, awards, partnerships | S | Trust signal — 5–6 logos in greyscale. |
| 4.8 | **Video hero option** — short 8s looping clip of a session | L | If Dan has footage. Could replace canvas animation as the focal point. |

---

## Tier 5 — Experimental / Premium

Big swings — high effort, but if executed they'd put the site in "agency portfolio" territory.

| # | Feature | Effort | Why |
|---|---|---|---|
| 5.1 | **Dark mode toggle** | M | Brand already heavy on charcoal. Light mode for daytime, dark mode for evening. |
| 5.2 | **Build-your-own preview** on Sessions | L | Tiny interactive demo: click a few bricks to build a model — gives a taste of the session experience. |
| 5.3 | **Scroll-triggered castle building** | L | LegoCanvas grows / changes as user scrolls down the home page (not just on initial load). |
| 5.4 | **3D brick logo intro** | L | Logo bricks "click together" on page load before settling into header position. |
| 5.5 | **Voice-over toggle** on hero — short Dan intro audio | M | Personal touch, especially powerful for first-time visitors. |
| 5.6 | **Booking flow modal** — full multi-step "request enrolment" wizard | L | Currently the buttons just say "Enrolment Form" but don't link anywhere. Build that flow. |
| 5.7 | **Achievement badges** on completed sessions | L | Gamification for repeat visitors — "Welcome back, you've attended 5 sessions". |
| 5.8 | **Live brick physics on click** — clicking ANY brick on the page (logo, footer studs, etc.) makes it pop and bounce | M | Easter egg that rewards exploration. |

---

## Recommended Sequencing

If I were calling the shots, I'd ship in this order:

**Week 1 — Foundation (4–6 hrs total):** 1.1, 1.2, 1.3, 1.4, 1.5, 1.6 — clean up the must-haves
**Week 2 — Visible polish (1 day):** 2.1 (page transitions), 2.2 (stats counter), 2.8 (mouse parallax)
**Week 3 — Content additions (1–2 days):** 2.3 (testimonials), 2.5 (FAQ), 2.6 (map)
**Week 4 — Conversion (½ day):** 2.7 (sticky CTA), 4.7 (press strip), 5.6 (enrolment flow link-up at minimum)
**Whenever you want a "wow" moment:** 3.1 (confetti) + 3.6 (timeline) + 5.2 (interactive brick build)

---

## Notes on Brand Fit

Every feature above respects the existing system:
- **Colours**: charcoal `#1E293B`, brand yellow `#ffe527`, slate-50/100 neutrals
- **Type**: Outfit (display) + Nunito (body), all headings `font-black` with `-0.02em` letter-spacing
- **Components**: `LegoButton` (orange/charcoal/white), shadcn `Card`, `Badge`, `Form`
- **Animation language**: spring physics, rise + tilt on interaction, dropping-from-above for entrance, brick-scale stagger
- **Layout**: `rounded-3xl` cards, hover-lift `-translate-y-1`, `pb-32 md:pb-40 -mb-32 md:-mb-40` pattern for sections that need to bleed into the footer brick

No feature requires new fonts, new colour additions, or breaking the existing design tokens.
