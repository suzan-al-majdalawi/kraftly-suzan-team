<template>
  <main class="invoices-view">
    <h1>Fakturor</h1>

    <KAlert
      :show="showAlert"
      :message="alertMessage"
      variant="info"
      @close="closeAlert"
    />

    <p v-if="loading" role="status" aria-live="polite">Laddar fakturor…</p>

    <p v-else-if="error" class="error-message" role="alert">
      {{ error }}
    </p>

    <section v-else class="card table-card" aria-label="Dina fakturor">
      <p v-if="invoices.length === 0" role="status">
        Det finns inga fakturor att visa.
      </p>

      <div v-else class="table-wrapper">
        <table>
          <caption>
            Översikt över dina fakturor
          </caption>

          <thead>
            <tr>
              <th scope="col">Faktura</th>
              <th scope="col">Period</th>
              <th scope="col">Belopp</th>
              <th scope="col">Förfaller</th>
              <th scope="col">Status</th>
              <th scope="col">Åtgärd</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="invoice in invoices" :key="invoice.id">
              <th scope="row">{{ invoice.id }}</th>
              <td>{{ invoice.period }}</td>
              <td>{{ invoice.amount }} kr</td>
              <td>{{ invoice.due }}</td>

              <td>
                <KStatus :status="invoice.status" />
              </td>

              <td>
                <KButton
                  :ref="(el) => setButtonRef(invoice.id, el)"
                  variant="primary"
                  class="download"
                  :class="{
                    'download--active': activeInvoiceId === invoice.id,
                  }"
                  type="button"
                  :aria-label="`Ladda ner faktura ${invoice.id}`"
                  @click="downloadInvoice(invoice)"
                >
                  Ladda ner
                </KButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { fetchInvoices } from "../services/api";
import KButton from "../components/KButton.vue";
import KAlert from "../components/KAlert.vue";
import KStatus from "../components/KStatus.vue";

const showAlert = ref(false);
const alertMessage = ref("");
const activeInvoiceId = ref(null);

const buttonRefs = new Map();

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

// Spara referensen till varje nedladdningsknapp.
const setButtonRef = (invoiceId, component) => {
  if (component) {
    buttonRefs.set(invoiceId, component.$el);
  } else {
    buttonRefs.delete(invoiceId);
  }
};

// Visa meddelande och markera den valda fakturans knapp.
const downloadInvoice = async (invoice) => {
  activeInvoiceId.value = invoice.id;
  alertMessage.value = `Nedladdning av faktura ${invoice.id} kommer snart.`;
  showAlert.value = true;
};

// Stäng meddelandet och återställ fokus till knappen.
const closeAlert = async () => {
  const button = buttonRefs.get(activeInvoiceId.value);

  showAlert.value = false;
  alertMessage.value = "";

  await nextTick();

  if (button?.isConnected) {
    button.focus();
  }
};

onUnmounted(() => {
  buttonRefs.clear();
});
</script>

<style scoped>
.table-card {
  min-width: 0;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

caption {
  padding: 0 0 12px;
  text-align: left;
  font-weight: 600;
  color: #1f2937;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #d0d5dd;
  vertical-align: middle;
}

thead th {
  background: #f2f4f7;
  color: #1f2937;
  font-weight: 700;
}

tbody th {
  font-weight: 600;
}

.download--active {
  outline: 3px solid #2563eb;
  outline-offset: 3px;
}

.download {
  color: #243b9b;
  background: none;
  border: 0;
  border-radius: 3px;
  padding: 6px 2px;
  font: inherit;
  font-size: 14px;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.download:focus-visible {
  outline: 3px solid #243b9b;
  outline-offset: 3px;
}

.error-message {
  color: #b42318;
  font-weight: 600;
}

@media (max-width: 600px) {
  th,
  td {
    padding: 9px;
    white-space: nowrap;
  }
}
</style>
