<template>
  <main class="grid gap-16 sm:col-span-8 md:col-start-2 lg:col-start-3 xl:col-span-8 xl:col-start-5">
    <div>
      <h2 class="mb-3">Podcasts</h2>
      <p>A few shows I keep coming back to, and the episodes I'd send a friend who's never listened before.</p>
    </div>

    <div v-for="podcast in podcasts" :key="podcast.slug" class="grid gap-8">
      <!-- Podcast header row — matches the Block component's two-column layout -->
      <div class="flex gap-6 xs:gap-8 sm:grid sm:grid-cols-8">
        <div class="w-[88px] shrink-0 sm:col-span-2 sm:w-auto">
          <NuxtLink
            :to="`/podcasts/${podcast.slug}`"
            class="block text-slate-400 hover:text-slate-600 hover:no-underline dark:text-slate-500 dark:hover:text-slate-300">
            &#9654;
          </NuxtLink>
        </div>

        <div class="grid gap-6 sm:col-span-6">
          <div>
            <h3 class="dark:text-slate-50">
              <NuxtLink :to="`/podcasts/${podcast.slug}`">{{ podcast.name }}</NuxtLink>
            </h3>
            <p class="mt-3">{{ podcast.description }}</p>
          </div>

          <!-- Recommended episodes -->
          <div v-if="podcast.recommendedEpisodes.length" class="grid gap-4">
            <small class="text-xs uppercase text-slate-400">My picks</small>

            <div
              v-for="episode in podcast.recommendedEpisodes"
              :key="episode.guid"
              class="flex items-start gap-3">
              <!-- Play button -->
              <button
                :title="`Play: ${episode.title}`"
                class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:border-slate-400 hover:text-slate-600 dark:border-slate-700 dark:text-slate-500 dark:hover:border-slate-500 dark:hover:text-slate-300"
                @click="playEpisode(podcast.slug, podcast.name, episode)">
                <svg class="ml-px h-2.5 w-2.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>

              <!-- Episode info -->
              <div class="min-w-0">
                <p class="text-sm leading-snug dark:text-slate-100">{{ episode.title }}</p>
                <p class="mt-1 text-sm text-slate-400">{{ episode.note }}</p>
              </div>
            </div>
          </div>

          <NuxtLink
            :to="`/podcasts/${podcast.slug}`"
            class="self-start text-sm text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
            All episodes &rarr;
          </NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { podcasts } from "~/data/podcasts";
import type { CuratedEpisode } from "~/data/podcasts";

useSeoMeta({
  title: "Podcasts | Benjamin Ottensten",
  ogTitle: "Podcasts | Benjamin Ottensten",
  description: "A curated list of podcasts and episode recommendations.",
  ogDescription: "A curated list of podcasts and episode recommendations.",
});

const { play } = usePodcastPlayer();

const playEpisode = (podcastSlug: string, podcastName: string, episode: CuratedEpisode) => {
  if (episode.audioUrl) {
    play({
      guid: episode.guid,
      title: episode.title,
      podcastName,
      audioUrl: episode.audioUrl,
    });
  } else {
    // No audio URL in the curated data — go to the detail page where the live
    // feed is loaded and any episode can be played directly.
    navigateTo(`/podcasts/${podcastSlug}`);
  }
};
</script>
