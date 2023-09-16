<script setup lang="ts">
import { onMounted } from "vue";
import Header from "./components/Header.vue";
// import GameCard from "./components/GameCard.vue";
// import ReadDirectory from "./components/ReadDirectory.vue";

onMounted(() => {
   document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
   });
});
</script>

<template>
   <Header />
   <div class="container mt-8">
      <router-view></router-view>
   </div>

   <!-- <ReadDirectory />-->
</template>

<style scoped></style>
