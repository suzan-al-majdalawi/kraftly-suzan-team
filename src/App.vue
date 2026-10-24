<template>
  <div>
    <div v-if="appEnv !== 'production'" class="env-banner" role="status">
      {{ appEnv.toUpperCase() }}
    </div>

    <header v-if="$route.path !== '/login'" class="topbar">
      <div class="topbar-inner container">
        <RouterLink to="/" class="logo-link" aria-label="Kraftly – Översikt">
          <img src="./assets/logo.svg" class="logo" alt="Kraftly" />
        </RouterLink>

        <nav class="main-nav" aria-label="Huvudmeny">
          <RouterLink to="/" exact-active-class="router-link-active">
            Översikt
          </RouterLink>
          <RouterLink to="/fakturor">Fakturor</RouterLink>
          <RouterLink to="/flytt">Flyttanmälan</RouterLink>
          <RouterLink to="/profil">Mina uppgifter</RouterLink>

          <button class="logout" type="button" @click="logout">Logga ut</button>
        </nav>
      </div>
    </header>

    <main id="main-content" class="container">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { logout as logoutSession } from "./services/api";

const router = useRouter();

// Sätts av containern vid start.
const appEnv = window.__KRAFTLY__?.env ?? "lokal";

const logout = async () => {
  try {
    // Rensa den riktiga sessionen som routern kontrollerar.
    await logoutSession();

    // Rensa eventuell äldre inloggningsflagga.
    localStorage.removeItem("kraftly_logged_in");

    // Gå direkt till inloggningen.
    await router.replace("/login");
  } catch (error) {
    console.error("Kunde inte logga ut:", error);
  }
};
</script>

<style>
.topbar {
  background: #101d3d;
}

.topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 14px;
  padding-bottom: 14px;
}

.logo-link {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  border-radius: 3px;
}

.logo {
  display: block;
  height: 30px;
  width: auto;
}

.main-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 22px;
}

.topbar nav a,
.logout {
  color: #ffffff;
  text-decoration: none;
  font: inherit;
  font-size: 14.5px;
}

.topbar nav a {
  padding: 8px 0;
}

.logout {
  background: none;
  border: 0;
  padding: 8px 0;
  cursor: pointer;
}

.topbar nav a.router-link-active {
  color: #ffffff;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 5px;
}

.topbar a:focus-visible,
.topbar button:focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 4px;
  border-radius: 3px;
}

.env-banner {
  background: #f5a524;
  color: #101d3d;
  font:
    600 12px/1.4 system-ui,
    sans-serif;
  letter-spacing: 0.08em;
  text-align: center;
  padding: 5px 8px;
}

#main-content {
  min-width: 0;
}

@media (max-width: 800px) {
  .topbar-inner {
    align-items: flex-start;
    flex-direction: column;
  }

  .main-nav {
    width: 100%;
    gap: 8px 16px;
  }
}
</style>
