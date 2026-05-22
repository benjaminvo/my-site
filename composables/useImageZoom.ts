const OFFSET = 80;
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

function calculateScaleFactor(
  displayWidth: number,
  naturalWidth: number,
  naturalHeight: number,
) {
  const viewportHeight = window.innerHeight - OFFSET;
  const viewportWidth = window.innerWidth - OFFSET;
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
  docRect: DocRect,
  naturalWidth: number,
  naturalHeight: number,
  animate: boolean,
): ZoomStyles {
  const { top, left, width, height } = docRect;
  const scale = calculateScaleFactor(width, naturalWidth, naturalHeight);
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
  const viewportY = scrollTop + window.innerHeight / 2;
  const viewportX = window.innerWidth / 2;
  const imageCenterY = top + height / 2;
  const imageCenterX = left + width / 2;
  const translateY = Math.round(viewportY - imageCenterY);
  const translateX = Math.round(viewportX - imageCenterX);
  const transition = animate ? `all ${TRANSITION_MS}ms` : "none";

  return {
    wrapper: {
      position: "absolute",
      top: `${top}px`,
      left: `${left}px`,
      zIndex: "666",
      transition,
      transform: `translate(${translateX}px, ${translateY}px) translateZ(0)`,
    },
    image: {
      display: "block",
      width: `${width}px`,
      height: `${height}px`,
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
    if (event.key === "Escape") close();
  }

  function close() {
    if (!isOpen.value || isClosing) return;
    isClosing = true;

    overlayVisible.value = false;

    const rect = activeSourceElement
      ? getDocumentRect(activeSourceElement.getBoundingClientRect())
      : initialRect.value;
    if (rect) {
      initialRect.value = rect;
      styles.value = buildRestStyles(rect, !prefersReducedMotion());
    }

    const reducedMotion = prefersReducedMotion();
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

  function openFromElement(img: HTMLImageElement, key: string) {
    if (!import.meta.client) return;

    if (isOpen.value && activeKey.value === key) {
      close();
      return;
    }

    if (isOpen.value) {
      finishClose();
    }

    const viewportRect = img.getBoundingClientRect();
    const docRect = getDocumentRect(viewportRect);
    const src = img.currentSrc || img.src;
    activeSourceElement = img;

    const runZoom = (naturalWidth: number, naturalHeight: number) => {
      const animate = !prefersReducedMotion();

      activeKey.value = key;
      imageSrc.value = src;
      initialRect.value = docRect;
      isOpen.value = true;
      isClosing = false;
      styles.value = buildRestStyles(docRect, false);
      addCloseListeners();

      requestAnimationFrame(() => {
        overlayVisible.value = true;
        requestAnimationFrame(() => {
          styles.value = buildZoomedStyles(docRect, naturalWidth, naturalHeight, animate);
        });
      });
    };

    if (img.complete && img.naturalWidth > 0) {
      runZoom(img.naturalWidth, img.naturalHeight);
      return;
    }

    const loader = new Image();
    loader.onload = () => runZoom(loader.naturalWidth, loader.naturalHeight);
    loader.onerror = () => runZoom(docRect.width, docRect.height);
    loader.src = src;
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
    openFromElement,
    close,
    isActive,
  };
}
