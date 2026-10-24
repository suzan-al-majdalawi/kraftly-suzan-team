<template>
  <main class="profile-view">
    <h1>Mina uppgifter</h1>

    <section v-if="store.user" class="card profile-card">
      <div class="field customer-field">
        <span class="field-label">Kundnummer</span>
        <span>{{ store.user.customerNo }}</span>
      </div>

      <form novalidate @submit.prevent="save">
        <KField
          id="profile-name"
          v-model="name"
          label="Namn"
          name="name"
          type="text"
          autocomplete="name"
          required
          :error="fieldErrors.name"
          @input="validateName"
          @blur="validateName"
        />

        <KField
          id="profile-email"
          v-model="email"
          label="E-postadress"
          name="email"
          type="email"
          autocomplete="email"
          required
          :error="fieldErrors.email"
          @input="validateEmail"
          @blur="validateEmail"
        />

        <KField
          id="profile-address"
          v-model="address"
          label="Adress"
          name="address"
          type="text"
          autocomplete="street-address"
          required
          :error="fieldErrors.address"
          @input="validateAddress"
          @blur="validateAddress"
        />

        <p v-if="errorMessage" class="error-message" role="alert">
          {{ errorMessage }}
        </p>

        <p v-if="message" role="status" class="success-message">
          {{ message }}
        </p>

        <div class="actions">
          <KButton variant="success" type="submit" :disabled="saving">
            {{ saving ? "Sparar…" : "Spara ändringar" }}
          </KButton>

          <KButton
            variant="secondary"
            type="button"
            :disabled="saving"
            @click="reset"
          >
            Ångra
          </KButton>
        </div>
      </form>
    </section>

    <p v-else role="status" aria-live="polite">Laddar uppgifter…</p>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import KButton from "../components/KButton.vue";
import KField from "../components/KField.vue";
import { useUserStore } from "../stores/user";

const store = useUserStore();

const name = ref("");
const email = ref("");
const address = ref("");
const message = ref("");
const errorMessage = ref("");
const saving = ref(false);

const fieldErrors = reactive({
  name: "",
  email: "",
  address: "",
});

function validateName() {
  const value = name.value.trim();

  if (!value) {
    fieldErrors.name = "Fyll i ditt för- och efternamn.";
  } else if (value.length < 2) {
    fieldErrors.name = "Namnet måste innehålla minst 2 tecken.";
  } else if (!/\s/.test(value)) {
    fieldErrors.name = "Skriv både förnamn och efternamn.";
  } else if (value.split(/\s+/).some((part) => part.length < 2)) {
    fieldErrors.name =
      "Förnamn och efternamn måste innehålla minst 2 tecken vardera.";
  } else {
    fieldErrors.name = "";
  }

  return !fieldErrors.name;
}

function validateEmail() {
  const value = email.value.trim();

  if (!value) {
    fieldErrors.email = "Fyll i din e-postadress.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    fieldErrors.email = "Ange en giltig e-postadress.";
  } else {
    fieldErrors.email = "";
  }

  return !fieldErrors.email;
}

function validateAddress() {
  const value = address.value.trim();

  if (!value) {
    fieldErrors.address = "Fyll i din adress.";
  } else if (value.length < 4) {
    fieldErrors.address = "Adressen måste innehålla minst 4 tecken.";
  } else {
    fieldErrors.address = "";
  }

  return !fieldErrors.address;
}

function validateForm() {
  return [validateName(), validateEmail(), validateAddress()].every(Boolean);
}

function reset() {
  if (!store.user) return;

  name.value = store.user.name ?? "";
  email.value = store.user.email ?? "";
  address.value = store.user.address ?? "";

  fieldErrors.name = "";
  fieldErrors.email = "";
  fieldErrors.address = "";
  message.value = "";
  errorMessage.value = "";
}

async function save() {
  message.value = "";
  errorMessage.value = "";

  if (!validateForm()) {
    errorMessage.value = "Kontrollera fälten och rätta uppgifterna.";
    return;
  }

  saving.value = true;

  try {
    await store.save({
      name: name.value.trim(),
      email: email.value.trim(),
      address: address.value.trim(),
    });

    // Visa sparade uppgifter från store om den uppdaterats.
    if (store.user) {
      name.value = store.user.name ?? name.value.trim();
      email.value = store.user.email ?? email.value.trim();
      address.value = store.user.address ?? address.value.trim();
    }

    message.value = "Ändringarna har sparats.";
  } catch (error) {
    console.error("Kunde inte spara uppgifterna:", error);
    errorMessage.value =
      "Det gick inte att spara ändringarna. Kontrollera anslutningen och försök igen.";
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  try {
    if (!store.user) {
      await store.load();
    }

    reset();
  } catch (error) {
    console.error("Kunde inte ladda uppgifterna:", error);
    errorMessage.value = "Kunde inte ladda dina uppgifter. Försök igen.";
  }
});
</script>

<style scoped>
.profile-card {
  width: 100%;
  max-width: 560px;
  box-sizing: border-box;
}

.field {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 0 14px;
  font-size: 14px;
}

.field-label {
  color: #344054;
  font-weight: 600;
}

.profile-card :deep(.k-field) {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.profile-card :deep(.k-field__label) {
  color: #344054;
  font-weight: 600;
}

.profile-card :deep(.k-field__input) {
  box-sizing: border-box;
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid #667085;
  border-radius: 6px;
  background: #ffffff;
  color: #1f2937;
  font: inherit;
}

.profile-card :deep(.k-field__input:focus-visible) {
  outline: 3px solid #243b9b;
  outline-offset: 2px;
  border-color: #243b9b;
}

.profile-card :deep(.k-field__input[aria-invalid="true"]) {
  border-color: #b42318;
}

.error-message {
  color: #b42318;
  font-size: 14px;
  line-height: 1.5;
  margin: 10px 0;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.success-message {
  color: #067647;
  font-weight: 600;
}

@media (max-width: 480px) {
  .profile-card {
    padding: 16px;
  }

  .actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
