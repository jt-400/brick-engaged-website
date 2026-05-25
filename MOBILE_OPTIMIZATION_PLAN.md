# Mobile Optimization Plan — Brick Engaged

Deep-dive plan to bring mobile experience to a premium standard. Based on a full audit of every page (Home, Sessions, Foundation, Holiday, About, Contact) + Layout.

**Target viewports:** 320px (small iPhone SE) · 375px (iPhone standard) · 414px (Plus/Pro) · 768px (tablet portrait)

**Effort key:** S = ≤30min · M = 1–3hrs · L = half day +

---

## Executive Summary

The site is functional on mobile but has 14 concrete issues worth fixing. They cluster into three buckets:

1. **Performance** — 2.2 MB Dan headshot, no WebP, no lazy-loading, LegoCanvas runs full physics sim on every mobile visit (battery drain)
2. **Vertical economy** — many sections use `min-h-[300px+]` images that consume half the mobile viewport on stacked layouts
3. **Touch & legibility** — some text could be tighter, some hero paddings too generous on small screens

Nothing is broken — the site already passes the basics (responsive grid, hamburger menu, no horizontal scroll, ≥44px touch targets, font legibility on dark backgrounds). This plan is about **moving from "works on mobile" to "feels designed for mobile."**

---

## Current State — What's Already Solid

| Win | Where |
|---|---|
| ✅ Hamburger menu collapses at `lg` (1024px) — tablets get clean view | Layout.tsx |
| ✅ All buttons ≥50px tall (LegoButton sm/md) — exceeds 44px touch min | LegoButton.tsx |
| ✅ Responsive H1 scaling: 34→52→72→88→95px | Home.tsx |
| ✅ Subhead bumps cleanly across breakpoints | Home.tsx |
| ✅ Stats grid: 2×2 on mobile, 1×4 on desktop | Home.tsx |
| ✅ `prefers-reduced-motion` respected globally | index.css |
| ✅ Mobile menu includes Contact Us | Layout.tsx |
| ✅ Page transitions don't break on mobile (Framer Motion AnimatePresence) | App.tsx |
| ✅ Form inputs use `text-base md:text-sm` — prevents iOS zoom-on-focus | input.tsx |

---

## Issues Identified

### 🔴 Critical — fix before next push

| # | Issue | Severity | Effort | Where |
|---|---|---|---|---|
| C1 | **PNG payload is huge** — `dan_headshot-...png` 2.2 MB, `lego_kids` 1.8 MB, `lego_therapy` 1.5 MB. Mobile users on 4G are eating 8 MB+ on a single page visit. | 🔴 | M | `attached_assets/` |
| C2 | **No `loading="lazy"` on any `<img>` tag** — every image loads upfront, including off-screen ones. | 🔴 | S | All pages |
| C3 | **LegoCanvas runs full physics sim on mobile** — castle drops dozens of bricks with 60fps physics loop. Battery + jank on low-end Androids. | 🔴 | M | Home.tsx + LegoCanvas |

### 🟡 High Impact — visible quality bumps

| # | Issue | Severity | Effort | Where |
|---|---|---|---|---|
| H1 | **Tall stacked layouts** — "LEGO® as a tool for growth" has `min-h-[480px]` + image `min-h-[320px]` on mobile, totaling ~800px of stacked content. Forces excessive scrolling. | 🟡 | S | Home.tsx |
| H2 | **Programme cards on Sessions** — image is `h-64` (256px) + 2 paragraphs + 2 buttons. Each card ~700px tall × 3 cards = enormous scroll. | 🟡 | S | Sessions.tsx |
| H3 | **Hero padding too generous on mobile** — `pt-28 pb-20` (112 + 80 = 192px just vertical padding) on Sessions/Foundation/About/Contact. Hero feels half-empty on small screens. | 🟡 | S | 4 pages |
| H4 | **Holiday price tag overflow risk** — absolute positioned `-top-5 -right-5` could clip on viewports < 375px. | 🟡 | S | Holiday.tsx |
| H5 | **Contact form `min-h-[150px]` textarea** — on a 667px iPhone SE, that's 22% of the viewport for one field. | 🟡 | S | Contact.tsx |
| H6 | **About page wall-of-text** — long bio paragraphs with no visual breaks on mobile. Hard to scan. | 🟡 | M | About.tsx |
| H7 | **Logo wordmark could break tightly** — "BRICK\<br/>ENGAGED" 2-line stack + 4 squares + text-lg might wrap awkwardly at < 360px. | 🟡 | S | Layout.tsx |
| H8 | **Brick divider height `h-32` (128px)** — takes 19% of a 667px iPhone SE viewport. Could be shorter on mobile. | 🟡 | S | Layout.tsx |

### 🟢 Polish — final 5%

| # | Issue | Severity | Effort | Where |
|---|---|---|---|---|
| P1 | **No `tap-highlight-color` reset** — iOS Safari shows grey highlight on every tap by default. | 🟢 | S | index.css |
| P2 | **Hover-only interactions** — `hover:-translate-y-1` on cards has no equivalent on touch. Tap-down state would feel more responsive. | 🟢 | S | Home.tsx, Sessions.tsx |
| P3 | **Mobile menu slides from right but starts at `top-16`** — gap of header underneath is visible during transition. Cosmetic. | 🟢 | S | Layout.tsx |

---

## Recommendations (in implementation order)

### Phase 1 — Performance baseline (must-do, biggest user impact)

**1.1 Image optimisation** [C1, C2]
- Convert all heavy PNGs to WebP via `sharp` or online tool. Keep PNG as fallback if needed.
- Target sizes: hero/feature images ≤ 300 KB, headshots ≤ 150 KB, decorative ≤ 100 KB.
- Add `loading="lazy"` to every `<img>` below the fold (everything except Home hero canvas + Dan headshot at the top of About).
- Add `decoding="async"` on all images.
- Add explicit `width` + `height` attributes to prevent layout shift.

Expected outcome: Home page initial payload from ~10 MB → ~1.5 MB. Lighthouse mobile score jumps ~25 points.

**1.2 Conditional LegoCanvas on mobile** [C3]
- Detect `window.innerWidth < 768` OR `prefers-reduced-motion: reduce`.
- On match: render a static SVG/PNG castle (export single frame) instead of running the physics sim.
- Saves battery, prevents jank, still preserves the brand visual.
- Alternative: keep the canvas but throttle to 30fps on mobile.

### Phase 2 — Layout tightening (visible improvements)

**2.1 Compress feature panel vertical space** [H1]
- `min-h-[480px]` → `min-h-[420px] md:min-h-[480px]`
- Image `min-h-[320px]` → `min-h-[240px] md:min-h-[320px]`
- Add `py-12 md:py-16` on text panel (currently `py-16` everywhere)

**2.2 Slim Sessions programme cards** [H2]
- Image `h-64` → `h-48 md:h-64` (192px on mobile vs 256px)
- Trim paragraph max-width on mobile so text fills more of the card vs spilling
- Tighten card padding: `p-8 md:p-10` → `p-6 md:p-10`

**2.3 Standardise hero padding on inner pages** [H3]
- `pt-28 pb-20` → `pt-20 pb-14 md:pt-28 md:pb-20` (Sessions, Foundation, About, Contact)
- Saves ~36px of empty space on mobile

**2.4 Fix Holiday price tag positioning** [H4]
- `-top-5 -right-5` → `-top-4 -right-4 md:-top-5 md:-right-5`
- Add `overflow-hidden` constraint on parent container

**2.5 Reduce Contact textarea height on mobile** [H5]
- `min-h-[150px]` → `min-h-[110px] md:min-h-[150px]`

**2.6 Add reading rhythm to About bio** [H6]
- Break paragraphs into smaller chunks (3–4 sentences max)
- Pull-quote one striking sentence on mobile
- Add subtle visual divider between major life chapters

**2.7 Logo wordmark safety** [H7]
- Make wordmark optional below 360px: add `hidden xs:inline` (define xs at 360px) — keep only the 4-square mark visible
- Or: switch to single-line "BRICK ENGAGED" with smaller text below xs breakpoint

**2.8 Shorter brick divider on mobile** [H8]
- `h-32 md:h-40` → `h-20 md:h-32 lg:h-40`
- Reclaims 48px of footer space on mobile

### Phase 3 — Polish

**3.1 iOS tap-highlight reset** [P1]
Add to `index.css`:
```css
* { -webkit-tap-highlight-color: transparent; }
button, a, [role="button"] { -webkit-tap-highlight-color: rgba(255,229,39,0.2); }
```

**3.2 Active-state press animations** [P2]
- Add `active:scale-[0.98]` to all cards on Home + Sessions
- LegoButton already has this — extend to non-LegoButton interactive surfaces

**3.3 Mobile menu polish** [P3]
- Slide-out from full top-0 with internal padding to clear header
- OR: animate header alongside menu so the visual seam is gone
- Add subtle backdrop blur behind the slide-out

---

## Testing Matrix

After implementing, verify on:
| Device | Viewport | Test |
|---|---|---|
| iPhone SE 1st gen | 320×568 | No horizontal scroll on any page |
| iPhone SE 2nd/3rd | 375×667 | Hero CTA reachable without scroll |
| iPhone 13/14/15 | 390×844 | Stats strip fits without cramping |
| iPhone Pro Max | 430×932 | Headshot + bio readable above fold on About |
| Pixel 7 | 412×915 | Castle animation smooth (30fps min) |
| iPad portrait | 768×1024 | Hero looks like desktop, no awkward in-between |
| iPad landscape | 1024×768 | Nav still hamburger (we set breakpoint at lg) — verify intentional |

Lighthouse targets (mobile, throttled 4G):
- Performance: ≥ 85 (current likely 50–60 due to image weights)
- Accessibility: ≥ 95
- Best Practices: ≥ 95
- LCP < 2.5s
- CLS < 0.05

---

## Sequencing & Effort

| Phase | Items | Total effort | User impact |
|---|---|---|---|
| Phase 1 (perf) | C1, C2, C3 | ~3–4 hrs | 🔴🔴🔴 huge |
| Phase 2 (layout) | H1–H8 | ~2 hrs | 🟡🟡 visible |
| Phase 3 (polish) | P1–P3 | ~30 min | 🟢 final 5% |

**Recommended order if doing in pieces:**
1. Phase 1.1 (image opt) — biggest single win, no UX risk
2. Phase 2.3 (hero padding) + 2.8 (divider height) — easy quick wins
3. Phase 1.2 (canvas mobile fallback) — biggest perf win after images
4. Phase 2.1, 2.2 (vertical compression) — bulk of the visible improvement
5. Phase 3 — once everything else feels solid

---

## What I'd Leave for Later

- **Service worker / PWA install** — meaningful only if site usage grows
- **Code splitting** — current JS bundle 542 KB is borderline; not urgent
- **Custom mobile-only hero** — the current responsive hero is fine; redesign only if data shows users dropping off

---

## Brand Fit Notes

Every change above respects the established system:
- Spacing: existing scale (py-12, py-16, py-20, py-24)
- Colours: charcoal, lego-orange #ffe527, slate-50/100
- Typography: Outfit/Nunito, font-black headings, -0.02em letter-spacing
- Motion: spring physics, rise + tilt, drop-from-above
- Components: LegoButton, shadcn Card/Badge

No new fonts, no new tokens, no breaking changes.
