<template>
  <main class="move-view">
    <h1>Flyttanmälan</h1>

    <section class="card move-card">
      <p class="intro">Fyll i uppgifterna nedan så flyttar vi ditt elavtal.</p>

      <form novalidate @submit.prevent="submit">
        <KField
          id="move-address"
          v-model="form.address"
          label="Ny adress"
          name="address"
          type="text"
          autocomplete="street-address"
          required
          :error="fieldErrors.address"
          @input="validateField('address')"
          @blur="validateField('address')"
        />

        <KField
          id="move-zip"
          v-model="form.zip"
          label="Postnummer"
          name="zip"
          type="text"
          inputmode="numeric"
          autocomplete="postal-code"
          maxlength="5"
          pattern="[0-9]{5}"
          required
          :error="fieldErrors.zip"
          @input="onZipInput"
          @blur="validateField('zip')"
        />

        <KField
          id="move-city"
          v-model="form.city"
          label="Ort"
          name="city"
          type="text"
          autocomplete="address-level2"
          required
          :error="fieldErrors.city"
          @input="validateField('city')"
          @blur="validateField('city')"
        />

        <KField
          id="move-date"
          v-model="form.date"
          label="Inflyttningsdatum"
          name="date"
          type="date"
          :min="minimumMoveDate"
          required
          :error="fieldErrors.date"
          @change="validateField('date')"
          @blur="validateField('date')"
        />

        <div class="form-field">
          <label for="move-contract">Avtal</label>

          <select
            id="move-contract"
            v-model="form.contract"
            name="contract"
            required
            :aria-invalid="fieldErrors.contract ? 'true' : undefined"
            :aria-describedby="
              fieldErrors.contract ? 'move-contract-error' : undefined
            "
            @change="validateField('contract')"
            @blur="validateField('contract')"
          >
            <option disabled value="">Välj avtal</option>
            <option>Rörligt pris</option>
            <option>Fast pris 1 år</option>
            <option>Fast pris 3 år</option>
          </select>

          <p
            v-if="fieldErrors.contract"
            id="move-contract-error"
            class="error-message"
          >
            {{ fieldErrors.contract }}
          </p>
        </div>

        <p v-if="submitError" class="error-message" role="alert">
          {{ submitError }}
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
import { computed, reactive, ref } from "vue";
import KButton from "../components/KButton.vue";
import KField from "../components/KField.vue";
import { submitMove } from "../services/api";

const form = reactive({
  address: "",
  zip: "",
  city: "",
  date: "",
  contract: "",
});

const fieldErrors = reactive({
  address: "",
  zip: "",
  city: "",
  date: "",
  contract: "",
});

const reference = ref(null);
const submitError = ref("");
const submitting = ref(false);

// Flyttdatumet måste vara minst 14 dagar framåt.
const minimumMoveDate = computed(() => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + 14);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
});

function validateField(field) {
  switch (field) {
    case "address": {
      const address = form.address.trim();

      if (!address) {
        fieldErrors.address = "Fyll i din nya adress.";
      } else if (address.length < 4) {
        fieldErrors.address = "Adressen måste innehålla minst 4 tecken.";
      } else {
        fieldErrors.address = "";
      }
      break;
    }

    case "zip": {
      if (!form.zip) {
        fieldErrors.zip = "Fyll i ditt postnummer.";
      } else if (!/^\d{5}$/.test(form.zip)) {
        fieldErrors.zip = "Postnumret ska innehålla exakt 5 siffror.";
      } else {
        fieldErrors.zip = "";
      }
      break;
    }

    case "city": {
      const city = form.city.trim();

      if (!city) {
        fieldErrors.city = "Fyll i din ort.";
      } else if (city.length < 4) {
        fieldErrors.city = "Orten måste innehålla minst 4 tecken.";
      } else {
        fieldErrors.city = "";
      }
      break;
    }

    case "date": {
      if (!form.date) {
        fieldErrors.date = "Välj ett inflyttningsdatum.";
      } else if (form.date < minimumMoveDate.value) {
        fieldErrors.date =
          "Inflyttningsdatumet måste vara minst 14 dagar framåt.";
      } else {
        fieldErrors.date = "";
      }
      break;
    }

    case "contract": {
      if (!form.contract) {
        fieldErrors.contract = "Välj ett avtal.";
      } else {
        fieldErrors.contract = "";
      }
      break;
    }
  }

  return !fieldErrors[field];
}

function onZipInput(event) {
  // Tillåt bara siffror och högst fem tecken.
  const digits = event.target.value.replace(/\D/g, "").slice(0, 5);

  form.zip = digits;
  event.target.value = digits;

  validateField("zip");
}

function validateForm() {
  const fields = ["address", "zip", "city", "date", "contract"];
  return fields.map(validateField).every(Boolean);
}

async function submit() {
  submitError.value = "";
  reference.value = null;

  if (!validateForm()) {
    submitError.value =
      "Kontrollera fälten ovan och rätta de uppgifter som saknas.";
    return;
  }

  submitting.value = true;

  try {
    const res = await submitMove({
      ...form,
      address: form.address.trim(),
      city: form.city.trim(),
      zip: form.zip,
    });

    reference.value = res.ref;
  } catch {
    submitError.value = "Flyttanmälan kunde inte skickas. Försök igen senare.";
  } finally {
    submitting.value = false;
  }
}
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

.move-card :deep(.k-field) {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.move-card :deep(.k-field__label),
.form-field label {
  color: #344054;
  font-size: 14px;
  font-weight: 600;
}

.move-card :deep(.k-field__input),
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

.move-card :deep(.k-field__input:focus-visible),
.form-field select:focus-visible {
  outline: 3px solid #243b9b;
  outline-offset: 2px;
}

.move-card :deep(.k-field__input[aria-invalid="true"]),
.form-field select[aria-invalid="true"] {
  border-color: #b42318;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.error-message {
  margin: 6px 0 10px;
  color: #b42318;
  font-size: 14px;
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
