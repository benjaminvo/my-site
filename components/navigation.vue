<template>
  <nav class="relative flex self-start rounded-full bg-slate-100 p-[1px] dark:bg-slate-800">
    <div
      aria-hidden="true"
      :class="[
        'pointer-events-none absolute inset-y-[1px] left-[1px] rounded-full border border-slate-200 bg-white shadow-xs transition-transform duration-250 ease-out',
        showLifeNav ? 'w-[calc(33.333%-1px)]' : 'w-[calc(50%-1px)]',
        showLifeNav
          ? activeIndex === 1
            ? 'translate-x-full'
            : activeIndex === 2
              ? 'translate-x-[200%]'
              : 'translate-x-0'
          : activeIndex === 1
            ? 'translate-x-full'
            : 'translate-x-0',
      ]" />
    <NuxtLink
      :class="[
        'tap-highlight-none relative min-w-[72px] flex-1 rounded-full border border-transparent px-3 py-1 text-center no-underline select-none outline-none ring-0 hover:no-underline focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0',
        activeIndex === 0
          ? 'text-black'
          : 'text-slate-500 transition-colors duration-50 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-400',
      ]"
      to="/">
      About
    </NuxtLink>
    <NuxtLink
      :class="[
        'tap-highlight-none relative min-w-[72px] flex-1 rounded-full border border-transparent px-3 py-1 text-center no-underline select-none outline-none ring-0 hover:no-underline focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0',
        activeIndex === 1
          ? 'text-black'
          : 'text-slate-500 transition-colors duration-50 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-400',
      ]"
      to="/work">
      Work
    </NuxtLink>
    <NuxtLink
      v-if="showLifeNav"
      :class="[
        'tap-highlight-none relative min-w-[72px] flex-1 rounded-full border border-transparent px-3 py-1 text-center no-underline select-none outline-none ring-0 hover:no-underline focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0',
        activeIndex === 2
          ? 'text-black'
          : 'text-slate-500 transition-colors duration-50 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-400',
      ]"
      to="/life">
      Life
    </NuxtLink>
  </nav>
</template>

<script setup>
/** Set true when the Life gallery is ready to go live. */
const showLifeNav = false;

const route = useRoute();

const activeIndex = computed(() => {
  if (route.path.startsWith("/work")) return 1;
  if (showLifeNav && route.path.startsWith("/life")) return 2;
  return 0;
});
</script>
