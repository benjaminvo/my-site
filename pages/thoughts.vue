<template>
  <main
    class="sm:col-start-2 sm:col-span-14 md:col-start-3 md:col-span-12 lg:col-start-4 lg:col-span-10 xl:col-start-5 xl:col-span-8">
    <Title>Thoughts</Title>
    <ContentList path="/thoughts" v-slot="{ list }">
      <div class="mb-10" v-for="thought in list" :key="thought._path">
        <h2 class="font-semibold">
          <NuxtLink :to="thought._path">{{ thought.title }}</NuxtLink>
        </h2>
        <!-- <ContentRenderer :value="thought" /> -->
        <ContentDoc :path="thought._path" />
      </div>
    </ContentList>
  </main>
</template>
