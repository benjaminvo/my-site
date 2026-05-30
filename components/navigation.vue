<template>
  <div class="contents xs:block self-start">
    <div ref="sentinel" class="xs:hidden h-px w-full" aria-hidden="true" />
    <div
      class="pointer-events-none fixed inset-x-0 top-0 z-40 h-0 overflow-visible xs:hidden"
      aria-hidden="true">
      <div
        :class="[
          'nav-scroll-fade',
          { 'nav-scroll-fade--visible': isStuck && !supportsScrollTimeline },
        ]" />
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
const supportsScrollTimeline = ref(false);

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

  supportsScrollTimeline.value = CSS.supports("animation-timeline", "scroll()");

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

<style scoped>
@reference "~/assets/css/main.css";

/*
 * Mask-based top fade: solid page background clipped by a gradient mask
 * (replaces stacked semi-transparent gradients + backdrop-blur).
 */
.nav-scroll-fade {
  position: absolute;
  inset-inline: 0;
  top: 0;
  /* Solid through nav, then a longer eased ramp (no hard jump to full white) */
  height: 4rem;
  background-color: white;
  -webkit-mask-image: linear-gradient(
    to bottom,
    #000 0%,
    #000 75%,
    rgba(0, 0, 0, 0.88) 80%,
    rgba(0, 0, 0, 0.62) 87%,
    rgba(0, 0, 0, 0.3) 94%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    #000 0%,
    #000 75%,
    rgba(0, 0, 0, 0.88) 80%,
    rgba(0, 0, 0, 0.62) 87%,
    rgba(0, 0, 0, 0.3) 94%,
    transparent 100%
  );
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-size: 100% 100%;
  -webkit-mask-size: 100% 100%;
}

:global(.dark) .nav-scroll-fade {
  background-color: var(--color-neutral-950);
}

@supports (animation-timeline: scroll()) {
  .nav-scroll-fade {
    opacity: 0;
    animation: nav-scroll-fade-in linear both;
    animation-timeline: scroll(root block);
    animation-range: 0 1rem;
  }

  @keyframes nav-scroll-fade-in {
    to {
      opacity: 1;
    }
  }
}

@supports not (animation-timeline: scroll()) {
  .nav-scroll-fade {
    opacity: 0;
    transition: opacity 200ms ease-out;
  }

  .nav-scroll-fade--visible {
    opacity: 1;
  }
}
</style>
