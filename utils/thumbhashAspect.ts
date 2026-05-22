/** UnLazy thumbhash placeholders decode to ~32×23 (~1.39 aspect), regardless of source image. */
const THUMBHASH_PLACEHOLDER_ASPECT = 32 / 23;

/** Whether thumbhash is close enough in aspect to the real image to use safely. */
export function thumbhashMatchesAspect(width: number, height: number, tolerance = 0.06) {
  const target = width / height;
  return Math.abs(THUMBHASH_PLACEHOLDER_ASPECT - target) / target <= tolerance;
}
