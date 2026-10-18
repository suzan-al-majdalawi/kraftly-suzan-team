<template>
  <div class="login-wrap">
    <div class="card login-card">
      <img src="../assets/logo-dark.svg" class="login-logo" alt="Kraftly" />
      <h1>Logga in på Mina sidor</h1>

      <p v-if="loading">Loggar in...</p>

      <form @submit.prevent="handleLogin">
        <label for="email">E-postadress</label>
        <input
          id="email"
          v-model.trim="email"
          type="email"
          autocomplete="username"
          placeholder="E-postadress"
          required
        />

        <label for="password">Lösenord</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          placeholder="Lösenord"
          required
        />

        <p v-if="error" role="alert" class="error">
          {{ error }}
        </p>

        <button
          class="btn"
          style="width: 100%"
          type="submit"
          :disabled="loading"
        >
          {{ loading ? "Loggar in..." : "Logga in" }}
        </button>
      </form>

      <p class="hint" style="margin-top: 10px">
        Problem att logga in? Ring kundservice 020-123 456
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../services/api";

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
    await login(email.value, password.value);
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
  padding: 60px 0;
  background: linear-gradient(180deg, #f5f7fa 0%, #e4e9f2 100%);
  border-top: 1px solid #e4e9f2;
}

.login-card {
  width: 380px;
  max-width: 100%;
}

.login-logo {
  height: 34px;
  margin-bottom: 18px;
}

.error {
  color: #b42318;
  margin: 12px 0;
}
</style>
