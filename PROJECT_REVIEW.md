# Architecture and validation notes

This document summarizes the current implementation. [README](README.md), [CI/CD](docs/CICD.md), [deployment](docs/DEPLOYMENT.md), and [SEO](docs/SEO.md) contain the operating instructions.

## Website

Astro generates English and French static pages. The opening presentation and closing contact section surround a PageFlip book containing experience, projects, skills, background, education, principles, and optional public open-source work.

Adaptive pagination measures real content and moves overflow onto new sheets. Keyboard navigation, wheel gestures, chapter links, focus management, and reduced-motion behavior share one controller. Inactive covers are hidden so the typing summary cannot leak through book pages.

## Data and privacy

GitHub requests run only during development rendering or builds. Project ordering follows the latest push. Private project metadata requires App access and explicit repository selection; source content stays private. Public contact details and portfolio identity are intentional website content.

The repository excludes environment files, credentials, signing keys, local caches, release archives, database files, and private operator configuration. Source/history scanning and build-output checks run in CI. Infrastructure bindings live on the deployment host, outside the release.

## Release workflow

Pull requests validate before merge to `main`. A GitHub-hosted workflow builds and publishes a checksummed static release. An outbound deployment service follows the current main commit, promotes the release with rollback, and exposes only its commit/build identifier for health checks. The implementation does not require a production GitHub runner or inbound SSH access from GitHub.

## Verification

Run the commands in README before a release. They cover repository privacy policy, Astro types, mocked GitHub requests, deployment safeguards, production compilation, and generated SEO files. The production workflow checks the actual live version, both locales, sitemap, robots, and social image. Browser interaction and search indexing still require separate review.
