// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  plugins: [{ src: "~/plugins/vercel.ts", mode: "client" }],
  modules: ["@unlazy/nuxt"],
  css: ["~/assets/css/main.css"],

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
