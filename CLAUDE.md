# CLAUDE.md — Project Guide

Personal portfolio site for Benjamin Ottensten, built with **Nuxt 3** and deployed on **Vercel**.

---

## Stack

- **Nuxt 3** (file-based routing, `<script setup>`, `useAsyncData`, `useState`)
- **Tailwind CSS** — no CSS modules; utility classes directly in templates
- **@nuxt/content** — markdown-based content pages
- **TypeScript** throughout
- **fast-xml-parser** — XML parsing in server routes
- **@unlazy/nuxt** — lazy image loading with thumbhash

---

## Directory Layout

```
app.vue                    # Root layout: Header, NuxtPage, PodcastPlayer
nuxt.config.ts
tailwind.config.js
assets/css/main.css        # Tailwind imports + custom font-face + base styles
components/                # Reusable Vue components
composables/               # Shared state logic (usePodcastPlayer)
pages/                     # File-based routes (see below)
server/api/                # Server-side API endpoints
data/                      # Static TypeScript data files
content/                   # Markdown content (thoughts, etc.)
public/fonts/              # Livory serif font files
plugins/vercel.ts          # Vercel Analytics (client-only)
```

---

## Pages & Routes

| File | Route | Notes |
|---|---|---|
| `pages/index.vue` | `/` | About / work experience |
| `pages/work.vue` | `/work` | Portfolio case studies |
| `pages/thoughts.vue` | `/thoughts` | Lists markdown files from `content/thoughts/` |
| `pages/podcasts/index.vue` | `/podcasts` | Podcast listing |
| `pages/podcasts/[slug].vue` | `/podcasts/:slug` | Individual podcast page |
| `pages/[...slug].vue` | `/*` | Catch-all: renders markdown via `@nuxt/content` |

---

## Key Components

| Component | Purpose |
|---|---|
| `Header.vue` | Site title + navigation |
| `Navigation.vue` | Pill nav (About / Work / Podcasts); active state via `.router-link-active` |
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

- **Tailwind only** — no scoped `<style>` blocks unless absolutely needed
- **Dark mode**: system-level (`dark:` utilities, not class-toggled)
- **Custom breakpoint**: `xs: 520px` (below default `sm`)
- **Grid**: up to 16 columns; custom spans `span-14`, `span-16`
- **Fonts**: "Livory" serif loaded via `@font-face` in `main.css`; applied with `font-serif`
- **Responsive pattern**: mobile-first, heavy use of `xs:`, `sm:`, `md:`, `lg:`, `xl:` prefixes

---

## Conventions & Patterns

- All components use `<script setup>` (Vue 3 Composition API)
- SEO via `useSeoMeta()` on each page
- Content pages use `<ContentDoc>` / `<ContentList>` / `<ContentRenderer>` from `@nuxt/content`
- Images use `<UnLazyImage>` with `src-set` and `thumbhash` for progressive loading
- Prettier + `prettier-plugin-tailwindcss` enforces class ordering
