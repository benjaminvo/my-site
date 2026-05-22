export type LifeLayoutMode = "grid" | "list";

export function useLifeLayout() {
  const layout = useState<LifeLayoutMode>("life:layout", () => "grid");

  function setLayout(mode: LifeLayoutMode) {
    layout.value = mode;
  }

  function toggleLayout() {
    layout.value = layout.value === "grid" ? "list" : "grid";
  }

  return { layout, setLayout, toggleLayout };
}
