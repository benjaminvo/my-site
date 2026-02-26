<template>
  <main class="grid gap-12 sm:col-span-8 sm:gap-14 md:col-start-2 lg:col-start-3 xl:col-span-8 xl:col-start-5">
    <section
      class="xs:w-[calc(100vw-80px)] w-[calc(100vw-48px)] sm:grid sm:w-auto sm:grid-cols-8 sm:items-center sm:gap-8">
      <div class="mb-9 sm:col-span-5 sm:mb-0">
        <p class="mb-3">I'm an experienced product builder with a background in product, design and code.</p>
        <p class="mb-10">
          I like to lead teams and build high-quality user experiences that bring joy. For the user and for the
          business. I have the best experience doing that when the team is small and made up of talented people who care
          about the details.
        </p>
      </div>
      <div class="xs:-ml-10 -ml-6 w-[100vw] overflow-hidden sm:hidden">
        <div class="relative left-3 mx-auto h-[300px] w-[380px] pt-2">
          <Transition name="fade">
            <div v-if="loadPhotos">
              <img
                class="absolute z-20 rotate-3 border-4 border-white shadow-sm"
                src="/img/me.jpg"
                srcset="/img/me@2x.jpg 2x, /img/me@3x.jpg 3x" />
              <img
                class="absolute top-[80px] left-[155px] z-10 -rotate-6 border-4 border-white shadow-sm"
                src="/img/eik.jpg"
                srcset="/img/eik@2x.jpg 2x, /img/eik@3x.jpg 3x" />
              <img
                class="absolute top-[120px] left-[30px] z-0 -rotate-1 border-4 border-white shadow-sm"
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
      <h2 class="mb-8">Experience</h2>
      <div class="grid gap-8">
        <Block
          label="Now"
          title="Independent practice"
          description="I'm currently freelancing in product design, frontend development, and product strategy. I like coming in early to shape something new, or stepping in to elevate what exists. Reach out if you want to collaborate."" />
        <Block
          label="2023–2026"
          title="Product Lead at Speckle"
          subTitle="Copenhagen (Remote) · Series A · 30 employees"
          description="Speckle is an open source platform for working with 3D data. It's used by thousands of professionals within the architecture, engineering and construction industry."
          description2="While I was there I led the development of the web platform, managed the design and frontend teams, and was deeply involved in the successful monetization efforts." />
        <Block
          label="2020–2023"
          title="Head of Product at The Org"
          subTitle="Copenhagen & New York · Series B · 75 employees"
          description="The Org — backed by Sequoia, Founders Fund and more — is a professional network for companies. I led the product development across multiple teams and managed the PMs."
          description2="While I was there we grew the traffic to 1 million organic visitors/month from 80k, grew contributions from companies to 35k/month from 1k, went from 6 to 75 team members, rebranded, and raised a series B funding round." />
        <Block
          label="2016–2020"
          title="Product Designer at GoMore"
          subTitle="Copenhagen"
          description="GoMore is a Danish peer-to-peer car sharing platform operating across Europe. I did product design for web and apps, frontend development and various PM work."
          description2="I'm most proud of having led the development of the now very popular GoMore Keyless product from start to finish. GoMore Keyless allows car owners to rent out their car to strangers without ever meeting." />
        <Block
          label="2014–2015"
          title="Teaching Assistant at the IT University of Copenhagen"
          subTitle="Copenhagen"
          description="I supervised projects and conducted weekly exercises on the two courses Context-Based App Design and Co-Design." />
        <Block
          label="2012–2013"
          title="Web Designer at Starfly Media"
          subTitle="Copenhagen"
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
        <Block label="Email" title="benjamin.ottensten@gmail.com" link="mailto:benjamin.ottensten@gmail.com" />
        <Block label="Phone" title="+45 21952390" link="tel:+4521952390" />
        <Block label="Twitter" title="@benjavo ↗" link="https://www.twitter.com/benjavo" />
        <Block label="LinkedIn" title="@benjaminvo ↗" link="https://www.linkedin.com/in/benjaminvo" />
        <Block label="Github" title="@benjaminvo ↗" link="https://www.github.com/benjaminvo" />
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
