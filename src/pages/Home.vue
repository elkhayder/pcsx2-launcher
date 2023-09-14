<script setup lang="ts">
import GameCard from "../components/GameCard.vue";
import { useGamesStore } from "../stores/Games";

const gamesStore = useGamesStore();
</script>

<template>
   <div class="flex justify-between items-center my-6">
      <h1 class="text-4xl font-bold">Games</h1>
      <button title="Refresh" @click="gamesStore.scan">
         <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
            fill="white"
            class="w-6 h-6"
         >
            <path
               d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z"
            />
         </svg>
      </button>
   </div>

   <div
      class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 items-start gap-4 -mx-2"
   >
      <GameCard
         v-for="(game, index) of gamesStore.games"
         :key="game.serial"
         :game="game"
         :index="index"
      />
   </div>
</template>

<style lang="scss" scoped></style>
