import { createRouter, createWebHistory, RouterView } from "vue-router";

import Track from "./pages/Track.vue";
import Admin from "./pages/Admin.vue";

export const routerHistory = createWebHistory();
export const router = createRouter({
  history: routerHistory,
  strict: true,
  routes: [
    { path: "/admin", name: "admin", component: Admin },
    { path: "/w/:id", name: "track", component: Track, props: true },
  ],
});
