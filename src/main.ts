import { createApp } from "vue";
import { createPinia } from "pinia";

import * as VueRouter from "vue-router";
// Styles
import "./styles.css";
// Fonts
import "./assets/fonts/Lato/stylesheet.css";
import "./assets/fonts/RobotoMono/stylesheet.css";

import App from "./App.vue";

const router = VueRouter.createRouter({
   // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
   history: VueRouter.createWebHistory(),
   routes: [
      { path: "/", component: () => import("./pages/Home.vue"), name: "Home" },
      {
         path: "/Config",
         component: () => import("./pages/Config.vue"),
         name: "Config",
      },
      {
         path: "/GameSettings/:serial",
         component: () => import("./pages/GameSettings.vue"),
         name: "GameSettings",
      },
   ],
});

const pinia = createPinia();

// Add router

createApp(App).use(router).use(pinia).mount("#app");
