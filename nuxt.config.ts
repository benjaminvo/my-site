// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  plugins: [{ src: "~/plugins/vercel.ts", mode: "client" }],
  modules: ["@unlazy/nuxt"],
  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      mixpanelToken:
        process.env.NUXT_PUBLIC_MIXPANEL_TOKEN || "c952ce59e338054fba682695002a4b67",
      // EU projects must use api-eu; US default is api-js.mixpanel.com
      mixpanelApiHost:
        process.env.NUXT_PUBLIC_MIXPANEL_API_HOST || "https://api-eu.mixpanel.com",
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
