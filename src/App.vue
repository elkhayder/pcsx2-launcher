<script setup lang="ts">
import { onMounted } from "vue";
import Header from "./components/Header.vue";
import { useGamesStore } from "./stores/Games";
import { useConfigStore } from "./stores/Config";
import { useGamepadStore } from "./stores/Gamepad";
// import GameCard from "./components/GameCard.vue";
// import ReadDirectory from "./components/ReadDirectory.vue";

onMounted(() => {
   document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
   });
});

// Load all stores
useGamesStore();
useConfigStore();
useGamepadStore();
</script>

<template>
   <Header />
   <div class="container mt-8">
      <router-view></router-view>
   </div>

   <!-- <ReadDirectory />-->
</template>

<style scoped></style>
