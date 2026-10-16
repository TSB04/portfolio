# Deployment and recovery

## Normal releases

Merge a validated pull request from `dev` into `main`. The [CI/CD pipeline](CICD.md) builds once, publishes a checksummed release, and verifies the deployed commit and build identifier. Production pulls over outbound HTTPS; no production SSH credentials are stored in GitHub Actions.

Only the public static website, generic deployment templates, and promotion script are release assets. Never put secrets, private inventory, operator configuration, or backups in a release.

## Private operator configuration

Connection addresses, SSH accounts, gateway settings, and infrastructure inventory belong outside this public checkout.

On the deployment host, create `~/tsb-portfolio/operator.json` using the structure in [operator.example.json](../deploy/operator.example.json). Set its real ingress container, ingress extension path, and existing Docker network privately; restrict the file to the deployment account with mode `0600`. The promoter loads this file locally and passes the network setting to Compose. It is never included in the release bundle.

The deployment account needs Python 3, Docker/Compose access, and permission to update the configured ingress files. The ingress must retain valid TLS certificates for the configured public domains. Keep DNS and certificate-renewal configuration in the private operations runbook.

## Manual release

Use this for recovery or a deliberate manual release from reviewed source:

```sh
npm run check:public
npm run astro check
npm run test:github
python -m unittest discover -s tests -p 'test_*.py'
npm run build
npm run check:seo
python scripts/deploy.py deploy --host deploy-user@example.invalid
```

Replace the example destination privately. An optional gateway can be supplied with `--jump`. Alternatively, set `PORTFOLIO_SSH_HOST` and `PORTFOLIO_SSH_JUMP` in your local shell or private secret store. There is no production destination embedded in the script. Host-key verification stays enabled.

`python scripts/deploy.py package` validates and packages without SSH. Local release files are written under ignored `.deploy/`. The packaging step rejects private file types, credential material, and private operator configuration before upload.

## TLS configuration

After the operator has provisioned certificates and reviewed the ingress template:

```sh
python scripts/deploy.py tls --host deploy-user@example.invalid
```

The script validates Nginx and reloads the configured ingress. It does not create certificates or change DNS.

## State and recovery

Private deployment state is stored under `~/tsb-portfolio/`:

- `deployment.json`: active release, commit, checksum, and previous release.
- `releases/`: versioned site files; `current` selects the active site.
- `backups/`: private configuration backups.
- `pull-release.log`: rotated deployment logs.
- `operator.json`: private infrastructure bindings.

Promotions serialize access, validate archive paths and hashes, preserve existing ingress routes, and check both locales and public SEO resources. Failure restores the previous site/configuration when available. Do not delete shared application volumes or unrelated ingress blocks while recovering this site.

Check the live URLs and neighboring applications using the private runbook. For a lasting rollback, merge a source revert into `main`; otherwise the deployment service continues following the current main release.
