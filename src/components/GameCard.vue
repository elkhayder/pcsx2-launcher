<script setup lang="ts">
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useGamesStore } from "../stores/Games";
import { Game } from "../types";
import { useGamepadStore } from "../stores/Gamepad";
import { onMounted, ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";

dayjs.extend(relativeTime);

const { game, index } = defineProps<{ game: Game; index: number }>();

const gamesStore = useGamesStore();
const gamepadStore = useGamepadStore();
const { selectedGameIndex } = storeToRefs(gamepadStore);

const buttonRef = ref<HTMLButtonElement>();

onMounted(() => {
   buttonRef.value?.addEventListener("focus", () => {
      gamepadStore.selectedGameIndex = index;
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
      class="focus:scale-110 transition-all duration-300"
      ref="buttonRef"
   >
      <div class="overflow-hidden bg-zinc-900 p-2">
         <div class="relative aspect-[16/23]">
            <img
               :src="`https://raw.githubusercontent.com/xlenore/ps2-covers/main/covers/${game.serial}.jpg`"
               alt="Game Cover"
               class="w-full"
            />
         </div>

         <h2 class="my-2 truncate">{{ game.name ?? "Unnamed" }}</h2>
         <h3 class="text-sm text-gray-400">
            Last played:
            <template v-if="game.lastPlayed">
               {{ dayjs(game.lastPlayed).fromNow() }}
            </template>
            <template v-else>-</template>
         </h3>
      </div>
   </button>
</template>

<style lang="scss" scoped></style>
