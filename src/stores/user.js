import { ref } from "vue";
import { defineStore } from "pinia";
import { fetchUser, saveUser } from "../services/api";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref("");

  const load = async () => {
    loading.value = true;
    error.value = "";

    try {
      user.value = await fetchUser();
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
        name: data.name.trim(),
        email: data.email.trim(),
        address: data.address.trim(),
      };

      const result = await saveUser(payload);

      user.value = {
        ...(user.value || {}),
        ...payload,
        ...(result || {}),
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
