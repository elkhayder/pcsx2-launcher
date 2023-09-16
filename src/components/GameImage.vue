<script setup lang="ts">
import { Game } from "../stores/Games";

defineProps<{ game: Game }>();
</script>

<template>
   <div class="relative aspect-[16/23]">
      <img
         :src="`https://raw.githubusercontent.com/xlenore/ps2-covers/main/covers/${game.serial}.jpg`"
         alt="Game Cover"
         class="w-full"
      />
   </div>
</template>

<style lang="scss" scoped></style>
