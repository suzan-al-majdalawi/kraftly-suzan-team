import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { getSafeRedirect } from "../utils/redirect";

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
  const auth = useAuthStore();

  let authenticated = false;

  try {
    authenticated = await auth.restore();
  } catch (error) {
    console.error("Authentication check failed:", error);
  }

  if (to.meta.requiresAuth && !authenticated) {
    return {
      path: "/login",
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta.guestOnly && authenticated) {
    const redirect = getSafeRedirect(to.query.redirect);
    return redirect;
  }

  return true;
});

export default router;
