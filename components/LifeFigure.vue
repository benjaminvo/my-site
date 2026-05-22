<template>
  <div>
    <div
      ref="imageWrapRef"
      class="relative w-full cursor-zoom-in overflow-hidden"
      :class="{ invisible: isActive(zoomKey) }"
      role="button"
      tabindex="0"
      :aria-expanded="isActive(zoomKey)"
      :aria-hidden="isActive(zoomKey)"
      @click="handleImageClick"
      @keydown.enter.prevent="handleImageClick"
      @keydown.space.prevent="handleImageClick">
      <div
        class="block w-full leading-none"
        :style="spacerStyle"
        aria-hidden="true" />
      <div class="absolute inset-0 overflow-hidden">
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
      </div>
    </div>
    <p class="mt-2 font-sans text-xs">
      <span class="text-black dark:text-slate-50">{{ title }}</span><span class="ml-1 text-slate-400">{{ date }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  src: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  thumbhash: { type: String, default: "" },
  staggerIndex: { type: Number, default: 0 },
});

const srcSet = computed(() => `${props.src} 1x`);
const zoomKey = computed(() => props.src);

const { dimensions, spacerStyle, placeholderRatio } = useReservedImageFrame({
  src: () => props.src,
});

const placeholderSrc = useThumbhashPlaceholderSrc(() => props.thumbhash, placeholderRatio);

const { onImageLoaded, photoStateClass } = useImageLoadFadeIn({
  staggerIndex: props.staggerIndex,
});

const imageWrapRef = ref<HTMLElement | null>(null);
const { openFromElement, isActive } = useImageZoom();

function handleImageClick(event: MouseEvent | KeyboardEvent) {
  if (!import.meta.client) return;

  const mouseEvent = event as MouseEvent;
  if (mouseEvent.metaKey || mouseEvent.ctrlKey) {
    window.open(props.src, "_blank");
    return;
  }

  const img = imageWrapRef.value?.querySelector(".lazy-image-frame__photo");
  if (!img || !(img instanceof HTMLImageElement)) return;

  openFromElement(img, zoomKey.value);
}
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
