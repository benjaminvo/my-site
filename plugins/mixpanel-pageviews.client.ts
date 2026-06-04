export default defineNuxtPlugin({
  name: "mixpanel-pageviews",
  dependsOn: ["mixpanel-client"],
  setup() {
    const router = useRouter();
    const mixpanel = useMixpanel();

    const capturePageview = () => {
      mixpanel?.track_pageview();
    };

    capturePageview();

    router.afterEach((to, from) => {
      if (to.fullPath !== from.fullPath) {
        capturePageview();
      }
    });
  },
});
