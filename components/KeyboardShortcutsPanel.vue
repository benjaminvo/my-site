<template>
  <div
    class="pointer-events-none fixed right-6 z-40 hidden md:block"
    :class="currentEpisode ? 'bottom-28' : 'bottom-6'">
    <div ref="panelRoot" class="pointer-events-auto relative">
      <Transition name="shortcuts-card">
        <div
          v-show="isOpen"
          class="shortcuts-card absolute right-0 bottom-full mb-3 w-[min(280px,calc(100vw-3rem))] rounded-2xl border border-black/8 bg-white/85 px-4 py-3 shadow-xs backdrop-blur-md select-none dark:border-white/6 dark:bg-neutral-800/85">
          <ul class="m-0 list-none space-y-2.5 p-0">
            <li v-for="shortcut in shortcuts" :key="shortcut.id" class="flex items-center justify-between gap-4">
              <span class="font-serif text-black dark:text-neutral-100">{{ shortcut.label }}</span>
              <span
                :class="[
                  'shortcut-badge inline-flex h-7 shrink-0 items-center justify-center bg-slate-100 text-xs font-medium text-slate-400 dark:bg-neutral-700 dark:text-neutral-500',
                  shortcut.keys.length === 1 ? 'min-w-7 rounded-full px-2' : 'gap-1 rounded-full px-2.5',
                  flashingId === shortcut.id && `shortcut-badge-flash shortcut-badge-flash--${flashGeneration}`,
                ]">
                <template v-for="(key, index) in shortcut.keys" :key="`${shortcut.id}-${key}`">
                  <span v-if="index > 0" class="text-[10px] text-slate-300 dark:text-neutral-600">+</span>
                  <span>{{ key }}</span>
                </template>
              </span>
            </li>
          </ul>
        </div>
      </Transition>

      <button
        type="button"
        class="keyboard-fab tap-highlight-none"
        :class="{ 'keyboard-fab--open': isOpen }"
        :aria-expanded="isOpen"
        :aria-label="isOpen ? 'Close keyboard shortcuts' : 'Open keyboard shortcuts'"
        @click="toggle">
        <span class="keyboard-fab__icons" aria-hidden="true">
          <img
            class="keyboard-fab__icon keyboard-fab__icon--keyboard"
            src="/img/icon-keyboard.svg"
            alt=""
            width="24"
            height="24" />
          <img
            class="keyboard-fab__icon keyboard-fab__icon--close"
            src="/img/icon-close.svg"
            alt=""
            width="24"
            height="24" />
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { currentEpisode } = usePodcastPlayer();
const { isOpen, shortcuts, flashingId, flashGeneration, toggle, close } = useKeyboardShortcuts();

const panelRoot = ref<HTMLElement | null>(null);

function onDocumentPointerDown(event: PointerEvent) {
  if (!isOpen.value || !panelRoot.value) return;
  if (panelRoot.value.contains(event.target as Node)) return;
  close();
}

watch(isOpen, (open) => {
  if (!import.meta.client) return;
  if (open) {
    document.addEventListener("pointerdown", onDocumentPointerDown);
  } else {
    document.removeEventListener("pointerdown", onDocumentPointerDown);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    document.removeEventListener("pointerdown", onDocumentPointerDown);
  }
});
</script>

<style scoped>
@reference "~/assets/css/main.css";

.shortcuts-card-enter-active,
.shortcuts-card-leave-active {
  transition:
    opacity 0.2s ease-out,
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}

.shortcuts-card-enter-from,
.shortcuts-card-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

.shortcuts-card-enter-to,
.shortcuts-card-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.keyboard-fab {
  @apply shadow-xs;
  display: flex;
  height: 3rem;
  width: 3rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid rgb(0 0 0 / 0.08);
  background-color: white;
  outline: none;
  transform: rotate(0deg);
  transition:
    transform 0.28s cubic-bezier(0.34, 1.2, 0.64, 1),
    background-color 0.2s ease-out,
    border-color 0.2s ease-out;
}

.keyboard-fab:hover {
  background-color: rgb(248 250 252);
}

.keyboard-fab--open {
  transform: rotate(90deg);
  border-color: transparent;
  background-color: black;
}

.keyboard-fab--open:hover {
  background-color: rgb(38 38 38);
}

.keyboard-fab__icons {
  position: relative;
  height: 1.5rem;
  width: 1.5rem;
}

.keyboard-fab__icon {
  position: absolute;
  inset: 0;
  transition: opacity 0.12s ease-out;
}

.keyboard-fab__icon--keyboard {
  opacity: 1;
}

.keyboard-fab__icon--close {
  opacity: 0;
}

.keyboard-fab--open .keyboard-fab__icon--keyboard {
  opacity: 0;
}

.keyboard-fab--open .keyboard-fab__icon--close {
  opacity: 1;
}

@media (prefers-color-scheme: dark) {
  .keyboard-fab {
    border-color: rgb(255 255 255 / 0.06);
    background-color: rgb(38 38 38);
  }

  .keyboard-fab:hover {
    background-color: rgb(64 64 64);
  }

  .keyboard-fab--open {
    background-color: black;
  }

  .keyboard-fab--open:hover {
    background-color: rgb(23 23 23);
  }

  .keyboard-fab__icon--keyboard {
    filter: invert(1);
  }
}

.shortcut-badge-flash {
  animation: shortcut-flash 0.32s ease-out forwards;
}

@keyframes shortcut-flash {
  0% {
    background-color: rgb(241 245 249);
    color: rgb(148 163 184);
  }
  14% {
    background-color: #5f8f6d;
    color: white;
  }
  100% {
    background-color: rgb(241 245 249);
    color: rgb(148 163 184);
  }
}

@media (prefers-color-scheme: dark) {
  .shortcut-badge-flash {
    animation-name: shortcut-flash-dark;
  }
}

@keyframes shortcut-flash-dark {
  0% {
    background-color: rgb(64 64 64);
    color: rgb(115 115 115);
  }
  14% {
    background-color: #5f8f6d;
    color: white;
  }
  100% {
    background-color: rgb(64 64 64);
    color: rgb(115 115 115);
  }
}
</style>
