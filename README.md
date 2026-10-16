# TSB portfolio

Personal portfolio for Thierno Sadou BARRY, built with Astro 7, TypeScript, Tailwind CSS 4, and PageFlip. English and French versions are available at `/en` and `/fr`.

The full-screen presentation and contact/footer surround an interactive book containing experience, projects, skills, and background. Pages adapt to the viewport; reading controls reveal on proximity, focus, or touch.

## Development

Node.js 22.12 or later is required.

```sh
npm install
npm run dev
npm run astro check
npm run test:github
npm run build
npm run check:seo
npm run preview
```

Production output is static in `dist/`. Build and deploy again to publish content updates.

## GitHub projects

Project pages load repository descriptions, topics, languages, stars, forks, licenses, and available homepage links at build time. Projects sort by latest push, newest first. Metadata is cached locally for one hour; an older matching cache or configured portfolio content is used during API failures.

The public API works without credentials locally. Production can authenticate through the GitHub App variables in `.env` or CI secrets. Accessible private projects are included as metadata; private README content and source links remain omitted. Credentials remain on the build side. Archived, disabled, and forked repositories are excluded.

See [GitHub setup and selection](docs/GITHUB.md) and [.env.example](.env.example) for configuration, refresh instructions, repository ordering, and authentication details. Do not overwrite an existing `.env` when following setup examples.

## Content and styles

- `src/config/SiteConfig.ts`: bilingual presentation, experience, skills, education, and local fallback projects.
- `src/lib/github.ts`: server-only GitHub data source.
- `src/i18n/`: localized interface text.
- `src/styles/global.css`: semantic light/dark tokens and responsive layouts.
- `src/scripts/`: book interaction and adaptive pagination.

Secrets, PEM files, environment files, generated output, and the metadata cache must remain outside version control. Keep keys out of `public/` and `dist/`.

## Production

Live at https://tsb-dev.fr/. See [production deployment](docs/DEPLOYMENT.md) for the verified SSH workflow, release retention, ingress, and certificate renewal.

Merge validated changes into `main` to deploy automatically. The [CI/CD guide](docs/CICD.md) covers GitHub Actions, the outbound deployment service, optional private-repository secrets, and recovery. See [SEO checks and indexing](docs/SEO.md) for sitemap and Search Console setup.
