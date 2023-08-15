<template>
  <main
    class="sm:col-span-8 sm:grid sm:grid-cols-8 sm:gap-x-8 md:col-start-2 lg:col-span-12 lg:grid-cols-12 xl:col-span-16 xl:grid-cols-16">
    <!-- <p class="mb-12 sm:mb-20 sm:col-start-2 sm:col-span-14 md:col-start-3 md:col-span-12 lg:col-start-4 lg:col-span-10
      xl:col-start-5 xl:col-span-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dictum metus
      necmirutrum scelerisque. Cras aliquet libero purus, ut bibendum justo commodo id.</p> -->

    <section
      class="mb-20 items-start sm:col-span-8 sm:grid sm:grid-cols-8 sm:gap-x-8 lg:col-span-12 lg:grid-cols-12 xl:col-span-16 xl:grid-cols-16">
      <div
        class="mb-10 grid gap-3 sm:col-span-8 lg:col-span-8 lg:col-start-3 xl:sticky xl:top-20 xl:col-span-4 xl:col-start-1 xl:mb-0">
        <h2>Regnsky</h2>
        <small class="text-xs uppercase text-slate-400">2016 · Blog redesign</small>
        <p>I redesigned and coded the popular Danish music blog regnsky.dk.</p>
        <p>
          We agreed on the keywords Cute, Friendly, Colourful, and Handmade. Seven years later I
          still think the design does a good job of capturing that.
        </p>
        <p>
          The illustration in the header, by Hvass&Hannibal, is the only thing I carried over from
          the old design.
        </p>
      </div>
      <div
        class="border border-black/[.05] sm:col-span-4 lg:col-span-4 lg:col-start-1 xl:col-span-4">
        <img
          src="img/regnsky/1.jpg"
          srcset="img/regnsky/1@2x.jpg 2x, img/regnsky/1@3x.jpg 3x"
          class="w-full" />
      </div>
      <div class="border border-black/[.05] sm:col-span-4 lg:col-span-4 xl:col-span-4">
        <img
          src="img/regnsky/2.jpg"
          srcset="img/regnsky/2@2x.jpg 2x, img/regnsky/2@3x.jpg 3x"
          class="w-full" />
      </div>
      <div class="border border-black/[.05] sm:col-span-4 lg:col-span-4 xl:col-span-4">
        <img
          src="img/regnsky/3.jpg"
          srcset="img/regnsky/3@2x.jpg 2x, img/regnsky/3@3x.jpg 3x"
          class="w-full" />
      </div>
    </section>
  </main>
</template>
<script setup>
useSeoMeta({
  title: "Work | Benjamin Ottensten",
  ogTitle: "Work | Benjamin Ottensten",
});
</script>
