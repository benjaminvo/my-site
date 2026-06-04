import type { Mixpanel } from "mixpanel-browser";

export function useMixpanel(): Mixpanel | undefined {
  const { $mixpanel } = useNuxtApp();
  return $mixpanel?.();
}
