<template>
  <main
    class="grid gap-12 sm:gap-14 sm:col-start-2 sm:col-span-14 md:col-start-3 md:col-span-12 lg:col-start-4 lg:col-span-10 xl:col-start-5 xl:col-span-8">
    <Title>Benjamin Ottensten</Title>
    <Meta name="Product & Design lead based in Copenhagen, Denmark" />
    <section
      class="w-[calc(100vw-48px)] xs:w-[calc(100vw-80px)] sm:w-auto sm:grid sm:grid-cols-8 sm:gap-8 sm:items-center">
      <div class="mb-10 sm:mb-0 sm:col-span-5">
        <p class="mb-3">I’m an experienced product builder (open to work!) with a background in both product, design and
          frontend roles. Most recently I was Head of Product at The Org leading multiple product teams.
        </p>
        <p>I enjoy building high-quality user experiences that spark joy and drive growth. I have the best experience
          doing that when the team is small and made up of talented, empathetic and kind people that care about the
          details.
        </p>
      </div>
      <div class="sm:hidden w-[100vw] -ml-6 xs:-ml-10 overflow-hidden">
        <div class="relative h-[300px] w-[380px] left-3 mx-auto">
          <Transition name="fade">
            <div v-if="loadPhotos">
              <img class="border-4 border-white shadow absolute z-20 rotate-3" src="/img/me.png"
                srcset="/img/me@2x.png 2x, /img/me@3x.png 3x">
              <img class="border-4 border-white shadow absolute z-10 -rotate-6 left-[155px] top-[80px]" src="/img/eik.png"
                srcset="/img/eik@2x.png 2x, /img/eik@3x.png 3x">
              <img class="border-4 border-white shadow absolute z-0 -rotate-1 left-[30px] top-[120px]"
                src="/img/lemons.png" srcset="/img/lemons@2x.png 2x, /img/lemons@3x.png 3x">
            </div>
          </Transition>
        </div>
      </div>
      <div class="hidden sm:block m-auto sm:col-span-3 w-60 h-44 sm:h-auto sm:mt-[20px] sm:ml-[32px] test">
        <PhotoStackComposition />
      </div>
    </section>
    <section>
      <h2 class="mb-8">Work experience</h2>
      <div class="grid gap-8">
        <Block label="Now" title="Open to work"
          description="Currently figuring out what to do next. Feel free to reach out." />
        <Block label="2020–2023" title="Head of Product at The Org" subTitle="Copenhagen & New York"
          description="The Org is a professional network for companies backed by Sequoia, Founders Fund and more. I led the product development across multiple teams and managed the PMs."
          description2="While I was there we grew the traffic to 1 million organic visitors/month from 80k, grew contributions from companies to 35k/month from 1k, went from 6-75 team members, rebranded, and raised a series B funding round."
          description3="It ended in April 2023 when most of the team was laid off. Apparently it's important to find a recurring revenue stream." />
        <Block label="2016–2020" title="Product Designer at GoMore" subTitle="Copenhagen"
          description="GoMore is a Danish peer-to-peer car sharing platform live in multiple markets across Europe. I did product design for web and apps, frontend development and various PM work."
          description2="I'm most proud of leading the launch of the very popular and also complex GoMore Keyless product, which allowed car owners to rent out the car without meeting the renter." />
        <Block label="2012–2013" title="Web Designer at Starfly Media" subTitle="Copenhagen · Part-time"
          description="A text here" />
      </div>
    </section>
    <section>
      <h2 class="mb-8">Education</h2>
      <Block label="2011–2016" title="Digital Design at the IT University of Copenhagen" subTitle="Bachelor & Master"
        description="I met a lot of wonderful people. The most important thing I learned was to buy rye bread at the local super market instead of in the school canteen. Way too expensive." />
    </section>
    <section>
      <h2 class="mb-8">Contact</h2>
      <div class="grid gap-3">
        <Block label="Email" title="benjamin.ottensten@gmail.com" link="mailto:benjamin.ottensten@gmail.com" />
        <Block label="Phone" title="+45 21952390" link="tel:+4521952390" />
        <Block label="Twitter" title="@benjavo ↗" link="https://www.twitter.com/benjavo" />
        <Block label="LinkedIn" title="@benjaminvo ↗" link="https://www.linkedin.com/in/benjaminvo" />
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
let loadPhotos = ref(false);

onMounted(() => {
  loadPhotos.value = true;
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.150s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>