import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// NYTT: Hämtar auth-store för att kunna återställa användarens inloggning.
import { useAuthStore } from "./stores/auth";

import "./assets/styles.css";

const app = createApp(App);

// NYTT: Skapar Pinia separat så att vi kan använda samma instans
// när vi hämtar auth-store längre ner.
const pinia = createPinia();

app.use(pinia);
app.use(router);

// NYTT: Hämtar auth-store med samma Pinia-instans som appen använder.
const auth = useAuthStore(pinia);

// NYTT: Kontrollerar om användaren fortfarande har en giltig session.
// Om det finns en refresh-token-cookie kan servern utfärda en ny access-token.
// Appen monteras först när kontrollen är klar, så att användaren inte
// visas som utloggad medan inloggningen återställs.
auth.restore().finally(() => {
  app.mount("#app");
});
