import type { MaybeRefOrGetter } from "vue";
import { toValue } from "vue";
import { createPlaceholderFromHash } from "unlazy";

/** Keeps the sharp layer invisible until the real file loads (thumbhash stays visible underneath). */
export const TRANSPARENT_PLACEHOLDER_SRC =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export function useThumbhashPlaceholderSrc(
  thumbhash: MaybeRefOrGetter<string | undefined>,
  placeholderRatio?: MaybeRefOrGetter<number | undefined>,
) {
  return computed(() => {
    const hash = toValue(thumbhash);
    if (!hash) return null;

    return (
      createPlaceholderFromHash({
        hash,
        hashType: "thumbhash",
        ratio: toValue(placeholderRatio),
      }) ?? null
    );
  });
}
