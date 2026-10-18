import { createRouter, createWebHistory } from "vue-router";

import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import InvoicesView from "../views/InvoicesView.vue";
import MoveFormView from "../views/MoveFormView.vue";
import ProfileView from "../views/ProfileView.vue";
import { refresh } from "../services/api";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", component: LoginView, meta: { guestOnly: true } },
    { path: "/", component: DashboardView, meta: { requiresAuth: true } },
    {
      path: "/fakturor",
      component: InvoicesView,
      meta: { requiresAuth: true },
    },
    { path: "/flytt", component: MoveFormView, meta: { requiresAuth: true } },
    { path: "/profil", component: ProfileView, meta: { requiresAuth: true } },
  ],
});

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    try {
      // يتحقق من الجلسة باستخدام refresh cookie إذا لم يوجد access token.
      await refresh();
      return true;
    } catch {
      return "/login";
    }
  }

  if (to.meta.guestOnly) {
    // لا نمنع صفحة الدخول اعتمادًا على localStorage.
    return true;
  }

  return true;
});

export default router;
