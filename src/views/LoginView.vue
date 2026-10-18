<template>
  <div class="login-wrap">
    <div class="card login-card">
      <img src="../assets/logo-dark.svg" class="login-logo" />
      <h1>Logga in på Mina sidor</h1>
      <input v-model="email" type="text" placeholder="E-postadress" />
      <input v-model="password" type="password" placeholder="Lösenord" />
      <button
        class="btn"
        style="width: 100%"
        :disabled="isLoading"
        @click="handleLogin"
      >
        {{ isLoading ? "Loggar in..." : "Logga in" }}
      </button>
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
const errorMessage = ref("");
const isLoading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    await login(email.value, password.value);
    await router.push("/");
  } catch {
    errorMessage.value =
      "Inloggningen misslyckades. Kontrollera dina uppgifter.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-wrap {
  display: flex;
  justify-content: center;
  padding-top: 60px;
  background: linear-gradient(180deg, #f5f7fa 0%, #e4e9f2 100%);
  padding-bottom: 60px;
  border-top: 1px solid #e4e9f2;
}
.login-card {
  width: 380px;
}
.login-logo {
  height: 34px;
  margin-bottom: 18px;
}
</style>
