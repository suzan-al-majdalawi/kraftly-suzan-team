import { ref } from "vue";
import { defineStore } from "pinia";
import { fetchUser } from "../services/api";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const loading = ref(false);
  const error = ref("");

  const load = async () => {
    loading.value = true;
    error.value = "";

    try {
      user.value = await fetchUser();
      return user.value;
    } catch (e) {
      user.value = null;
      error.value = "Kunde inte hämta användaruppgifter.";
      console.error("fetchUser failed:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return { user, loading, error, load };
});
