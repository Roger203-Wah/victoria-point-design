# Claude Collaboration Guide — 14 Prescoter Drive

This is the shared source repository for the **14 Prescoter Drive, Victoria Point** renovation design presentation and project tracker. It is a premium React/Vite static site. Treat `main` as the shared source of truth; make focused changes on a branch or through a pull request whenever possible.

## Project intent

The property is being renovated as a future rental rather than a forever home. Design choices must remain **Premium Economy**: durable, renter-proof, broadly appealing, and cohesive rather than overcapitalised. Maintain the warm-minimal studio aesthetic: linen backgrounds, deep warm-brown typography, muted sage accents, Fraunces display type, and Plus Jakarta Sans body type.

## Essential files

| Purpose                          | File                           |
| -------------------------------- | ------------------------------ |
| Main design presentation         | `client/src/pages/Home.tsx`    |
| Project tracker UI               | `client/src/pages/Tracker.tsx` |
| Tracker data source              | `client/src/data/tracker.ts`   |
| Routing                          | `client/src/App.tsx`           |
| Global styling and design tokens | `client/src/index.css`         |
| Package scripts                  | `package.json`                 |

The presentation route is `/` and the tracker route is `/tracker`.

## Updating the tracker safely

Make tracker-content edits in `client/src/data/tracker.ts`, not in the UI component. Keep `Phase.id` values stable because spend rows reference them. Log every real spend in `SPEND_LOG`, including small DIY purchases. Use the actual transaction date and supplier where known; receipts can be short references only. Update `LAST_UPDATED` whenever tracker data changes. Do not invent spend, quotes, supplier names, certification outcomes, or completion states.

## Renovation guardrails

Preserve the agreed project sequence: complete the outside first where practical; kitchen before interior room-by-room works; lounge, master, bedrooms 3 and 4, then bedroom 2/office; LVP in kitchen/hall/dining/entry last; and bathrooms/laundry around September 2026. The side access is a rolling project, not an ordered phase. DIY demolition and painting are assumed unless a project note says otherwise. Do not turn the current driveway into a scope item.

The current tracker budget range is **$118k–$142k**, including the existing $15,000 estimated pre-tracker exterior spend. Preserve confirmed quote values unless Jeremy supplies a replacement: pool coping $10,939 inc. GST, ShawCon bathroom/ensuite works $45,300 inc. GST, and plumbing $7,485 inc. GST.

## Development and validation

```bash
pnpm install
pnpm check
pnpm build
```

Run `pnpm check` and `pnpm build` after every substantive change. Keep the project frontend-only; do not add a database, authentication, external API, or server-side code merely to support tracker edits. Do not edit `server/` unless explicitly requested. Avoid storing large image files inside the repository; existing visuals are CDN-hosted.

## Shared workflow

1. Pull the latest `main` before beginning work.
2. Read this file and the relevant source file before changing it.
3. Make the narrowest valid change.
4. Run the validation commands above.
5. Commit with a clear message and open a pull request or push the reviewed change.
6. Include a short summary of changed files, validation results, and any visual or data assumptions.

## Publishing to the live site

The live site is the `live` branch, served locally by the owner. GitHub Actions builds `main` on every push and publishes only the static site, `serve.js`, and `README-LIVE.md` to `live`. From that checkout, `node serve.js` serves http://localhost:8080. Do not claim a push to `main` is on the owner's machine until that publish has finished and the local `live` checkout has been updated. Manus is not part of this workflow.
