# Public site

The design presentation (`/`) and the project tracker (`/tracker`) are a static site. GitHub `main` is the source. This file is the owner's path to a shareable HTTPS address.

No public URL exists until a host shows a successful deployment. Use the address on that project's page. Do not share a guessed `pages.dev` or `vercel.app` link.

## Before you start

Merge the open pull request that removes the Manus build plugin into `main`. Cloudflare and Vercel build the production branch. Until that merge, `main` still uses the old Manus build.

The GitHub repository can stay private. The site address is public. Anyone with the link can read the design presentation and the tracker, including budget and spend.

The `live` branch and `node serve.js` remain the local copy. They are not a public URL.

## Cloudflare Pages

About five minutes, after the pull request is merged.

1. Create a free Cloudflare account at <https://dash.cloudflare.com/sign-up>. Choose **Continue with GitHub** when it is offered.
2. Open **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Authorize Cloudflare for `Roger203-Wah/victoria-point-design`.
4. Select that repository. Use the settings below. The Vite preset publishes `dist`, which is the wrong folder for this repository.

| Setting | Value |
| --- | --- |
| Project name | `victoria-point-design` |
| Production branch | `main` |
| Framework preset | None |
| Root directory | empty (repository root, not `client`) |
| Build command | `pnpm build` |
| Build output directory | `dist/public` |
| Environment variable `PNPM_VERSION` | `10.4.1` |

Node.js 22 comes from `.node-version`. You do not need to set `NODE_VERSION`.

5. Deploy and wait until the deployment status is Success.
6. Copy the address Cloudflare shows on the project page. It has the form `https://<project-name>.pages.dev`. With the project name above, that is `https://victoria-point-design.pages.dev` unless that name was already taken on the account. If Cloudflare changes the name, use the address it displays.
7. Open `/`, open `/tracker`, and refresh `/tracker`.

Later pushes to `main` rebuild the public site. A push is public only after that deployment succeeds.

`client/public/_redirects` is copied into the build so `/tracker` serves the app. `wrangler.toml` records the same output directory for a manual `npx wrangler pages deploy`. The Git connection does not read the build command from that file. The table above is what the dashboard needs.

## Vercel

Use this if you would rather connect Vercel. One host is enough.

1. Create a free account at <https://vercel.com/signup> and continue with GitHub.
2. Choose **Add New** → **Project** and import `Roger203-Wah/victoria-point-design`.
3. Leave the root directory as the repository root. `vercel.json` sets `pnpm install --frozen-lockfile`, `pnpm build`, output directory `dist/public`, and a rewrite so `/tracker` works. If the import screen shows output directory `dist`, change it to `dist/public`.
4. Deploy. Copy the address Vercel shows. It has the form `https://<project-name>.vercel.app`.
5. Open `/`, open `/tracker`, and refresh `/tracker`.

## What stays unchanged

A custom domain is optional. The host address is already shareable HTTPS. Connecting a host does not change tracker numbers. Spend stays in `client/src/data/tracker.ts`.
