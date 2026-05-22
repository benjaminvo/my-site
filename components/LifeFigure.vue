<template>
  <div>
    <div
      ref="imageWrapRef"
      class="relative cursor-zoom-in"
      :class="{ invisible: isActive(zoomKey) }"
      role="button"
      tabindex="0"
      :aria-expanded="isActive(zoomKey)"
      :aria-hidden="isActive(zoomKey)"
      @click="handleImageClick"
      @keydown.enter.prevent="handleImageClick"
      @keydown.space.prevent="handleImageClick">
      <UnLazyImage :src-set="srcSet" :thumbhash="thumbhash" class="w-full" />
    </div>
    <p class="mt-2.5 font-sans text-xs">
      <span class="text-black dark:text-slate-50">{{ title }}</span><span class="ml-1 text-slate-400">{{ date }}</span>
    </p>

    <Teleport to="body">
      <template v-if="isActive(zoomKey)">
        <div
          class="fixed inset-0 z-[420] cursor-zoom-out bg-white transition-opacity duration-[200ms]"
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
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  src: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  thumbhash: { type: String, default: "" },
});

const srcSet = computed(() => `${props.src} 1x`);
const zoomKey = computed(() => props.src);

const imageWrapRef = ref<HTMLElement | null>(null);
const { overlayVisible, imageSrc, styles, openFromElement, close, isActive } = useImageZoom();

function handleImageClick(event: MouseEvent | KeyboardEvent) {
  if (!import.meta.client) return;

  const mouseEvent = event as MouseEvent;
  if (mouseEvent.metaKey || mouseEvent.ctrlKey) {
    window.open(props.src, "_blank");
    return;
  }

  const img = imageWrapRef.value?.querySelector("img");
  if (!img) return;

  openFromElement(img, zoomKey.value);
}
</script>
