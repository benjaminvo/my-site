const pageByPath: Record<string, "about" | "work" | "life"> = {
  "/": "about",
  "/work": "work",
  "/life": "life",
};

export default defineNuxtPlugin({
  name: "mixpanel-pageviews",
  dependsOn: ["mixpanel-client"],
  setup() {
    const router = useRouter();
    const mixpanel = useMixpanel();

    const capturePageview = (path: string) => {
      const page = pageByPath[path];
      if (page) {
        mixpanel?.track("Page Viewed", { page });
        return;
      }

      mixpanel?.track_pageview();
    };

    capturePageview(router.currentRoute.value.path);

    router.afterEach((to, from) => {
      if (to.fullPath !== from.fullPath) {
        capturePageview(to.path);
      }
    });
  },
});
