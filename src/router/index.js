import { createRouter, createWebHistory } from "vue-router";
import { hasSession, refreshSession } from "../services/api";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      component: () => import("../views/LoginView.vue"),
      meta: { guestOnly: true },
    },
    {
      path: "/",
      component: () => import("../views/DashboardView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/fakturor",
      component: () => import("../views/InvoicesView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/flytt",
      component: () => import("../views/MoveFormView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/profil",
      component: () => import("../views/ProfileView.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(async (to) => {
  let authenticated = hasSession();

  if (!authenticated) {
    try {
      authenticated = await refreshSession();
    } catch {
      authenticated = false;
    }
  }

  if (to.meta.requiresAuth && !authenticated) {
    return "/login";
  }

  if (to.meta.guestOnly && authenticated) {
    return "/";
  }

  return true;
});

export default router;
