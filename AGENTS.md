# AGENTS.md — Project Guide

Personal portfolio site for Benjamin Ottensten, built with **Nuxt 4** and deployed on **Vercel**.

---

## Stack

- **Nuxt 4** (file-based routing, `<script setup>`, `useAsyncData`, `useState`)
- **Tailwind CSS v4** — CSS-first config via `@theme` in `main.css`; no `tailwind.config.js`
- **TypeScript** throughout
- **@unlazy/nuxt** — lazy image loading with thumbhash

---

## Directory Layout

```
app.vue                    # Root layout: Header, NuxtPage
nuxt.config.ts
assets/css/main.css        # Tailwind v4 entry: @import, @theme, @utility, base styles
components/                # Reusable Vue components
composables/               # Shared state logic (e.g. useImageZoom, usePodcastPlayer)
pages/                     # File-based routes (see below)
server/api/                # Server-side API endpoints
data/                      # Static data (`imageDimensions.ts` auto-generated on build)
composables/               # `useReservedImageFrame`, `useImageZoom`, etc.
public/fonts/              # Livory serif font files
plugins/vercel.ts          # Vercel Analytics (client-only)
```

---

## Pages & Routes

| File              | Route   | Notes                   |
| ----------------- | ------- | ----------------------- |
| `pages/index.vue` | `/`     | About / work experience |
| `pages/work.vue`  | `/work` | Portfolio case studies  |
| `pages/life.vue`  | `/life` | Personal photo grid with zoom          |

**Adding Life photos:** edit `lifePhotoEntries` in `data/life.ts`, add files under `public/img/life/`, then `/sync-life-photos` or `npm run sync:life`.

---

## Key Components

| Component                   | Purpose                                                         |
| --------------------------- | --------------------------------------------------------------- |
| `Header.vue`                | Site title + navigation                                         |
| `Navigation.vue`            | Pill nav (About / Work; Life hidden via `showLifeNav` until launch) |
| `Block.vue`                 | Generic content block (label, title, link, descriptions)        |
| `Border.vue`                | Decorative divider                                              |
| `PhotoStackComposition.vue` | Animated photo layouts on home page                             |
| `WorkImg.vue`               | Styled image wrapper for work portfolio                         |
| `WorkFigure.vue`            | Lazy-loaded work image; layout via `useReservedImageFrame`       |
| `LifeFigure.vue`            | Life photo with zoom; reserved-height layout, title/date caption |

---

## State Management

No Pinia/Vuex. Uses Nuxt's `useState()` for SSR-safe shared state.

---

## Styling Conventions

- **Tailwind v4** — configured entirely in `assets/css/main.css` via `@theme`; no `tailwind.config.js`
- **Tailwind integration**: `@tailwindcss/vite` plugin in `nuxt.config.ts` (not `@nuxtjs/tailwindcss`)
- **Dark mode**: system-level (`dark:` utilities, not class-toggled)
- **Custom breakpoint**: `xs: 520px` (below default `sm`) — defined as `--breakpoint-xs: 520px` in `@theme`
- **Grid**: up to 16 columns; `col-span-16` defined via `@utility`
- **Fonts**: "Livory" serif loaded via `@font-face` in `main.css`; applied with `font-serif`
- **Responsive pattern**: mobile-first, heavy use of `xs:`, `sm:`, `md:`, `lg:`, `xl:` prefixes
- **`@apply` in scoped styles**: requires `@reference "~/assets/css/main.css";` at the top of the `<style>` block

## Conventions & Patterns

- All components use `<script setup>` (Vue 3 Composition API)
- SEO via `useSeoMeta()` on each page
- Prettier + `prettier-plugin-tailwindcss` enforces class ordering

---

## Cursor Cloud specific instructions

### Running the dev server

Single service: `npm run dev` starts the Nuxt SSR dev server on `http://localhost:3000`. No external services (databases, Docker, Redis) are required.

### Lint & format

- `npx prettier --check .` — check formatting (repo currently has pre-existing style diffs; do not auto-fix unless asked)
- `npx prettier --write <file>` — format specific files you modify

### Build

- `npm run build` — production build (runs `prebuild` which generates `data/imageDimensions.ts` via `sharp`)

### Key caveats

- No automated test suite exists (no `test` script in `package.json`). Verify changes via build + manual browser testing.
- `nuxt prepare` runs automatically via `postinstall` and generates `.nuxt/` types. If TypeScript errors appear after dependency changes, re-run `npm install`.
- The `data/imageDimensions.ts` file is auto-generated. To regenerate after adding images: `npm run sync:life`.
- `NUXT_PUBLIC_MIXPANEL_TOKEN` overrides the project token; `NUXT_PUBLIC_MIXPANEL_API_HOST` overrides the ingestion host (default `https://api-eu.mixpanel.com` for EU data residency). Tracking is disabled in dev (`opt_out_tracking`).
