const OFFSET = 80;
const ZOOM_MAX_WIDTH = 800;
const SCROLL_CLOSE_THRESHOLD = 40;
const TRANSITION_MS = 250;

type DocRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type ZoomStyles = {
  wrapper: Record<string, string>;
  image: Record<string, string>;
  caption: Record<string, string>;
};

const emptyStyles = (): ZoomStyles => ({
  wrapper: {},
  image: {},
  caption: {},
});

let initialScrollY: number | null = null;
let initialTouchY: number | null = null;
let wheelAccumulator = 0;
let listenersAttached = false;
let isClosing = false;
let activeSourceElement: HTMLImageElement | null = null;

type PhotoCaption = {
  title: string;
  date: string;
};

function prefersReducedMotion() {
  if (!import.meta.client) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getDocumentRect(rect: DOMRect): DocRect {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || 0;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
    width: rect.width,
    height: rect.height,
  };
}

function getViewportBounds() {
  return {
    width: Math.min(window.innerWidth - OFFSET, ZOOM_MAX_WIDTH),
    height: window.innerHeight - OFFSET,
  };
}

function calculateZoomRect(gridRect: DocRect, naturalWidth: number, naturalHeight: number): DocRect {
  const { width: viewportWidth, height: viewportHeight } = getViewportBounds();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
  const imageAspectRatio = naturalWidth / naturalHeight;
  const viewportAspectRatio = viewportWidth / viewportHeight;

  let width: number;
  let height: number;

  if (naturalWidth < viewportWidth && naturalHeight < viewportHeight) {
    width = naturalWidth;
    height = naturalHeight;
  } else if (imageAspectRatio < viewportAspectRatio) {
    height = viewportHeight;
    width = height * imageAspectRatio;
  } else {
    width = viewportWidth;
    height = width / imageAspectRatio;
  }

  return {
    top: Math.round(scrollTop + (window.innerHeight - height) / 2),
    left: Math.round((window.innerWidth - width) / 2),
    width: Math.round(width),
    height: Math.round(height),
  };
}

function buildRestStyles(docRect: DocRect, animate: boolean): ZoomStyles {
  const transition = animate ? `top ${TRANSITION_MS}ms, left ${TRANSITION_MS}ms, width ${TRANSITION_MS}ms, height ${TRANSITION_MS}ms` : "none";
  return {
    wrapper: {
      position: "absolute",
      top: `${docRect.top}px`,
      left: `${docRect.left}px`,
      width: `${docRect.width}px`,
      height: `${docRect.height}px`,
      zIndex: "666",
      transition,
      overflow: "hidden",
      transform: "translateZ(0)",
    },
    image: {
      display: "block",
      width: "100%",
      height: "100%",
      maxWidth: "none",
      objectFit: "cover",
      objectPosition: "center center",
    },
    caption: {
      position: "absolute",
      top: `${docRect.top + docRect.height + 8}px`,
      left: `${docRect.left}px`,
      width: `${docRect.width}px`,
      zIndex: "666",
      transition,
    },
  };
}

function buildZoomedStyles(
  gridRect: DocRect,
  naturalWidth: number,
  naturalHeight: number,
  animate: boolean,
): ZoomStyles {
  const zoomRect = calculateZoomRect(gridRect, naturalWidth, naturalHeight);
  const transition = animate ? `top ${TRANSITION_MS}ms, left ${TRANSITION_MS}ms, width ${TRANSITION_MS}ms, height ${TRANSITION_MS}ms` : "none";

  return {
    wrapper: {
      position: "absolute",
      top: `${zoomRect.top}px`,
      left: `${zoomRect.left}px`,
      width: `${zoomRect.width}px`,
      height: `${zoomRect.height}px`,
      zIndex: "666",
      transition,
      overflow: "hidden",
      transform: "translateZ(0)",
    },
    image: {
      display: "block",
      width: "100%",
      height: "100%",
      maxWidth: "none",
      objectFit: "cover",
      objectPosition: "center center",
    },
    caption: {
      position: "absolute",
      top: `${zoomRect.top + zoomRect.height + 8}px`,
      left: `${zoomRect.left}px`,
      width: `${zoomRect.width}px`,
      zIndex: "666",
      transition,
    },
  };
}

export function useImageZoom() {
  const isOpen = useState("image-zoom:open", () => false);
  const activeKey = useState<string | null>("image-zoom:key", () => null);
  const overlayVisible = useState("image-zoom:overlay-visible", () => false);
  const imageSrc = useState("image-zoom:src", () => "");
  const caption = useState<PhotoCaption | null>("image-zoom:caption", () => null);
  const styles = useState<ZoomStyles>("image-zoom:styles", emptyStyles);
  const initialRect = useState<DocRect | null>("image-zoom:initial-rect", () => null);
  const photoKeys = useState<string[]>("image-zoom:keys", () => []);
  const photoCaptions = useState<Record<string, PhotoCaption>>("image-zoom:captions", () => ({}));

  function setPhotoKeys(keys: string[]) {
    photoKeys.value = keys;
  }

  function setPhotoCaptions(captions: Record<string, PhotoCaption>) {
    photoCaptions.value = captions;
  }

  function findPhotoImg(key: string) {
    const container = document.querySelector(`[data-life-photo="${CSS.escape(key)}"]`);
    if (!container) return null;

    const photo = container.querySelector(".lazy-image-frame__photo");
    if (photo instanceof HTMLImageElement) return photo;

    const img = photo?.querySelector("img");
    return img instanceof HTMLImageElement ? img : null;
  }

  function removeCloseListeners() {
    if (!import.meta.client || !listenersAttached) return;
    window.removeEventListener("scroll", handleScroll);
    document.removeEventListener("wheel", handleWheel);
    document.removeEventListener("keydown", handleKeydown);
    document.removeEventListener("touchstart", handleTouchStart);
    document.removeEventListener("touchmove", handleTouchMove);
    listenersAttached = false;
    initialScrollY = null;
    initialTouchY = null;
    wheelAccumulator = 0;
  }

  function addCloseListeners() {
    if (!import.meta.client || listenersAttached) return;
    initialScrollY = window.pageYOffset;
    wheelAccumulator = 0;
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("wheel", handleWheel, { passive: true });
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    listenersAttached = true;
  }

  function handleScroll() {
    if (initialScrollY === null) return;
    const deltaY = Math.abs(initialScrollY - window.pageYOffset);
    if (deltaY >= SCROLL_CLOSE_THRESHOLD) close();
  }

  function handleWheel(event: WheelEvent) {
    wheelAccumulator += Math.abs(event.deltaY);
    if (wheelAccumulator >= SCROLL_CLOSE_THRESHOLD) close();
  }

  function handleTouchStart(event: TouchEvent) {
    initialTouchY = event.touches[0]?.pageY ?? null;
  }

  function handleTouchMove(event: TouchEvent) {
    if (initialTouchY === null) return;
    const touchY = event.touches[0]?.pageY;
    if (touchY === undefined) return;
    if (Math.abs(touchY - initialTouchY) >= 10) close();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      close();
      return;
    }
    if (!isOpen.value || isClosing) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigate(-1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      navigate(1);
    }
  }

  function navigate(delta: 1 | -1) {
    if (!activeKey.value || photoKeys.value.length === 0) return;
    const index = photoKeys.value.indexOf(activeKey.value);
    if (index === -1) return;
    const nextIndex = (index + delta + photoKeys.value.length) % photoKeys.value.length;
    const nextKey = photoKeys.value[nextIndex];
    const img = findPhotoImg(nextKey);
    if (!img) return;
    switchToElement(img, nextKey);
  }

  function close() {
    if (!isOpen.value || isClosing) return;
    isClosing = true;

    overlayVisible.value = false;

    const gridRect = activeSourceElement
      ? getDocumentRect(activeSourceElement.getBoundingClientRect())
      : initialRect.value;
    const reducedMotion = prefersReducedMotion();

    if (gridRect) {
      styles.value = buildRestStyles(gridRect, !reducedMotion);
    }

    if (reducedMotion) {
      finishClose();
      return;
    }

    window.setTimeout(finishClose, TRANSITION_MS);
  }

  function finishClose() {
    isOpen.value = false;
    activeKey.value = null;
    imageSrc.value = "";
    caption.value = null;
    initialRect.value = null;
    styles.value = emptyStyles();
    isClosing = false;
    activeSourceElement = null;
    removeCloseListeners();
  }

  function loadNaturalSize(
    img: HTMLImageElement,
    src: string,
    onLoad: (naturalWidth: number, naturalHeight: number) => void,
  ) {
    if (img.complete && img.naturalWidth > 0) {
      onLoad(img.naturalWidth, img.naturalHeight);
      return;
    }

    const loader = new Image();
    loader.onload = () => onLoad(loader.naturalWidth, loader.naturalHeight);
    loader.onerror = () => {
      const rect = img.getBoundingClientRect();
      onLoad(rect.width, rect.height);
    };
    loader.src = src;
  }

  function applyZoomedImage(
    img: HTMLImageElement,
    key: string,
    gridRect: DocRect,
    naturalWidth: number,
    naturalHeight: number,
    animate: boolean,
  ) {
    activeSourceElement = img;
    activeKey.value = key;
    imageSrc.value = img.currentSrc || img.src;
    caption.value = photoCaptions.value[key] ?? null;
    initialRect.value = gridRect;
    styles.value = buildZoomedStyles(gridRect, naturalWidth, naturalHeight, animate);
  }

  function switchToElement(img: HTMLImageElement, key: string) {
    if (!import.meta.client || !isOpen.value) return;

    const src = img.currentSrc || img.src;
    const gridRect = getDocumentRect(img.getBoundingClientRect());

    loadNaturalSize(img, src, (naturalWidth, naturalHeight) => {
      applyZoomedImage(img, key, gridRect, naturalWidth, naturalHeight, false);
    });
  }

  function openFromElement(img: HTMLImageElement, key: string, photoCaption?: PhotoCaption) {
    if (!import.meta.client || !isImageZoomEnabled()) return;

    if (isOpen.value && activeKey.value === key) {
      close();
      return;
    }

    if (isOpen.value) {
      switchToElement(img, key);
      return;
    }

    const gridRect = getDocumentRect(img.getBoundingClientRect());
    const src = img.currentSrc || img.src;
    const animate = !prefersReducedMotion();

    activeSourceElement = img;
    activeKey.value = key;
    imageSrc.value = src;
    caption.value = photoCaption ?? photoCaptions.value[key] ?? null;
    initialRect.value = gridRect;
    isOpen.value = true;
    isClosing = false;
    styles.value = buildRestStyles(gridRect, false);
    addCloseListeners();

    loadNaturalSize(img, src, (naturalWidth, naturalHeight) => {
      requestAnimationFrame(() => {
        overlayVisible.value = true;
        requestAnimationFrame(() => {
          applyZoomedImage(img, key, gridRect, naturalWidth, naturalHeight, animate);
        });
      });
    });
  }

  function isActive(key: string) {
    return isOpen.value && activeKey.value === key;
  }

  return {
    isOpen,
    activeKey,
    overlayVisible,
    imageSrc,
    caption,
    styles,
    setPhotoKeys,
    setPhotoCaptions,
    openFromElement,
    close,
    isActive,
  };
}
