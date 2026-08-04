# Portfolio "Carnet" Redesign — Implementation Guideline

**Project:** tsb-dev.fr — Thierno Sadou BARRY, Full Stack Engineer
**Concept:** The portfolio becomes a spiral notebook (*carnet*). The Hero is the **front cover**, each content section is a **page**, the Contact/Footer is the **back cover**. Scrolling turns pages.

---

## 0. Stack Evaluation & Decision (updated)

The original AGENTS.md constraint was "vanilla scripts only, no third-party client JS." For this redesign that constraint is revised — the carnet concept lives or dies on the quality of its scroll choreography (directional 3D page turns, staggered reveals, smooth anchor travel), and hand-rolling that in vanilla JS produces janky, hard-to-maintain code. The stack was re-evaluated end-to-end:

| Candidate | Verdict |
| :-- | :-- |
| **Keep Astro 7 + vanilla JS** | Best SEO baseline, but page-turn/scroll choreography at this fidelity is fragile and expensive to hand-write. Rejected as insufficient for the motion design. |
| **Migrate to Next.js (React)** | Excellent SEO (SSG/SSR) and GSAP-friendly, but a full rewrite of a working site for zero SEO gain over Astro's static output — React hydration adds JS weight Astro doesn't have. Rejected: churn without payoff. |
| **Migrate to SvelteKit** | Pleasant DX, smaller runtime than React, but still a full rewrite, and the i18n/OG/JSON-LD plumbing already exists in Astro. Rejected for the same reason. |
| **✅ Keep Astro 7 static shell + add GSAP (ScrollTrigger) + Lenis** | Astro keeps doing what it's already best-in-class at — shipping **fully static, crawlable HTML with near-zero baseline JS** — while GSAP becomes the dedicated animation engine and Lenis the smooth-scroll layer. Small, controlled addition; no framework rewrite. |

### Decision: Astro 7 + Tailwind v4 + TypeScript (unchanged) **+ GSAP + ScrollTrigger + Lenis** (new)

```bash
npm install gsap lenis
```

Why this is the right trade:

- **SEO is preserved or improved.** Astro still prerenders every word of content into static HTML — GSAP/Lenis load client-side and *enhance*, never gate content. With JavaScript disabled, the site is a fully readable, navigable document. This is the single most important SEO property and it comes from Astro, not from the animation layer.
- **GSAP is the industry standard** for exactly this: scroll-linked timelines, directional enter/exit choreography, 3D transforms with `transformPerspective`, and built-in snapping — replacing ~300 lines of brittle hand-rolled scroll math.
- **Lenis** gives inertia-smooth wheel/trackpad scrolling and a `scrollTo` API that solves the anchor-navigation smoothness requirement without fighting the browser.
- **Budget:** gsap core + ScrollTrigger + lenis ≈ **45 kB gzipped**, loaded once, deferred. Acceptable for a portfolio whose main content JS was near zero.

**Revised constraint set (supersedes the vanilla-only rule in AGENTS.md):**

- Astro v7 static output, TypeScript strict, **no UI framework** (still no React/Vue/Svelte — GSAP runs in plain `<script>` blocks).
- Tailwind v4 via `@tailwindcss/vite`, theme in `src/styles/global.css`, **no `tailwind.config.*`**.
- **Semantic tokens only** (`bg-bg`, `bg-surface`, `bg-elevated`, `text-fg`, `text-fg-muted`, `border-border`); dark mode class-based via `.dark`.
- Reuse utilities: `.card`, `.glass`, `.text-gradient`, `.reveal`, `.stagger`, `.btn-*`, `.badge` (`.reveal`/`.stagger` become the no-JS fallback, see §4).
- `ClientRouter` stays; all GSAP/Lenis setup must be **created and torn down per navigation** (`gsap.context()` + `astro:page-load` / cleanup on `astro:before-swap`) — same discipline as the existing `data-astro-rerun` pattern.
- i18n: every content/UI addition updates **both locales** and `TranslationKeys` in `src/types/index.ts`.
- Content images via `OptimizedImage.astro` / `astro:assets` — no hotlinking, no plain `<img>`.
- Only two new runtime dependencies, ever: `gsap`, `lenis`. Nothing else without explicit justification.
- Verification: `npm run astro check` + `npm run build` + manual `/en` and `/fr` sweep (now also with JS disabled once, to prove content integrity).

---

## 1. Design Concept — The Carnet Metaphor

Drawn from the reference image (spiral password keeper with letter tabs):

| Carnet element | Portfolio translation |
| :-- | :-- |
| Hard gray **front cover** | **Hero** — full-viewport, solid/elevated surface, logo + name + specialty + CTA |
| **Spiral binding** | A vertical decorative spine (repeating ring motif) on the left edge of each page on desktop; doubles as the visual anchor for page-turn transforms |
| **Letter tabs** (M N O P Q R…) on the right edge | **TabNav** — fixed right-edge navigation, one tab per section. Active tab sticks out further, like a real index tab |
| **Ruled/lined paper** pages | Content sections: light paper texture in light mode (subtle repeating `linear-gradient` lines at low opacity), elevated dark surface in dark mode |
| Two-page spread feel | Desktop pages use a two-column composition with a center crease shadow (left = heading/media, right = text/list) |
| **Back cover** | Contact + Footer — same solid treatment as the front cover, closing the book |

**Unique background per page:** each page gets a token-driven variation — Experience = `bg-surface` + ruled lines, Projects = `bg-bg` + dotted grid, Skills = `bg-elevated` + diagonal texture, About = paper + portrait treatment. Variations come from CSS custom properties per section (`--page-bg`, `--page-texture`), never new palette colors.

### New design tokens to add in `global.css` (`:root` / `.dark`)

```css
:root {
  --paper-line: color-mix(in oklab, var(--fg) 6%, transparent);   /* ruled lines */
  --page-crease: color-mix(in oklab, var(--fg) 10%, transparent); /* center spine shadow */
  --cover-bg: var(--elevated);                                     /* cover surface */
  --tab-bg: var(--surface);
  --tab-active-bg: var(--fg);                                      /* active tab = inverted */
  --page-turn-duration: 700ms;
  --page-turn-ease: cubic-bezier(0.22, 1, 0.36, 1);
}
.dark {
  --paper-line: color-mix(in oklab, var(--fg) 5%, transparent);
  --page-crease: color-mix(in oklab, black 35%, transparent);
}
```

---

## 2. Information Architecture — Page Map

Book order (one full-viewport "page" each, inside the scroll container):

```
0. COVER       #hero        → Header visible (overlay), full-viewport, background media + CTA
1. PAGE 1      #experience  → carnet page (no header, no footer)
2. PAGE 2      #projects    → carnet page
3. PAGE 3      #skills      → carnet page (promote skills to its own page — currently buried in About)
4. PAGE 4      #about       → carnet page
5. BACK COVER  #contact     → Contact content + Footer merged; back-to-top appears here only
```

**Navigation model:**

- **Header nav links** (on the cover) jump to pages: Experience, Projects, Skills, About, Contact.
- **TabNav** (right edge) replaces the header on inner pages — visible from page 1 onward, hidden on the cover.
- **Wheel / swipe / keyboard** turns pages sequentially (Lenis + ScrollTrigger snap on desktop, CSS snap fallback on mobile).
- **CTA on the cover** ("Open the notebook" / « Ouvrir le carnet ») smooth-scrolls to `#experience` via Lenis.

**Header behavior:** fixed overlay, visible only while `#hero` or `#contact` is on screen. On carnet pages it slides up and hides; theme/language toggles are duplicated in a small floating control cluster (top-right) that appears on inner pages. Implementation: a ScrollTrigger on the page range toggles `data-book-state="cover|page|back"` on `<body>`; header/cluster visibility is pure CSS off that attribute.

**Footer behavior:** remove `transition:persist` from `Footer.astro`. The footer markup moves **inside** the back-cover section (`#contact`), so it is physically unreachable until the last page — satisfying "footer displayed only at the bottom" structurally rather than with scroll-position hacks. The **back-to-top button** lives in the footer and also gets a floating variant that fades in only when `data-book-state="back"` (i.e., only at the bottom).

---

## 3. Layout System

### 3.1 Full-viewport pages

Every section fills the viewport:

```html
<section class="carnet-page min-h-svh md:min-h-dvh w-full">…</section>
```

- Use `svh` base + `dvh` where supported to avoid mobile URL-bar jump; plain-CSS `min-height: 100svh` fallback for older browsers.
- **Scroll-snap is now GSAP-driven on desktop** (§4.3) and CSS `snap-proximity` on touch/mobile — no more `snap-mandatory` anywhere (it fights both Lenis and programmatic smooth scrolls).
- Each page is a centered container: `max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-2` with the **center crease** as a pseudo-element on desktop only.

### 3.2 Spiral spine (desktop decoration)

A `::before` on each `.carnet-page` at `left: 0` (or a fixed layer on the container): repeating radial-gradient rings every ~48 px, 40–60% opacity, `pointer-events: none`. Hidden below `lg`.

### 3.3 Structural changes in `Layout.astro`

1. Keep the scroll container (`#book`) but **drop the `.snap-y` CSS class** — snapping moves into the GSAP layer (with CSS fallback, §4.3).
2. Move `<Footer />` out of the layout flow into the new `BackCover` section.
3. Replace the existing keyboard-nav script: Arrow/Page Up/Down now call the shared `goToPage(index ± 1)` function (which uses `lenis.scrollTo` when active, native `scrollIntoView` otherwise), so keyboard, TabNav, header links, and wheel all travel through one path.
4. All GSAP/Lenis lifecycle code lives in one module script in the layout, wrapped so it **re-initializes on `astro:page-load` and fully cleans up on `astro:before-swap`** (`ctx.revert()` on a `gsap.context`, `lenis.destroy()`), per the ClientRouter convention.

---

## 4. Animation & Motion System (GSAP-driven)

### 4.1 Architecture: one scroll engine, three tiers

```ts
// pseudo-structure of the single init module in Layout.astro
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isDesktop    = matchMedia("(min-width: 1024px)").matches;

if (!reduceMotion) {
  const lenis = new Lenis({ /* smoothWheel: true, lerp: 0.1 */ });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
// tiers:
// 1. desktop + motion OK  → GSAP page-turn timelines + ScrollTrigger snap
// 2. mobile  + motion OK  → 2D slide-in (xPercent only) + CSS snap-proximity
// 3. reduced motion       → no Lenis, no GSAP scroll anims; existing .reveal/.stagger
//                           CSS appears statically; content 100% readable
```

### 4.2 Page turns — direction-aware (core requirement)

Scrolling **down** = turning forward → incoming page enters **from the right**, outgoing exits **left**. Scrolling **up** = reversed. With GSAP this is a timeline per page, scrubbed or triggered, with direction taken from ScrollTrigger's `self.direction`:

```ts
pages.forEach((page, i) => {
  ScrollTrigger.create({
    trigger: page,
    scroller: "#book",
    start: "top 60%",
    onEnter:    (self) => playPageTurn(page, self.direction),  // 1 → from right
    onEnterBack:(self) => playPageTurn(page, self.direction),  // -1 → from left
  });
});

function playPageTurn(page: HTMLElement, direction: 1 | -1) {
  const inner = page.querySelector(".page-inner");
  gsap.fromTo(inner,
    { xPercent: 6 * direction, rotateY: isDesktop ? -50 * direction : 0,
      opacity: 0, transformPerspective: 1600, transformOrigin: direction === 1 ? "left center" : "right center" },
    { xPercent: 0, rotateY: 0, opacity: 1, duration: 0.7, ease: "power3.out", overwrite: "auto" }
  );
}
```

- **Always animate `.page-inner`, never the section itself** — transforming scroll children breaks scroll math and snap positions.
- 3D `rotateY` only above `lg`; below that, keep the `xPercent` slide and zero rotation.
- A moving crease shadow (pseudo-element opacity) can be tweened on the same timeline for the "paper" feel.

### 4.3 Snapping & smooth scrolling

- **Desktop:** ScrollTrigger's built-in snap on a wrapper trigger spanning all pages — `snap: { snapTo: 1 / (pages.length - 1), duration: { min: 0.2, max: 0.6 }, ease: "power2.inOut" }`. This gives deliberate, one-page-at-a-time turns with momentum tolerance.
- **Mobile/touch:** CSS `scroll-snap-type: y proximity` on `#book` and **no Lenis smoothing on touch** (native momentum already feels right; double-smoothing feels laggy). Configure `Lenis({ smoothTouch: false })` — default — and simply don't fight the platform.
- **Anchor/CTA/TabNav/back-to-top clicks:** one `goToPage(id)` helper → `lenis.scrollTo(target, { duration: 1.1 })` when Lenis is active, else `target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" })`.
- Because CSS mandatory snap is gone, the old "snap vs. smooth-scroll fighting" problem disappears with it.

### 4.4 In-page micro-animations (GSAP timelines per page)

Each page turn replays its content cascade — like re-reading a page:

- **Experience:** timeline rail draws top-to-bottom (`scaleY`, `transformOrigin: top`) + cards stagger in (`stagger: 0.08`).
- **Projects:** cards flip up with slight `rotationX`, image does a slow Ken Burns `scale: 1 → 1.05` while the page is active.
- **Skills:** chip clouds pop with `stagger: { each: 0.03, from: "start" }` and an overshoot ease (`back.out(1.7)`) — the spring feel CSS can't do well.
- **About:** portrait unclips via `clipPath: "inset(0 0 100% 0)" → "inset(0 0 0% 0)"`; paragraphs reveal per-line.
- **Covers:** CTA gentle idle pulse (`gsap.to(..., { repeat: -1, yoyo: true })`); back-to-top arrow bounce on appear.

All of these are built inside the per-page `gsap.timeline({ paused: true })` and `.play()`/`.reverse()`-ed from the ScrollTrigger callbacks of §4.2.

### 4.5 No-JS / reduced-motion fallback (mandatory, also an SEO guard)

- Existing `.reveal`/`.stagger` CSS stays and is the **default state**: elements are visible by default; GSAP only *adds* `from` states at runtime (`gsap.from`/fromTo), so nothing is ever hidden waiting on JS. **Never** pre-hide content in CSS with `opacity: 0` — that is the classic pattern that blanks the page for crawlers-without-JS and reduced-motion users.
- `@media (prefers-reduced-motion: reduce)`: Lenis not constructed, ScrollTriggers not created, CSS keyframes killed, `scroll-behavior: auto`.

---

## 5. Component-by-Component Specification

### 5.1 `Header.astro` (modify)

- Fixed, `inset-x-0 top-0 z-50`, transparent over the cover with `.glass` backdrop after slight scroll.
- Contains: **logo** (left), **nav menu** (Experience, Projects, Skills, About, Contact), **actions** (`ThemeToggle`, `LanguageToggle`).
- Visibility: `body[data-book-state="page"] & { transform: translateY(-100%); }` with 300 ms transition; visible on `cover` and `back`.
- Mobile: hamburger (existing `Menu` icon) opens a full-screen `.glass` overlay; links go through `goToPage` then auto-close.

### 5.2 `Hero.astro` → the **Front Cover**

- Full viewport, `--cover-bg` cover treatment + **captivating background**: image or muted looping video (new `hero.backgroundMedia` config field, §6).
  - Video: `<video autoplay muted loop playsinline poster>`; poster optimized via `astro:assets`, marked `fetchpriority="high"` and preloaded in `Layout.astro` `<head>` — it is the LCP element.
  - Overlay gradient scrim (`from-bg/70`) for text contrast in both themes.
- Content: logo mark, `hero.name` (`.text-gradient`, `font-serif`), `hero.specialty`, 2-line `hero.summary`, availability `.badge`, **CTA** (`.btn-primary`) → `goToPage("#experience")`.
- Decorative: spine preview on the left edge (hint of the book to come); bouncing scroll chevron (paused under reduced motion).
- Header overlays this page (transparent → glass on scroll).

### 5.3 New `CarnetPage.astro` (wrapper component)

```astro
---
interface Props {
  id: string;            // anchor + TabNav target
  tabLabel: string;      // edge tab label
  texture?: "lines" | "grid" | "diagonal" | "plain";
  index: number;         // page number, shown as "01 / 05"
}
---
<section id={id} class="carnet-page min-h-svh md:min-h-dvh" data-texture={texture} data-index={index}>
  <div class="page-inner min-h-inherit grid md:grid-cols-2 …">
    <slot />
  </div>
</section>
```

Owns: textures (pseudo-elements), center crease, page-number strip ("01 / 05", `text-fg-subtle`, bottom-right), and the `.page-inner` animation target.

### 5.4 New `TabNav.astro` — the edge tabs

- Fixed right edge, vertically centered, `z-40`, hidden on the cover (`body[data-book-state]` CSS).
- One tab per section: `writing-mode: vertical-rl` labels; staggered vertical offsets like real index tabs.
- Active tab: inverted tokens + extends ~8 px left — driven by the same ScrollTrigger that fires page turns.
- Click → `goToPage(id)`. Below `md`: collapses to dots at bottom-center.
- Real `<a href="#id">` elements (crawlable, keyboard-focusable, `:focus-visible` ring).

### 5.5 Content pages (migrate existing components into `CarnetPage`)

- **Experience:** left column = sticky heading + company/date meta; right = timeline cards.
- **Projects:** 2×2 card grid (4 projects fit one page); card = `OptimizedImage` thumb + name + 2-line summary + `.badge` tags + links. If overflow on short viewports: internal `overflow-y-auto` on `.page-inner` for that page only.
- **Skills:** new standalone page. Left = heading + one-liner ("The toolbox I reach for"); right = 5 category blocks (Backend, Frontend, Database, DevOps, AI) with chip clouds.
- **About:** left = `OptimizedImage` portrait with a taped-photo/polaroid treatment; right = `about.description` split on `\n\n` into `<p>`s.
- Every page: eyebrow label ("Chapter 01 — Experience" / « Chapitre 01 — Expérience ») + `font-serif` heading with a `.text-gradient` accent word.

### 5.6 New `BackCover.astro` — Contact + Footer (merged)

- Same `--cover-bg` surface as the Hero → book symmetry.
- Heading ("Let's build something" / « Construisons quelque chose »), email CTA (`mailto:` from `hero.email`), location + availability, then footer block: social links (LinkedIn, GitHub, Portfolio from `socialLinks`, existing icons), copyright, **back-to-top** (`.btn-ghost` + arrow).
- Back-to-top → `goToPage("#hero")`; floating variant fades in only while `data-book-state="back"`.
- Header fades back in on this page (shares the "cover" visibility rule), so theme/language toggles stay reachable at the bottom.

---

## 6. SiteConfig.ts Expansion (en + fr)

All content-driven; types in `src/types/index.ts`, UI strings in `src/i18n/en.ts` / `fr.ts`.

```ts
// --- Hero: cover CTA + background media ---
hero: {
  ...existing,
  ctaLabel: "Open the notebook",              // fr: « Ouvrir le carnet »
  ctaTarget: "#experience",
  // backgroundMedia: heroCover (ImageMetadata) or /video.mp4 in public/ — OptimizedImage or <video poster>
},

// --- Book structure: drives TabNav + page numbers + eyebrows ---
sections: [
  { id: "experience", tab: "E", eyebrow: "Chapter 01", title: "Experience" },
  { id: "projects",   tab: "P", eyebrow: "Chapter 02", title: "Projects" },
  { id: "skills",     tab: "S", eyebrow: "Chapter 03", title: "Skills" },
  { id: "about",      tab: "A", eyebrow: "Chapter 04", title: "About" },
  { id: "contact",    tab: "C", eyebrow: "Back cover", title: "Contact" },
],
// fr: eyebrow "Chapitre 01…", titles « Expérience », « Projets », « Compétences », « À propos », « Contact »
// + add { text: "Skills", href: "#skills" } to navLinks in BOTH locales

// --- New Contact block ---
contact: {
  heading: "Let's build something together",  // fr: « Construisons quelque chose ensemble »
  message: "Whether it's a full-time role, a freelance mission, or a technical challenge worth solving — my inbox is open.",
  // fr: « Que ce soit pour un poste, une mission freelance ou un défi technique à résoudre — ma boîte mail est ouverte. »
  email: "thierno.sadou.barry98@gmail.com",
  location: "France",
  availability: "Open to freelance & full-time opportunities", // fr: « Disponible pour missions freelance & CDI »
},

// --- Stats strip (cover or About) ---
stats: [
  { value: "3+",  label: "Years shipping software" },   // fr: « Années d'expérience »
  { value: "4+",  label: "Production projects" },       // fr: « Projets en production »
  { value: "15+", label: "Technologies in the stack" }, // fr: « Technologies maîtrisées »
],

// --- Footer ---
footer: {
  tagline: "Designed & built like a notebook — one page at a time.", // fr: « Conçu comme un carnet — page après page. »
  backToTopLabel: "Back to the cover",  // fr: « Retour à la couverture »
  copyright: "© {year} Thierno Sadou BARRY",
},
```

**i18n checklist:** `SiteContent` interface + `TranslationKeys` (new keys: `nav.skills`, `tabs.*` aria-labels, `hero.cta`, `contact.*`, `footer.backToTop`, `footer.tagline`) + `en.ts` + `fr.ts`. Strict mode turns a missing key into a compile error — that's the safety net.

---

## 7. Responsive Strategy

| Breakpoint | Behavior |
| :-- | :-- |
| `< md` | Single-column pages; CSS snap-proximity; TabNav → bottom dots; no spine/crease; 2D slide only; Lenis off for touch; hamburger overlay; simplified textures |
| `md – lg` | Two-column where it fits, crease optional; compact letter tabs |
| `> lg` | Full carnet: spine, crease, letter tabs, 3D page-turn, ScrollTrigger snap, Lenis smooth wheel |

`touch-action: pan-y` on `#book`; verify focus is never trapped on off-screen pages.

---

## 8. SEO, Accessibility & Performance (updated for the new stack)

**SEO — the Astro advantage, kept intact:**

- **Content integrity first:** every page's full text renders in the static HTML payload. GSAP only *enhances* (§4.5) — never `opacity: 0` in base CSS, never content injected by JS. Test: `curl` the built page and confirm all headings/paragraphs are present.
- Keep the existing `<head>` machinery untouched and extend it: JSON-LD (`Person` + `WebSite`), OG/Twitter cards, `hreflang` en/fr alternates, canonical URLs, localized `og:locale`.
- **Add `@astrojs/sitemap`** (`npm install @astrojs/sitemap` + config entry) so `/en` and `/fr` are enumerated for crawlers; verify `robots.txt` allows all and references the sitemap.
- One `<h1>` per page (the cover), `<h2>` per carnet page, `<section aria-labelledby>` structure — the book metaphor must not flatten the document outline.
- Anchor URLs (`#experience` etc.) keep working as plain links — TabNav items are real `<a href>`, so the structure is crawlable and shareable.

**Performance / Core Web Vitals (SEO ranking signals):**

- **LCP:** hero poster via `astro:assets`, `fetchpriority="high"`, preloaded; hero video ≤ ~2 MB, `muted autoplay loop playsinline`, never the LCP itself. Target LCP < 2.5 s.
- **CLS:** fixed viewport-height pages + self-hosted fonts (already Fontsource via Astro's fonts API) → target CLS ≈ 0.
- **INP:** GSAP/Lenis ≈ 45 kB gz, loaded deferred, zero hydration — target INP < 200 ms. No other client dependencies allowed.
- All below-cover images `loading="lazy"`; animations run on `transform`/`opacity` only (compositor-friendly, no layout thrash).
- Ship a Lighthouse check (both locales): target ≥ 95 Performance / 100 SEO / 100 Best Practices / ≥ 95 Accessibility on desktop.

**Accessibility:**

- Full `prefers-reduced-motion` path (§4.5) — site fully usable with motion off and with JS off.
- Keyboard: Arrow/Page keys → `goToPage`; TabNav in tab order; visible focus rings.
- Textures stay ≤ 8% opacity — decorative, never under body text at contrast cost; verify both themes.

---

## 9. Implementation Roadmap (phased, verifiable)

0. **Stack setup** — `npm install gsap lenis @astrojs/sitemap`; wire sitemap into `astro.config.mjs`; update `AGENTS.md` (see §10 addendum). *Verify:* build green, sitemap emitted.
1. **Tokens & motion primitives** — new CSS vars, textures, `carnet-page` base, reduced-motion guards. *Verify:* build passes, tokens switch in dark mode.
2. **Layout restructure** — `CarnetPage.astro`, full-viewport sections, footer into `#contact`, drop `.snap-y`. *Verify:* all content reachable by plain scroll, both locales, **JS disabled**.
3. **Scroll engine** — Lenis + ScrollTrigger init/cleanup with `gsap.context()` per `astro:page-load`; direction-aware page-turn timelines; `data-book-state`; header/cluster visibility. *Verify:* forward turns enter from right, backward from left; state survives locale switches.
4. **Snapping + navigation** — ScrollTrigger snap (desktop), CSS proximity (mobile), unified `goToPage()` for keyboard/tabs/CTA/back-to-top. *Verify:* Chrome/Firefox/Safari, no fighting, no double-smoothing on touch.
5. **TabNav** — edge tabs, mobile dots, active-state sync.
6. **Front cover (Hero)** — background media + poster/LCP handling, CTA, stats strip; remove `transition:persist` from Footer.
7. **Content pages** — migrate Experience/Projects/About, create Skills page, per-page GSAP micro-animations.
8. **Back cover + back-to-top** — contact block, socials, tagline, bottom-only button.
9. **SiteConfig + i18n expansion** — all blocks from §6, `TranslationKeys`, both locales. *Verify:* `astro check` clean.
10. **SEO/perf/QA pass** — sitemap + `curl` content check, Lighthouse both locales, reduced-motion pass, dark/light pass, `/en` + `/fr` sweep, final `npm run build`.

**Definition of done per phase:** `astro check` + `build` green, behavior confirmed on both locales.

---

## 10. Addendum — `AGENTS.md` Updates Required

After implementation, sync the repo's AGENTS.md so future agents aren't misled by stale rules:

- **Project Overview → Styling:** add "Animation: GSAP (+ ScrollTrigger) and Lenis for scroll-driven motion, initialized per-navigation via `gsap.context()`; no UI framework."
- **Security notes:** revise "avoid third-party client-side scripts" → "third-party client JS is limited to `gsap` and `lenis`; anything further needs explicit justification."
- **Code Organization:** add `components/CarnetPage.astro`, `components/TabNav.astro`, `components/BackCover.astro`; note Footer moved inside `#contact`; note `.snap-y` container replaced by GSAP snap + CSS proximity fallback.
- **Config:** note `@astrojs/sitemap` in `astro.config.mjs`.
- **Testing:** add "verify content renders with JS disabled (SEO baseline)" and "Lighthouse ≥ 95/100 targets" to the verification list.

---

## 11. Risk Notes

- **View transitions + GSAP:** the #1 bug source. Every ScrollTrigger/Lenis instance must be created inside `gsap.context()` and reverted on `astro:before-swap`, or animations duplicate/drift after locale navigation.
- **Lenis + touch:** never smooth touch input (`smoothTouch: false`) — double-smoothing feels broken. Mobile keeps native momentum + CSS proximity snap.
- **ScrollTrigger `scroller`:** if `#book` remains an inner scroll container, every ScrollTrigger needs `scroller: "#book"` and Lenis must wrap that element (`wrapper`/`content` options). Simpler alternative: scroll `window` directly and drop the inner container entirely — **recommended**, fewer moving parts.
- **`100vh` on iOS:** always `svh`/`dvh`, never raw `vh`.
- **Never pre-hide content in CSS** (§4.5) — it's both an a11y and an SEO/crawler hazard.
- **Video autoplay policies:** muted + playsinline are mandatory; always ship the poster path for when autoplay is blocked.
- Keep the legacy `card.astro` page and `componentsAssup/` untouched.



Internationalization (i18n)

- Locales: `fr` (default), `en`, `de` , configured in `astro.config.mjs` with `prefixDefaultLocale: false` at the Astro level — but in practice both locales are served under `/[locale]/` via `getStaticPaths`, and `/` performs a redirect based on `Astro.preferredLocale`.
- **Two-layer translation model:**
  - `src/config/SiteConfig.ts` — long-form portfolio *content* per locale (`getSiteConfig(locale)`, `getSiteContent(locale)`). The French content spreads the English base and overrides translated fields.
  - `src/i18n/en.ts` / `fr.ts` — short *UI strings* typed by `TranslationKeys`, accessed via `getTranslation(locale)`.
- When adding content or UI text, you must update **both locales** and keep the `TranslationKeys` interface (`src/types/index.ts`) in sync.
- `Layout.astro` emits `hreflang` alternate links and localized `og:locale`.