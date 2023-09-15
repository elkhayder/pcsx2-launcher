import { defineStore } from "pinia";
import { computed, onMounted, reactive } from "vue";
import { useConfigStore } from "./Config";
import { invoke } from "@tauri-apps/api";
import type { Game } from "../types.d.ts";
import GamesDB from "../assets/games_db.json";

export const useGamesStore = defineStore("games", () => {
   const configStore = useConfigStore();

   const config = computed(() => configStore.config);

   const games = reactive<Game[]>([]);

   onMounted(() => {
      console.log("Games store Mounted");
      scan();
   });

   const scan = async () => {
      games.length = 0;

      for (const path of config.value.folders) {
         const x = (await invoke("read_directory_games", { path })) as Game[];

         x.forEach((game) => {
            game.name = (GamesDB as any)[game.serial];

            game.lastPlayed = localStorage.getItem(
               `last_played_${game.serial}`
            );
         });

         games.push(...x);
      }
   };

   const play = async (game: Game) => {
      if (!config.value.pcsx2Path) {
         alert("PCSX2 location is not configured");
         return;
      }

      localStorage.setItem(
         `last_played_${game.serial}`,
         new Date().toISOString()
      );
      game.lastPlayed = new Date().toISOString();

      await invoke("launch_game", {
         pcsx2Path: config.value.pcsx2Path,
         isoPath: game.path,
      });
   };

   return {
      games,
      scan,
      play,
   };
});
