import { ref, computed } from "vue";
import { defineStore } from "pinia";
import * as api from "../services/api";
import { getAccessToken, setAccessToken } from "../services/token";

export const useAuthStore = defineStore("auth", () => {
  const name = ref(null);

  // Sessionen är inte återställd när appen startar.
  const restored = ref(false);

  // Hindrar flera samtidiga sessionåterställningar.
  let restorePromise = null;

  const isAuthenticated = computed(() => Boolean(getAccessToken()));

  const login = async (email, password) => {
    const data = await api.login(email, password);

    name.value = data.name || null;
    restored.value = true;

    return data;
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      setAccessToken(null);
      name.value = null;
      restored.value = true;
    }
  };

  const restore = async () => {
    // Om en återställning redan pågår väntar vi på samma Promise. förslag från AI
    if (restorePromise) {
      return restorePromise;
    }

    // Om sessionen redan har återställts behöver vi inte anropa API:t igen.
    if (restored.value) {
      return isAuthenticated.value;
    }

    restorePromise = (async () => {
      try {
        const data = await api.refresh();

        if (data) {
          name.value = data.name || null;
        } else {
          setAccessToken(null);
          name.value = null;
        }
      } catch (error) {
        setAccessToken(null);
        name.value = null;

        console.error("Session restore failed:", error);
      } finally {
        restored.value = true;
        restorePromise = null;
      }

      return isAuthenticated.value;
    })();

    return restorePromise;
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
