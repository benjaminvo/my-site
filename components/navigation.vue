<template>
  <nav class="flex self-start rounded-full bg-slate-100 p-1 dark:bg-slate-700">
    <NuxtLink
      class="tap-highligt-none min-w-[80px] flex-1 rounded-full px-3 py-1 text-center text-slate-500 hover:text-slate-600 hover:no-underline dark:text-slate-300 dark:hover:text-slate-400"
      to="/">
      About
    </NuxtLink>
    <NuxtLink
      class="tap-highligt-none min-w-[80px] flex-1 rounded-full px-3 py-1 text-center text-slate-500 hover:text-slate-600 hover:no-underline dark:text-slate-300 dark:hover:text-slate-400"
      to="/work"
      >Work
    </NuxtLink>
  </nav>
</template>
<style scoped>
.router-link-active {
  @apply bg-white;
  @apply shadow;
  @apply text-black;
}
</style>
