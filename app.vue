<template>
  <div
    class="px-6 py-12 xs:px-10 xs:py-20 sm:px-0 sm:grid sm:grid-cols-16 sm:gap-x-8 sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-7xl mx-auto">
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