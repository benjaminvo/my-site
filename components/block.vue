<template>
  <div class="flex gap-6 sm:grid sm:grid-cols-8 sm:gap-8">
    <div v-if="label" class="w-[88px] shrink-0 text-slate-400 sm:col-span-2 sm:w-auto">
      {{ label }}
    </div>
    <div class="grid gap-3 sm:col-span-6">
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
      <small v-if="subTitle" class="text-xs uppercase text-slate-400">{{ subTitle }}</small>
      <p v-if="description">{{ description }}</p>
      <p v-if="description2">{{ description2 }}</p>
      <p v-if="description3">{{ description3 }}</p>
    </div>
  </div>
</template>
<script setup>
defineProps(["label", "title", "link", "subTitle", "description", "description2", "description3"]);
</script>
