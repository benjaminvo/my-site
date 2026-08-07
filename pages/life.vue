<template>
  <main class="pb-20 sm:col-span-8 md:col-span-8 md:col-start-2 lg:col-span-12 xl:col-span-16">
    <section
      class="grid items-stretch gap-6 sm:grid-cols-8 sm:gap-x-8 md:grid-cols-10 md:gap-x-8 lg:grid-cols-12 xl:grid-cols-16">
      <div
        v-for="item in gridItems"
        :key="item.src"
        :data-life-photo="item.src"
        :class="[item.gridClass, item.isHero && 'xl:min-h-0 xl:self-stretch']">
        <LifeFigure
          :class="item.isHero ? 'xl:h-full' : undefined"
          :src="item.src"
          :title="item.title"
          :date="item.date"
          :thumbhash="item.thumbhash"
          :is-hero="item.isHero"
          :stagger-index="item.sourceIndex" />
      </div>
    </section>
  </main>

  <Teleport to="body">
    <template v-if="isOpen">
      <div
        class="fixed inset-0 z-[420] cursor-zoom-out bg-white transition-opacity duration-[280ms] dark:bg-neutral-950"
        :class="overlayVisible ? 'opacity-100' : 'opacity-0'"
        aria-hidden="true"
        @click="close" />
      <div :style="styles.wrapper">
        <img :src="imageSrc" alt="" :style="styles.image" class="cursor-zoom-out" @click.stop="close" />
      </div>
      <p v-if="caption" :style="styles.caption" class="pointer-events-none font-sans text-xs">
        <span class="text-black dark:text-neutral-100">{{ caption.title }}</span
        ><span class="ml-1 text-slate-400 dark:text-neutral-500">{{ caption.date }}</span>
      </p>
    </template>
  </Teleport>
</template>

<script setup lang="ts">
import { buildLifeGridItems, LIFE_ZOOM_FRAME, lifePhotos } from "~/data/life";

useSeoMeta({
  title: "Life | Benjamin Ottensten, Product lead & Designer",
  ogTitle: "Life | Benjamin Ottensten, Product lead & Designer",
});

const gridItems = computed(() => buildLifeGridItems(lifePhotos));

onMounted(() => {
  resetLifeImageStagger();
});

const { isOpen, overlayVisible, imageSrc, caption, styles, close, setPhotoKeys, setPhotoCaptions, setUniformZoomSize } =
  useImageZoom();

setUniformZoomSize(LIFE_ZOOM_FRAME);

watch(
  gridItems,
  (items) => {
    setPhotoKeys(items.map((item) => item.src));
    setPhotoCaptions(
      Object.fromEntries(
        items.map((item) => [
          item.src,
          {
            title: item.title,
            date: item.date,
          },
        ]),
      ),
    );
  },
  { immediate: true },
);
</script>
