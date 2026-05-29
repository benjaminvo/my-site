<template>
  <nav aria-label="Work projects" class="fixed top-1/2 right-3 z-30 hidden -translate-y-1/2 lg:block">
    <div class="relative" @mouseenter="openCard" @mouseleave="closeCard">
      <div
        class="flex flex-col items-end gap-1.5 transition-opacity duration-200"
        :class="isCardOpen ? 'opacity-0' : 'opacity-100'"
        aria-hidden="true">
        <span
          v-for="project in projects"
          :key="project.id"
          :class="[
            'h-[2px] rounded-full transition-all duration-200',
            activeId === project.id ? 'w-4 bg-slate-900 dark:bg-neutral-100' : 'w-2.5 bg-slate-200 dark:bg-neutral-700',
          ]" />
      </div>

      <div
        :class="[
          'absolute top-1/2 right-0 w-max -translate-y-1/2 rounded-xl border border-black/8 bg-white px-3 py-2 shadow-lg transition-all duration-200 ease-out motion-reduce:translate-x-0 dark:border-white/6 dark:bg-neutral-900',
          isCardOpen
            ? 'pointer-events-auto translate-x-0 opacity-100'
            : 'pointer-events-none translate-x-1.5 opacity-0',
        ]">
        <ul class="m-0 list-none p-0">
          <li v-for="project in projects" :key="project.id">
            <a
              :href="`#${project.id}`"
              :aria-label="project.title"
              :class="[
                'block min-w-[140px] py-1 text-sm whitespace-nowrap no-underline transition-colors duration-150 hover:no-underline',
                activeId === project.id
                  ? 'text-black dark:text-neutral-100'
                  : 'text-slate-400 hover:text-slate-500 dark:text-neutral-500 dark:hover:text-neutral-300',
              ]"
              @click.prevent="scrollToSection(project.id)">
              {{ project.shortTitle ?? project.title }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
type Project = {
  id: string;
  title: string;
  shortTitle?: string;
};

const projects: Project[] = [
  { id: "3d-web-viewer", title: "3D Web Viewer" },
  { id: "transparent-employer-branding", title: "Transparent employer branding", shortTitle: "Employer branding" },
  { id: "dashboard", title: "Dashboard" },
  { id: "keyless-car-rental", title: "Keyless car rental", shortTitle: "Keyless rental" },
  { id: "finding-your-driver", title: "Find your driver" },
  { id: "colorful-car-leasing", title: "Colorful car leasing", shortTitle: "Car leasing" },
  { id: "blog-redesign", title: "Blog redesign" },
  { id: "motivating-students-to-read", title: "Motivating students to read", shortTitle: "Motivating to read" },
];

const { activeId } = useScrollSpy(projects.map((project) => project.id));

const isCardOpen = ref(false);
let closeTimer: ReturnType<typeof setTimeout> | null = null;

function openCard() {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
  isCardOpen.value = true;
}

function closeCard() {
  closeTimer = setTimeout(() => {
    isCardOpen.value = false;
  }, 100);
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

onUnmounted(() => {
  if (closeTimer) clearTimeout(closeTimer);
});
</script>
