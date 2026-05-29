import posthog from "posthog-js";

export default defineNuxtPlugin({
  name: "posthog-client",
  setup() {
    const config = useRuntimeConfig();
    const publicKey = config.public.posthogPublicKey;

    if (!publicKey || posthog.__loaded) {
      return;
    }

    posthog.init(publicKey, {
      api_host: config.public.posthogApiHost,
      ui_host: config.public.posthogUiHost,
      person_profiles: "always",
      capture_pageview: false,
      capture_exceptions: true,
      disable_session_recording: true,
      capture_dead_clicks: false,
      disable_surveys: true,
      capture_performance: false,
    });

    if (import.meta.dev) {
      posthog.opt_out_capturing();
    }

    return {
      provide: {
        posthog: () => posthog,
      },
    };
  },
});
