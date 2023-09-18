import { defineStore } from "pinia";
import { computed, onMounted, reactive, ref, watchEffect } from "vue";
import { useConfigStore } from "./Config";
import { invoke } from "@tauri-apps/api";
import GamesDB from "../assets/games_db.json";
import {
   BaseDirectory,
   exists,
   readBinaryFile,
   writeBinaryFile,
} from "@tauri-apps/api/fs";

export type OrderBy = "lastPlayed" | "name";

export type Game = {
   serial: string;
   path: string;
   extra: {
      name?: string;
      args?: string;
      cover?: string | null;
      lastPlayed?: string; // ISO formatted
   };
};

export const useGamesStore = defineStore("games", () => {
   const LOCALSTORAGE_KEY = "games";

   const configStore = useConfigStore();

   const config = computed(() => configStore.config);

   const orderBy = ref<OrderBy>("lastPlayed");
   const searchKeyword = ref<string>("");

   const games = reactive<Game[]>([]);

   const filteredGames = computed(() =>
      games
         // Filter
         .filter((x) => {
            if (searchKeyword.value === "") return true;

            return x.extra.name
               ?.toLowerCase()
               .includes(searchKeyword.value.toLowerCase());
         })
         // Order
         .sort((a, b) => {
            if (orderBy.value === "lastPlayed") {
               if (!a.extra.lastPlayed) return 1;
               if (!b.extra.lastPlayed) return -1;

               return (
                  new Date(b.extra.lastPlayed).getTime() -
                  new Date(a.extra.lastPlayed).getTime()
               );
            } else if (orderBy.value === "name") {
               if (!a.extra.name) return 1;
               if (!b.extra.name) return -1;

               return a.extra.name.localeCompare(b.extra.name);
            }

            return 0;
         })
   );

   onMounted(async () => {
      console.log("Games store Mounted");
      await scan();

      // Watch for changes and update localStorage
      // This is initiated here instead of in the reactive declaration
      // because we don't want to trigger a write to localStorage on
      // initialization
      setTimeout(() => {
         watchEffect(() => {
            const extra = Object.fromEntries(
               games.map((x) => {
                  const { cover, ...rest } = x.extra;
                  return [x.serial, rest];
               })
            );

            localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(extra));
         });
      }, 2000);
   });

   const scan = async () => {
      const gamesConfigs = JSON.parse(
         localStorage.getItem(LOCALSTORAGE_KEY) || "{}"
      ) as Record<string, Game["extra"]>;

      games.length = 0;

      for (const path of config.value.folders) {
         const x = (await invoke("read_directory_games", { path })) as Game[];
         games.push(...x);

         for (let i = 0; i < games.length; i++) {
            const game = games[i];

            game.extra = gamesConfigs[game.serial] ?? {};

            game.extra.name ??= (GamesDB as any)[game.serial];

            cover.get(game);
         }
      }
   };

   const play = async (game: Game) => {
      if (!config.value.pcsx2.path) {
         alert("PCSX2 location is not configured");
         return;
      }

      game.extra.lastPlayed = new Date().toISOString();

      await invoke("launch_game", {
         pcsx2Path: config.value.pcsx2.path,
         isoPath: game.path,
         flags: config.value.pcsx2.flags,
         gamesArgs: game.extra.args,
      });
   };

   const cover = {
      async get(game: Game) {
         const r = await exists(game.serial, { dir: BaseDirectory.AppData });

         if (!r) {
            this.default(game);
         } else {
            const content = await readBinaryFile(game.serial, {
               dir: BaseDirectory.AppData,
            });

            game.extra.cover = URL.createObjectURL(new Blob([content.buffer]));
         }
      },

      async default(game: Game) {
         try {
            const request = await fetch(
               `https://raw.githubusercontent.com/xlenore/ps2-covers/main/covers/${game.serial}.jpg`
            );
            const blob = await request.blob();

            await writeBinaryFile(game.serial, await blob.arrayBuffer(), {
               dir: BaseDirectory.AppData,
            });

            game.extra.cover = URL.createObjectURL(blob);
         } catch {
            game.extra.cover = null;
         }
      },
   };

   return {
      games,
      orderBy,
      searchKeyword,
      filteredGames,
      cover,
      scan,
      play,
   };
});
