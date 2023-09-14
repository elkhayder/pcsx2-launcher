import { createApp } from "vue";
import { createPinia } from "pinia";

import * as VueRouter from "vue-router";
// Styles
import "./styles.css";
// Fonts
import "./assets/fonts/Lato/stylesheet.css";
import "./assets/fonts/RobotoMono/stylesheet.css";

import App from "./App.vue";
// Pages components
import Home from "./pages/Home.vue";
import Config from "./pages/Config.vue";

const router = VueRouter.createRouter({
   // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
   history: VueRouter.createWebHashHistory(),
   routes: [
      { path: "/", component: Home },
      { path: "/config", component: Config },
   ],
});

const pinia = createPinia();

// Add router

createApp(App).use(router).use(pinia).mount("#app");
