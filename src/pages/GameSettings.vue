<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed } from "vue";
import { open } from "@tauri-apps/api/dialog";

import { useGamesStore } from "../stores/Games";
import GameImage from "../components/GameImage.vue";
import {
   BaseDirectory,
   readBinaryFile,
   writeBinaryFile,
} from "@tauri-apps/api/fs";

const router = useRouter();
const gamesStore = useGamesStore();

const game = computed(
   () =>
      gamesStore.games.find(
         (game) => game.serial === router.currentRoute.value.params.serial
      )!
);

const updateCover = async () => {
   const image = await open({
      multiple: false,
      filters: [
         {
            name: "Image",
            // All supported web images extensions
            extensions: ["png", "jpg", "jpeg", "webp"],
         },
      ],
   });

   if (!image || Array.isArray(image)) return;

   game.value.extra.cover = undefined;

   await writeBinaryFile(game.value.serial, await readBinaryFile(image), {
      dir: BaseDirectory.AppData,
   });

   gamesStore.cover.get(game.value);
};

const resetCover = async () => {
   game.value.extra.cover = undefined;
   gamesStore.cover.default(game.value);
};
</script>

<template>
   <div class="grid grid-cols-1 lg:grid-cols-2">
      <div class="max-w-xs mx-auto">
         <GameImage :game="game" />
         <div class="my-4 flex gap-4 justify-center">
            <button
               class="mt-2 px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-600 transition-all duration-100"
               @click="updateCover"
            >
               Change
            </button>

            <button
               class="mt-2 px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-600 transition-all duration-100"
               @click="resetCover"
            >
               Restore default
            </button>
         </div>
      </div>
      <div class="form">
         <div>
            <label>Title</label>
            <input v-model="game.extra.name" />
         </div>
         <div>
            <label>
               Custom arguments (Will be appended used as --gameargs)
            </label>
            <input v-model="game.extra.args" />
         </div>
      </div>
   </div>
</template>

<style lang="scss" scoped>
.form > div:not(:last-child) {
   @apply mb-8;
}
</style>
