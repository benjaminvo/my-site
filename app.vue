<template>
  <div class="grid grid-cols-16 gap-x-8 py-20 md:max-w-[768px] lg:max-w-[1024px] xl:max-w-7xl mx-auto">
    <Header />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'bg-white'
  }
})
</script>