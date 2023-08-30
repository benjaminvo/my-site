<template>
  <div
    class="relative"
    :class="[
      small
        ? 'sm:col-span-4 md:col-span-5 lg:col-span-4'
        : 'sm:col-span-8 md:col-span-10 lg:col-span-12 xl:col-start-5',
      noMargin ? '' : 'mb-8',
    ]">
    <img
      loading="lazy"
      :src="path + '.jpg'"
      :srcset="path + '@2x.jpg 2x,' + path + '@3x.jpg 3x'"
      class="w-full" />
    <div class="absolute bottom-0 left-0 right-0 top-0 border border-black/[.15]"></div>
  </div>
</template>
<script setup>
defineProps({
  small: Boolean,
  path: String,
  noMargin: Boolean,
});
</script>
