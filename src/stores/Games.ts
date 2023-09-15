import { defineStore } from "pinia";
import { computed, onMounted, reactive, ref } from "vue";
import { useConfigStore } from "./Config";
import { invoke } from "@tauri-apps/api";
import type { Game } from "../types.d.ts";
import GamesDB from "../assets/games_db.json";

export type OrderBy = "lastPlayed" | "name";

export const useGamesStore = defineStore("games", () => {
   const configStore = useConfigStore();

   const config = computed(() => configStore.config);

   const orderBy = ref<OrderBy>("lastPlayed");
   const searchKeyword = ref<string>("");

   const games = reactive<Game[]>([]);

   const filteredGames = computed(() =>
      games
         // Filter
         .filter((x) =>
            x.name?.toLowerCase().includes(searchKeyword.value.toLowerCase())
         )
         // Order
         .sort((a, b) => {
            if (orderBy.value === "lastPlayed") {
               if (!a.lastPlayed) return 1;
               if (!b.lastPlayed) return -1;

               return (
                  new Date(b.lastPlayed).getTime() -
                  new Date(a.lastPlayed).getTime()
               );
            } else if (orderBy.value === "name") {
               if (!a.name) return 1;
               if (!b.name) return -1;

               return a.name.localeCompare(b.name);
            }

            return 0;
         })
   );

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
      if (!config.value.pcsx2.path) {
         alert("PCSX2 location is not configured");
         return;
      }

      localStorage.setItem(
         `last_played_${game.serial}`,
         new Date().toISOString()
      );
      game.lastPlayed = new Date().toISOString();

      await invoke("launch_game", {
         pcsx2Path: config.value.pcsx2.path,
         isoPath: game.path,
      });
   };

   return {
      games,
      orderBy,
      searchKeyword,
      filteredGames,
      scan,
      play,
   };
});
