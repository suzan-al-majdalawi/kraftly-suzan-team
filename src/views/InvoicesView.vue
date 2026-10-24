<template>
  <div>
    <h1>Fakturor</h1>
    <div class="card">
      <table>
        <tr>
          <th>Faktura</th>
          <th>Period</th>
          <th>Belopp</th>
          <th>Förfaller</th>
          <th>Status</th>
          <th></th>
        </tr>
        <tr v-for="invoice in invoices" :key="invoice.id">
          <td>{{ invoice.id }}</td>
          <td>{{ invoice.period }}</td>
          <td>{{ invoice.amount }} kr</td>
          <td>{{ invoice.due }}</td>
          <td>
            <span
              :class="[
                'status-chip',
                invoice.status === 'Betald'
                  ? 'status-betald'
                  : 'status-obetald',
              ]"
              >{{ invoice.status }}</span
            >
          </td>
          <td>
            <button
              class="download"
              type="button"
              @click="downloadInvoice(invoice)"
            >
              Ladda ner
            </button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchInvoices } from "../services/api";

const invoices = ref([]);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    invoices.value = await fetchInvoices();
  } catch {
    error.value = "Kunde inte hämta fakturorna. Försök logga in igen.";
  } finally {
    loading.value = false;
  }
});

const downloadInvoice = (invoice) => {
  console.log("download", invoice.id);
  alert("Nedladdning kommer snart");
};
</script>

<style scoped>
.download {
  color: #2f54eb;
  background: none;
  border: 0;
  padding: 0;
  font: inherit;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
}
</style>
