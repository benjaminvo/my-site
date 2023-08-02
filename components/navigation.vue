<template>
  <nav class="flex self-start bg-slate-100 rounded-full xs:rounded-[11px] p-1">
    <NuxtLink
      class="flex-1 py-1 px-3 rounded-full xs:rounded-lg text-center text-slate-400 hover:text-slate-500 hover:no-underline"
      to="/">
      About
    </NuxtLink>
    <NuxtLink
      class="flex-1 py-1 px-3 rounded-full xs:rounded-lg text-center text-slate-400 hover:text-slate-500 hover:no-underline"
      to="/work">Work
    </NuxtLink>
    <!-- <NuxtLink
      class="flex-1 py-1 px-3 rounded-full xs:rounded-lg text-center text-slate-400 hover:text-slate-500 hover:no-underline"
      to="/thoughts">
      Thoughts
    </NuxtLink> -->
  </nav>
</template>
<style scoped>
.router-link-active {
  @apply bg-white;
  @apply shadow;
  @apply text-black;
}
</style>