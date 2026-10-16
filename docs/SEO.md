# Search visibility and performance

## What the build provides

- `/en/` and `/fr/` are the two indexable, server-rendered portfolio pages. The book is a progressive enhancement of real HTML, not content downloaded by client-side JavaScript.
- Each page has one H1, a distinct localized title and description, a self-canonical URL, reciprocal `en`/`fr` alternates, and an `x-default` pointing to the English homepage.
- `/sitemap-index.xml` references `/sitemap-0.xml`. Only the two canonical pages are listed, with the same language alternates. Redirects and the unfinished legacy card pages are excluded.
- `/robots.txt` is generated from `Astro.site`, allows crawling, and points to the sitemap index. CSS, JavaScript, and image resources remain crawlable. `robots.txt` is not a privacy boundary.
- JSON-LD links `Person`, `WebSite`, and `ProfilePage` entities using stable IDs. The decorative placeholder image is not described as a portrait. No invented ratings, business address, or modification dates are emitted.
- Open Graph and Twitter metadata share a real 1200 × 630 PNG at `/og-image.png`. Regenerate it with `npm run generate:social` after editing `scripts/generate-social-image.mjs`.
- Content images have responsive WebP variants, explicit dimensions, and lazy loading. Priority images receive `fetchpriority="high"`. Fonts are self-hosted; unused weight 300 has been removed.
- Nginx configuration provides permanent redirects for the root, slashless locale paths, legacy card URLs, and HTTPS `www` to the primary hostname. XML is included in compression. Fingerprinted Astro assets keep immutable caching.

The sitemap deliberately omits `priority` and `changefreq`, and does not claim that every page was updated on every build. Google ignores those priority/frequency hints; modification dates should reflect substantive content changes.

## Validate a release

```powershell
npm run astro check
npm run test:github
npm run build
npm run check:seo
```

`check:seo` inspects the real `dist/` files: canonical and alternate URLs, sitemap entries, robots rules, titles, descriptions, heading count, server-rendered sections, JSON-LD relationships, social-card dimensions, favicon/image existence, and legacy redirects. It fails rather than accepting missing assets.

The Nginx configuration changes take effect only when deployed; static redirect HTML is a fallback on hosts without those server rules. Validate the deployed Nginx configuration with `nginx -t` before reload. The existing deployment helper performs configuration validation and rollback.

## After deployment

1. Verify `https://tsb-dev.fr/` as a domain property in Google Search Console using the account's DNS verification record. Keep verification tokens out of source until one is actually supplied.
2. Submit `https://tsb-dev.fr/sitemap-index.xml`. Inspect both localized URLs and request indexing after the release is live.
3. Use URL Inspection to check the rendered page, chosen canonical, indexability, and fetched resources. Validate JSON-LD in Google's Rich Results Test. Valid markup does not guarantee a rich result.
4. Check that the two locale pages, robots, both sitemap files, and social PNG return HTTP 200; root, legacy, and alternate-host URLs should redirect permanently. Missing paths must return HTTP 404 rather than the homepage.
5. Check PageSpeed Insights/Core Web Vitals on mobile after deployment. No Lighthouse score or browser performance measurement is claimed by the repository checks.

This audit could not fetch the live domain through the available web reader. Local build checks do not establish that this release is deployed or indexed. No Search Console access or production deployment was performed as part of the audit.

## Content opportunities

The single-page design gives each language one indexable URL; hash chapters are not separate search landing pages. For broader searches, publish substantive localized case studies with their own routes, genuine screenshots, implementation details, and outcomes. Avoid creating thin pages by repeating GitHub descriptions. Replace placeholder imagery with relevant project screenshots and a real portrait when ready. Keep role, availability, and project descriptions accurate in both languages.

Private repository metadata is public once included in the static portfolio. Fetching private projects still requires the actual App key on the build machine and installation access to those repositories; SEO changes do not repair missing credentials.

## References

- [Astro sitemap integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [Google: localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google: build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Google: profile-page structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
