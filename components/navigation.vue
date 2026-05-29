<template>
  <div class="contents xs:block self-start">
    <div ref="sentinel" class="xs:hidden h-px w-full" aria-hidden="true" />
    <div
      aria-hidden="true"
      :class="[
        'pointer-events-none fixed inset-x-0 top-0 z-40 h-16 overflow-hidden transition-opacity duration-200 ease-out xs:hidden',
        isStuck ? 'opacity-100' : 'opacity-0',
      ]">
      <div
        class="absolute inset-0 backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)]" />
      <div
        class="absolute inset-0 [background:linear-gradient(to_bottom,white_0%,white_50%,rgba(255,255,255,0)_100%)] dark:[background:linear-gradient(to_bottom,var(--color-neutral-950)_0%,var(--color-neutral-950)_50%,rgba(3,7,18,0)_100%)]" />
    </div>
    <nav
      class="sticky top-4 z-50 -ml-1 mb-12 flex w-[calc(100%+8px)] gap-2 self-start xs:static xs:ml-0 xs:mb-0 xs:w-auto">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :class="[
          'tap-highlight-none relative flex-1 rounded-full border border-black/8 dark:border-white/6 px-3 py-1 text-center no-underline shadow-xs select-none outline-none ring-0 transition-colors duration-150 ease-out hover:no-underline focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 xs:flex-none',
          activeIndex === item.index
            ? [activeColorClass, 'text-white']
            : 'bg-white dark:bg-neutral-800 text-black dark:text-white hover:bg-slate-50 dark:hover:bg-neutral-700',
        ]"
        :to="item.to">
        {{ item.label }}
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup>
/** Set true when the Life gallery is ready to go live. */
const showLifeNav = true;

const route = useRoute();
const sentinel = ref(null);
const isStuck = ref(false);

const navItems = computed(() => {
  const items = [
    { label: "About", to: "/", index: 0 },
    { label: "Work", to: "/work", index: 1 },
  ];

  if (showLifeNav) {
    items.push({ label: "Life", to: "/life", index: 2 });
  }

  return items;
});

const activeIndex = computed(() => {
  if (route.path.startsWith("/work")) return 1;
  if (showLifeNav && route.path.startsWith("/life")) return 2;
  return 0;
});

const activeColorClass = computed(() => {
  if (activeIndex.value === 1) return "bg-[#5F8F6D]";
  if (activeIndex.value === 2) return "bg-[#5F8F6D]";
  return "bg-[#5F8F6D]";
});

onMounted(() => {
  if (!import.meta.client || !sentinel.value) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      isStuck.value = !entry.isIntersecting;
    },
    { rootMargin: "-16px 0px 0px 0px", threshold: 0 },
  );
  observer.observe(sentinel.value);

  onUnmounted(() => {
    observer.disconnect();
  });
});
</script>
