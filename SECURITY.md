# Security policy

## Report a vulnerability privately

Use [GitHub private vulnerability reporting](https://github.com/TSB04/portfolio2/security/advisories/new). Do not open a public issue containing a key, token, private repository content, environment file, or production inventory.

If a credential has been published, revoke or rotate it first. Removing a file or adding a `.gitignore` entry does not invalidate it or remove earlier copies.

## Public and private boundaries

This is a public portfolio repository. The owner's name, professional biography, social links, and published contact details are intentional public content. Infrastructure inventory, credentials, signing material, environment files, build caches, and operational backups are private.

- Keep environment values in ignored `.env` files or GitHub Secrets; only empty/public templates are tracked.
- Keep App PEM files outside the checkout, `public/`, and `dist/`.
- Keep server bindings in private `operator.json`, not source defaults or documentation.
- Explicitly select any private GitHub project whose metadata may appear publicly. App installation access alone does not authorize publication.
- Keep `LICENSE`, `NOTICE`, and third-party notices when reusing the project.

## Automated checks

CI runs Gitleaks against fetched Git history and the generated website. The scanner binary version and download checksum are pinned. Reports are redacted; secret reports are not published as public artifacts.

`npm run check:public` rejects tracked private file paths, key material, operator home paths, and private network addresses. Release packaging checks the generated site before publishing it. Ignore rules prevent accidental additions but are not encryption and do not protect files added with `git add --force`.

The audit on 16 October 2026 found no credential patterns in the 23 commits scanned. Unnecessary infrastructure identifiers were removed from current source defaults and public operator documentation. Earlier commits and existing release copies may still contain those old identifiers; forward commits do not erase history. A coordinated history rewrite and cache/fork cleanup is a separate operation, not a substitute for credential rotation.

No scanner can guarantee that every sensitive value is detectable. Review descriptions, images, and build artifacts before publishing, especially when enabling private GitHub data.
