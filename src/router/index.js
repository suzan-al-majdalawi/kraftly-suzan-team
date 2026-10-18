import { createRouter, createWebHistory } from "vue-router";
import { hasSession, refreshSession } from "../services/api";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/",
      component: () => import("../views/DashboardView.vue"),
    },
    {
      path: "/fakturor",
      component: () => import("../views/InvoicesView.vue"),
    },
    {
      path: "/flytt",
      component: () => import("../views/MoveFormView.vue"),
    },
    {
      path: "/profil",
      component: () => import("../views/ProfileView.vue"),
    },
  ],
});

router.beforeEach(async (to) => {
  const authenticated = hasSession() || (await refreshSession());

  if (to.path !== "/login" && !authenticated) {
    return "/login";
  }

  if (to.path === "/login" && authenticated) {
    return "/";
  }

  return true;
});

export default router;
