<template>
  <main
    class="pb-20 sm:col-span-8 sm:grid sm:grid-cols-8 sm:gap-x-8 md:col-span-10 md:grid-cols-10 lg:col-span-12 lg:grid-cols-12 xl:col-span-16 xl:grid-cols-16">
    <section
      class="col-span-full grid gap-6 sm:grid-cols-8 sm:gap-x-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16">
      <div
        v-for="(photo, index) in lifePhotos"
        :key="photo.src"
        :data-life-photo="photo.src"
        :class="photo.gridClass">
        <LifeFigure
          :src="photo.src"
          :title="photo.title"
          :date="photo.date"
          :thumbhash="photo.thumbhash"
          :stagger-index="index" />
      </div>
    </section>
  </main>

  <Teleport to="body">
    <template v-if="isOpen">
      <div
        class="fixed inset-0 z-[420] cursor-zoom-out bg-white transition-opacity duration-[280ms] dark:bg-slate-950"
        :class="overlayVisible ? 'opacity-100' : 'opacity-0'"
        aria-hidden="true"
        @click="close" />
      <div :style="styles.wrapper">
        <img
          :src="imageSrc"
          alt=""
          :style="styles.image"
          class="cursor-zoom-out"
          @click.stop="close" />
      </div>
    </template>
  </Teleport>
</template>

<script setup lang="ts">
import { lifePhotos } from "~/data/life";

useSeoMeta({
  title: "Life | Benjamin Ottensten, Product Lead",
  ogTitle: "Life | Benjamin Ottensten, Product Lead",
});

const { isOpen, overlayVisible, imageSrc, styles, close, setPhotoKeys } = useImageZoom();

setPhotoKeys(lifePhotos.map((photo) => photo.src));
</script>
