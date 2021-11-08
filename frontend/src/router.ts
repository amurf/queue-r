import { createRouter, createWebHistory, RouterView } from "vue-router";

import Track from "./pages/Track.vue";
import Order from "./pages/Order.vue";
import Manage from "./pages/Manage.vue";
import QR from "./pages/QR.vue";

export const routerHistory = createWebHistory();
export const router = createRouter({
  history: routerHistory,
  strict: true,
  routes: [
    { path: "/", name: "order", component: Order },
    { path: "/manage", name: "manage", component: Manage },
    { path: "/qr/:id", name: "qr", component: QR, props: true },
    { path: "/w/:id", name: "track", component: Track, props: true },
  ],
});
