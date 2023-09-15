import { defineStore } from "pinia";
import { onMounted, reactive, watchEffect } from "vue";

export type Config = {
   folders: string[];
   pcsx2: {
      path: string | null;
      flags: string[];
   };
};

export const useConfigStore = defineStore("config", () => {
   const LOCALSTORAGE_KEY = "config";

   const config = reactive<Config>({
      folders: [],
      pcsx2: {
         path: null,
         flags: [],
      },
   });

   onMounted(() => {
      console.log("Config store Mounted");

      // Populate config from localStorage
      if (!localStorage.getItem(LOCALSTORAGE_KEY)) {
         localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(config));
      } else {
         Object.assign(
            config,
            JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)!)
         );
      }

      // Watch for changes and update localStorage
      // This is initiated here instead of in the reactive declaration
      // because we don't want to trigger a write to localStorage on
      // initialization
      watchEffect(() => {
         localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(config));
      });
   });

   return {
      config,
   };
});
