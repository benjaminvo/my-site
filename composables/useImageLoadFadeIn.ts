import type { Ref } from "vue";

export const LIFE_IMAGE_STAGGER_STEP_MS = 45;

type Options = {
  /** When set, delays reveal in grid order after each photo has loaded (Life grid). */
  staggerIndex?: number;
  staggerStepMs?: number;
  /** Optional wrapper containing the lazy-loaded `<img>`. */
  imageWrapRef?: Ref<HTMLElement | null>;
};

function prefersReducedMotion() {
  return import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function resolvePhotoImg(container: HTMLElement | null | undefined) {
  const photo = container?.querySelector(".lazy-image-frame__photo");
  if (photo instanceof HTMLImageElement) return photo;

  const img = photo?.querySelector("img");
  return img instanceof HTMLImageElement ? img : null;
}

let advanceTimer: ReturnType<typeof setTimeout> | undefined;

/** Shared across LifeFigure instances — reset from `life.vue` on each visit. */
export function resetLifeImageStagger() {
  if (advanceTimer) {
    clearTimeout(advanceTimer);
    advanceTimer = undefined;
  }

  const loaded = useState<number[]>("life-stagger:loaded", () => []);
  const revealedUpTo = useState("life-stagger:revealed-up-to", () => -1);
  loaded.value = [];
  revealedUpTo.value = -1;
}

function useLifeStaggerState() {
  const loaded = useState<number[]>("life-stagger:loaded", () => []);
  const revealedUpTo = useState("life-stagger:revealed-up-to", () => -1);
  return { loaded, revealedUpTo };
}

function advanceLifeStagger(stepMs: number) {
  const { loaded, revealedUpTo } = useLifeStaggerState();

  const tryAdvance = () => {
    advanceTimer = undefined;
    const nextIndex = revealedUpTo.value + 1;
    if (!loaded.value.includes(nextIndex)) return;

    revealedUpTo.value = nextIndex;
    advanceTimer = setTimeout(tryAdvance, stepMs);
  };

  if (!advanceTimer) tryAdvance();
}

/**
 * Sharp photo fades in over a separate thumbhash layer.
 * Life grid: reveals in source order, one step after each photo has loaded.
 */
export function useImageLoadFadeIn(options: Options = {}) {
  const isLoaded = ref(false);
  const canReveal = ref(false);
  const usesLifeStagger = options.staggerIndex !== undefined;

  let timer: ReturnType<typeof setTimeout> | undefined;

  function revealNow() {
    isLoaded.value = true;
    canReveal.value = true;
  }

  function onImageLoaded() {
    if (isLoaded.value) return;

    if (!usesLifeStagger || prefersReducedMotion()) {
      revealNow();
      return;
    }

    isLoaded.value = true;

    const { loaded } = useLifeStaggerState();
    const index = options.staggerIndex ?? 0;
    if (!loaded.value.includes(index)) {
      loaded.value.push(index);
    }

    const stepMs = options.staggerStepMs ?? LIFE_IMAGE_STAGGER_STEP_MS;
    advanceLifeStagger(stepMs);
  }

  function markLoadedIfComplete() {
    const img = resolvePhotoImg(options.imageWrapRef?.value ?? null);
    if (img?.complete && img.naturalWidth > 0) {
      onImageLoaded();
    }
  }

  if (usesLifeStagger) {
    const { revealedUpTo } = useLifeStaggerState();

    watch(
      revealedUpTo,
      (revealed) => {
        if (!isLoaded.value || canReveal.value) return;
        if ((options.staggerIndex ?? 0) <= revealed) {
          canReveal.value = true;
        }
      },
      { immediate: true },
    );
  }

  onMounted(() => {
    if (!usesLifeStagger) {
      canReveal.value = true;
      if (prefersReducedMotion()) {
        markLoadedIfComplete();
        return;
      }
      nextTick(() => {
        markLoadedIfComplete();
      });
      return;
    }

    if (prefersReducedMotion()) {
      nextTick(() => {
        markLoadedIfComplete();
      });
      return;
    }

    nextTick(() => {
      markLoadedIfComplete();
    });
  });

  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer);
  });

  const showPhoto = computed(() => {
    if (prefersReducedMotion()) return isLoaded.value;
    return isLoaded.value && canReveal.value;
  });

  const photoStateClass = computed(() =>
    showPhoto.value ? "lazy-image-frame__photo--loaded" : "lazy-image-frame__photo--pending",
  );

  return { isLoaded, onImageLoaded, photoStateClass };
}
