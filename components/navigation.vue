<template>
  <nav class="flex self-start bg-slate-100 rounded-lg p-1">
    <NuxtLink class="py-1 px-3 rounded-lg text-slate-400 hover:text-slate-500 hover:no-underline" to="/">About</NuxtLink>
    <NuxtLink class="py-1 px-3 rounded-lg text-slate-400 hover:text-slate-500 hover:no-underline" to="/work">Work
    </NuxtLink>
    <NuxtLink class="py-1 px-3 rounded-lg text-slate-400 hover:text-slate-500 hover:no-underline" to="/thoughts">Thoughts
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