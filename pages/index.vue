<template>
  <main
    class="grid gap-12 sm:gap-14 sm:col-start-2 sm:col-span-14 md:col-start-3 md:col-span-12 lg:col-start-4 lg:col-span-10 xl:col-start-5 xl:col-span-8">
    <Title>Benjamin Ottensten</Title>
    <Meta name="Design & Product lead based in Copenhagen, Denmark" />
    <section
      class="w-[calc(100vw-48px)] xs:w-[calc(100vw-80px)] sm:w-auto sm:grid sm:grid-cols-8 sm:gap-8 sm:h-[144px] lg:h-[120px] xl:h-[144px]">
      <p class="mb-10 sm:mb-0 sm:col-span-5">Most recently Head of Product at The Org for 3 years. Did product design and
        frontend development at GoMore before that. I enjoy designing and developing high-quality user experiences that
        create real value. And potentially some more text here.</p>
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
      <div class="hidden sm:block m-auto sm:col-span-3 w-60 h-44 sm:h-auto sm:-mt-5 sm:ml-2">
        <PhotoStackComposition />
      </div>
    </section>
    <section>
      <h2 class="mb-8">Work experience</h2>
      <div class="grid gap-8">
        <Block label="Now" title="Open to work" description="Currently figuring out what to do next." />
        <Block label="2020–2023" title="Head of Product at The Org" subTitle="Copenhagen & New York"
          description="Led the product development incl. product strategy, roadmapping,
                    hiring, managing other PMs, coordinating feature work from start to finish across multiple teams." />
        <Block label="2016–2020" title="Product Designer at GoMore" subTitle="Copenhagen" description="A text here" />
        <Block label="2012–2013" title="Web Designer at Starfly Media" subTitle="Copenhagen" description="A text here" />
      </div>
    </section>
    <section>
      <h2 class="mb-8">Education</h2>
      <Block label="2011–2016" title="Digital Design at the IT University of Copenhagen" description="A text here" />
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