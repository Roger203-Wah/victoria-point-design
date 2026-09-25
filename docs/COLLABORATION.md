# Collaboration and Deployment Workflow

## Purpose

This repository is the durable, shared editing surface for the 14 Prescoter Drive renovation presentation. It allows Claude, Manus, and human collaborators to work from the same reviewed source instead of relying on a single chat session.

## Source-of-truth model

GitHub `main` is the canonical code and content history. The private repository should contain all source files, the tracker data, and collaboration instructions. The live Manus site is a managed deployment of this source; it is not currently configured for automatic GitHub deployment.

## Editing workflow

Each collaborator should pull the latest `main`, make a focused change, run `pnpm check` and `pnpm build`, then commit with a descriptive message. A pull request is preferred for design, scope, budget, or tracker changes because it creates an auditable decision trail. Small factual tracker updates may be committed directly only when the account owner has requested that workflow.

## Tracker updates

Record all actual project spending in `client/src/data/tracker.ts`. Expenses should be granular enough to reconcile with receipts, including small purchases such as hardware, consumables, or delivery fees. Preserve existing phase IDs. Update `LAST_UPDATED` whenever phase data or spend changes. Keep quotes and budgets separate from actual spend.

## Syncing GitHub changes to the live Manus site

After a Claude or GitHub change is approved, the Manus project maintainer should pull the matching Git commit into the managed WebDev project, inspect the diff, run `pnpm check` and `pnpm build`, save a WebDev checkpoint, and publish. The published site should be tested at both `/` and `/tracker`. A GitHub push alone does not update the existing Manus site.

## Conflict rule

Never overwrite another collaborator's work wholesale. Rebase or merge deliberately, reconcile conflicts in `client/src/data/tracker.ts` carefully, and retain every confirmed spend entry unless it was demonstrably duplicated or corrected by Jeremy.
