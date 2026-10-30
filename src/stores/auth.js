import { ref, computed } from "vue";
import { defineStore } from "pinia";
import * as api from "../services/api";
import { getAccessToken, setAccessToken } from "../services/token";

export const useAuthStore = defineStore("auth", () => {
  const name = ref(null);
  const restored = ref(false);

  let restorePromise = null;
  let sessionVersion = 0;

  const isAuthenticated = computed(() => Boolean(getAccessToken()));

  const login = async (email, password) => {
    const data = await api.login(email, password);

    sessionVersion++;
    name.value = data.name || null;
    restored.value = true;

    return data;
  };

  const logout = async () => {
    sessionVersion++;

    try {
      await api.logout();
    } finally {
      setAccessToken(null);
      name.value = null;
      restored.value = true;
    }
  };

  const restore = async () => {
    if (restorePromise) {
      return restorePromise;
    }

    if (restored.value) {
      return isAuthenticated.value;
    }

    const currentVersion = sessionVersion;

    let currentPromise;

    currentPromise = (async () => {
      try {
        const data = await api.refresh();

        // Ignorera resultatet om sessionens tillstånd har ändrats.
        if (currentVersion !== sessionVersion) {
          return isAuthenticated.value;
        }

        if (data) {
          name.value = data.name || null;
        } else {
          setAccessToken(null);
          name.value = null;
        }
      } catch (error) {
        if (currentVersion === sessionVersion) {
          setAccessToken(null);
          name.value = null;
        }

        console.error("Session restore failed:", error);
      } finally {
        if (currentVersion === sessionVersion) {
          restored.value = true;
        }

        if (restorePromise === currentPromise) {
          restorePromise = null;
        }
      }

      return isAuthenticated.value;
    })();

    restorePromise = currentPromise;

    return currentPromise;
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
