<template>
  <main class="move-view">
    <h1>Flyttanmälan</h1>

    <section class="card move-card">
      <p class="intro">Fyll i uppgifterna nedan så flyttar vi ditt elavtal.</p>

      <form novalidate @submit.prevent="submit">
        <div class="form-field">
          <label for="move-address">Ny adress</label>
          <input
            id="move-address"
            v-model.trim="form.address"
            name="address"
            type="text"
            autocomplete="street-address"
            required
            :aria-invalid="Boolean(error)"
            aria-describedby="move-error"
          />
        </div>

        <div class="form-field">
          <label for="move-zip">Postnummer</label>
          <input
            id="move-zip"
            v-model.trim="form.zip"
            name="zip"
            type="text"
            autocomplete="postal-code"
            inputmode="numeric"
            required
            :aria-invalid="Boolean(error)"
            aria-describedby="move-error"
          />
        </div>

        <div class="form-field">
          <label for="move-city">Ort</label>
          <input
            id="move-city"
            v-model.trim="form.city"
            name="city"
            type="text"
            autocomplete="address-level2"
            required
            :aria-invalid="Boolean(error)"
            aria-describedby="move-error"
          />
        </div>

        <div class="form-field">
          <label for="move-date">Inflyttningsdatum</label>
          <input
            id="move-date"
            v-model="form.date"
            name="date"
            type="date"
            required
            :aria-invalid="Boolean(error)"
            aria-describedby="move-error"
          />
        </div>

        <div class="form-field">
          <label for="move-contract">Avtal</label>
          <select
            id="move-contract"
            v-model="form.contract"
            name="contract"
            required
            :aria-invalid="Boolean(error)"
            aria-describedby="move-error"
          >
            <option disabled value="">Välj avtal</option>
            <option>Rörligt pris</option>
            <option>Fast pris 1 år</option>
            <option>Fast pris 3 år</option>
          </select>
        </div>

        <p v-if="error" id="move-error" class="error-message" role="alert">
          {{ error }}
        </p>

        <KButton type="submit" :disabled="submitting">
          {{ submitting ? "Skickar…" : "Skicka flyttanmälan" }}
        </KButton>
      </form>

      <p class="hint">Anmälan måste göras senast 14 dagar före flytt.</p>

      <p v-if="reference" class="success-message" role="status">
        Tack! Referensnummer: {{ reference }}
      </p>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive } from "vue";
import KButton from "../components/KButton.vue";
import { submitMove } from "../services/api";

const form = reactive({
  address: "",
  zip: "",
  city: "",
  date: "",
  contract: "",
});

const reference = ref(null);
const error = ref("");
const submitting = ref(false);

const submit = async () => {
  error.value = "";
  reference.value = null;

  if (
    !form.address.trim() ||
    !form.zip.trim() ||
    !form.city.trim() ||
    !form.date ||
    !form.contract
  ) {
    error.value = "Fyll i alla uppgifter innan du skickar flyttanmälan.";
    return;
  }

  submitting.value = true;

  try {
    const res = await submitMove({ ...form });
    reference.value = res.ref;
  } catch {
    error.value = "Flyttanmälan kunde inte skickas. Försök igen senare.";
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.move-card {
  width: 100%;
  max-width: 560px;
  box-sizing: border-box;
}

.intro {
  margin-bottom: 18px;
  color: #344054;
  line-height: 1.5;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.form-field label {
  color: #344054;
  font-size: 14px;
  font-weight: 600;
}

.form-field input,
.form-field select {
  width: 100%;
  min-height: 44px;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #667085;
  border-radius: 6px;
  background: #ffffff;
  color: #1f2937;
  font: inherit;
}

.form-field input:focus-visible,
.form-field select:focus-visible {
  outline: 3px solid #243b9b;
  outline-offset: 2px;
}

.form-field input[aria-invalid="true"],
.form-field select[aria-invalid="true"] {
  border-color: #b42318;
}

.error-message {
  margin: 10px 0;
  color: #b42318;
  font-weight: 600;
  line-height: 1.5;
}

.hint {
  margin-top: 12px;
  color: #344054;
  font-size: 14px;
  line-height: 1.5;
}

.success-message {
  margin-top: 12px;
  color: #05603a;
  font-weight: 600;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .move-card {
    padding: 16px;
  }
}
</style>
