<script setup lang="ts">
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Game, useGamesStore } from "../stores/Games";
import { useGamepadStore } from "../stores/Gamepad";
import { onMounted, ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import GameImage from "./GameImage.vue";

dayjs.extend(relativeTime);

const { game, index } = defineProps<{ game: Game; index: number }>();

const gamesStore = useGamesStore();
const gamepadStore = useGamepadStore();
const { selectedGameIndex } = storeToRefs(gamepadStore);

const buttonRef = ref<HTMLButtonElement>();

const router = useRouter();

onMounted(() => {
   buttonRef.value?.addEventListener("focus", () => {
      gamepadStore.selectedGameIndex = index;
   });

   buttonRef.value?.addEventListener("keypress", (e) => {
      if (e.code === "Enter") {
         gamesStore.play(game);
      }
   });

   buttonRef.value?.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      router.push({ name: "GameSettings", params: { serial: game.serial } });
   });
});

watchEffect(() => {
   if (index === selectedGameIndex.value) {
      buttonRef.value?.focus();
   }
});
</script>

<template>
   <button
      @dblclick="() => gamesStore.play(game)"
      class="rounded-md transition-all outline-none duration-300 bg-zinc-900 focus:bg-zinc-700 focus:scale-110"
      ref="buttonRef"
   >
      <div class="overflow-hidden p-2 pb-3">
         <GameImage :game="game" />

         <h2 class="my-2 truncate">{{ game.extra.name ?? game.serial }}</h2>
         <h3 class="text-xs text-gray-400">
            Last played:
            <template v-if="game.extra.lastPlayed">
               {{ dayjs(game.extra.lastPlayed).fromNow() }}
            </template>
            <template v-else>-</template>
         </h3>
      </div>
   </button>
</template>

<style lang="scss" scoped></style>
