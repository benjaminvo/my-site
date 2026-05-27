export default defineNuxtPlugin({
  name: "posthog-pageviews",
  dependsOn: ["posthog-client"],
  setup() {
    const router = useRouter();
    const posthog = usePostHog();

    const capturePageview = () => {
      posthog?.capture("$pageview");
    };

    capturePageview();

    router.afterEach((to, from) => {
      if (to.fullPath !== from.fullPath) {
        capturePageview();
      }
    });
  },
});
