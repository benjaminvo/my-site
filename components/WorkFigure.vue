<template>
  <div>
    <div class="relative w-full overflow-hidden">
      <div
        class="block w-full leading-none"
        :style="spacerStyle"
        aria-hidden="true" />
      <div class="absolute inset-0 overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          v-if="placeholderSrc"
          :src="placeholderSrc"
          alt=""
          aria-hidden="true"
          class="absolute inset-0 z-0 size-full object-cover" />
        <UnLazyImage
          :src-set="srcSet"
          thumbhash=""
          :placeholder-src="TRANSPARENT_PLACEHOLDER_SRC"
          :width="dimensions?.width"
          :height="dimensions?.height"
          class="lazy-image-frame__photo"
          :class="photoStateClass"
          @loaded="onImageLoaded" />
        <Border class="pointer-events-none z-[2]" />
      </div>
    </div>
    <p v-if="caption" class="mt-2.5 font-sans text-xs text-slate-400">
      {{ caption }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  caption: String,
  srcSet: { type: String, required: true },
  thumbhash: { type: String, required: true },
});

const { dimensions, spacerStyle, placeholderRatio, effectiveThumbhash } = useReservedImageFrame({
  srcSet: () => props.srcSet,
  thumbhash: () => props.thumbhash,
  thumbhashTolerance: WORK_IMAGE_THUMBHASH_TOLERANCE,
});

const placeholderSrc = useThumbhashPlaceholderSrc(
  () => effectiveThumbhash.value,
  placeholderRatio,
);

const { onImageLoaded, photoStateClass } = useImageLoadFadeIn();
</script>

<style scoped>
@reference "~/assets/css/main.css";

.lazy-image-frame__photo,
.lazy-image-frame__photo :deep(img) {
  @apply absolute inset-0 z-[1] block size-full object-cover;
}

.lazy-image-frame__photo--pending,
.lazy-image-frame__photo--pending :deep(img) {
  @apply opacity-0;
}

.lazy-image-frame__photo--loaded,
.lazy-image-frame__photo--loaded :deep(img) {
  @apply opacity-100;
  transition: opacity 250ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .lazy-image-frame__photo--pending,
  .lazy-image-frame__photo--pending :deep(img) {
    @apply opacity-100;
    transition: none;
  }
}
</style>
