export default defineNuxtPlugin(async () => {
  if (import.meta.dev) return;

  const { inject } = await import("@vercel/analytics");
  inject();
});
