import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

export const useConfigStore = defineStore("config", () => {
   const PREFIX = "config_";

   const folders = ref<string[]>([]);
   const pcsx2Path = ref<string | null>(null);

   onMounted(() => {
      console.log("Config store Mounted");

      if (localStorage.getItem(PREFIX + "folders") == null) {
         localStorage.setItem(PREFIX + "folders", JSON.stringify([]));
      } else {
         folders.value = JSON.parse(localStorage.getItem(PREFIX + "folders")!);
      }

      pcsx2Path.value = localStorage.getItem(PREFIX + "pcsx2_path");
   });

   const addFolder = (path: string) => {
      folders.value.push(path);
      localStorage.setItem(PREFIX + "folders", JSON.stringify(folders.value));
   };

   const removeFolder = (path: string) => {
      folders.value = folders.value.filter((folder) => folder !== path);
      localStorage.setItem(PREFIX + "folders", JSON.stringify(folders.value));
   };

   const updatePCSX2Path = (path: string) => {
      localStorage.setItem(PREFIX + "pcsx2_path", path);
      pcsx2Path.value = path;
   };

   return {
      folders,
      pcsx2Path,
      addFolder,
      removeFolder,
      updatePCSX2Path,
   };
});
