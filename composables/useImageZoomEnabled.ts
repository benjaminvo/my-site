/** Matches Tailwind `sm:` — zoom is desktop/tablet only. */
const ZOOM_MEDIA_QUERY = "(min-width: 640px)";

let mediaQueryListenerAttached = false;

export function useImageZoomEnabled() {
  const enabled = useState("image-zoom:enabled", () => false);

  onMounted(() => {
    if (!import.meta.client) return;

    const mq = window.matchMedia(ZOOM_MEDIA_QUERY);
    const sync = () => {
      enabled.value = mq.matches;
    };

    sync();

    if (!mediaQueryListenerAttached) {
      mediaQueryListenerAttached = true;
      mq.addEventListener("change", sync);
    }
  });

  return enabled;
}

export function isImageZoomEnabled() {
  return import.meta.client && window.matchMedia(ZOOM_MEDIA_QUERY).matches;
}
