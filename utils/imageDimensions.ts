import { imageDimensions } from "~/data/imageDimensions";

export function get1xSrcFromSrcSet(srcSet: string) {
  const trimmed = srcSet.trim();

  for (const part of trimmed.split(",")) {
    const token = part.trim();
    if (/\s1x$/i.test(token)) {
      return token.replace(/\s+1x$/i, "").trim();
    }
  }

  const first = trimmed.split(",")[0]?.trim() ?? "";
  return first.split(/\s+/)[0] ?? "";
}

export function getImageDimensionsFromSrc(src: string) {
  const direct = imageDimensions[src as keyof typeof imageDimensions];
  if (direct) return direct;

  const withoutDensity = src.replace(/@\d+x(?=\.[^.]+$)/i, "");
  if (withoutDensity !== src) {
    return imageDimensions[withoutDensity as keyof typeof imageDimensions] ?? null;
  }

  return null;
}

export function getImageDimensionsFromSrcSet(srcSet: string) {
  return getImageDimensionsFromSrc(get1xSrcFromSrcSet(srcSet));
}

/** Build a 1x/2x density srcset from a 1x asset path (e.g. `/img/life/1.jpg`). */
export function buildDensitySrcSet(src1x: string) {
  const src2x = src1x.replace(/(\.[^.]+)$/, "@2x$1");
  return `${src1x} 1x, ${src2x} 2x`;
}
