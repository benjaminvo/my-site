<template>
  <nav
    ref="navRef"
    class="relative flex self-start rounded-full bg-slate-100 p-[1px] dark:bg-slate-800">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-[1px] left-0 rounded-full border border-slate-200 bg-white shadow-xs"
      :class="{ 'opacity-0': !indicatorReady }"
      :style="indicatorStyle" />
    <NuxtLink
      v-for="item in navItems"
      :key="item.to"
      :ref="(el) => setLinkRef(el, item.index)"
      :class="[
        'tap-highlight-none relative rounded-full border px-3 py-1 text-center no-underline select-none outline-none ring-0 hover:no-underline focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0',
        activeIndex === item.index
          ? indicatorReady
            ? 'border-transparent text-black'
            : 'border-slate-200 bg-white text-black shadow-xs'
          : 'border-transparent text-slate-500 transition-colors duration-50 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-400',
      ]"
      :to="item.to">
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>

<script setup>
/** Set true when the Life gallery is ready to go live. */
const showLifeNav = true;

const route = useRoute();

const navRef = ref(null);
const linkEls = ref([]);

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

const indicatorStyle = ref({
  width: "0px",
  transform: "translateX(0px)",
  transition: "none",
});
const indicatorReady = ref(false);
const canAnimateIndicator = ref(false);

function setLinkRef(el, index) {
  if (el) {
    linkEls.value[index] = el.$el ?? el;
  }
}

function updateIndicator({ animate = false } = {}) {
  const nav = navRef.value;
  const link = linkEls.value[activeIndex.value];

  if (!nav || !link) return;

  const navRect = nav.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();

  indicatorStyle.value = {
    width: `${linkRect.width}px`,
    transform: `translateX(${linkRect.left - navRect.left}px)`,
    transition:
      animate && canAnimateIndicator.value
        ? "transform 250ms ease-out, width 250ms ease-out"
        : "none",
  };
  indicatorReady.value = true;
}

watch(activeIndex, () => nextTick(() => updateIndicator({ animate: true })));

onMounted(() => {
  updateIndicator({ animate: false });

  requestAnimationFrame(() => {
    canAnimateIndicator.value = true;
  });

  const observer = new ResizeObserver(() => updateIndicator({ animate: false }));
  if (navRef.value) observer.observe(navRef.value);

  onUnmounted(() => observer.disconnect());
});
</script>
