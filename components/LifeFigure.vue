<template>
  <div>
    <div class="relative">
      <UnLazyImage :src-set="srcSet" :thumbhash="thumbhash" class="w-full" />
    </div>
    <p class="mt-2.5 font-sans text-xs">
      <span class="text-black dark:text-slate-50">{{ title }}</span><span class="ml-1 text-slate-400">{{ date }}</span>
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  src: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  thumbhash: { type: String, default: "" },
});

const srcSet = computed(() => `${props.src} 1x`);
</script>
