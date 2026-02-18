<template>
  <Transition name="player">
    <div
      v-if="currentEpisode"
      class="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <!-- Hidden audio element -->
      <audio
        ref="audioEl"
        :src="currentEpisode.audioUrl"
        preload="metadata"
        @timeupdate="onTimeUpdate"
        @loadedmetadata="onLoadedMetadata"
        @ended="onEnded"
        @play="playing = true"
        @pause="playing = false" />

      <!-- Scrubber -->
      <div class="relative h-1 w-full bg-slate-100 dark:bg-slate-800" @click="seekByClick">
        <div
          class="pointer-events-none h-full bg-slate-900 transition-none dark:bg-slate-100"
          :style="{ width: progressPercent + '%' }" />
        <!-- Invisible wider hit target -->
        <div class="absolute inset-0 -top-2 bottom-[-8px] cursor-pointer" @click="seekByClick" />
      </div>

      <!-- Controls -->
      <div
        class="mx-auto flex items-center gap-4 px-6 py-4 sm:max-w-[calc(640px-56px)] md:max-w-[calc(768px-30px)] lg:max-w-[calc(1024px-132px)] xl:max-w-[calc(1280px-80px)]">
        <!-- Play / Pause -->
        <button
          :disabled="!currentEpisode.audioUrl"
          :title="playing ? 'Pause' : 'Play'"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-950"
          @click="togglePlay">
          <!-- Play icon -->
          <svg v-if="!playing" class="ml-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <!-- Pause icon -->
          <svg v-else class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </button>

        <!-- Episode info -->
        <div class="min-w-0 flex-1">
          <p class="truncate text-xs text-slate-400">{{ currentEpisode.podcastName }}</p>
          <p class="truncate text-sm dark:text-slate-100">{{ currentEpisode.title }}</p>
        </div>

        <!-- Time -->
        <span class="hidden shrink-0 tabular-nums text-xs text-slate-400 xs:block">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </span>

        <!-- Close -->
        <button
          class="shrink-0 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
          title="Close player"
          @click="close">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { currentEpisode, close } = usePodcastPlayer();

const audioEl = ref<HTMLAudioElement | null>(null);
const playing = ref(false);
const currentTime = ref(0);
const duration = ref(0);

const progressPercent = computed(() => {
  if (!duration.value) return 0;
  return (currentTime.value / duration.value) * 100;
});

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
};

const onTimeUpdate = () => {
  if (audioEl.value) currentTime.value = audioEl.value.currentTime;
};
const onLoadedMetadata = () => {
  if (audioEl.value) duration.value = audioEl.value.duration;
};
const onEnded = () => {
  playing.value = false;
  currentTime.value = 0;
};

const togglePlay = () => {
  if (!audioEl.value) return;
  if (playing.value) {
    audioEl.value.pause();
  } else {
    audioEl.value.play();
  }
};

const seekByClick = (event: MouseEvent) => {
  if (!audioEl.value || !duration.value) return;
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const ratio = (event.clientX - rect.left) / rect.width;
  audioEl.value.currentTime = ratio * duration.value;
};

// When a new episode is set, load and auto-play it
watch(currentEpisode, async (episode) => {
  // Reset state
  playing.value = false;
  currentTime.value = 0;
  duration.value = 0;

  if (!episode) return;

  await nextTick();

  if (audioEl.value && episode.audioUrl) {
    audioEl.value.load();
    audioEl.value.play().catch(() => {
      // Autoplay may be blocked by the browser — user can press play manually
    });
  }
});
</script>

<style scoped>
.player-enter-active,
.player-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.player-enter-from,
.player-leave-to {
  transform: translateY(100%);
}
</style>
