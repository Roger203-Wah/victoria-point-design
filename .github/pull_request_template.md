## Change summary

Describe the focused change and its intended outcome.

## Tracker data (if applicable)

- [ ] New spend entries use the correct phase ID.
- [ ] `LAST_UPDATED` was changed.
- [ ] No confirmed historical spend or quote was removed without a stated correction.

## Validation

- [ ] `pnpm check`
- [ ] `pnpm build`
- [ ] Visual verification completed for `/` and/or `/tracker` when UI changed.

## Publication

Merging to `main` publishes the static site to the `live` branch automatically. The owner updates a local checkout of `live` and runs `node serve.js`.
