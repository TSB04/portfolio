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

All repositories owned by the configured account are eligible unless archived or disabled, including forks and the profile repository. `GITHUB_REPOSITORIES=*` explicitly permits public display of metadata for all current and future accessible public/private owned repositories. Archive a repository on GitHub to remove it on the next successful build. An empty selection remains public-only; named selections support a curated portfolio. The App must have access to all desired repositories.

This policy publishes names, descriptions, topics, branch names, dates, statistics, and verified submodule names/paths/pinned revisions. Private source code, README text, credentials and private source links remain excluded. Private repositories never populate the open-source chapter.

README excerpts are fetched only for public repositories. Markdown is reduced to plain text and escaped by Astro rather than rendered as repository-supplied HTML. An unavailable README, release, language, or component endpoint does not prevent its parent project from appearing. Private README text and release content are never fetched for display.

For a direct local build without an App PEM file, an optional `GITHUB_USER_TOKEN` can authenticate the repository owner. It uses the authenticated user's owned-repository endpoint. Keep this token in the environment or a private credential store; never commit it or expose it through a `PUBLIC_` variable.

## Selection

Optional values in `.env` or the build environment:

```dotenv
GITHUB_OWNER=tsb04
GITHUB_PROJECT_LIMIT=0
GITHUB_REPOSITORIES=*
```

`GITHUB_REPOSITORIES` is optional. When provided, it filters repository names (or full `owner/name` names). The fetching layer sorts by latest push first, falling back to the update date when no push date is available, with no cap by default. `GITHUB_PROJECT_LIMIT=0` means unlimited; a positive integer enables an optional cap. Listing follows pagination until exhausted.

Project pages include descriptions, topics, creation and last-push dates, default branch, repository size, open issue/pull request count, stars, forks, license, language percentages, and the latest public release when available. Repository size is GitHub's reported size, not a download-size estimate. Private repositories do not populate the open-source chapter.

The presentation layer places SAAY, SunuStream, Invora and Automation Tools first, preserving recency for the remaining projects. Localized editorial overviews live in `src/config/projectPresentation.ts` and use owner-provided content and approved metadata. Other projects gain language/component context where available; private READMEs are never fetched.

Local images match SAAY, Studio/API/AI/homelab, Invora and SunuStream by repository name. Supplied portraits appear on the cover and About pages. Existing screenshots are reused only for matching repository URLs; other projects receive a CSS illustration. Assets named `*-logo` use a compact treatment. Architecture illustrations span the page width, preserve their aspect ratio and open in a native modal with zoom and a full-size link. The viewer uses optimized local images and suspends book navigation while open.

## Submodules

Each parent can display up to twelve direct submodules as component cards. Discovery reads `.gitmodules`, verifies paths against actual Git tree entries with mode `160000`, and displays the pinned revision. Relative URLs, GitHub HTTPS URLs, and GitHub SSH URLs are normalized without cloning code. Non-GitHub hosts, credential-bearing URLs, invalid paths, and ordinary directories are ignored. Requests are processed in small batches and never run in visitors' browsers.

Archived and disabled components are excluded. Public components appear automatically. Private components require explicit selection in `GITHUB_REPOSITORIES` or `GITHUB_SUBMODULE_REPOSITORIES`, or the wildcard policy for components owned by the same account as their parent. The latter adds components without creating standalone project cards. Missing access to a child repository skips that component while preserving the parent. Only the first level of submodules is inspected; nested submodules are not recursively expanded.

```dotenv
GITHUB_SUBMODULE_REPOSITORIES=approved-component,owner/another-approved-component
```

Selecting a private component permits its name, description, language, path and pinned revision to be displayed publicly. It does not publish README content, credentials, private repository links or source files. Review those fields before approving publication.

## Refresh and fallback

Only normalized project metadata is stored in ignored `.cache/github-projects.json`. The cache key includes the installation, selection, privacy policy version, and authentication configuration; caches created under the old public-only policy are invalidated. The cache is shared by English and French and remains fresh for one hour during development. Production builds fetch fresh metadata so archive changes take effect. In-flight calls are shared briefly to avoid duplicate work. Rate limits or outages can use an older matching cache; a cold failure falls back to the existing portfolio projects in `SiteConfig.ts`.

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
