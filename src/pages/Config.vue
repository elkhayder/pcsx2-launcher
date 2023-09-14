<script setup lang="ts">
import { open } from "@tauri-apps/api/dialog";
import { useConfigStore } from "../stores/Config";

const configStore = useConfigStore();

const addFolder = async () => {
   const folder = await open({
      directory: true,
   });

   if (folder) {
      configStore.addFolder(folder as string);
   }
};

const updatePCSX2Location = async () => {
   const location = await open({
      directory: false,
      filters: [
         {
            extensions: ["exe"],
            name: "PCSX2",
         },
      ],
   });

   if (!location) return;

   configStore.updatePCSX2Path(location as string);
};
</script>

<template>
   <h1 class="my-6 text-4xl font-bold">Config</h1>

   <div class="py-4">
      <div class="flex justify-between">
         <h3>Folders</h3>
         <button
            @click="addFolder"
            class="px-4 py-2 font-bold text-white bg-black rounded-md"
         >
            Add folder
         </button>
      </div>

      <div class="flex flex-col mt-4">
         <div
            class="flex flex-row items-center mt-4 first-of-type:mt-0 px-4 py-4 bg-black border-2 border-gray-300 rounded-md"
            v-for="(folder, index) in configStore.folders"
            :key="index"
         >
            <h6 class="flex-grow truncate">{{ folder }}</h6>
            <button
               class="px-4 py-2 font-bold text-white bg-red-600 rounded-md"
               @click="() => configStore.removeFolder(folder)"
            >
               Remove
            </button>
         </div>
      </div>
   </div>

   <div class="py-4">
      <h3>PCSX2 location</h3>
      <div class="flex flex-col mt-4">
         <div
            class="flex flex-row items-center mt-4 first-of-type:mt-0 px-4 py-4 bg-black border-2 border-gray-300 rounded-md"
         >
            <h6 class="flex-grow truncate">
               {{ configStore.pcsx2Path ?? "-" }}
            </h6>
            <button
               class="px-4 py-2 font-bold text-white bg-red-600 rounded-md"
               @click="updatePCSX2Location"
            >
               Change
            </button>
         </div>
      </div>
   </div>
</template>

<style lang="scss" scoped></style>
