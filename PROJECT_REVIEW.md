# Final project review

Reviewed on 2026-10-16. This review covers the bilingual static portfolio, its project metadata pipeline, the book reader, public output and release tooling.

## Findings fixed

- Centralized reader controls and navigation labels in the locale dictionaries. Both dictionaries have matching, nonempty keys and valid Unicode.
- Localized French skill labels, current-employment dates, repository sizes, certifications, fallback portfolio descriptions and approved project summaries. Original public README excerpts retain their source language and are labeled accordingly. No private README content is fetched or sent to a translation service.
- Language switching retains the source chapter rather than a translated page number. Fixed the two-page-spread reflow case where a chapter link could be replaced by the preceding left-hand page after fonts loaded.
- Enlarged the active About portrait from a 12rem cap to a responsive 25rem area. Observed image sizes were 382 x 478 pixels on desktop and 324 x 405 on mobile. The green/light and blue-and-white/dark portraits remain intact.
- Corrected low-contrast cover availability and reading-hint text using the semantic theme tokens. Theme switching works when browser storage is unavailable, and theme initialization does not accumulate transition listeners.
- Upgraded compatible dependencies to Astro 7.4.0 and sharp 0.35.5 with their patched transitive dependencies. Updated the minimum Node requirement to 22.22.0; CI continues to use Node 24. Added a high-severity dependency audit to CI.
- Removed an unused image import that emitted a 1,462,098-byte raw PNG. Retained optimized responsive WebP artwork and full-size illustration viewing. All emitted JavaScript totals about 19 KiB gzipped; localized HTML is about 33-34 KiB gzipped per locale in this build.
- Restricted image processing to local assets, added .keys directory protection to repository/package/promotion checks, and corrected Nginx security-header inheritance inside cached asset and HTML locations.
- Added the existing MIT attribution notice to the visible contact footer and corrected the canonical GitHub repository URL in package metadata.

## Validation

| Check | Result |
| :-- | :-- |
| Astro and TypeScript | No errors, warnings or hints |
| JavaScript integration/localization/presentation tests | 16 passed |
| Python deployment and privacy tests | 11 passed |
| Production build | 48 active projects, 21 private, 7 verified components |
| Dependency audit | 0 reported vulnerabilities |
| Gitleaks history scan | No secrets detected in 29 commits examined |
| Gitleaks generated-output scan | No secrets detected |
| SEO checks | Both locales, canonical and alternate URLs, structured data, sitemap, robots, social card and local assets passed |
| Chrome and automated accessibility review | 20 sampled screens; no reported WCAG A/AA rule violations, JavaScript errors or page overflow |

The browser matrix sampled presentation, About, projects, skills and contact for English/light/desktop, French/dark/desktop, English/dark/mobile and French/light/mobile. It also verified language switching from About. Prior reader checks cover image zoom, modal dismissal and scroll isolation. These are automated checks of the exercised screens, not an accessibility certification.

## Operating constraints

The deployed site stays static. Repository archives, descriptions and permissions take effect on the next successful build and deployment. The approved publication policy includes metadata from current and future non-archived repositories owned by the portfolio account; private source, README content, credentials and private source links remain excluded.

Public README excerpts deliberately retain their original language. Editorial translations live in src/config/projectTranslations.ts and src/config/projectPresentation.ts. Newly added repository descriptions may need a local editorial translation.

On this Windows installation npm lists optional WASM fallback packages as extraneous even after pruning. Required dependencies resolve, the native compiler/image pipeline builds successfully, and those fallback packages are not shipped with the static site. Release installs continue to use the committed lockfile.

See [README](README.md), [GitHub data](docs/GITHUB.md), [CI/CD](docs/CICD.md), [deployment](docs/DEPLOYMENT.md) and [SEO](docs/SEO.md) for operating instructions.
