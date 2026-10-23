<template>
  <div>
    <img
      src="../assets/hero.webp"
      class="hero"
      width="1200"
      height="600"
      alt=""
      fetchpriority="high"
    />

    <h1 v-if="userStore.user">Hej {{ userStore.user.name.split(" ")[0] }}!</h1>
    <h1 v-else>Hej!</h1>

    <div class="stats">
      <div class="card stat">
        <div class="stat-label">Förbrukning senaste månaden</div>
        <div class="stat-value">{{ latestMonth }} kWh</div>
      </div>

      <div class="card stat">
        <div class="stat-label">Aktuellt pris</div>
        <div class="stat-value">{{ currentPrice }} kr/kWh</div>
      </div>

      <div class="card stat">
        <div class="stat-label">Avtal</div>
        <div class="stat-value contract-value">
          {{ userStore.user ? userStore.user.contract : "–" }}
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Din elförbrukning – senaste 12 månaderna</h2>

      <div class="chart-box">
        <p v-if="consumptionStore.loading">Laddar…</p>

        <ConsumptionChart
          v-else-if="consumptionStore.data"
          :months="consumptionStore.data.months"
          :values="consumptionStore.data.values"
        />
      </div>

      <p class="hint">Källa: din elmätare. Uppdateras varje dygn.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, defineAsyncComponent } from "vue";
import { useUserStore } from "../stores/user";
import { useConsumptionStore } from "../stores/consumption";

const ConsumptionChart = defineAsyncComponent(
  () => import("../components/ConsumptionChart.vue"),
);

const userStore = useUserStore();
const consumptionStore = useConsumptionStore();

const latestMonth = computed(() => {
  const data = consumptionStore.data;
  return data ? data.values[data.values.length - 1] : "–";
});

const currentPrice = computed(() =>
  consumptionStore.data ? consumptionStore.data.pricePerKwh : "–",
);

onMounted(() => {
  userStore.load();
  consumptionStore.load();
});
</script>

<style scoped>
.hero {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 18px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.stat-label {
  font-size: 13px;
  color: #7c8698;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
}

.contract-value {
  font-size: 20px;
}

.chart-box {
  aspect-ratio: 2 / 1;
}

@media (max-width: 700px) {
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
