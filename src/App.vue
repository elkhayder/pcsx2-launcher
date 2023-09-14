<script setup lang="ts">
import Header from "./components/Header.vue";
// import GameCard from "./components/GameCard.vue";
// import ReadDirectory from "./components/ReadDirectory.vue";
</script>

<template>
   <Header />
   <div class="container mt-8">
      <router-view></router-view>
   </div>
   <!-- <ReadDirectory />-->
</template>

<style scoped></style>
