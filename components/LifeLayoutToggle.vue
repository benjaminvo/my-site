<template>
  <div
    class="fixed bottom-6 left-1/2 z-40 -translate-x-1/2"
    role="group"
    aria-label="Photo layout">
    <nav class="relative flex rounded-full bg-slate-100 p-[1px] shadow-sm dark:bg-slate-800">
      <div
        aria-hidden="true"
        :class="[
          'pointer-events-none absolute inset-y-[1px] left-[1px] w-[calc(50%-1px)] rounded-full border border-slate-200 bg-white shadow-xs transition-transform duration-250 ease-out',
          layout === 'list' ? 'translate-x-full' : 'translate-x-0',
        ]" />
      <button
        type="button"
        :class="buttonClass('grid')"
        :aria-pressed="layout === 'grid'"
        @click="select('grid')">
        Grid
      </button>
      <button
        type="button"
        :class="buttonClass('list')"
        :aria-pressed="layout === 'list'"
        @click="select('list')">
        List
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import type { LifeLayoutMode } from "~/composables/useLifeLayout";

const { layout } = useLifeLayout();

const emit = defineEmits<{
  change: [mode: LifeLayoutMode];
}>();

function buttonClass(mode: LifeLayoutMode) {
  return [
    "tap-highlight-none relative min-w-[72px] rounded-full border border-transparent px-3 py-1 text-center font-sans text-sm select-none outline-none",
    layout.value === mode
      ? "text-black dark:text-slate-50"
      : "text-slate-500 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-400",
  ];
}

function select(mode: LifeLayoutMode) {
  if (layout.value === mode) return;
  emit("change", mode);
}
</script>
