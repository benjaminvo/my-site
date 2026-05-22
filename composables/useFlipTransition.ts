const FLIP_DURATION_MS = 300;
const FLIP_EASING = "cubic-bezier(0.2, 0, 0.2, 1)";

function prefersReducedMotion() {
  if (!import.meta.client) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getFlipItems(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>("[data-flip-item]"));
}

export async function runFlipTransition(
  container: HTMLElement | null,
  update: () => void,
) {
  if (!import.meta.client || !container) {
    update();
    return;
  }

  if (prefersReducedMotion()) {
    update();
    await nextTick();
    return;
  }

  const items = getFlipItems(container);
  const firstRects = items.map((item) => item.getBoundingClientRect());

  update();
  await nextTick();

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      items.forEach((item, index) => {
        const first = firstRects[index];
        const last = item.getBoundingClientRect();
        if (!first || !last.width || !last.height) return;

        const deltaX = first.left - last.left;
        const deltaY = first.top - last.top;
        const scaleX = first.width / last.width;
        const scaleY = first.height / last.height;

        item.style.transformOrigin = "top left";
        item.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
        item.style.transition = "none";

        requestAnimationFrame(() => {
          item.style.transition = `transform ${FLIP_DURATION_MS}ms ${FLIP_EASING}`;
          item.style.transform = "";

          const onEnd = () => {
            item.removeEventListener("transitionend", onEnd);
            item.style.transition = "";
            item.style.transformOrigin = "";
          };
          item.addEventListener("transitionend", onEnd);
        });
      });

      window.setTimeout(resolve, FLIP_DURATION_MS);
    });
  });
}
