<template>
  <main class="grid gap-14 md:col-start-3 md:col-span-12 lg:col-start-4 lg:col-span-10 xl:col-start-5 xl:col-span-8">
    <Title>Benjamin Ottensten</Title>
    <Meta name="Product lead & designer based in Copenhagen, Denmark" />
    <section class="grid grid-cols-8 gap-8">
      <p class="col-span-5">Most recently Head of Product at The Org for 3 years. Did product design and frontend
        development at GoMore
        before that. I enjoy designing and developing high-quality user experiences that create real value. And
        potentially some more text here.</p>
      <div class="w-60 -mt-5 ml-2">
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