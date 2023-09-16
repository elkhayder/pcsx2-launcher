<script setup lang="ts">
import { open } from "@tauri-apps/api/dialog";
import { useConfigStore } from "../stores/Config";
import { computed } from "vue";
import PCSX2Flag from "../components/Config/PCSX2Flag.vue";

const configStore = useConfigStore();

const config = computed(() => configStore.config);

const addFolder = async () => {
   const folder = await open({
      directory: true,
   });

   if (folder) {
      config.value.folders.push(folder as string);
   }
};

const removeFolder = (folder: string) => {
   config.value.folders = config.value.folders.filter((f) => f !== folder);
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

   config.value.pcsx2.path = location as string;
};

const PCSX2Flags = [
   {
      flag: "--portable",
      description:
         "Enables portable mode to store ini and cfg data in local PCSX2 paths instead of the current user's Documents path (which requires admin/root access).",
   },
   {
      flag: "--console",
      description: "Forces PCSX2 log console to be visible.",
   },
   { flag: "--fullscreen", description: "Starts in full-screen mode." },
   { flag: "--windowed", description: "Starts in windowed mode (default)." },
   {
      flag: "--forcewiz",
      description: "Forces PCSX2 to start in the first time wizard mode.",
   },
   {
      flag: "--nogui",
      description:
         "Disables display of the graphical user interface (you can combine it with --fullscreen when loading an ISO file so that PCSX2's presence will be hidden from the user).",
   },
];
</script>

<template>
   <h1 class="my-6 text-4xl font-bold">Config</h1>

   <div class="py-4">
      <div class="flex justify-between items-center">
         <h3 class="text-2xl font-semibold">Games folders</h3>
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
            v-for="(folder, index) in config.folders"
            :key="index"
         >
            <h6 class="flex-grow truncate">{{ folder }}</h6>
            <button
               class="px-4 py-2 font-bold text-white bg-red-600 rounded-md"
               @click="() => removeFolder(folder)"
            >
               Remove
            </button>
         </div>
      </div>
   </div>

   <div class="py-4">
      <h3 class="my-3 text-2xl font-semibold">PCSX2</h3>
      <!--  -->
      <div class="my-5">
         <h4>Executable Path</h4>
         <div class="flex flex-col mt-4">
            <div
               class="flex flex-row items-center mt-4 first-of-type:mt-0 px-4 py-4 bg-black border-2 border-gray-300 rounded-md"
            >
               <h6 class="flex-grow truncate">
                  {{ config.pcsx2.path ?? "-" }}
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
      <!--  -->
      <div class="my-5">
         <h4>Flags</h4>
         <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <PCSX2Flag
               v-for="x in PCSX2Flags"
               :flag="x.flag"
               :description="x.description"
            />
         </div>
      </div>
   </div>
</template>

<style lang="scss" scoped></style>
