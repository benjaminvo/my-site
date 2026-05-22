import type { MaybeRefOrGetter } from "vue";
import { toValue } from "vue";

type ImageDimensions = { width: number; height: number };

/** Work screenshots: thumbhash’s ~1.39 aspect rarely matches; skip to avoid misleading placeholders. */
export const WORK_IMAGE_THUMBHASH_TOLERANCE = 0.02;

type Options = {
  thumbhash?: MaybeRefOrGetter<string | undefined>;
  thumbhashTolerance?: number;
} & ({ srcSet: MaybeRefOrGetter<string> } | { src: MaybeRefOrGetter<string> });

function resolveDimensions(options: Options): ImageDimensions | null {
  if ("srcSet" in options) return getImageDimensionsFromSrcSet(toValue(options.srcSet));
  return getImageDimensionsFromSrc(toValue(options.src));
}

export function useReservedImageFrame(options: Options) {
  const dimensions = computed(() => resolveDimensions(options));

  const spacerStyle = computed(() => {
    if (!dimensions.value) return undefined;
    const { width, height } = dimensions.value;
    return { paddingBottom: `${(height / width) * 100}%` };
  });

  const placeholderRatio = computed(() => {
    if (!dimensions.value) return undefined;
    return dimensions.value.width / dimensions.value.height;
  });

  const effectiveThumbhash = computed(() => {
    const hash = toValue(options.thumbhash);
    if (!hash || !dimensions.value) return "";
    const { width, height } = dimensions.value;
    const tolerance = options.thumbhashTolerance ?? 0.06;
    return thumbhashMatchesAspect(width, height, tolerance) ? hash : "";
  });

  return { dimensions, spacerStyle, placeholderRatio, effectiveThumbhash };
}
