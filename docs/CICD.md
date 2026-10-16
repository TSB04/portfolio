# Continuous integration and deployment

Production deploys only from **main**, after validation. Develop on `dev`, open a pull request, then merge when the checks pass. Pushes to `dev` and pull requests targeting `main` run checks without deploying.

## Pipeline

`.github/workflows/portfolio.yml` uses GitHub-hosted Ubuntu runners and Node 24. It runs `npm ci`, Astro checks, GitHub integration tests, Python deployment tests, a production build, and generated SEO checks. The exact checked build is packaged once and uploaded as a workflow artifact.

For `main`, a production job publishes an immutable-commit prerelease named `portfolio-<commit SHA>`, containing `portfolio.tar.gz`, `promote.py`, and `release.json` with SHA-256 hashes. The server polls for the current main commit every three minutes and deploys only when that commit's complete validated release is available. The job then checks `/version.json` and public pages/assets; it fails if the expected commit is not serving within ten minutes.

The deployment host is on a private network and this repository is public. The solution needs no inbound SSH rule, production SSH secret, or self-hosted GitHub runner. The static release assets are public, like the deployed website. They contain no `.env` files, PEM keys, Git history, or GitHub tokens.

## Initial server setup

Use the existing verified SSH route to run `scripts/install-deploy-service.py` on the production host, passing `deploy/pull-release.py` through stdin. Run it as the production account (`tsb04-prod`); it installs `~/tsb-portfolio/pull-release.py` and updates only its marked cron entry. The user already needs Docker access for the existing promotion mechanism. Other cron entries and neighboring applications are retained.

The poller needs Python 3, outbound HTTPS access to GitHub API/release assets, and the existing Docker deployment infrastructure. No Node.js installation is required on the server.

## GitHub configuration

The `production` environment is limited to `main`. The workflow's validation job has read-only repository permission; only the production release job receives `contents: write`. Pull request code never runs with production credentials or on the production machine. The server executes deployment code only from the exact current main commit's verified release.

Optional repository secrets for fetching private portfolio projects during builds:

- `PORTFOLIO_GITHUB_CLIENT_ID`
- `PORTFOLIO_GITHUB_INSTALLATION_ID`
- `PORTFOLIO_GITHUB_PRIVATE_KEY` (actual PEM text)

The App installation must include the desired private repositories. Without those secrets, builds use public GitHub data or configured fallback projects; no private project fetching is claimed.

## Daily use

```powershell
git push origin dev
# Open and merge a pull request from dev into main after validation.
```

Watch the [Actions workflow](https://github.com/TSB04/portfolio2/actions) for validation and production verification. Run it manually from `main` to retry deployment or rebuild GitHub project data without changing source. Production checks match both commit and workflow run/attempt, so an older build of the same commit does not count as a completed refresh. Never publish deployment prereleases from unreviewed branches.

## Diagnostics and recovery

- `~/tsb-portfolio/deployment.json`: active release, commit, checksum, and previous release.
- `~/tsb-portfolio/pull-release.log`: deployment activity, rotated at 1 MB with two backups.
- `crontab -l`: the marked poller entry; remove only that entry to pause automatic deployment.
- `/version.json`: deployed commit SHA and public build identifier, used by the workflow's health check.

Artifact integrity, archive traversal protection, serialized promotions, Nginx validation, neighboring-ingress preservation, and rollback remain in `deploy/promote.py`. Failed checks do not publish a release. A failed promotion restores the previous site/configuration; a missing release leaves the active site untouched. A newer main commit supersedes pending old builds.

Manual deployment remains available:

```powershell
npm run build
npm run check:seo
python scripts/deploy.py deploy
```

Only merge a Git revert of the desired changes into `main` when an enduring rollback is needed; the service follows main and otherwise redeploys its current commit. Release artifacts are deliberately retained for recovery; no destructive release cleanup is automatic.
