<template>
  <main
    class="grid gap-12 sm:col-span-8 sm:gap-14 md:col-start-2 lg:col-start-3 xl:col-span-8 xl:col-start-5">
    <section
      class="w-[calc(100vw-48px)] xs:w-[calc(100vw-80px)] sm:grid sm:w-auto sm:grid-cols-8 sm:items-center sm:gap-8">
      <div class="mb-9 sm:col-span-5 sm:mb-0">
        <p class="mb-3">
          I'm an experienced product builder with a background in product, design and frontend.
        </p>
        <p>
          I enjoy building high-quality user experiences that spark joy and drive growth. I have the
          best experience doing that when the team is small and made up of talented, empathetic and
          kind people that care about the details.
        </p>
      </div>
      <div class="-ml-6 w-[100vw] overflow-hidden xs:-ml-10 sm:hidden">
        <div class="relative left-3 mx-auto h-[300px] w-[380px] pt-2">
          <Transition name="fade">
            <div v-if="loadPhotos">
              <img
                class="absolute z-20 rotate-3 border-4 border-white shadow"
                src="/img/me.jpg"
                srcset="/img/me@2x.jpg 2x, /img/me@3x.jpg 3x" />
              <img
                class="absolute left-[155px] top-[80px] z-10 -rotate-6 border-4 border-white shadow"
                src="/img/eik.jpg"
                srcset="/img/eik@2x.jpg 2x, /img/eik@3x.jpg 3x" />
              <img
                class="absolute left-[30px] top-[120px] z-0 -rotate-1 border-4 border-white shadow"
                src="/img/lemons.jpg"
                srcset="/img/lemons@2x.jpg 2x, /img/lemons@3x.jpg 3x" />
            </div>
          </Transition>
        </div>
      </div>
      <div class="m-auto hidden h-44 w-60 sm:col-span-3 sm:mt-5 sm:block sm:h-auto">
        <PhotoStackComposition />
      </div>
    </section>
    <section>
      <h2 class="mb-8">Work experience</h2>
      <div class="grid gap-8">
        <Block
          label="Now"
          title="Open to work"
          subTitle="Copenhagen or Remote"
          description="I'm currently figuring out what to do next. Freelance, join a startup, start my own company — I'm in exploration mode. Reach out if you want to collaborate." />
        <Block
          label="2023–2026"
          title="Product Lead at Speckle"
          subTitle="Copenhagen (Remote)"
          description="Speckle is an open source platform for working with 3D data. It's used by thousands of architects and other professionals within the architecture, engineering and construction industry."
          description2="I led the development of the web platform and managed the design and frontend teams." />
        <Block
          label="2020–2023"
          title="Head of Product at The Org"
          subTitle="Copenhagen & New York"
          description="The Org — backed by Sequoia, Founders Fund and more — is a professional network for companies. I led the product development across multiple teams and managed the PMs."
          description2="While I was there we grew the traffic to 1 million organic visitors/month from 80k, grew contributions from companies to 35k/month from 1k, went from 6 to 75 team members, rebranded, and raised a series B funding round." />
        <Block
          label="2016–2020"
          title="Product Designer at GoMore"
          subTitle="Copenhagen"
          description="GoMore is a Danish peer-to-peer car sharing platform operating in multiple European markets. I did product design for web and apps, frontend development and various PM work."
          description2="I'm most proud of leading the launch of the now very popular, and also complex, GoMore Keyless product, which allows car owners to rent out their car to strangers without ever meeting." />
        <Block
          label="2014–2015"
          title="Teaching Assistant at the IT University of Copenhagen"
          subTitle="Copenhagen · Part-time"
          description="I planned and conducted weekly exercises for 2nd year bachelor students on the two courses Context-Based App Design and Co-Design (twice). I also supervised their design projects." />
        <Block
          label="2012–2013"
          title="Web Designer at Starfly Media"
          subTitle="Copenhagen · Part-time"
          description="Starfly Media is an online marketing agency. I designed and built landing pages and other sites for various campaigns." />
      </div>
    </section>
    <section>
      <h2 class="mb-8">Education</h2>
      <Block label="2011–2016" title="MSc in Digital Design from the IT University of Copenhagen" />
    </section>
    <section>
      <h2 class="mb-8">Contact</h2>
      <div class="grid gap-3">
        <Block
          label="Email"
          title="benjamin.ottensten@gmail.com"
          link="mailto:benjamin.ottensten@gmail.com" />
        <Block label="Phone" title="+45 21952390" link="tel:+4521952390" />
        <Block label="Twitter" title="@benjavo ↗" link="https://www.twitter.com/benjavo" />
        <Block
          label="LinkedIn"
          title="@benjaminvo ↗"
          link="https://www.linkedin.com/in/benjaminvo" />
      </div>
    </section>
  </main>
</template>

<script setup>
useSeoMeta({
  title: "Benjamin Ottensten, Product & Design lead",
  ogTitle: "Benjamin Ottensten, Product & Design lead",
});

import { ref, onMounted } from "vue";
let loadPhotos = ref(false);

onMounted(() => {
  loadPhotos.value = true;
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
