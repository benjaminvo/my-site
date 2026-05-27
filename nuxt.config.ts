// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  plugins: [{ src: "~/plugins/vercel.ts", mode: "client" }],
  modules: ["@unlazy/nuxt"],
  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      posthogPublicKey: process.env.NUXT_POSTHOG_CONFIG_PUBLIC_KEY || "",
      posthogApiHost: process.env.NUXT_POSTHOG_CONFIG_API_HOST || "/livy-capture",
      posthogUiHost: process.env.NUXT_POSTHOG_CONFIG_UI_HOST || "https://eu.posthog.com",
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
