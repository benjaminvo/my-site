<template>
  <div :class="isHero ? 'xl:grid xl:h-full xl:min-h-0 xl:grid-rows-[1fr_auto]' : ''">
    <div
      ref="imageWrapRef"
      class="relative min-h-0 overflow-hidden"
      :class="[
        isHero ? 'w-full sm:aspect-[4/3] xl:aspect-auto xl:h-full' : 'w-full sm:aspect-[4/3]',
        { invisible: isActive(zoomKey) },
        zoomEnabled ? 'sm:cursor-zoom-in' : '',
      ]"
      :role="zoomEnabled ? 'button' : undefined"
      :tabindex="zoomEnabled ? 0 : undefined"
      :aria-expanded="zoomEnabled ? isActive(zoomKey) : undefined"
      :aria-hidden="zoomEnabled && isActive(zoomKey) ? true : undefined"
      @click="handleImageClick"
      @keydown.enter.prevent="handleImageClick"
      @keydown.space.prevent="handleImageClick">
      <div
        class="block w-full leading-none sm:hidden"
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
    <p
      class="mt-2 shrink-0 font-sans text-xs"
      :class="{ invisible: isActive(zoomKey) }"
      :aria-hidden="isActive(zoomKey) || undefined">
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
  isHero: { type: Boolean, default: false },
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
const zoomEnabled = useImageZoomEnabled();
const { openFromElement, isActive } = useImageZoom();

function handleImageClick(event: MouseEvent | KeyboardEvent) {
  if (!import.meta.client || !zoomEnabled.value) return;

  const mouseEvent = event as MouseEvent;
  if (mouseEvent.metaKey || mouseEvent.ctrlKey) {
    window.open(props.src, "_blank");
    return;
  }

  const img = imageWrapRef.value?.querySelector(".lazy-image-frame__photo img");
  if (img instanceof HTMLImageElement) {
    openFromElement(img, zoomKey.value, {
      title: props.title,
      date: props.date,
    });
    return;
  }

  const photo = imageWrapRef.value?.querySelector(".lazy-image-frame__photo");
  if (photo instanceof HTMLImageElement) {
    openFromElement(photo, zoomKey.value, {
      title: props.title,
      date: props.date,
    });
  }
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
