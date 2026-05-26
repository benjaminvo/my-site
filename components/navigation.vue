<template>
  <div
    ref="navSlot"
    class="self-start"
    :style="isStuck ? { height: `${navHeight}px` } : undefined">
    <div
      aria-hidden="true"
      :class="[
        'pointer-events-none fixed inset-x-0 top-0 z-40 h-16 overflow-hidden transition-opacity duration-200 ease-out xs:hidden',
        isStuck ? 'opacity-100' : 'opacity-0',
      ]">
      <div
        class="absolute inset-0 backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)]" />
      <div class="absolute inset-0 [background:linear-gradient(to_bottom,white_0%,white_50%,rgba(255,255,255,0)_100%)]" />
    </div>
    <nav
      ref="navRef"
      :class="[
        'flex gap-2 xs:w-auto',
        isStuck
          ? 'fixed top-4 ml-0 w-auto z-50 xs:relative'
          : 'relative -ml-1 w-[calc(100%+8px)] shadow-none',
        'xs:shadow-none',
      ]"
      :style="isStuck ? stickyNavStyle : undefined">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :class="[
          'tap-highlight-none relative flex-1 rounded-full border border-black/8 px-3 py-1 text-center no-underline shadow-xs select-none outline-none ring-0 transition-colors duration-150 ease-out hover:no-underline focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 xs:flex-none',
          activeIndex === item.index
            ? [activeColorClass, 'text-white']
            : 'bg-white text-black hover:bg-slate-50',
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
const navRef = ref(null);
const navSlot = ref(null);
const isStuck = ref(false);
const navHeight = ref(0);
const stickyNavStyle = ref({});

const stickyTop = 16;
const stickyLeft = 20;
const stickyRight = 20;
const mobileQuery = "(max-width: 519px)";

const updateStuckState = () => {
  if (!import.meta.client || !navRef.value || !navSlot.value) return;

  const isMobile = window.matchMedia(mobileQuery).matches;
  const slotTop = navSlot.value.getBoundingClientRect().top;

  navHeight.value = navRef.value.offsetHeight;
  const shouldStick = isMobile && slotTop <= stickyTop;

  isStuck.value = shouldStick;
  stickyNavStyle.value = shouldStick
    ? {
        left: `${stickyLeft}px`,
        right: `${stickyRight}px`,
      }
    : {};
};

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
  updateStuckState();

  const observer = new ResizeObserver(() => {
    updateStuckState();
  });
  if (navRef.value) observer.observe(navRef.value);

  window.addEventListener("scroll", updateStuckState, { passive: true });
  window.addEventListener("resize", updateStuckState);

  onUnmounted(() => {
    observer.disconnect();
    window.removeEventListener("scroll", updateStuckState);
    window.removeEventListener("resize", updateStuckState);
  });
});
</script>
