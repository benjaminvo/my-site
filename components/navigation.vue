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
        'flex gap-2',
        isStuck
          ? 'fixed top-4 z-50 xs:relative'
          : 'relative w-full shadow-none xs:w-auto',
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
const stickyInset = 16;
const mobileQuery = "(max-width: 519px)";
let stickyAnimationFrame = null;
let stickyAnimationTimeout = null;
let isAnimatingSticky = false;

const clearStickyAnimation = () => {
  if (stickyAnimationFrame) cancelAnimationFrame(stickyAnimationFrame);
  if (stickyAnimationTimeout) clearTimeout(stickyAnimationTimeout);
  stickyAnimationFrame = null;
  stickyAnimationTimeout = null;
};

const animateToStickyBounds = () => {
  if (!navRef.value || !navSlot.value) return;

  const slotRect = navSlot.value.getBoundingClientRect();
  const stickyWidth = window.innerWidth - stickyInset * 2;
  navHeight.value = navRef.value.offsetHeight;
  isStuck.value = true;
  isAnimatingSticky = true;
  stickyNavStyle.value = {
    left: `${stickyInset}px`,
    width: `${stickyWidth}px`,
    transform: `scaleX(${slotRect.width / stickyWidth})`,
    transformOrigin: "center top",
    transition: "none",
  };

  clearStickyAnimation();
  stickyAnimationFrame = requestAnimationFrame(() => {
    stickyAnimationFrame = requestAnimationFrame(() => {
      stickyNavStyle.value = {
        left: `${stickyInset}px`,
        width: `${stickyWidth}px`,
        transform: "scaleX(1)",
        transformOrigin: "center top",
        transition: "transform 200ms ease-out, box-shadow 200ms ease-out",
      };
      stickyAnimationTimeout = window.setTimeout(() => {
        isAnimatingSticky = false;
        stickyAnimationTimeout = null;
      }, 220);
    });
  });
};

const updateStuckState = () => {
  if (!import.meta.client || !navRef.value || !navSlot.value) return;

  const isMobile = window.matchMedia(mobileQuery).matches;
  const slotTop = navSlot.value.getBoundingClientRect().top;

  navHeight.value = navRef.value.offsetHeight;
  const shouldStick = isMobile && slotTop <= stickyTop;

  if (shouldStick && !isStuck.value) {
    animateToStickyBounds();
  } else if (!shouldStick && isStuck.value && !isAnimatingSticky) {
    clearStickyAnimation();
    isStuck.value = false;
    stickyNavStyle.value = {};
  } else if (shouldStick && !isAnimatingSticky) {
    stickyNavStyle.value = {
      left: `${stickyInset}px`,
      width: `${window.innerWidth - stickyInset * 2}px`,
      transform: "scaleX(1)",
      transformOrigin: "center top",
      transition: "transform 200ms ease-out, box-shadow 200ms ease-out",
    };
  }
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
  if (activeIndex.value === 1) return "bg-[#74A5C4]";
  if (activeIndex.value === 2) return "bg-[#78A67E]";
  return "bg-[#B48260]";
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
    clearStickyAnimation();
    observer.disconnect();
    window.removeEventListener("scroll", updateStuckState);
    window.removeEventListener("resize", updateStuckState);
  });
});
</script>
