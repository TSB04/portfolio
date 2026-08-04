# AGENTS.md

Guidance for AI coding agents working in this repository. Assume no prior knowledge of the project.

## Project Overview

Personal portfolio website for **Thierno Sadou BARRY** (TSB — Full Stack Engineer), deployed at <https://tsb-dev.fr>.

- **Framework:** [Astro](https://docs.astro.build) v7 (`astro ^7.1.3`), static output (`output: "static"` in `astro.config.mjs`).
- **Styling:** Tailwind CSS v4 via the official Vite plugin (`@tailwindcss/vite`). All theme configuration lives in CSS (`src/styles/global.css`), there is no `tailwind.config.*` file.
- **Language:** TypeScript (`.ts` modules + frontmatter in `.astro` files), strict mode via `astro/tsconfigs/strict`.
- **Runtime requirement:** Node.js `>=22.12.0` (see `engines` in `package.json`).
- **No UI framework** (no React/Vue/Svelte). Interactivity is done with plain `<script>` blocks inside `.astro` components.
- **Images:** optimized with `sharp` through `astro:assets`; fonts are self-hosted via Astro's experimental `fonts` API (Fontsource provider: Gabarito + Be Vietnam Pro).

## Build and Development Commands

All commands run from the project root:

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server (default `localhost:4321`) |
| `npm run build` | Build the production site to `./dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run astro ...` | Run the Astro CLI (e.g. `npm run astro check`) |

### Dev server management

When starting the dev server as an agent, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

### Testing

There is **no test suite, no linter, and no formatter configured** in this project (no test script in `package.json`, no ESLint/Prettier config). Verification is done by:

1. `npm run astro check` — type-checks `.astro` and TypeScript files (requires `@astrojs/check` + `typescript`; install on demand if missing).
2. `npm run build` — must succeed without errors.
3. Manually inspecting pages in dev/preview mode (both locales `/en` and `/fr`).

There is also no CI/CD pipeline in the repository; deployment of `dist/` is handled outside the repo (hosting for `tsb-dev.fr`).

## Code Organization

```
src/
├── pages/
│   ├── index.astro            # Root route: redirects to /fr or /en based on Astro.preferredLocale
│   └── [locale]/index.astro   # The real homepage (getStaticPaths: en, fr)
│       [locale]/card.astro    # Standalone legacy "business card" page (uses styles/card.css)
├── layouts/Layout.astro       # Single layout: <head> (SEO, OG, JSON-LD), Header, snap-scroll container, Footer
├── components/                # Active components: Header, Footer, Hero, Experience, Projects, About,
│                              #   Section, ThemeToggle, LanguageToggle, OptimizedImage
├── componentsAssup/           # LEGACY/backup copies of earlier components — do not edit or import from here
├── config/SiteConfig.ts       # All portfolio content (hero, experience, projects, about, skills)
│                              #   in both English (base) and French (frContent)
├── i18n/                      # UI string translations: en.ts, fr.ts, helpers in index.ts
│                              #   (getTranslation, isValidLocale, getAlternateLocale, ...)
├── types/index.ts             # Shared TypeScript interfaces (SiteConfig, SiteContent, TranslationKeys, Locale, ...)
├── icons/                     # Standalone SVG icon components (Discord, Menu, News)
├── styles/global.css          # Tailwind v4 entry: @theme tokens, semantic color tokens, utility classes,
│                              #   dark variant (.dark class), animations, print styles
│   styles/card.css            # Plain CSS used only by the legacy card page
└── assets/images/             # Local images imported as ImageMetadata (logo, profile, project shots)
```

`public/` holds static files served as-is: favicons, `site.webmanifest`, `robots.txt`.

### Import aliases

Path aliases are defined in `tsconfig.json` — use them instead of relative paths:

- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@icons/*` → `src/icons/*`
- `@images/*` → `src/assets/images/*`
- `@types` → `src/types/index.ts`
- `@config` → `src/config/index.ts`
- `@i18n` → `src/i18n/index.ts`

## Internationalization (i18n)

- Locales: `en` (default) and `fr`, configured in `astro.config.mjs` with `prefixDefaultLocale: false` at the Astro level — but in practice both locales are served under `/[locale]/` via `getStaticPaths`, and `/` performs a redirect based on `Astro.preferredLocale`.
- **Two-layer translation model:**
  - `src/config/SiteConfig.ts` — long-form portfolio *content* per locale (`getSiteConfig(locale)`, `getSiteContent(locale)`). The French content spreads the English base and overrides translated fields.
  - `src/i18n/en.ts` / `fr.ts` — short *UI strings* typed by `TranslationKeys`, accessed via `getTranslation(locale)`.
- When adding content or UI text, you must update **both locales** and keep the `TranslationKeys` interface (`src/types/index.ts`) in sync.
- `Layout.astro` emits `hreflang` alternate links and localized `og:locale`.

## Theming and Styling Conventions

- Dark mode is class-based: `@custom-variant dark (&:where(.dark, .dark *))` in `global.css`. The theme is initialized by an inline script in `Layout.astro` (reads `localStorage.theme`, falls back to `prefers-color-scheme`) and toggled by `ThemeToggle.astro`.
- **Always use the semantic design tokens** defined in `global.css` — e.g. `bg-bg`, `bg-surface`, `bg-elevated`, `text-fg`, `text-fg-muted`, `text-fg-subtle`, `border-border` — instead of hardcoded Tailwind palette colors. Raw values live in `:root` / `.dark` CSS variables; `@theme inline` only aliases them, so both themes switch automatically.
- Reusable utility classes defined in `global.css` (see also `REF.md`): `.card`, `.glass`, `.text-gradient`, `.reveal` (scroll animation), `.stagger`, `.btn-*`, `.badge`. Prefer these over inventing new one-off styles.
- Fonts: use `font-serif` (Gabarito, headings) and `font-sans` (Be Vietnam Pro, body).
- `REF.md` is a migration/design reference for the token system; `STRUCT.md` is an older structure sketch. Neither is normative — the code is the source of truth.

## Astro-Specific Conventions

- The site uses `ClientRouter` (view transitions) with `transition:persist` on Header and Footer. Scripts that attach DOM listeners must handle re-execution after navigation: use `is:inline` / `data-astro-rerun` and re-query elements instead of caching them (see `ThemeToggle.astro` for the established pattern).
- Page layout uses a snap-scroll container (`.snap-y`) inside a fixed-height body; `Layout.astro` adds keyboard navigation (ArrowUp/Down, PageUp/Down) that scrolls this container.
- Images in content are imported in `SiteConfig.ts` as `ImageMetadata` and rendered through `OptimizedImage.astro` / `astro:assets` — do not hotlink or use plain `<img>` for content images (the legacy `card.astro` page is the only exception).
- `astro.config.mjs` allows remote images from `images.unsplash.com` and any `https` source via `remotePatterns`.

## Security and Environment Notes

- A `.env` file exists at the root and is git-ignored (along with `.env.production`). Never commit secrets, and do not print or exfiltrate `.env` contents.
- The site is fully static with no backend, no forms posting to a server, and no external runtime dependencies — the attack surface is minimal. Keep it that way: avoid adding third-party client-side scripts without a clear need.
- `public/` files are served verbatim; do not place anything sensitive there.

## Documentation

Full Astro documentation: <https://docs.astro.build>

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
