<template>
  <nav class="relative flex self-start rounded-full bg-slate-100 p-[1px] dark:bg-slate-800">
    <div
      aria-hidden="true"
      :class="[
        'pointer-events-none absolute inset-y-[1px] left-[1px] w-[calc(50%-1px)] rounded-full border border-slate-200 bg-white shadow-xs transition-transform duration-250 ease-out',
        activeIndex === 1 ? 'translate-x-full' : 'translate-x-0',
      ]" />
    <NuxtLink
      :class="[
        'tap-highlight-none relative min-w-[80px] flex-1 rounded-full border border-transparent px-3 py-1 text-center no-underline select-none hover:no-underline',
        activeIndex === 0
          ? 'text-black dark:text-white'
          : 'text-slate-500 transition-colors duration-50 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-400',
      ]"
      to="/">
      About
    </NuxtLink>
    <NuxtLink
      :class="[
        'tap-highlight-none relative min-w-[80px] flex-1 rounded-full border border-transparent px-3 py-1 text-center no-underline select-none hover:no-underline',
        activeIndex === 1
          ? 'text-black dark:text-white'
          : 'text-slate-500 transition-colors duration-50 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-400',
      ]"
      to="/work">
      Work
    </NuxtLink>
    <!-- <NuxtLink
      class="tap-highlight-none min-w-[80px] flex-1 select-none rounded-full border border-transparent px-3 py-1 text-center text-slate-500 hover:text-slate-600 hover:no-underline dark:text-slate-300 dark:hover:text-slate-400 no-underline"
      to="/podcasts">
      Podcasts
    </NuxtLink> -->
  </nav>
</template>

<script setup>
const route = useRoute();

const activeIndex = computed(() => (route.path.startsWith("/work") ? 1 : 0));
</script>
