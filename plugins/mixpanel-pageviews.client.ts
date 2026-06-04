const sectionViewEvents: Record<string, string> = {
  "/": "Viewed About",
  "/work": "Viewed Work",
  "/life": "Viewed Life",
};

export default defineNuxtPlugin({
  name: "mixpanel-pageviews",
  dependsOn: ["mixpanel-client"],
  setup() {
    const router = useRouter();
    const mixpanel = useMixpanel();

    const capturePageview = (path: string) => {
      mixpanel?.track_pageview();

      const sectionEvent = sectionViewEvents[path];
      if (sectionEvent) {
        mixpanel?.track(sectionEvent);
      }
    };

    capturePageview(router.currentRoute.value.path);

    router.afterEach((to, from) => {
      if (to.fullPath !== from.fullPath) {
        capturePageview(to.path);
      }
    });
  },
});
