# Damian Pérez · Personal portfolio

Bilingual personal portfolio at **https://damianperez.dev**. Built with Next.js, React and Framer Motion; exported as static files and hosted in Damian's personal Cloudflare account.

The landing lives at `/`; the project catalog lives at `/portfolio/`. English equivalents are `/en/` and `/en/portfolio/`. Navigation does not add URL fragments.

## Development

```sh
npm ci
npm run dev
```

## Verification and preview

```sh
npm run lint
npm run typecheck
npm run format:check
npm run build
npm test
npm audit --omit=dev
npm run preview
```

The background worker is bundled automatically before `dev` and `build`; after editing its source during a dev session, rebuild it with `node scripts/build-hero-worker.mjs`. The static preview is http://localhost:4175. Browser tests use installed Google Chrome, desktop and mobile viewports. A production build is required before the preview and browser tests.

## Deployment

The checked-in account is Damian's personal account, not Clyra's. Credentials are never stored in this repository. On Damian's Mac, use the separate Wrangler login:

```sh
export XDG_CONFIG_HOME=/Users/damianperez/.config/cloudflare-personal
npx wrangler whoami
npm run build
npx wrangler deploy --env staging
```

Staging: https://damian-pebe-portfolio-staging.damian-pebe.workers.dev

After verification and explicit authorization for the production release, promote the reviewed revision to main and deploy the same `out/` files:

```sh
npx wrangler deploy --env=''
# Only if changing the separate www redirect:
npx wrangler deploy --config wrangler.redirect.jsonc
```

Production: https://damianperez.dev. The `www` hostname redirects to the canonical domain. Custom-domain bindings provision DNS and HTTPS through Cloudflare Workers.

The main site is an assets-only Worker. A separate small Worker redirects www while preserving paths and query strings, so canonical asset requests do not invoke Worker code. No application server, API keys, database or paid plan is needed.

See [architecture](docs/architecture.md), [verification](docs/verification.md) and [third-party notices](docs/THIRD_PARTY_NOTICES.md).
