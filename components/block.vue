<template>
  <div class="grid grid-cols-8 gap-8">
    <div v-if="label" class="col-span-2 text-slate-400">{{ label }}</div>
    <div class="col-span-6 grid gap-2">
      <h3 v-if="title">
        <template v-if="link">
          <NuxtLink :to="link" target="_blank">
            {{ title }}
          </NuxtLink>
        </template>
        <template v-else>
          {{ title }}
        </template>
      </h3>
      <small v-if="subTitle" class="text-xs text-slate-400 uppercase">{{ subTitle }}</small>
      <p v-if="description">{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps(['label', 'title', 'link', 'subTitle', 'description']);
</script>