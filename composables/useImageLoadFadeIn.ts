export const LIFE_IMAGE_STAGGER_STEP_MS = 45;

type Options = {
  /** When set, delays the fade start by `staggerIndex * staggerStepMs` (Life grid). */
  staggerIndex?: number;
  staggerStepMs?: number;
};

function prefersReducedMotion() {
  return import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Sharp photo fades in over a separate thumbhash layer.
 * Optional stagger: image 0 at 0ms, image 1 at +45ms, etc. (waits for load + delay).
 */
export function useImageLoadFadeIn(options: Options = {}) {
  const isLoaded = ref(false);
  const canReveal = ref(false);

  let timer: ReturnType<typeof setTimeout> | undefined;

  onMounted(() => {
    if (prefersReducedMotion()) {
      canReveal.value = true;
      return;
    }

    const delay = (options.staggerIndex ?? 0) * (options.staggerStepMs ?? LIFE_IMAGE_STAGGER_STEP_MS);
    if (delay === 0) {
      canReveal.value = true;
      return;
    }

    timer = setTimeout(() => {
      canReveal.value = true;
    }, delay);
  });

  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer);
  });

  const showPhoto = computed(() => {
    if (prefersReducedMotion()) return isLoaded.value;
    return isLoaded.value && canReveal.value;
  });

  function onImageLoaded() {
    isLoaded.value = true;
  }

  const photoStateClass = computed(() =>
    showPhoto.value ? "lazy-image-frame__photo--loaded" : "lazy-image-frame__photo--pending",
  );

  return { isLoaded, onImageLoaded, photoStateClass };
}
