<template>
  <div>
    <div class="relative">
      <UnLazyImage :src-set="srcSet" :thumbhash="thumbhash" class="w-full" />
      <Border />
    </div>
    <p v-if="caption" class="mt-2.5 font-sans text-xs text-slate-400">
      {{ caption }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  caption: String,
  srcSet: { type: String, required: true },
  thumbhash: { type: String, required: true },
});
</script>
