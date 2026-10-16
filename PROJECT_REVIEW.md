# Portfolio review

These notes record the initial portfolio redesign. The current deployment and search setup is documented in [CI/CD](docs/CICD.md) and [SEO](docs/SEO.md). Subsequent changes add a split hero with typed summaries, authenticated private-project metadata, newest-first project ordering, and main-only automated releases.

Static Astro 7 portfolio with Tailwind 4 semantic tokens, self-hosted fonts, optimized local images, and English/French routes.

## Final experience

The portfolio has three structurally separate stages:

1. A full-viewport presentation with name, specialty, summary, availability, location, and an Open notebook action.
2. The interior book: contents, experience, projects, skills, about, education, certifications, engineering principles, and open-source work.
3. A full-viewport contact section containing contact details, social links, and the footer, with links back to the book and presentation.

Presentation and contact use named layout slots outside the book. Neither can be passed into PageFlip or adaptive pagination. The interior keeps the original page-curl engine, desktop spreads, mobile pages, dynamic shadows, corner dragging, keyboard navigation, wheel turning, and reduced-motion support.

Previous on the first spread returns to presentation; next on the final spread opens contact. Direct chapter/contact links, URL hashes, keyboard controls, wheel boundaries, and boundary swipes use the same three-stage controller. Focus and inert state follow the visible stage. The header is visible on the opening and ending. During reading, header navigation, the centered chapter/page dock, and page numbers fade away. Pointer proximity within 48px, hover, or keyboard focus reveals controls. Leaving the area fades them again; Escape dismisses focused chrome. A touch on the book reveals controls for 2.4 seconds. The Show menu button and its obsolete translations were removed. The book has symmetric viewport margins; presentation and contact content are centered.

Interior overflow continues onto additional measured sheets without scrollbars or shrinking body text. Resizing repaginates original content and preserves the chapter. The standalone opening/ending occupy the viewport; unusually short screens or zoom can scroll those covers to keep all content and footer actions accessible.

Consolidated the accumulated book CSS into one set of stage and reading rules. Corrected locale routing to prefix both /en and /fr, matching actual generated pages and eliminating the English development response's incorrect 404. Restarted the project dev server to clear a stale Sharp import error; preview images now load.

## Verification

- Production build passed for all five routes.
- Astro check: zero errors and warnings; two pre-existing hints in untouched backup components.
- Chrome checked both locales at 1440x900, 390x844, 844x390, and 320x568: full-viewport covers, no covers/footer inside the book, no overflowing interior sheets, and both boundary transitions passed.
- Normal-motion page curl, direct contact navigation, return to presentation, wheel boundaries, menu dismissal, theme changes, and locale transitions passed without browser errors.
- Both locale URLs return HTTP 200, image requests load, and app IDs are unique.
- Centered book/dock geometry, pointer proximity, fade-out, focus reveal, Escape dismissal, and touch reveal/timeout verified in Chrome. Rechecked page fitting at phone, narrow-phone, and landscape sizes.
- Desktop and mobile screenshots inspected. No deployment performed. Local development remains available at http://localhost:4321.

The root remains a static redirect to /en. Legacy card pages and backup components retain their existing presentation. Without JavaScript the opening, chapters, and ending remain a naturally scrolling document.

## GitHub-backed projects

The homepage now loads public project data through `src/lib/github.ts` during server rendering/builds. It supports the configured GitHub App credentials when the key is available, and the public API locally when the production key path is a placeholder. It currently retrieves 12 actual public repositories, with GitHub descriptions, README excerpts, topics, language percentages, stars, forks, licenses, push dates, and source/homepage links. Original fallback project content remains available for cold API failures.

Public metadata is cached for one hour in ignored `.cache/github-projects.json`, with stale-cache fallback during outages/rate limits. No private repository is enriched, cached, or rendered. README content is converted to escaped plain text; badge/reference definitions are removed. Images are reused only for exact repository URL matches; other repositories use a CSS illustration rather than unrelated local screenshots. The open-source chapter follows licensed GitHub projects and disappears cleanly when empty.

Five isolated integration tests passed, including generated-key JWT verification, metadata-only installation-token permissions, private/fork/archive filtering, selection order, URL validation, missing-key public mode, cache behavior, and exclusion of authentication data. Astro check and production build pass. Generated output was scanned against configured credential values without printing them; no matches were found. Chrome checked project pagination in both locales on desktop, phone, and phone-landscape screens without clipping or browser errors. Actual production App authentication remains untested because the provided PEM path is a placeholder.

See `docs/GITHUB.md` and `.env.example` for configuration, repository selection, and build refresh instructions. No secrets were changed and no deployment was performed.

## Production rollout - 16 October 2026

Deployed the final static output as isolated `tsb-portfolio` on the existing production host, through the verified Saay SSH gateway. Release `20261016T091154-3ef5252295bc` is active. Only the new portfolio service was created; the shared ingress was syntax-checked and gracefully reloaded with existing routes preserved. Versioned artifacts and private ingress backups are retained.

DNS for root and www now resolves to 82.64.250.254. A valid Let's Encrypt certificate covers both names; HTTP redirects to HTTPS. Both locale pages and all browser assets loaded successfully. Public Chrome checks passed for presentation, book turns, GitHub data, contact/footer, and mobile sizing, with no JavaScript errors or failed requests. Saay and SunuStream HTTPS checks still return 200. Certificate renewal scheduling is enabled; see docs/DEPLOYMENT.md for the operator workflow.

No environment files or keys were transferred into the website. The local Git index/history was preserved. The production GitHub private-key path remains a placeholder; this release includes public API data rendered during the local build.
