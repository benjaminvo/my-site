<template>
  <section>
    <Title>Thoughts</Title>
    <h1 class="mb-10">My thoughts</h1>

    <ContentList path="/thoughts" v-slot="{ list }">
      <div class="mb-10" v-for="thought in list" :key="thought._path">
        <h2 class="font-semibold">
          <NuxtLink :to="thought._path">{{ thought.title }}</NuxtLink>
        </h2>
        <!-- <ContentRenderer :value="thought" /> -->
        <ContentDoc :path="thought._path" />
      </div>
    </ContentList>

  </section>
</template>
