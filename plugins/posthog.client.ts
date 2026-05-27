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
      api_host: config.public.posthogHost,
      capture_pageview: false,
      capture_exceptions: true,
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
