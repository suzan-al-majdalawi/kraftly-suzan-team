import { ref } from "vue";
import { defineStore } from "pinia";
import { fetchConsumption } from "../services/api";

export const useConsumptionStore = defineStore("consumption", () => {
  const data = ref(null);
  const loading = ref(false);
  const error = ref("");

  const load = async () => {
    loading.value = true;
    error.value = "";

    try {
      data.value = await fetchConsumption();
      return data.value;
    } catch (e) {
      error.value = "Kunde inte hämta förbrukningsuppgifter.";
      console.error("fetchConsumption failed:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    loading,
    error,
    load,
  };
});
