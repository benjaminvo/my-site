<template>
  <div
    ref="navSlot"
    class="self-start"
    :style="isStuck ? { height: `${navHeight}px` } : undefined">
    <nav
      ref="navRef"
      :class="[
        'flex rounded-full border border-black/5 bg-slate-100/85 px-[1px] py-[2px] backdrop-blur-md dark:bg-slate-800/85 xs:w-auto',
        isStuck
          ? 'fixed top-6 z-30 shadow-xs xs:relative'
          : 'relative w-full shadow-none',
        'xs:shadow-none',
      ]"
      :style="isStuck ? stickyNavStyle : undefined">
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-y-[2px] left-0 rounded-full border border-slate-200 bg-white shadow-xs"
        :class="{ 'opacity-0': !indicatorReady }"
        :style="indicatorStyle" />
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :ref="(el) => setLinkRef(el, item.index)"
        :class="[
          'tap-highlight-none relative flex-1 rounded-full border px-3 py-1 text-center no-underline select-none outline-none ring-0 hover:no-underline focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 xs:flex-none',
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
  </div>
</template>

<script setup>
/** Set true when the Life gallery is ready to go live. */
const showLifeNav = true;

const route = useRoute();
const navRef = ref(null);
const navSlot = ref(null);
const linkEls = ref([]);
const isStuck = ref(false);
const navHeight = ref(0);
const stickyNavStyle = ref({});

const stickyTop = 24;
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
  nextTick(() => updateIndicator({ animate: true }));

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
        updateIndicator({ animate: false });
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
    nextTick(() => updateIndicator({ animate: false }));
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

  indicatorStyle.value = {
    width: `${Math.max(0, link.offsetWidth - 2)}px`,
    transform: `translateX(${link.offsetLeft + 1}px)`,
    transition:
      animate && canAnimateIndicator.value
        ? "transform 250ms ease-out, width 250ms ease-out"
        : "none",
  };
  indicatorReady.value = true;
}

watch(activeIndex, () => nextTick(() => updateIndicator({ animate: true })));

onMounted(() => {
  updateStuckState();
  updateIndicator({ animate: false });

  requestAnimationFrame(() => {
    canAnimateIndicator.value = true;
  });

  const observer = new ResizeObserver(() => {
    updateStuckState();
    updateIndicator({ animate: false });
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
