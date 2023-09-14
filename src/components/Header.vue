<script setup lang="ts"></script>

<template>
   <header class="mt-2">
      <div class="container h-20 flex items-center justify-between">
         <img src="../assets/ps2-icon.png" alt="PS2 Icon" class="h-12" />
         <nav>
            <ul class="flex items-center space-x-4">
               <li>
                  <router-link to="/">Home</router-link>
               </li>
               <li>
                  <router-link to="/config">Config</router-link>
               </li>
            </ul>
         </nav>
      </div>
   </header>
</template>

<style lang="scss" scoped></style>
