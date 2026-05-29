export function useScrollSpy(sectionIds: string[]) {
  const activeId = ref(sectionIds[0] ?? "");

  onMounted(() => {
    if (!import.meta.client || sectionIds.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        if (visible.size === 0) return;

        const next = sectionIds.find((id) => visible.has(id));
        if (next) activeId.value = next;
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
    );

    for (const id of sectionIds) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    onUnmounted(() => observer.disconnect());
  });

  return { activeId };
}
