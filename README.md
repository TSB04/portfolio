# TSB Portfolio

An interactive, bilingual engineering portfolio by [Thierno Sadou BARRY](https://tsb-dev.fr), built with Astro 7, TypeScript, Tailwind CSS 4, and PageFlip.

**[Live website](https://tsb-dev.fr)** | [MIT license](LICENSE) | [Attribution](NOTICE) | [Security](SECURITY.md)

## Features

- English and French pages at `/en/` and `/fr/`.
- Responsive book with page turns, chapter navigation, keyboard controls, and reduced-motion support.
- Split hero with a typing summary and an optional image.
- GitHub projects ordered by latest push, fetched only at build time.
- Self-hosted fonts, optimized images, localized metadata, structured data, sitemap, and robots rules.
- CI validation and automatic deployment after merge to `main`.

The website is fully static. Visitors receive no GitHub credentials and make no runtime GitHub API requests.

## Start locally

Requires Node.js **22.12 or later**; CI uses Node 24. Python 3 is needed for repository and deployment checks.

```sh
npm ci
npm run dev
```

GitHub authentication is optional. Use public data without credentials, or create a local `.env` from [.env.example](.env.example). Keep any actual keys outside the repository and the public build. Never overwrite an existing environment file when setting up a clone.

## Validate

```sh
npm run check:public
npm run astro check
npm run test:github
python -m unittest discover -s tests -p 'test_*.py'
npm run build
npm run check:seo
npm run preview
```

CI also scans Git history and the generated site with Gitleaks. `dist/`, local environment files, keys, caches, archives, and operator configuration are not source files.

## Customize your copy

| File | Purpose |
| --- | --- |
| `src/config/SiteConfig.ts` | Identity, summaries, experience, projects, skills, and both locales |
| `src/i18n/` | English and French interface text |
| `src/styles/global.css` | Theme tokens and responsive book styles |
| `src/assets/images/` | Local imagery and technology icons |
| `astro.config.mjs` | Site URL, fonts, integrations, and sitemap policy |
| `scripts/generate-social-image.mjs` | Social preview; run `npm run generate:social` after editing |

Replace personal details, screenshots, links, and deployment URLs before publishing your own portfolio. Keep third-party license notices. Personal branding does not imply the original author's endorsement of a derivative site.

## GitHub projects

Public repositories work without App credentials. An authenticated App can include a private project only when its name is explicitly listed in `GITHUB_REPOSITORIES`. That selection publishes its metadata, so use only descriptions and links intended for public display. Private README content and source links are omitted. Forked, archived, and disabled projects are excluded.

See [GitHub configuration](docs/GITHUB.md) for permissions, selection, caching, and refresh behavior.

## Deploy

Develop on `dev`, open a pull request to `main`, and merge after validation. GitHub Actions publishes a checked release, the production service pulls it over HTTPS, and the workflow verifies the live commit/build. Production connection details are kept in private operator configuration, not this public repository.

- [CI/CD and retries](docs/CICD.md)
- [Deployment and recovery](docs/DEPLOYMENT.md)
- [SEO and indexing](docs/SEO.md)
- [Security policy](SECURITY.md)

## License and attribution

This project is free to use, modify, redistribute, and use commercially under the [MIT License](LICENSE). Retain the copyright and license notice identifying **Thierno Sadou BARRY** in copies or substantial portions. [NOTICE](NOTICE) provides an attribution example and third-party rights information.

Suggested credit: **Based on TSB Portfolio by [Thierno Sadou BARRY](https://tsb-dev.fr).**
