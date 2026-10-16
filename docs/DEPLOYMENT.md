# Production deployment

The portfolio is served at **https://tsb-dev.fr/**. HTTP redirects to HTTPS. Both `/en/` and `/fr/` are static pages; the root page opens the English version. `www.tsb-dev.fr` is also covered by the certificate.

## Infrastructure

- Production: `tsb04-prod@192.168.1.160` (`ubuntu-prod`), public IPv4 `82.64.250.254`.
- Verified SSH route from this workstation: `root@127.0.0.1:2222` jump gateway. Host-key checking remains enabled.
- Dedicated service: Compose project `tsb-portfolio`, container `tsb-portfolio`.
- Operator directory: `/home/tsb04-prod/tsb-portfolio`.
- Releases: `releases/<UTC-timestamp>-<artifact-hash>/site`; `current` selects the active static root.
- Internal origin alias: `tsb-portfolio-origin`, on the existing external `sunustream_sunustream` network. No additional host ports are published.
- Shared TLS ingress: `sunustream-nginx`. The portfolio virtual host is retained in `sunustream-cd/control/ingress-extra.conf` and the active ingress template. Saay and SunuStream routes are preserved.

## Deliver a new release

The default workflow is now to merge into `main`. GitHub Actions validates and packages the exact commit; the production host pulls its release over HTTPS and the workflow verifies the deployed commit. See [CI/CD](CICD.md). The SSH workflow below remains available for manual recovery.

From this checkout, with the Saay gateway available:

```powershell
npm run test:github
npm run astro check
npm run build
npm run check:seo
python scripts/deploy.py deploy
```

The delivery client snapshots the **built `dist/` output**, not the Git index or repository history. It uploads a SHA-256-verified archive and the reviewed Nginx/Compose configuration over SSH. Local artifacts are kept under ignored `.deploy/`. The server retains versioned releases and configuration backups, recreates only the portfolio service, validates the shared Nginx configuration, and gracefully reloads the ingress.

Environment files, Git metadata, private keys, and the GitHub cache are not deployed. GitHub data is already rendered into the static build. To use App authentication for a future build, provide the actual key on the machine performing that build; the currently configured path is a production placeholder.

Failed promotion restores the previous portfolio release when available, along with the prior ingress configuration. On a first deployment there is no earlier portfolio release; failure stops the new service and restores the ingress. No existing application volumes are removed.

## HTTPS

The Let's Encrypt certificate covers `tsb-dev.fr` and `www.tsb-dev.fr`. DNS A records must resolve to `82.64.250.254`; stale AAAA records should not route visitors elsewhere.

The host's existing `certbot.timer` is enabled and active. Its webroot is `/var/www/certbot`; shared ingress serves ACME challenges independently of the portfolio container. The existing host deployment hook reloads `sunustream-nginx` after renewal.

Certificate creation was performed with the installed Certbot Docker image. Its host-oriented reload hook could not run inside the container, so ingress was explicitly reloaded and TLS verified during promotion. The hook command uses `/usr/bin/docker`, which is available in the host timer's environment. A non-destructive renewal dry-run validates domain challenges with directory hooks disabled inside the container.

After provisioning or renewing a certificate manually, the reviewed HTTPS route can be applied using:

```powershell
python scripts/deploy.py tls
```

## Verification and recovery

Read `/home/tsb04-prod/tsb-portfolio/deployment.json` for the active artifact hash, release, previous site path, and TLS state. Backups are under `backups/` with private permissions. Keep existing releases, backups, and shared ingress extension files; do not use `docker compose down -v` or prune shared application data.

The portfolio container has a locale-page health check. Test public pages and hashed assets after changes, then check that `https://saay.store/` and `https://sunuflix.online/` still respond.

The first release was verified on 16 October 2026: both locale pages, presentation/book/contact transitions, GitHub project details, mobile layout, valid HTTPS, and existing neighboring services passed. Public browser verification reported no failed assets or JavaScript errors.
