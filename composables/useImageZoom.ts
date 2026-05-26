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
let openSessionId = 0;
let closeTimer: ReturnType<typeof setTimeout> | null = null;
let resizeRaf: number | null = null;

type ZoomListenerStore = {
  scroll: ((this: Window, ev: Event) => void) | null;
  resize: ((this: Window, ev: Event) => void) | null;
  wheel: ((this: Window, ev: WheelEvent) => void) | null;
  keydown: ((this: Window, ev: KeyboardEvent) => void) | null;
  touchstart: ((this: Window, ev: TouchEvent) => void) | null;
  touchmove: ((this: Window, ev: TouchEvent) => void) | null;
};

function getZoomListenerStore(): ZoomListenerStore {
  const globalKey = "__imageZoomListenerStore";
  const globalScope = globalThis as typeof globalThis & { __imageZoomListenerStore?: ZoomListenerStore };
  if (!globalScope[globalKey]) {
    globalScope[globalKey] = {
      scroll: null,
      resize: null,
      wheel: null,
      keydown: null,
      touchstart: null,
      touchmove: null,
    };
  }
  return globalScope[globalKey];
}

function cancelCloseTimer() {
  if (closeTimer === null) return;
  window.clearTimeout(closeTimer);
  closeTimer = null;
}

function invalidateOpenSession() {
  openSessionId += 1;
}

function beginOpenSession() {
  cancelCloseTimer();
  isClosing = false;
  openSessionId += 1;
  return openSessionId;
}

function isCurrentOpenSession(sessionId: number) {
  return sessionId === openSessionId;
}

type PhotoCaption = {
  title: string;
  date: string;
};

type UniformZoomSize = {
  width: number;
  height: number;
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

function calculateZoomRect(naturalWidth: number, naturalHeight: number): DocRect {
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
  const zoomRect = calculateZoomRect(naturalWidth, naturalHeight);
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
  const activeIndex = useState("image-zoom:index", () => -1);
  const photoCaptions = useState<Record<string, PhotoCaption>>("image-zoom:captions", () => ({}));
  const uniformZoomSize = useState<UniformZoomSize | null>("image-zoom:uniform-size", () => null);

  function setPhotoKeys(keys: string[]) {
    photoKeys.value = keys;
  }

  function setPhotoCaptions(captions: Record<string, PhotoCaption>) {
    photoCaptions.value = captions;
  }

  function setUniformZoomSize(size: UniformZoomSize | null) {
    uniformZoomSize.value = size;
  }

  function resolveZoomNaturalSize(naturalWidth: number, naturalHeight: number) {
    return uniformZoomSize.value ?? { width: naturalWidth, height: naturalHeight };
  }

  function resolvePhotoImg(container: Element | null): HTMLImageElement | null {
    const photo = container?.querySelector(".lazy-image-frame__photo");
    if (photo instanceof HTMLImageElement) return photo;

    const img = photo?.querySelector("img");
    return img instanceof HTMLImageElement ? img : null;
  }

  function findPhotoImg(key: string) {
    const container = document.querySelector(`[data-life-photo="${CSS.escape(key)}"]`);
    return resolvePhotoImg(container);
  }

  function setActivePhoto(key: string) {
    activeKey.value = key;
    activeIndex.value = photoKeys.value.indexOf(key);
  }

  function repositionZoomed(animate: boolean) {
    if (!isOpen.value || isClosing) return;

    const gridRect = initialRect.value;
    if (!gridRect) return;

    const applyStyles = (naturalWidth: number, naturalHeight: number) => {
      const zoomNatural = resolveZoomNaturalSize(naturalWidth, naturalHeight);
      styles.value = buildZoomedStyles(gridRect, zoomNatural.width, zoomNatural.height, animate);
    };

    if (uniformZoomSize.value) {
      applyStyles(uniformZoomSize.value.width, uniformZoomSize.value.height);
      return;
    }

    if (!activeSourceElement) return;

    const src = activeSourceElement.currentSrc || activeSourceElement.src;
    loadNaturalSize(activeSourceElement, src, (naturalWidth, naturalHeight) => {
      if (!isOpen.value || isClosing) return;
      applyStyles(naturalWidth, naturalHeight);
    });
  }

  function removeCloseListeners() {
    if (!import.meta.client) return;

    const store = getZoomListenerStore();
    if (store.scroll) window.removeEventListener("scroll", store.scroll);
    if (store.resize) window.removeEventListener("resize", store.resize);
    if (store.wheel) document.removeEventListener("wheel", store.wheel);
    if (store.keydown) document.removeEventListener("keydown", store.keydown);
    if (store.touchstart) document.removeEventListener("touchstart", store.touchstart);
    if (store.touchmove) document.removeEventListener("touchmove", store.touchmove);

    store.scroll = null;
    store.resize = null;
    store.wheel = null;
    store.keydown = null;
    store.touchstart = null;
    store.touchmove = null;
    listenersAttached = false;
    if (resizeRaf !== null) {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = null;
    }
    initialScrollY = null;
    initialTouchY = null;
    wheelAccumulator = 0;
  }

  function addCloseListeners() {
    if (!import.meta.client) return;

    removeCloseListeners();

    const store = getZoomListenerStore();
    store.scroll = handleScroll;
    store.resize = handleResize;
    store.wheel = handleWheel;
    store.keydown = handleKeydown;
    store.touchstart = handleTouchStart;
    store.touchmove = handleTouchMove;

    initialScrollY = window.pageYOffset;
    wheelAccumulator = 0;
    window.addEventListener("scroll", store.scroll, { passive: true });
    window.addEventListener("resize", store.resize, { passive: true });
    document.addEventListener("wheel", store.wheel, { passive: true });
    document.addEventListener("keydown", store.keydown);
    document.addEventListener("touchstart", store.touchstart, { passive: true });
    document.addEventListener("touchmove", store.touchmove, { passive: true });
    listenersAttached = true;
  }

  function handleScroll() {
    if (initialScrollY === null) return;
    const deltaY = Math.abs(initialScrollY - window.pageYOffset);
    if (deltaY >= SCROLL_CLOSE_THRESHOLD) close();
  }

  function handleResize() {
    if (!isOpen.value || isClosing) return;
    if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      resizeRaf = null;
      repositionZoomed(false);
    });
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
    if (!isOpen.value || isClosing || photoKeys.value.length === 0 || !activeKey.value) return;

    const currentIndex = photoKeys.value.indexOf(activeKey.value);
    if (currentIndex === -1) return;

    activeIndex.value = currentIndex;
    const nextIndex = (currentIndex + delta + photoKeys.value.length) % photoKeys.value.length;
    const nextKey = photoKeys.value[nextIndex];
    const img = findPhotoImg(nextKey);
    if (!img) return;
    switchToElement(img, nextKey);
  }

  function close() {
    if (!isOpen.value || isClosing) return;
    invalidateOpenSession();
    isClosing = true;

    overlayVisible.value = false;

    const gridRect = activeSourceElement
      ? getDocumentRect(activeSourceElement.getBoundingClientRect())
      : initialRect.value;
    const reducedMotion = prefersReducedMotion();

    if (gridRect) {
      styles.value = buildRestStyles(gridRect, !reducedMotion);
    }

    cancelCloseTimer();

    if (reducedMotion) {
      finishClose();
      return;
    }

    closeTimer = window.setTimeout(finishClose, TRANSITION_MS);
  }

  function finishClose() {
    cancelCloseTimer();
    isOpen.value = false;
    activeKey.value = null;
    activeIndex.value = -1;
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
    const zoomNatural = resolveZoomNaturalSize(naturalWidth, naturalHeight);
    activeSourceElement = img;
    setActivePhoto(key);
    imageSrc.value = img.currentSrc || img.src;
    caption.value = photoCaptions.value[key] ?? null;
    initialRect.value = gridRect;
    styles.value = buildZoomedStyles(gridRect, zoomNatural.width, zoomNatural.height, animate);
  }

  function switchToElement(img: HTMLImageElement, key: string) {
    if (!import.meta.client || !isOpen.value || isClosing) return;

    const src = img.currentSrc || img.src;
    const gridRect = getDocumentRect(img.getBoundingClientRect());

    if (uniformZoomSize.value) {
      activeSourceElement = img;
      setActivePhoto(key);
      imageSrc.value = src;
      caption.value = photoCaptions.value[key] ?? null;
      initialRect.value = gridRect;
      styles.value = buildZoomedStyles(
        gridRect,
        uniformZoomSize.value.width,
        uniformZoomSize.value.height,
        false,
      );
      return;
    }

    loadNaturalSize(img, src, (naturalWidth, naturalHeight) => {
      if (!isOpen.value || isClosing) return;
      applyZoomedImage(img, key, gridRect, naturalWidth, naturalHeight, false);
    });
  }

  function openFromElement(img: HTMLImageElement, key: string, photoCaption?: PhotoCaption) {
    if (!import.meta.client || !isImageZoomEnabled()) return;

    if (isOpen.value && !isClosing && activeKey.value === key) {
      close();
      return;
    }

    if (isOpen.value && !isClosing) {
      switchToElement(img, key);
      return;
    }

    const sessionId = beginOpenSession();
    const gridRect = getDocumentRect(img.getBoundingClientRect());
    const src = img.currentSrc || img.src;
    const animate = !prefersReducedMotion();

    activeSourceElement = img;
    setActivePhoto(key);
    imageSrc.value = src;
    caption.value = photoCaption ?? photoCaptions.value[key] ?? null;
    initialRect.value = gridRect;
    isOpen.value = true;
    overlayVisible.value = false;
    styles.value = buildRestStyles(gridRect, false);
    addCloseListeners();

    loadNaturalSize(img, src, (naturalWidth, naturalHeight) => {
      if (!isCurrentOpenSession(sessionId)) return;

      requestAnimationFrame(() => {
        if (!isCurrentOpenSession(sessionId)) return;
        overlayVisible.value = true;
        requestAnimationFrame(() => {
          if (!isCurrentOpenSession(sessionId)) return;
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
    setUniformZoomSize,
    openFromElement,
    close,
    isActive,
  };
}
