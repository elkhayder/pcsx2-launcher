<script setup lang="ts">
import { onMounted } from "vue";
import Header from "./components/Header.vue";
import { useGamesStore } from "./stores/Games";
import { useConfigStore } from "./stores/Config";
import { useGamepadStore } from "./stores/Gamepad";
import { createDir, exists } from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
// import GameCard from "./components/GameCard.vue";
// import ReadDirectory from "./components/ReadDirectory.vue";

onMounted(async () => {
   document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
   });

   const dir = await appDataDir();

   if (await exists(dir)) {
      console.log("AppData exists");
   } else {
      console.log("AppData does not exist");
      await createDir(dir);
   }
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
</template>

<style scoped></style>
