# GitHub project source

The localized homepage fetches projects in Astro frontmatter through `src/lib/github.ts`. This runs during development rendering and production builds. The deployed portfolio stays fully static: visitors do not call GitHub and receive no authentication material.

## Authentication

The existing environment variables are supported:

- `GITHUB_CLIENT_ID` (preferred JWT issuer) or `GITHUB_APP_ID`
- `GITHUB_INSTALLATION_ID`
- `GITHUB_PRIVATE_KEY_PATH`: absolute PEM path on the machine running the build
- Alternatively, `GITHUB_PRIVATE_KEY`: PEM text; literal `\n` line breaks are supported for CI secrets.

When the key is available, the integration signs a short-lived RS256 JWT and requests read-only `metadata` and `contents` permissions. Contents access discovers submodule declarations; if that permission is not granted, authentication retries with metadata-only access. The App must have access to every private parent and component repository it reads. The private key remains in server memory and tokens are never cached to disk.

The production key path may be a placeholder locally. A missing key file, or no App configuration, selects the public API. Invalid keys or failed authentication use previously cached project metadata, or the existing local portfolio content if no cache exists. No live production App authentication was performed during implementation because the configured file is a production placeholder.

Active, non-forked repositories owned by the configured account are eligible, including explicitly selected private repositories accessible to the authenticated GitHub App installation. Private names must be listed in `GITHUB_REPOSITORIES`; an empty selection includes public repositories only. Install the App on all desired repositories (or select them explicitly in GitHub). Without working App credentials, only public repositories can be fetched. Private project metadata (names, descriptions, topics, dates, and language statistics) appears on the public portfolio. Private source and README links are omitted; private repositories do not populate the open-source chapter.

README excerpts are fetched only for public repositories. Markdown is reduced to plain text and escaped by Astro rather than rendered as repository-supplied HTML. An unavailable README, release, language, or component endpoint does not prevent its parent project from appearing. Private README text and release content are never fetched for display.

For a direct local build without an App PEM file, an optional `GITHUB_USER_TOKEN` can authenticate the repository owner. It uses the authenticated user's owned-repository endpoint. Keep this token in the environment or a private credential store; never commit it or expose it through a `PUBLIC_` variable.

## Selection

Optional values in `.env` or the build environment:

```dotenv
GITHUB_OWNER=tsb04
GITHUB_PROJECT_LIMIT=12
GITHUB_REPOSITORIES=portfolio2,ms_estiam,Teranga-Digital
```

`GITHUB_REPOSITORIES` is optional. When provided, it filters repository names (or full `owner/name` names). All selections are sorted by latest push first, falling back to the update date when no push date is available, with a default limit of 12 (maximum 24).

Project pages include descriptions, topics, creation and last-push dates, default branch, repository size, open issue/pull request count, stars, forks, license, language percentages, and the latest public release when available. Repository size is GitHub's reported size, not a download-size estimate. Private repositories do not populate the open-source chapter.

Local brand images are used for SAAY and SunuStream. Existing screenshots are reused only for matching repository URLs; other projects receive a CSS illustration.

## Submodules

Each parent can display up to twelve direct submodules as component cards. Discovery reads `.gitmodules`, verifies paths against actual Git tree entries with mode `160000`, and displays the pinned revision. Relative URLs, GitHub HTTPS URLs, and GitHub SSH URLs are normalized without cloning code. Non-GitHub hosts, credential-bearing URLs, invalid paths, and ordinary directories are ignored. Requests are processed in small batches and never run in visitors' browsers.

Public components can appear automatically. Private component metadata requires explicit selection in `GITHUB_REPOSITORIES` or `GITHUB_SUBMODULE_REPOSITORIES`. The latter adds components without creating standalone project cards. Missing access to a child repository skips that component while preserving the parent. Only the first level of submodules is inspected; nested submodules are not recursively expanded.

```dotenv
GITHUB_SUBMODULE_REPOSITORIES=approved-component,owner/another-approved-component
```

Selecting a private component permits its name, description, language, path and pinned revision to be displayed publicly. It does not publish README content, credentials, private repository links or source files. Review those fields before approving publication.

## Refresh and fallback

Only normalized project metadata is stored in ignored `.cache/github-projects.json`. The cache key includes the installation, selection, privacy policy version, and authentication configuration; caches created under the old public-only policy are invalidated. The cache is shared by English and French and remains fresh for one hour. In-flight calls are shared briefly to avoid duplicate work. Rate limits or outages can use an older matching cache; a cold failure falls back to the existing portfolio projects in `SiteConfig.ts`.

New GitHub changes require a new build and deployment. To refresh before the cache expires in PowerShell:

```powershell
Remove-Item -LiteralPath .cache/github-projects.json -ErrorAction SilentlyContinue
npm run build
```

Restart the development server as well if it is retaining a recently loaded result. Optional configuration changes also take effect on a new build/server restart. No webhook, scheduled build, or deployment automation is added.

Copy variable names from `.env.example` when setting up another environment. Never place a PEM file in `public/` or `dist/`, and never prefix authentication variables with `PUBLIC_`. Environment files, caches, and key files are ignored by Git.

## Verification

`npm run test:github` runs isolated tests with mocked HTTP responses and generated fixture keys. It checks unauthenticated public-only filtering, authenticated private inclusion, signed App authentication, newest-first ordering, homepage URL validation, missing-key public mode, cache/rate-limit fallback, and exclusion of authentication material from the cache.

The App JWT behavior follows [GitHub's authentication documentation](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-json-web-token-jwt-for-a-github-app).
