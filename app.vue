<template>
  <div
    class="mx-auto px-6 py-14 xs:px-10 xs:py-20 sm:grid sm:max-w-[calc(640px-56px)] sm:grid-cols-8 sm:gap-x-8 sm:px-0 md:max-w-[calc(768px-30px)] md:grid-cols-10 lg:max-w-[calc(1024px-132px)] lg:grid-cols-12 xl:max-w-[calc(1280px-80px)] xl:grid-cols-16">
    <Header />
    <NuxtPage />
  </div>
</template>

<script setup>
useHead({
  bodyAttrs: {
    class: "bg-white dark:bg-slate-950 overflow-x-hidden",
  },
});
useSeoMeta({
  ogSiteName: "Benjamin Ottensten",
  title: "Benjamin Ottensten, Product & Design lead",
  ogTitle: "Benjamin Ottensten, Product & Design lead",
  description: "Experienced product builder based in Copenhagen with a background in product, design and frontend.",
  ogDescription: "Experienced product builder based in Copenhagen with a background in product, design and frontend.",
  ogImage: "https://benjaminottensten.com/img/social.jpg",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterSite: "@benjavo",
});
</script>
