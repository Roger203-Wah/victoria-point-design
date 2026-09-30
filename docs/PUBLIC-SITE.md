# Public site

The design presentation (`/`) and the project tracker (`/tracker`) are a static site. GitHub `main` is the source. The repository is public, so a host can clone it without a private-repo credential.

## GitHub Pages

`.github/workflows/pages.yml` deploys on every push to `main`, and when someone runs the workflow by hand. It uses Node 22, `pnpm install --frozen-lockfile`, and `pnpm build`, then publishes `dist/public` with `actions/upload-pages-artifact` and `actions/deploy-pages`.

The project site address is:

https://roger203-wah.github.io/victoria-point-design/

That host serves the site from `/victoria-point-design/`, not from the domain root. The workflow sets `GITHUB_PAGES_BASE` so Vite emits asset and image URLs under that path. `pnpm dev`, the `live` branch, Cloudflare, and Vercel do not set that variable, so they stay at `/`.

GitHub Pages does not read `client/public/_redirects`. The build copies `index.html` to `dist/public/404.html` (fallback for unknown routes) and to `dist/public/tracker/index.html` so `/tracker` returns the app. Refreshing `/tracker` loads the same page.

Do not claim that address is up to date until the **Deploy GitHub Pages** workflow on `main` has succeeded.

The site has to be created once in the repository settings. Automation cannot do that step: creating a Pages site needs a repository admin, and the GitHub Actions token is not allowed to create it. If the workflow fails at **Setup Pages** with `Get Pages site failed` / `Not Found`:

1. Open <https://github.com/Roger203-Wah/victoria-point-design/settings/pages>.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**. Save if GitHub asks.
3. Re-run **Deploy GitHub Pages** on `main`.

After that, pushes to `main` publish on their own.

The `live` branch and `node serve.js` remain the local copy. They are not a public URL.

## Cloudflare Pages retry

The repository is public. An existing Cloudflare Pages project can clone it and rebuild without new credentials. Use **Retry deployment** with these settings. The Vite preset publishes `dist`, which is the wrong folder.

| Setting | Value |
| --- | --- |
| Project name | `victoria-point-design` |
| Production branch | `main` |
| Framework preset | None |
| Root directory | empty (repository root, not `client`) |
| Build command | `pnpm build` |
| Build output directory | `dist/public` |
| Environment variable `PNPM_VERSION` | `10.4.1` |

Do not set `GITHUB_PAGES_BASE` on Cloudflare. The site is served from the domain root there, so the default Vite base `/` is correct. Node.js 22 comes from `.node-version`.

`client/public/_redirects` is copied into the build so `/tracker` serves the app. `wrangler.toml` records the same output directory for a manual `npx wrangler pages deploy`. The Git connection does not read the build command from that file.

A successful retry shows an address of the form `https://<project-name>.pages.dev`. Use the address Cloudflare displays. Open `/` and `/tracker`, then refresh `/tracker`.

Later pushes to `main` rebuild that project as well as GitHub Pages. A push is public only after the deployment you are sharing has succeeded.

## Vercel

Use this if you would rather connect Vercel. One host is enough.

1. Create a free account at <https://vercel.com/signup> and continue with GitHub.
2. Choose **Add New** → **Project** and import `Roger203-Wah/victoria-point-design`.
3. Leave the root directory as the repository root. `vercel.json` sets `pnpm install --frozen-lockfile`, `pnpm build`, output directory `dist/public`, and a rewrite so `/tracker` works. If the import screen shows output directory `dist`, change it to `dist/public`.
4. Deploy. Copy the address Vercel shows. It has the form `https://<project-name>.vercel.app`.
5. Open `/`, open `/tracker`, and refresh `/tracker`.

## What stays unchanged

A custom domain is optional. Connecting a host does not change tracker numbers. Spend stays in `client/src/data/tracker.ts`.
