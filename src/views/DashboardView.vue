<template>
  <main class="dashboard">
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

    <section class="stats" aria-label="Din elöversikt">
      <div class="card stat">
        <h2 class="stat-label">Förbrukning senaste månaden</h2>
        <p class="stat-value">{{ latestMonth }} kWh</p>
      </div>

      <div class="card stat">
        <h2 class="stat-label">Aktuellt pris</h2>
        <p class="stat-value">{{ currentPrice }} kr/kWh</p>
      </div>

      <div class="card stat">
        <h2 class="stat-label">Avtal</h2>
        <p class="stat-value contract-value">
          {{ userStore.user ? userStore.user.contract : "–" }}
        </p>
      </div>
    </section>

    <section class="card chart-card" aria-labelledby="consumption-heading">
      <h2 id="consumption-heading">Din elförbrukning – senaste 12 månaderna</h2>

      <div class="chart-box">
        <p v-if="consumptionStore.loading" role="status" aria-live="polite">
          Laddar diagram…
        </p>

        <p v-else-if="!consumptionStore.data" role="status">
          Ingen förbrukningsdata tillgänglig.
        </p>

        <ConsumptionChart
          v-else
          :months="consumptionStore.data.months"
          :values="consumptionStore.data.values"
        />
      </div>

      <p class="hint">Källa: din elmätare. Uppdateras varje dygn.</p>
    </section>

    <!-- Information för Norge -->
    <NorwayNotice />
  </main>
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
  return data ? (data.values[data.values.length - 1] ?? "–") : "–";
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
.dashboard {
  min-width: 0;
}

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
  margin-bottom: 24px;
}

.stat-label {
  margin: 0 0 6px;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 600;
  color: #344054;
}

.stat-value {
  margin: 0;
  font-size: 26px;
  line-height: 1.4;
  font-weight: 700;
  color: #1f2937;
  overflow-wrap: anywhere;
}

.contract-value {
  font-size: 20px;
}

.chart-card h2 {
  line-height: 1.4;
}

.chart-box {
  min-width: 0;
  aspect-ratio: 2 / 1;
}

.hint {
  margin-top: 12px;
  color: #344054;
  line-height: 1.5;
}

.dashboard :deep(a:focus-visible),
.dashboard :deep(button:focus-visible) {
  outline: 3px solid #243b9b;
  outline-offset: 3px;
}

@media (max-width: 700px) {
  .stats {
    grid-template-columns: 1fr;
  }

  .stat-value {
    font-size: 22px;
  }

  .chart-box {
    aspect-ratio: 1 / 1;
  }
}
</style>
