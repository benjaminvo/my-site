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
};

const emptyStyles = (): ZoomStyles => ({
  wrapper: {},
  image: {},
});

let initialScrollY: number | null = null;
let initialTouchY: number | null = null;
let wheelAccumulator = 0;
let listenersAttached = false;
let isClosing = false;
let activeSourceElement: HTMLImageElement | null = null;

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

function calculateScaleFactor(
  displayWidth: number,
  naturalWidth: number,
  naturalHeight: number,
) {
  const { width: viewportWidth, height: viewportHeight } = getViewportBounds();
  const maxScaleFactor = naturalWidth / displayWidth;
  const imageAspectRatio = naturalWidth / naturalHeight;
  const viewportAspectRatio = viewportWidth / viewportHeight;

  if (naturalWidth < viewportWidth && naturalHeight < viewportHeight) {
    return maxScaleFactor;
  }
  if (imageAspectRatio < viewportAspectRatio) {
    return (viewportHeight / naturalHeight) * maxScaleFactor;
  }
  return (viewportWidth / naturalWidth) * maxScaleFactor;
}

function buildRestStyles(docRect: DocRect, animate: boolean): ZoomStyles {
  const transition = animate ? `all ${TRANSITION_MS}ms` : "none";
  return {
    wrapper: {
      position: "absolute",
      top: `${docRect.top}px`,
      left: `${docRect.left}px`,
      zIndex: "666",
      transition,
      transform: "translate(0, 0) translateZ(0)",
    },
    image: {
      display: "block",
      width: `${docRect.width}px`,
      height: `${docRect.height}px`,
      maxWidth: "none",
      transition,
      transform: "scale(1)",
      transformOrigin: "center center",
    },
  };
}

function buildZoomedStyles(
  gridRect: DocRect,
  naturalWidth: number,
  naturalHeight: number,
  animate: boolean,
): ZoomStyles {
  const scale = calculateScaleFactor(gridRect.width, naturalWidth, naturalHeight);
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
  const viewportY = scrollTop + window.innerHeight / 2;
  const viewportX = window.innerWidth / 2;
  const imageCenterY = gridRect.top + gridRect.height / 2;
  const imageCenterX = gridRect.left + gridRect.width / 2;
  const translateY = Math.round(viewportY - imageCenterY);
  const translateX = Math.round(viewportX - imageCenterX);
  const transition = animate ? `all ${TRANSITION_MS}ms` : "none";

  return {
    wrapper: {
      position: "absolute",
      top: `${gridRect.top}px`,
      left: `${gridRect.left}px`,
      zIndex: "666",
      transition,
      transform: `translate(${translateX}px, ${translateY}px) translateZ(0)`,
    },
    image: {
      display: "block",
      width: `${gridRect.width}px`,
      height: `${gridRect.height}px`,
      maxWidth: "none",
      transition,
      transform: `scale(${scale})`,
      transformOrigin: "center center",
    },
  };
}

export function useImageZoom() {
  const isOpen = useState("image-zoom:open", () => false);
  const activeKey = useState<string | null>("image-zoom:key", () => null);
  const overlayVisible = useState("image-zoom:overlay-visible", () => false);
  const imageSrc = useState("image-zoom:src", () => "");
  const styles = useState<ZoomStyles>("image-zoom:styles", emptyStyles);
  const initialRect = useState<DocRect | null>("image-zoom:initial-rect", () => null);
  const photoKeys = useState<string[]>("image-zoom:keys", () => []);

  function setPhotoKeys(keys: string[]) {
    photoKeys.value = keys;
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

  function openFromElement(img: HTMLImageElement, key: string) {
    if (!import.meta.client) return;

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
    styles,
    setPhotoKeys,
    openFromElement,
    close,
    isActive,
  };
}
