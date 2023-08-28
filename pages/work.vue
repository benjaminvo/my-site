<template>
  <main
    class="sm:col-span-8 sm:grid sm:grid-cols-8 sm:gap-x-8 md:col-start-2 lg:col-span-12 lg:grid-cols-12 xl:col-span-16 xl:grid-cols-16">
    <!-- <p class="mb-12 sm:mb-20 sm:col-start-2 sm:col-span-14 md:col-start-3 md:col-span-12 lg:col-start-4 lg:col-span-10
      xl:col-start-5 xl:col-span-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dictum metus
      necmirutrum scelerisque. Cras aliquet libero purus, ut bibendum justo commodo id.</p> -->

    <section
      class="mb-40 items-start sm:col-span-8 sm:grid sm:grid-cols-8 sm:gap-x-8 lg:col-span-12 lg:grid-cols-12 xl:col-span-16 xl:grid-cols-16">
      <div
        class="mb-10 grid gap-3 sm:col-span-8 lg:col-start-3 xl:sticky xl:top-20 xl:col-span-4 xl:col-start-1 xl:mb-0">
        <h2>Company profiles</h2>
        <small class="text-xs uppercase text-slate-400">The Org, 2023</small>
        <p>I redesigned and coded the popular Danish music blog regnsky.dk.</p>
        <p>
          We agreed on the keywords Cute, Friendly, Colourful, and Handmade. Seven years later I
          still think the design does a good job of capturing that.
        </p>
      </div>
      <div
        class="mb-8 border border-black/[.15] sm:col-span-4 lg:col-span-4 lg:col-start-1 xl:col-span-4">
        <nuxt-img
          loading="lazy"
          width="1170"
          height="3372"
          densities="x1 x2 x3"
          src="/img/company-page/mobile-front-page-new.jpg"
          sizes="xs:100vw sm:276px md:276px lg:276px xl:276px"
          class="w-full" />
      </div>
      <div class="mb-8 border border-black/[.15] sm:col-span-4 lg:col-span-4 xl:col-span-4">
        <nuxt-img
          loading="lazy"
          src="/img/company-page/mobile-position.jpg"
          srcset="
            /img/company-page/mobile-position@2x.jpg 2x,
            /img/company-page/mobile-position@3x.jpg 3x
          "
          class="w-full" />
      </div>
      <div class="mb-8 border border-black/[.15] sm:col-span-4 lg:col-span-4 xl:col-span-4">
        <nuxt-img
          loading="lazy"
          src="/img/company-page/mobile-job.jpg"
          srcset="/img/company-page/mobile-job@2x.jpg 2x, /img/company-page/mobile-job@3x.jpg 3x"
          class="w-full" />
      </div>
      <div
        class="mb-8 border border-black/[.15] sm:col-span-8 md:col-span-10 lg:col-span-12 xl:col-start-5">
        <nuxt-img
          loading="lazy"
          src="/img/company-page/front-page.jpg"
          srcset="/img/company-page/front-page@2x.jpg 2x, /img/company-page/front-page@3x.jpg 3x"
          class="w-full" />
      </div>
      <div
        class="mb-8 border border-black/[.15] sm:col-span-8 md:col-span-10 lg:col-span-12 xl:col-start-5">
        <nuxt-img
          loading="lazy"
          src="/img/company-page/job.jpg"
          srcset="/img/company-page/job@2x.jpg 2x, /img/company-page/job@3x.jpg 3x"
          class="w-full" />
      </div>
      <div
        class="mb-8 border border-black/[.15] sm:col-span-8 md:col-span-10 lg:col-span-12 xl:col-start-5">
        <nuxt-img
          loading="lazy"
          src="/img/company-page/position.jpg"
          srcset="/img/company-page/position@2x.jpg 2x, /img/company-page/position@3x.jpg 3x"
          class="w-full" />
      </div>
      <div
        class="border border-black/[.15] sm:col-span-8 md:col-span-10 lg:col-span-12 xl:col-start-5">
        <nuxt-img
          loading="lazy"
          src="/img/company-page/team.jpg"
          srcset="/img/company-page/team@2x.jpg 2x, /img/company-page/team@3x.jpg 3x"
          class="w-full" />
      </div>
    </section>
    <section
      class="mb-40 items-start sm:col-span-8 sm:grid sm:grid-cols-8 sm:gap-x-8 lg:col-span-12 lg:grid-cols-12 xl:col-span-16 xl:grid-cols-16">
      <div
        class="mb-10 grid gap-3 sm:col-span-8 lg:col-start-3 xl:sticky xl:top-20 xl:col-span-4 xl:col-start-1 xl:mb-0">
        <h2>Dashboard</h2>
        <small class="text-xs uppercase text-slate-400">The Org, 2023</small>
        <p>Blablabla</p>
        <p>
          We agreed on the keywords Cute, Friendly, Colourful, and Handmade. Seven years later I
          still think the design does a good job of capturing that.
        </p>
      </div>
      <div
        class="mb-8 border border-black/[.15] sm:col-span-8 md:col-span-10 lg:col-span-12 xl:col-start-5">
        <nuxt-img
          loading="lazy"
          src="/img/dashboard/overview.jpg"
          srcset="/img/dashboard/overview@2x.jpg 2x, /img/dashboard/overview@3x.jpg 3x"
          class="w-full" />
      </div>
      <div
        class="mb-8 border border-black/[.15] sm:col-span-8 md:col-span-10 lg:col-span-12 xl:col-start-5">
        <nuxt-img
          loading="lazy"
          src="/img/dashboard/org-chart.jpg"
          srcset="/img/dashboard/org-chart@2x.jpg 2x, /img/dashboard/org-chart@3x.jpg 3x"
          class="w-full" />
      </div>
      <div
        class="mb-8 border border-black/[.15] sm:col-span-8 md:col-span-10 lg:col-span-12 xl:col-start-5">
        <nuxt-img
          loading="lazy"
          src="/img/dashboard/jobs-integrations.jpg"
          srcset="
            /img/dashboard/jobs-integrations@2x.jpg 2x,
            /img/dashboard/jobs-integrations@3x.jpg 3x
          "
          class="w-full" />
      </div>
      <div
        class="mb-8 border border-black/[.15] sm:col-span-8 md:col-span-10 lg:col-span-12 xl:col-start-5">
        <nuxt-img
          loading="lazy"
          src="/img/dashboard/jobs-edit.jpg"
          srcset="/img/dashboard/jobs-edit@2x.jpg 2x, /img/dashboard/jobs-edit@3x.jpg 3x"
          class="w-full" />
      </div>
      <div
        class="border border-black/[.15] sm:col-span-8 md:col-span-10 lg:col-span-12 xl:col-start-5">
        <nuxt-img
          loading="lazy"
          src="/img/dashboard/members.jpg"
          srcset="/img/dashboard/members@2x.jpg 2x, /img/dashboard/members@3x.jpg 3x"
          class="w-full" />
      </div>
    </section>
    <section
      class="mb-40 items-start sm:col-span-8 sm:grid sm:grid-cols-8 sm:gap-x-8 lg:col-span-12 lg:grid-cols-12 xl:col-span-16 xl:grid-cols-16">
      <div
        class="mb-10 grid gap-3 sm:col-span-8 lg:col-start-3 xl:sticky xl:top-20 xl:col-span-4 xl:col-start-1 xl:mb-0">
        <h2>Keyless car rental</h2>
        <small class="text-xs uppercase text-slate-400">GoMore, 2019</small>
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
        class="mb-8 border border-black/[.15] sm:col-span-8 md:col-span-10 lg:col-span-12 xl:col-start-5">
        <nuxt-img
          loading="lazy"
          src="/img/keyless/landing-page.jpg"
          srcset="/img/keyless/landing-page@2x.jpg 2x, /img/keyless/landing-page@3x.jpg 3x"
          class="w-full" />
      </div>
      <div
        class="mb-8 border border-black/[.15] sm:col-span-4 lg:col-span-4 lg:col-start-1 xl:col-span-4 xl:col-start-5 xl:mb-0">
        <nuxt-img
          loading="lazy"
          src="/img/keyless/overview.jpg"
          srcset="/img/keyless/overview@2x.jpg 2x, /img/keyless/overview@3x.jpg 3x"
          class="w-full" />
      </div>
      <div class="mb-8 border border-black/[.15] sm:col-span-4 lg:col-span-4 xl:col-span-4 xl:mb-0">
        <nuxt-img
          loading="lazy"
          src="/img/keyless/photos.jpg"
          srcset="/img/keyless/photos@2x.jpg 2x, /img/keyless/photos@3x.jpg 3x"
          class="w-full" />
      </div>
      <div class="mb-8 border border-black/[.15] sm:col-span-4 lg:col-span-4 xl:col-span-4 xl:mb-0">
        <nuxt-img
          loading="lazy"
          src="/img/keyless/guide.jpg"
          srcset="/img/keyless/guide@2x.jpg 2x, /img/keyless/guide@3x.jpg 3x"
          class="w-full" />
      </div>
    </section>
    <section
      class="mb-40 items-start sm:col-span-8 sm:grid sm:grid-cols-8 sm:gap-x-8 lg:col-span-12 lg:grid-cols-12 xl:col-span-16 xl:grid-cols-16">
      <div
        class="mb-10 grid gap-3 sm:col-span-8 lg:col-start-3 xl:sticky xl:top-20 xl:col-span-4 xl:col-start-1 xl:mb-0">
        <h2>Location sharing</h2>
        <small class="text-xs uppercase text-slate-400">GoMore, 2018</small>
        <p>
          We agreed on the keywords Cute, Friendly, Colourful, and Handmade. Seven years later I
          still think the design does a good job of capturing that.
        </p>
      </div>
      <div
        class="mb-8 border border-black/[.15] sm:col-span-4 lg:col-span-4 lg:col-start-1 xl:col-span-4 xl:mb-0">
        <nuxt-img
          loading="lazy"
          src="/img/location/setting.jpg"
          srcset="/img/location/setting@2x.jpg 2x, /img/location/setting@3x.jpg 3x"
          class="w-full" />
      </div>
      <div class="mb-8 border border-black/[.15] sm:col-span-4 lg:col-span-4 xl:col-span-4 xl:mb-0">
        <nuxt-img
          loading="lazy"
          src="/img/location/details.jpg"
          srcset="/img/location/details@2x.jpg 2x, /img/location/details@3x.jpg 3x"
          class="w-full" />
      </div>
      <div class="mb-8 border border-black/[.15] sm:col-span-4 lg:col-span-4 xl:col-span-4 xl:mb-0">
        <nuxt-img
          loading="lazy"
          src="/img/location/map.jpg"
          srcset="/img/location/map@2x.jpg 2x, /img/location/map@3x.jpg 3x"
          class="w-full" />
      </div>
    </section>

    <section
      class="mb-40 items-start sm:col-span-8 sm:grid sm:grid-cols-8 sm:gap-x-8 lg:col-span-12 lg:grid-cols-12 xl:col-span-16 xl:grid-cols-16">
      <div
        class="mb-10 grid gap-3 sm:col-span-8 lg:col-start-3 xl:sticky xl:top-20 xl:col-span-4 xl:col-start-1 xl:mb-0">
        <h2>Car leasing</h2>
        <small class="text-xs uppercase text-slate-400">GoMore, 2018</small>
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
        class="mb-8 border border-black/[.15] sm:col-span-8 md:col-span-10 lg:col-span-12 xl:col-start-5">
        <nuxt-img
          loading="lazy"
          src="/img/leasing/business.jpg"
          srcset="/img/leasing/business@2x.jpg 2x, /img/leasing/business@3x.jpg 3x"
          class="w-full" />
      </div>
      <div
        class="border border-black/[.15] sm:col-span-8 md:col-span-10 lg:col-span-12 xl:col-start-5">
        <nuxt-img
          loading="lazy"
          src="/img/leasing/car.jpg"
          srcset="/img/leasing/car@2x.jpg 2x, /img/leasing/car@3x.jpg 3x"
          class="w-full" />
      </div>
    </section>
    <section
      class="mb-40 items-start sm:col-span-8 sm:grid sm:grid-cols-8 sm:gap-x-8 lg:col-span-12 lg:grid-cols-12 xl:col-span-16 xl:grid-cols-16">
      <div
        class="mb-10 grid gap-3 sm:col-span-8 lg:col-start-3 xl:sticky xl:top-20 xl:col-span-4 xl:col-start-1 xl:mb-0">
        <h2>Blog redesign</h2>
        <small class="text-xs uppercase text-slate-400">Regnsky, 2016</small>
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
        class="mb-8 border border-black/[.15] sm:col-span-4 lg:col-span-4 lg:col-start-1 xl:col-span-4">
        <nuxt-img
          loading="lazy"
          src="/img/regnsky/1.jpg"
          srcset="/img/regnsky/1@2x.jpg 2x, /img/regnsky/1@3x.jpg 3x"
          class="w-full" />
      </div>
      <div class="mb-8 border border-black/[.15] sm:col-span-4 lg:col-span-4 xl:col-span-4">
        <nuxt-img
          loading="lazy"
          src="/img/regnsky/2.jpg"
          srcset="/img/regnsky/2@2x.jpg 2x, /img/regnsky/2@3x.jpg 3x"
          class="w-full" />
      </div>
      <div class="mb-8 border border-black/[.15] sm:col-span-4 lg:col-span-4 xl:col-span-4">
        <nuxt-img
          loading="lazy"
          src="/img/regnsky/3.jpg"
          srcset="/img/regnsky/3@2x.jpg 2x, /img/regnsky/3@3x.jpg 3x"
          class="w-full" />
      </div>
      <div
        class="border border-black/[.15] sm:col-span-8 md:col-span-10 lg:col-span-12 xl:col-start-5">
        <nuxt-img
          loading="lazy"
          src="/img/regnsky/4.jpg"
          srcset="/img/regnsky/4@2x.jpg 2x, /img/regnsky/4@3x.jpg 3x"
          class="w-full" />
      </div>
    </section>
    <section
      class="mb-40 items-start sm:col-span-8 sm:grid sm:grid-cols-8 sm:gap-x-8 lg:col-span-12 lg:grid-cols-12 xl:col-span-16 xl:grid-cols-16">
      <div
        class="mb-10 grid gap-3 sm:col-span-8 lg:col-start-3 xl:sticky xl:top-20 xl:col-span-4 xl:col-start-1 xl:mb-0">
        <h2>Quasi – A study tool</h2>
        <small class="text-xs uppercase text-slate-400">Concept, 2016</small>
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
        class="mb-8 border border-black/[.15] sm:col-span-8 md:col-span-10 lg:col-span-12 xl:col-start-5">
        <nuxt-img
          loading="lazy"
          src="/img/quasi/article.jpg"
          srcset="/img/quasi/article@2x.jpg 2x, /img/quasi/article@3x.jpg 3x"
          class="w-full" />
      </div>
      <div
        class="border border-black/[.15] sm:col-span-8 md:col-span-10 lg:col-span-12 xl:col-start-5">
        <nuxt-img
          loading="lazy"
          src="/img/quasi/search.jpg"
          srcset="/img/quasi/search@2x.jpg 2x, /img/quasi/search@3x.jpg 3x"
          class="w-full" />
      </div>
    </section>
    <section
      class="mb-40 items-start sm:col-span-8 sm:grid sm:grid-cols-8 sm:gap-x-8 lg:col-span-12 lg:grid-cols-12 xl:col-span-16 xl:grid-cols-16">
      <div
        class="mb-10 grid gap-3 sm:col-span-8 lg:col-start-3 xl:sticky xl:top-20 xl:col-span-4 xl:col-start-1 xl:mb-0">
        <h2>Old News – News archives</h2>
        <small class="text-xs uppercase text-slate-400">Concept, 2016</small>
        <p>
          We agreed on the keywords Cute, Friendly, Colourful, and Handmade. Seven years later I
          still think the design does a good job of capturing that.
        </p>
      </div>
      <div class="sm:col-span-8 md:col-span-10 lg:col-span-12 xl:col-start-5">
        <nuxt-img
          loading="lazy"
          src="/img/old-news/concept.jpg"
          srcset="/img/old-news/concept@2x.jpg 2x, /img/old-news/concept@3x.jpg 3x"
          class="w-full" />
      </div>
    </section>
  </main>
</template>
<script setup>
useSeoMeta({
  title: "Work | Benjamin Ottensten, Product & Design lead",
  ogTitle: "Work | Benjamin Ottensten, Product & Design lead",
});
</script>
