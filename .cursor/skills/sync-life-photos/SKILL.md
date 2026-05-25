---
name: sync-life-photos
description: >-
  Sync Life page image assets after adding photos or editing lifePhotoEntries in
  data/life.ts. Regenerates thumbhashes and dimensions, validates files match
  entries. Use when the user invokes /sync-life-photos, adds life photos, uploads
  to public/img/life, or asks to sync or refresh life image placeholders.
disable-model-invocation: true
---

# Sync Life photos

Run this after the user has added image files and/or entries to `lifePhotoEntries` in `data/life.ts`.

## Workflow

1. **Read entries** — Parse `src` values from `lifePhotoEntries` in `data/life.ts`.

2. **List files** — List image files in `public/img/life/` (`.png`, `.jpg`, `.jpeg`, `.webp`; skip `@2x` variants).

3. **Validate** — Report mismatches before generating:
   - Entry in `lifePhotoEntries` but no file on disk → warn; do not invent files.
   - File on disk but no entry → list it; ask if the user wants an entry added (only if they ask).

4. **Generate assets** — From the repo root:

   ```bash
   npm run sync:life
   ```

   This updates `data/imageDimensions.ts` (dimensions for all images; thumbhashes for life photos). Do not edit that file manually.

5. **Verify** — Confirm every entry `src` appears in `data/imageDimensions.ts` with `width`, `height`, and `thumbhash`.

6. **Summarize** — Tell the user:
   - How many photos synced
   - Any warnings from step 3
   - That thumbhashes and dimensions are ready; refresh the browser if dev server is running

## What the user edits (not you, unless asked)

Only `lifePhotoEntries` in `data/life.ts`:

```typescript
{
  src: "/img/life/10.png",
  title: "Caption",
  date: "May 26",
},
```

Optional: update `LIFE_HERO_INDEX` if the hero photo changed.

## Do not

- Commit unless the user explicitly asks
- Edit `data/imageDimensions.ts` by hand
- Run a production build unless the user asks — `sync:life` is enough for local dev

## Project context

- Grid, zoom, and arrow navigation read from `lifePhotos` (entries + generated thumbhashes)
- Production builds run the same generator via `prebuild`; local dev needs an explicit sync
- See `AGENTS.md` for Life page architecture
