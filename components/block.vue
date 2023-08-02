<template>
  <div class="flex gap-8 sm:grid sm:grid-cols-8">
    <div v-if="label" class="shrink-0 sm:col-span-2 text-slate-400 w-[88px] sm:w-auto">{{ label }}</div>
    <div class="grid gap-2 sm:col-span-6">
      <h3 class="break-word" v-if="title">
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