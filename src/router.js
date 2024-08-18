import { createRouter, createWebHistory } from "vue-router";

import Home from "./pages/Home.vue";
import Contatti from "./pages/Contatti.vue";
import Menu from "./pages/Menu.vue";
import Ordina from "./pages/Ordina.vue";
import CheckOut from "./pages/CheckOut.vue";
import News from "./pages/News.vue";
import Story from "./pages/Story.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/menu",
      name: "menu",
      component: Menu,
    },
    {
      path: "/contatti",
      name: "contatti",
      component: Contatti,
    },
    {
      path: "/news",
      name: "news",
      component: News,
    },
    {
      path: "/story",
      name: "story",
      component: Story,
    },
    {
      path: "/ordina",
      name: "ordina",
      component: Ordina,
    },
    {
      path: "/check-out",
      name: "check-out",
      component: CheckOut,
    },
  ],
});

export { router };
