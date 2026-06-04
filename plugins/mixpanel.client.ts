import mixpanel from "mixpanel-browser";

export default defineNuxtPlugin({
  name: "mixpanel-client",
  setup() {
    const config = useRuntimeConfig();
    const token = config.public.mixpanelToken;

    if (!token) {
      return;
    }

    mixpanel.init(token, {
      api_host: config.public.mixpanelApiHost,
      debug: import.meta.dev,
      track_pageview: false,
      persistence: "localStorage",
    });

    if (import.meta.dev) {
      mixpanel.opt_out_tracking();
    }

    return {
      provide: {
        mixpanel: () => mixpanel,
      },
    };
  },
});
