<template>
  <main class="sm:col-span-8 md:col-start-2 lg:col-start-3 xl:col-start-5">
    <Title>Thoughts | Benjamin Ottensten</Title>
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
<script setup>
useSeoMeta({
  title: "Thoughts | Benjamin Ottensten, Product & Design lead",
  ogTitle: "Thoughts | Benjamin Ottensten, Product & Design lead",
});
</script>
<style scoped>
p {
  font-size: 18px;
  margin-bottom: 16px;
}
</style>
