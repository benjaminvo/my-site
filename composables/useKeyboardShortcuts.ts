/** Keep in sync with Navigation.vue */
const showLifeNav = true;

const MD_MEDIA_QUERY = "(min-width: 768px)";
const FLASH_MS = 320;

export type ShortcutDef = {
  id: string;
  label: string;
  keys: string[];
  match: (e: KeyboardEvent) => boolean;
  run: () => void | Promise<void>;
  enabled?: () => boolean;
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return target.isContentEditable;
}

function letterMatch(key: string) {
  return (e: KeyboardEvent) =>
    e.key.toLowerCase() === key.toLowerCase() && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey;
}

function altArrowMatch(key: "ArrowDown" | "ArrowUp") {
  return (e: KeyboardEvent) => e.altKey && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.key === key;
}

export function useKeyboardShortcuts() {
  const route = useRoute();
  const isOpen = useState("keyboard-shortcuts:open", () => false);
  const flashingId = useState<string | null>("keyboard-shortcuts:flashing", () => null);
  const flashGeneration = useState("keyboard-shortcuts:flash-gen", () => 0);
  const isMdViewport = useState("keyboard-shortcuts:md", () => false);
  const imageZoomOpen = useState("image-zoom:open", () => false);

  const { scrollToAdjacent, isOnWorkPage } = useWorkProjectNav();
  const { requestPhotoStackSummon } = usePhotoStackSummon();

  let flashTimer: ReturnType<typeof setTimeout> | null = null;

  async function goToContact() {
    if (!route.path.startsWith("/")) {
      await navigateTo("/");
    }
    await nextTick();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function summonPhotos() {
    if (!route.path.startsWith("/")) {
      await navigateTo("/");
      await nextTick();
    }
    requestPhotoStackSummon();
  }

  const shortcuts = computed<ShortcutDef[]>(() => {
    const defs: ShortcutDef[] = [
      {
        id: "nav-about",
        label: "Go to About",
        keys: ["A"],
        match: letterMatch("a"),
        run: () => navigateTo("/"),
      },
      {
        id: "nav-work",
        label: "Go to Work",
        keys: ["W"],
        match: letterMatch("w"),
        run: () => navigateTo("/work"),
      },
      {
        id: "work-next",
        label: "Go to next project",
        keys: ["⌥", "↓"],
        match: altArrowMatch("ArrowDown"),
        run: () => scrollToAdjacent(1),
        enabled: () => isOnWorkPage.value,
      },
      {
        id: "work-prev",
        label: "Go to prev project",
        keys: ["⌥", "↑"],
        match: altArrowMatch("ArrowUp"),
        run: () => scrollToAdjacent(-1),
        enabled: () => isOnWorkPage.value,
      },
      {
        id: "summon-photos",
        label: "Summon photos",
        keys: ["P"],
        match: letterMatch("p"),
        run: summonPhotos,
      },
      {
        id: "contact",
        label: "Contact me",
        keys: ["C"],
        match: letterMatch("c"),
        run: goToContact,
      },
      {
        id: "panel-toggle",
        label: "Toggle shortcuts",
        keys: ["S"],
        match: letterMatch("s"),
        run: () => toggle(),
      },
    ];

    if (showLifeNav) {
      defs.splice(2, 0, {
        id: "nav-life",
        label: "Go to Life",
        keys: ["L"],
        match: letterMatch("l"),
        run: () => navigateTo("/life"),
      });
    }

    return defs;
  });

  const visibleShortcuts = computed(() => shortcuts.value.filter((s) => (s.enabled ? s.enabled() : true)));

  function flashShortcut(id: string) {
    flashingId.value = null;
    flashGeneration.value += 1;
    nextTick(() => {
      flashingId.value = id;
      if (flashTimer) clearTimeout(flashTimer);
      flashTimer = setTimeout(() => {
        flashingId.value = null;
        flashTimer = null;
      }, FLASH_MS);
    });
  }

  function toggle() {
    isOpen.value = !isOpen.value;
  }

  function close() {
    isOpen.value = false;
  }

  function runShortcut(shortcut: ShortcutDef, event: KeyboardEvent) {
    event.preventDefault();
    void Promise.resolve(shortcut.run());
    flashShortcut(shortcut.id);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!isMdViewport.value) return;

    if (event.key === "Escape" && isOpen.value) {
      event.preventDefault();
      close();
      return;
    }

    if (isTypingTarget(event.target)) return;

    const panelToggle = visibleShortcuts.value.find((s) => s.id === "panel-toggle");
    if (panelToggle?.match(event)) {
      runShortcut(panelToggle, event);
      return;
    }

    if (imageZoomOpen.value) return;

    for (const shortcut of visibleShortcuts.value) {
      if (shortcut.id === "panel-toggle") continue;
      if (!shortcut.match(event)) continue;
      runShortcut(shortcut, event);
      return;
    }
  }

  onMounted(() => {
    if (!import.meta.client) return;

    const mq = window.matchMedia(MD_MEDIA_QUERY);
    const syncViewport = () => {
      isMdViewport.value = mq.matches;
      if (!mq.matches) close();
    };
    syncViewport();
    mq.addEventListener("change", syncViewport);

    window.addEventListener("keydown", handleKeydown);

    onUnmounted(() => {
      mq.removeEventListener("change", syncViewport);
      window.removeEventListener("keydown", handleKeydown);
      if (flashTimer) clearTimeout(flashTimer);
    });
  });

  return {
    isOpen,
    flashingId,
    flashGeneration,
    shortcuts: visibleShortcuts,
    toggle,
    close,
  };
}
