<script setup lang="ts">
import { computed } from "vue";
import { useConfigStore } from "../../stores/Config";

const props = defineProps<{ flag: string; description: string }>();

const configStore = useConfigStore();

const value = computed(() =>
   configStore.config.pcsx2.flags.includes(props.flag)
);

const onChange = (e: Event) => {
   const target = e.target as HTMLInputElement;

   if (target.checked) {
      configStore.config.pcsx2.flags.push(props.flag);
   } else {
      configStore.config.pcsx2.flags = configStore.config.pcsx2.flags.filter(
         (f) => f !== props.flag
      );
   }
};
</script>

<template>
   <div>
      <label class="relative flex items-start cursor-pointer" :for="flag">
         <input
            class="sr-only peer"
            type="checkbox"
            :id="flag"
            @change="onChange"
            :checked="value"
         />
         <div
            class="flex-shrink-0 w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-blue-600"
         />
         <span class="ml-3 text-sm font-medium text-gray-400">
            <span class="text-white"> {{ flag }}</span>
            : {{ description }}
         </span>
      </label>
   </div>
</template>

<style lang="scss" scoped></style>
