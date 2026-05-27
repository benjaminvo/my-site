// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  plugins: [{ src: "~/plugins/vercel.ts", mode: "client" }],
  modules: ["@unlazy/nuxt", "@posthog/nuxt"],
  css: ["~/assets/css/main.css"],

  posthogConfig: {
    publicKey: process.env.NUXT_POSTHOG_CONFIG_PUBLIC_KEY || "",
    host: process.env.NUXT_POSTHOG_CONFIG_HOST || "https://eu.i.posthog.com",
    clientConfig: {
      capture_pageview: false,
      capture_exceptions: true,
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") {
          posthog.opt_out_capturing();
        }
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  compatibilityDate: "2026-02-20",
});
