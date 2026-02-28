<template>
  <nav class="flex self-start rounded-full bg-slate-100 p-[1px] dark:bg-slate-800">
    <NuxtLink
      class="tap-highligt-none min-w-[80px] flex-1 select-none rounded-full border border-transparent px-3 py-1 text-center text-slate-500 hover:text-slate-600 hover:no-underline dark:text-slate-300 dark:hover:text-slate-400 no-underline"
      to="/">
      About
    </NuxtLink>
    <NuxtLink
      class="tap-highligt-none min-w-[80px] flex-1 select-none rounded-full border border-transparent px-3 py-1 text-center text-slate-500 hover:text-slate-600 hover:no-underline dark:text-slate-300 dark:hover:text-slate-400 no-underline"
      to="/work">
      Work
    </NuxtLink>
    <!-- <NuxtLink
      class="tap-highligt-none min-w-[80px] flex-1 select-none rounded-full border border-transparent px-3 py-1 text-center text-slate-500 hover:text-slate-600 hover:no-underline dark:text-slate-300 dark:hover:text-slate-400 no-underline"
      to="/podcasts">
      Podcasts
    </NuxtLink> -->
  </nav>
</template>
<style scoped>
@reference "~/assets/css/main.css";

.router-link-exact-active {
  @apply bg-white shadow-xs border border-slate-200 text-black;
}
</style>
