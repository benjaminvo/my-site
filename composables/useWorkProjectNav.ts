import { workProjectIds } from "~/data/workProjects";

const SCROLL_OFFSET_PX = 80;

export function useWorkProjectNav() {
  const route = useRoute();

  const isOnWorkPage = computed(() => route.path.startsWith("/work"));

  function scrollToProject(id: string) {
    if (!import.meta.client) return;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function getActiveProjectIndex(): number {
    if (!import.meta.client) return 0;

    let bestIndex = 0;
    let bestTop = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < workProjectIds.length; i++) {
      const element = document.getElementById(workProjectIds[i]);
      if (!element) continue;

      const top = element.getBoundingClientRect().top;
      if (top <= SCROLL_OFFSET_PX && top > bestTop) {
        bestTop = top;
        bestIndex = i;
      }
    }

    return bestIndex;
  }

  function scrollToAdjacent(delta: 1 | -1) {
    if (!import.meta.client || !isOnWorkPage.value) return;

    const currentIndex = getActiveProjectIndex();
    const nextIndex = Math.min(workProjectIds.length - 1, Math.max(0, currentIndex + delta));
    scrollToProject(workProjectIds[nextIndex]);
  }

  return {
    isOnWorkPage,
    scrollToProject,
    scrollToAdjacent,
  };
}
