import { ref, computed } from "vue";
import { defineStore } from "pinia";
import * as api from "../services/api";
import { getAccessToken, setAccessToken } from "../services/token";

export const useAuthStore = defineStore("auth", () => {
  const name = ref(null);
  const restored = ref(false);

  const isAuthenticated = computed(() => Boolean(getAccessToken()));

  const login = async (email, password) => {
    const data = await api.login(email, password);
    name.value = data.name || null;
    return data;
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      setAccessToken(null);
      name.value = null;
    }
  };

  const restore = async () => {
    if (restored.value) {
      return isAuthenticated.value;
    }

    restored.value = true;

    try {
      const data = await api.refresh();

      if (data) {
        name.value = data.name || null;
      }
    } catch (error) {
      setAccessToken(null);
      name.value = null;
      console.error("Session restore failed:", error);
    }

    return isAuthenticated.value;
  };

  return {
    name,
    restored,
    isAuthenticated,
    login,
    logout,
    restore,
  };
});
