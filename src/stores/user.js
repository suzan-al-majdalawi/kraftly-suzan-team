import { ref } from "vue";
import { defineStore } from "pinia";
import { fetchUser, saveUser } from "../services/api";

// Normaliserar API-svaret, oavsett om det har formatet { user: {...} } eller {...}.
const normalizeUser = (result, allowEmpty = false) => {
  if (result === null && allowEmpty) {
    return {};
  }

  if (!result || typeof result !== "object" || Array.isArray(result)) {
    throw new Error("Invalid user data returned from API");
  }

  const normalized = result.user ?? result;

  if (
    !normalized ||
    typeof normalized !== "object" ||
    Array.isArray(normalized)
  ) {
    throw new Error("Invalid user data returned from API");
  }

  return normalized;
};

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref("");

  const load = async () => {
    loading.value = true;
    error.value = "";

    try {
      const result = await fetchUser();
      user.value = normalizeUser(result);

      return user.value;
    } catch (e) {
      error.value = "Kunde inte hämta användaruppgifter.";
      console.error("fetchUser failed:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const save = async (data) => {
    saving.value = true;
    error.value = "";

    try {
      const payload = {
        name: String(data.name ?? "").trim(),
        email: String(data.email ?? "").trim(),
        address: String(data.address ?? "").trim(),
      };

      const result = await saveUser(payload);
      const normalizedResult = normalizeUser(result, true);

      user.value = {
        ...(user.value || {}),
        ...payload,
        ...normalizedResult,
      };

      return user.value;
    } catch (e) {
      error.value = "Kunde inte spara användaruppgifterna.";
      console.error("saveUser failed:", e);
      throw e;
    } finally {
      saving.value = false;
    }
  };

  return {
    user,
    loading,
    saving,
    error,
    load,
    save,
  };
});
