<template>
  <main class="grid gap-12 sm:col-span-8 md:col-start-2 lg:col-start-3 xl:col-span-8 xl:col-start-5">
    <!-- Not found -->
    <div v-if="!podcast">
      <NuxtLink to="/podcasts" class="text-sm text-slate-400 hover:text-slate-600">&larr; Podcasts</NuxtLink>
      <p class="mt-8">Podcast not found.</p>
    </div>

    <template v-else>
      <!-- Back link -->
      <NuxtLink
        to="/podcasts"
        class="self-start text-sm text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
        &larr; Podcasts
      </NuxtLink>

      <!-- Podcast header -->
      <div class="flex gap-6 xs:gap-8 sm:grid sm:grid-cols-8">
        <div class="w-[88px] shrink-0 sm:col-span-2 sm:w-auto">
          <!-- Artwork -->
          <img
            v-if="feedData?.artwork"
            :src="feedData.artwork"
            :alt="podcast.name"
            class="aspect-square w-16 rounded-lg object-cover sm:w-full" />
          <div
            v-else
            class="aspect-square w-16 rounded-lg bg-slate-100 dark:bg-slate-800 sm:w-full" />
        </div>

        <div class="grid gap-3 sm:col-span-6">
          <h2 class="dark:text-slate-50">{{ podcast.name }}</h2>
          <p>{{ podcast.description }}</p>
          <a
            :href="podcast.websiteUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="self-start text-sm text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
            Website &nearr;
          </a>
        </div>
      </div>

      <!-- My picks (highlighted) -->
      <section v-if="podcast.recommendedEpisodes.length" class="grid gap-6">
        <h3 class="dark:text-slate-50">My picks</h3>

        <div class="grid gap-4">
          <div
            v-for="ep in podcast.recommendedEpisodes"
            :key="ep.guid"
            class="flex gap-6 xs:gap-8 sm:grid sm:grid-cols-8">
            <div class="w-[88px] shrink-0 sm:col-span-2 sm:w-auto" />
            <div class="grid gap-3 sm:col-span-6">
              <div class="flex items-start gap-3">
                <button
                  :title="resolvedAudio(ep.guid) ? `Play: ${ep.title}` : 'Episode not yet loaded'"
                  :disabled="!resolvedAudio(ep.guid) && !ep.audioUrl"
                  class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:border-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-500 dark:hover:border-slate-500 dark:hover:text-slate-300"
                  @click="playRecommended(ep)">
                  <svg class="ml-px h-2.5 w-2.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <div>
                  <p class="text-sm font-medium leading-snug dark:text-slate-100">{{ ep.title }}</p>
                  <p class="mt-1 text-sm text-slate-500">{{ ep.note }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Full feed -->
      <section class="grid gap-6">
        <h3 class="dark:text-slate-50">All episodes</h3>

        <!-- Loading -->
        <div v-if="feedPending" class="grid gap-3">
          <div v-for="n in 6" :key="n" class="flex gap-6 xs:gap-8 sm:grid sm:grid-cols-8">
            <div class="w-[88px] shrink-0 sm:col-span-2 sm:w-auto" />
            <div class="sm:col-span-6">
              <div class="h-4 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
              <div class="mt-2 h-3 w-1/3 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        </div>

        <!-- Error -->
        <p v-else-if="feedError" class="text-sm text-slate-400">
          Couldn't load the episode list. Try again later.
        </p>

        <!-- Episodes list -->
        <div v-else class="grid gap-4">
          <div
            v-for="ep in displayedEpisodes"
            :key="ep.guid"
            class="flex gap-6 xs:gap-8 sm:grid sm:grid-cols-8">
            <!-- Date / duration column -->
            <div class="w-[88px] shrink-0 text-slate-400 sm:col-span-2 sm:w-auto">
              <span class="block text-xs">{{ formatDate(ep.publishDate) }}</span>
              <span v-if="ep.duration" class="block text-xs">{{ ep.duration }}</span>
            </div>

            <!-- Episode info + play -->
            <div class="flex items-start gap-3 sm:col-span-6">
              <button
                :title="`Play: ${ep.title}`"
                :disabled="!ep.audioUrl"
                class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:border-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-500 dark:hover:border-slate-500 dark:hover:text-slate-300"
                @click="playFeedEpisode(ep)">
                <svg class="ml-px h-2.5 w-2.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>

              <div class="min-w-0">
                <p class="text-sm leading-snug dark:text-slate-100" :class="{ 'font-medium': isRecommended(ep.guid) }">
                  {{ ep.title }}
                  <span
                    v-if="isRecommended(ep.guid)"
                    class="ml-2 inline-block align-middle text-[10px] uppercase tracking-wide text-slate-400">
                    pick
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Load all button -->
        <button
          v-if="hasMoreEpisodes"
          class="self-start text-sm text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          @click="showAllEpisodes = true">
          Load all episodes ({{ feedData?.episodes?.length }})
        </button>
      </section>
    </template>
  </main>
</template>

<script setup lang="ts">
import { podcasts } from "~/data/podcasts";
import type { CuratedEpisode } from "~/data/podcasts";
import type { FeedData, FeedEpisode } from "~/server/api/podcast-feed.get";

const route = useRoute();
const podcast = podcasts.find((p) => p.slug === route.params.slug);

useSeoMeta({
  title: podcast ? `${podcast.name} | Podcasts | Benjamin Ottensten` : "Podcast | Benjamin Ottensten",
  ogTitle: podcast ? `${podcast.name} | Benjamin Ottensten` : "Podcast | Benjamin Ottensten",
});

const {
  data: feedData,
  pending: feedPending,
  error: feedError,
} = await useAsyncData(
  `feed-${podcast?.slug}`,
  () =>
    podcast
      ? $fetch<FeedData>(`/api/podcast-feed?url=${encodeURIComponent(podcast.feedUrl)}`)
      : Promise.resolve(null),
  { server: false },
);

const { play } = usePodcastPlayer();

// Build a GUID → audioUrl map from the live feed so recommended episodes get
// their audio URL resolved even if it wasn't filled in the data file.
const feedAudioMap = computed<Record<string, string>>(() => {
  const map: Record<string, string> = {};
  for (const ep of feedData.value?.episodes ?? []) {
    if (ep.guid && ep.audioUrl) map[ep.guid] = ep.audioUrl;
  }
  return map;
});

const resolvedAudio = (guid: string) =>
  feedAudioMap.value[guid] ?? podcast?.recommendedEpisodes.find((e) => e.guid === guid)?.audioUrl ?? "";

const isRecommended = (guid: string) =>
  podcast?.recommendedEpisodes.some((e) => e.guid === guid) ?? false;

const playRecommended = (ep: CuratedEpisode) => {
  play({
    guid: ep.guid,
    title: ep.title,
    podcastName: podcast!.name,
    audioUrl: resolvedAudio(ep.guid) || ep.audioUrl,
  });
};

const playFeedEpisode = (ep: FeedEpisode) => {
  play({
    guid: ep.guid,
    title: ep.title,
    podcastName: podcast!.name,
    audioUrl: ep.audioUrl,
  });
};

const INITIAL_EPISODE_COUNT = 10;
const showAllEpisodes = ref(false);
const displayedEpisodes = computed(() => {
  const episodes = feedData.value?.episodes ?? [];
  return showAllEpisodes.value ? episodes : episodes.slice(0, INITIAL_EPISODE_COUNT);
});
const hasMoreEpisodes = computed(
  () => !showAllEpisodes.value && (feedData.value?.episodes?.length ?? 0) > INITIAL_EPISODE_COUNT,
);

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
};
</script>
