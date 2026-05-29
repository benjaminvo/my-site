<template>
  <main class="grid gap-12 sm:col-span-8 sm:gap-14 md:col-start-2 lg:col-start-3 xl:col-span-8 xl:col-start-5">
    <section
      class="xs:w-[calc(100vw-80px)] w-[calc(100vw-48px)] sm:grid sm:w-auto sm:grid-cols-8 sm:items-center sm:gap-8">
      <div class="mb-9 sm:col-span-5 sm:mb-0">
        <p class="mb-3">
          I'm a product builder with 10+ years of experience in product leadership, design and frontend at startups.
        </p>
        <p class="mb-10">
          I care about good strategy and high-quality user experiences. I like when the team is small and made up of
          technical and kind people who care about the details. And I enjoy leading those teams while staying hands-on
          myself too.
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
          title="Freelance"
          description="I help startups with product strategy, design, and frontend, whether that’s shaping something new or improving what exists. Reach out if you want to collaborate!" />
        <Block
          label="2023–2026"
          title="Product Lead at Speckle"
          subTitle="Remote · Series A · 30 employees"
          description="Speckle is a popular 3D data platform for the AEC industry. I led the web product, managed the design and frontend teams, and played a key role in transitioning Speckle from a free open-source project to a paid enterprise product." />
        <Block
          label="2020–2023"
          title="Head of Product at The Org"
          subTitle="Copenhagen & New York · Series B · 75 employees"
          description="Backed by Sequoia and Founders Fund, The Org helps companies showcase their team and culture. I led product development and managed the PM team during a rapid expansion phase, where we raised a Series B and grew organic traffic to 1 million monthly visitors." />
        <Block
          label="2016–2020"
          title="Product Designer at GoMore"
          subTitle="Copenhagen"
          description="GoMore is Europe’s leading car-sharing platform. I worked across design, frontend, and product management, and my main project was leading the end-to-end development of GoMore Keyless – a product that lets car owners rent out their vehicles without meeting face-to-face." />
        <!--
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
          -->
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
          link="mailto:benjamin.ottensten@gmail.com"
          @click="trackContact('email')" />
        <Block label="Phone" title="+45 21952390" link="tel:+4521952390" @click="trackContact('phone')" />
        <Block
          label="Twitter"
          title="@benjavo ↗"
          link="https://www.twitter.com/benjavo"
          @click="trackContact('twitter')" />
        <Block
          label="LinkedIn"
          title="@benjaminvo ↗"
          link="https://www.linkedin.com/in/benjaminvo"
          @click="trackContact('linkedin')" />
      </div>
    </section>
  </main>
</template>

<script setup>
useSeoMeta({
  title: "Benjamin Ottensten, Product & Design Lead",
  ogTitle: "Benjamin Ottensten, Product & Design Lead",
});

import { ref, onMounted } from "vue";
let loadPhotos = ref(false);

onMounted(() => {
  loadPhotos.value = true;
});

const posthog = usePostHog();

function trackContact(linkType) {
  posthog?.capture("contact_link_clicked", { link_type: linkType });
}
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
