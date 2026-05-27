import type posthog from "posthog-js";

export function usePostHog(): typeof posthog | undefined {
  const { $posthog } = useNuxtApp();
  return $posthog?.();
}
