<template>
  <main
    class="sm:col-span-8 sm:grid sm:grid-cols-8 sm:gap-x-8 md:col-span-10 md:grid-cols-10 lg:col-span-12 lg:grid-cols-12 xl:col-span-16 xl:grid-cols-16">
    <section
      class="col-span-full grid gap-3 sm:grid-cols-8 sm:gap-x-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16">
      <div v-for="photo in lifePhotos" :key="photo.src" :class="photo.gridClass">
        <LifeFigure
          :src="photo.src"
          :title="photo.title"
          :date="photo.date"
          :thumbhash="photo.thumbhash" />
      </div>
    </section>
  </main>
</template>

<script setup>
import { lifePhotos } from "~/data/life";

useSeoMeta({
  title: "Life | Benjamin Ottensten, Product Lead",
  ogTitle: "Life | Benjamin Ottensten, Product Lead",
});
</script>
