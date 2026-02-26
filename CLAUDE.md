# CLAUDE.md — Project Guide

Personal portfolio site for Benjamin Ottensten, built with **Nuxt 4** and deployed on **Vercel**.

---

## Stack

- **Nuxt 4** (file-based routing, `<script setup>`, `useAsyncData`, `useState`)
- **Tailwind CSS v4** — CSS-first config via `@theme` in `main.css`; no `tailwind.config.js`
- **TypeScript** throughout
- **fast-xml-parser** — XML parsing in server routes
- **@unlazy/nuxt** — lazy image loading with thumbhash

---

## Directory Layout

```
app.vue                    # Root layout: Header, NuxtPage, PodcastPlayer
nuxt.config.ts
assets/css/main.css        # Tailwind v4 entry: @import, @theme, @utility, base styles
components/                # Reusable Vue components
composables/               # Shared state logic (usePodcastPlayer)
pages/                     # File-based routes (see below)
server/api/                # Server-side API endpoints
data/                      # Static TypeScript data files
public/fonts/              # Livory serif font files
plugins/vercel.ts          # Vercel Analytics (client-only)
```

---

## Pages & Routes

| File | Route | Notes |
|---|---|---|
| `pages/index.vue` | `/` | About / work experience |
| `pages/work.vue` | `/work` | Portfolio case studies |
| `pages/podcasts/index.vue` | `/podcasts` | Podcast listing |
| `pages/podcasts/[slug].vue` | `/podcasts/:slug` | Individual podcast page |

---

## Key Components

| Component | Purpose |
|---|---|
| `Header.vue` | Site title + navigation |
| `Navigation.vue` | Pill nav (About / Work); active state via `.router-link-active` |
| `Block.vue` | Generic content block (label, title, link, descriptions) |
| `Border.vue` | Decorative divider |
| `PodcastPlayer.vue` | Fixed audio player at page bottom |
| `PhotoStack.vue` / `PhotoStackComposition.vue` | Animated photo layouts on home page |
| `WorkImg.vue` | Styled image wrapper for work portfolio |

---

## State Management

No Pinia/Vuex. Uses Nuxt's `useState()` for SSR-safe shared state.

**`composables/usePodcastPlayer.ts`** — single source of truth for the audio player:
- `PlayerEpisode`: `{ guid, title, podcastName, audioUrl }`
- Methods: `play(episode)`, `close()`
- Consumed by both `PodcastPlayer.vue` and podcast pages

---

## Data Files

**`data/podcasts.ts`**:
- `Podcast`: `{ slug, name, feedUrl, websiteUrl, description, recommendedEpisodes[] }`
- `CuratedEpisode`: `{ guid, title, description, audioUrl, duration, publishDate, note }`

---

## Server Routes

**`server/api/podcast-feed.get.ts`** — fetches and parses an RSS feed server-side.
- Query param: `url` (RSS feed URL)
- Returns `FeedData`: `{ name, artwork, description, episodes[] }`
- Each episode: `{ guid, title, description, audioUrl, duration, publishDate }`

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

---

## Shaders

**Package**: `@paper-design/shaders` (vanilla JS, no framework dependency) — already installed.

Shaders are designed in **Paper** (MCP server: `paper`) and implemented in Vue using `ShaderMount`. Use the `/implement-shader` skill. Workflow: `get_selection` → `get_jsx` (extracts exact params) → map to `ShaderMount` uniforms in `onMounted`. The container `<div>` fills the target space; `ShaderMount` manages the canvas inside it. Each shader has its own fragment shader export and shapes enum (e.g. `grainGradientFragmentShader`, `GrainGradientShapes`).

---

## Conventions & Patterns

- All components use `<script setup>` (Vue 3 Composition API)
- SEO via `useSeoMeta()` on each page
- Images use `<UnLazyImage>` with `src-set` and `thumbhash` for progressive loading
- Prettier + `prettier-plugin-tailwindcss` enforces class ordering
