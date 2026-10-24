<template>
  <main class="profile-view">
    <h1>Mina uppgifter</h1>

    <section v-if="store.user" class="card profile-card">
      <div class="field customer-field">
        <span class="field-label">Kundnummer</span>
        <span>{{ store.user.customerNo }}</span>
      </div>

      <form @submit.prevent="save">
        <div class="field-group">
          <label for="profile-name">Namn</label>
          <input
            id="profile-name"
            v-model.trim="name"
            name="name"
            type="text"
            autocomplete="name"
            required
          />
        </div>

        <div class="field-group">
          <label for="profile-email">E-postadress</label>
          <input
            id="profile-email"
            v-model.trim="email"
            name="email"
            type="email"
            autocomplete="email"
            required
          />
        </div>

        <div class="field-group">
          <label for="profile-address">Adress</label>
          <input
            id="profile-address"
            v-model.trim="address"
            name="address"
            type="text"
            autocomplete="street-address"
            required
          />
        </div>

        <p v-if="message" role="status" class="success-message">
          {{ message }}
        </p>

        <div class="actions">
          <KButton variant="success" type="submit"> Spara ändringar </KButton>

          <KButton variant="secondary" type="button" @click="reset">
            Ångra
          </KButton>
        </div>
      </form>
    </section>

    <p v-else role="status" aria-live="polite">Laddar uppgifter…</p>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import KButton from "../components/KButton.vue";
import { useUserStore } from "../stores/user";

const store = useUserStore();

const name = ref("");
const email = ref("");
const address = ref("");
const message = ref("");

const reset = () => {
  if (!store.user) return;

  name.value = store.user.name ?? "";
  email.value = store.user.email ?? "";
  address.value = store.user.address ?? "";
  message.value = "";
};

const save = async () => {
  message.value = "";

  try {
    await store.save({
      name: name.value,
      email: email.value,
      address: address.value,
    });

    message.value = "Ändringarna har sparats.";
  } catch (error) {
    console.error("Kunde inte spara uppgifterna:", error);
    message.value = "Det gick inte att spara ändringarna. Försök igen.";
  }
};

onMounted(async () => {
  if (!store.user) {
    await store.load();
  }

  reset();
});
</script>

<style scoped>
.profile-card {
  max-width: 560px;
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

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.field-group label {
  color: #344054;
  font-weight: 600;
}

.field-group input {
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

.field-group input:focus-visible {
  outline: 3px solid #243b9b;
  outline-offset: 2px;
  border-color: #243b9b;
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
  .actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
