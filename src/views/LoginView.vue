<template>
  <div class="login-wrap">
    <div class="card login-card">
      <img src="../assets/logo-dark.svg" class="login-logo" alt="Kraftly" />

      <h1>Logga in på Mina sidor</h1>

      <p v-if="loading" role="status" aria-live="polite">Loggar in...</p>

      <form @submit.prevent="handleLogin">
        <KField
          id="email"
          v-model="email"
          label="E-postadress"
          type="email"
          name="email"
          autocomplete="username"
          placeholder="E-postadress"
          required
          :error="error"
        />

        <KField
          id="password"
          v-model="password"
          label="Lösenord"
          type="password"
          name="password"
          autocomplete="current-password"
          placeholder="Lösenord"
          required
        />

        <p v-if="error" id="login-error" role="alert" class="error">
          {{ error }}
        </p>

        <KButton
          variant="primary"
          type="submit"
          :disabled="loading"
          class="login-button"
        >
          {{ loading ? "Loggar in..." : "Logga in" }}
        </KButton>
      </form>

      <p class="hint">Problem att logga in? Ring kundservice 020-123 456</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../services/api";
import KButton from "../components/KButton.vue";
import KField from "../components/KField.vue";

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  if (loading.value) return;

  error.value = "";
  loading.value = true;

  try {
    await login(email.value.trim(), password.value);
    await router.push("/");
  } catch (e) {
    console.error("Login failed:", e);

    error.value = e.message?.startsWith("API error")
      ? "Kunde inte kontakta inloggningstjänsten."
      : e.message ||
        "Inloggningen misslyckades. Kontrollera e-postadress och lösenord.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-wrap {
  display: flex;
  justify-content: center;
  padding: 60px 16px;
  background: linear-gradient(180deg, #f5f7fa 0%, #e4e9f2 100%);
  border-top: 1px solid #e4e9f2;
}

.login-card {
  width: 380px;
  max-width: 100%;
}

.login-logo {
  height: 34px;
  max-width: 100%;
  margin-bottom: 18px;
}

.login-card :deep(.k-field) {
  margin-top: 16px;
}

.login-card :deep(.k-field__label) {
  display: block;
  margin: 0 0 6px;
  color: #1f2937;
  font-weight: 600;
}

.login-card :deep(.k-field__input) {
  display: block;
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

.login-card :deep(.k-field__input:focus-visible) {
  outline: 3px solid #243b9b;
  outline-offset: 2px;
  border-color: #243b9b;
}

.login-button {
  width: 100%;
  margin-top: 18px;
}

.error {
  color: #b42318;
  margin: 12px 0;
  font-weight: 600;
}

.hint {
  margin-top: 16px;
  color: #344054;
  line-height: 1.5;
}

@media (prefers-reduced-motion: reduce) {
  .login-card * {
    scroll-behavior: auto;
  }
}
</style>
