# Collaboration and Deployment Workflow

## Purpose

This repository is the durable, shared editing surface for the 14 Prescoter Drive renovation presentation. It allows Claude and human collaborators to work from the same reviewed source instead of relying on a single chat session.

## Source-of-truth model

GitHub `main` is the canonical code and content history. The public repository contains the source files, the tracker data, and collaboration instructions.

The live site is the `live` branch. On every push to `main`, GitHub Actions installs dependencies, runs `pnpm check` and `pnpm build`, and publishes the built static site to `live`. That branch contains only the built files, a zero-dependency `serve.js`, and `README-LIVE.md`. The owner serves `live` locally. Manus is not involved.

## Editing workflow

Each collaborator should pull the latest `main`, make a focused change, run `pnpm check` and `pnpm build`, then commit with a descriptive message. A pull request is preferred for design, scope, budget, or tracker changes because it creates an auditable decision trail. Small factual tracker updates may be committed directly only when the account owner has requested that workflow.

## Tracker updates

Record all actual project spending in `client/src/data/tracker.ts`. Expenses should be granular enough to reconcile with receipts, including small purchases such as hardware, consumables, or delivery fees. Preserve existing phase IDs. Update `LAST_UPDATED` whenever phase data or spend changes. Keep quotes and budgets separate from actual spend.

## Running the live site

On the computer that displays the site, check out the `live` branch and keep it updated from GitHub. From that folder, run:

```bash
node serve.js
```

Then open http://localhost:8080. The server listens on port 8080 unless `PORT` is set or a port is passed as an argument (`node serve.js 3000`). Refreshing `/` or `/tracker` falls back to `index.html`, so both routes keep working.

A push to `main` updates the owner's screen only after GitHub Actions finishes publishing `live` and the local checkout pulls that branch.

## Public shareable link

The `live` branch is local only. The public HTTPS address is GitHub Pages: `https://roger203-wah.github.io/victoria-point-design/`. The repository is public, so Cloudflare can clone it. Retry an existing Cloudflare Pages project with framework None, build `pnpm build`, output `dist/public`, and `PNPM_VERSION=10.4.1`. Build settings are in `docs/PUBLIC-SITE.md`. The host address is public, including the tracker. Do not claim a public URL is current until that host shows a successful deployment.

## Conflict rule

Never overwrite another collaborator's work wholesale. Rebase or merge deliberately, reconcile conflicts in `client/src/data/tracker.ts` carefully, and retain every confirmed spend entry unless it was demonstrably duplicated or corrected by Jeremy.
