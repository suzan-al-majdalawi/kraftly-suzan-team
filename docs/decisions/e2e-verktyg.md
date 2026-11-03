# Beslut: verktyg för E2E-tester

**Datum:** 2026-08-28, 2026-08-31, 2026-09-01  
**Senast uppdaterad:** 2026-10-30  
**Beslut:** Vi använder **Playwright** för end-to-end-tester.

## Bakgrund

Vi behövde välja ett E2E-verktyg för att kunna skriva ett smoke-test som kan köras i CI i M2. Vi ville också ha möjlighet att testa användarflöden och mocka API-anrop vid behov.

## Alternativ vi jämförde

Vi jämförde **Cypress** och **Playwright** utifrån våra egna observationer från workshopen.

| Område                     | Cypress                     | Playwright                          |
| -------------------------- | --------------------------- | ----------------------------------- |
| Tid till första gröna test | 953 ms                      | 1,7 s                               |
| Hitta element              | `cy.get()`, `cy.contains()` | `getByRole()`, `getByPlaceholder()` |
| Mockning                   | `cy.intercept()`            | `page.route()`                      |
| Väntan/flakiness           | Behöver ibland `cy.wait()`  | `expect` väntar automatiskt         |
| Headless i CI              | Ja                          | Ja                                  |
| Felmeddelanden             | Tydliga                     | Tydliga och lätta att följa         |

## Motivering

Vi väljer Playwright eftersom testkoden är tydlig och det är enkelt att se var ett test misslyckas. Vi tycker också att element-sökningen med exempelvis `getByRole()` gör testerna lätta att förstå. Playwright passar vårt behov av ett smoke-test som kan köras headless i CI.

## Konsekvenser

Vi ger upp möjligheten att använda Cypress, som teamet redan har erfarenhet av. Playwright är något långsammare i vårt första test, men skillnaden är liten. Om vi vill byta verktyg senare behöver vi skriva om våra E2E-tester och uppdatera CI-konfigurationen.

## Smoke-test

Våra Playwright-tester finns i mappen:

`e2e/`

Smoke-testet finns i:

`e2e/smoke.spec.js`

Det kan köras med:

```powershell
npm run e2e:pw
```

### Vad testerna kontrollerar

Vi har nu fem aktiva Playwright-tester som kontrollerar:

- Att kunden kan logga in och se sin översikt.
- Att fel lösenord inte ger tillgång till systemet.
- Att ingen autentiseringstoken sparas i `localStorage` vid misslyckad inloggning.
- Att en användare som inte är inloggad skickas till `/login`.
- Att användaren skickas tillbaka till den skyddade sidan `/fakturor` efter lyckad inloggning och kan se rätt faktura.

## Vad vi åtgärdade den 30 oktober 2026

Vi felsökte och förbättrade inloggningsflödet och Playwright-testerna. Det största problemet var att användaren inte kom tillbaka till den sida som användaren försökte öppna innan inloggningen.

### 1. Uppdatering av `src/router/index.js`

Tidigare skickades användaren direkt till `/login` om användaren försökte öppna en skyddad sida utan att vara inloggad.

Den tidigare koden var:

```js
if (to.meta.requiresAuth && !authenticated) {
  return "/login";
}

if (to.meta.guestOnly && authenticated) {
  return "/";
}
```

Problemet var att routern inte sparade vilken sida användaren försökte besöka. Efter inloggning skickades användaren därför alltid till startsidan `/` i stället för till den ursprungliga sidan.

Vi uppdaterade därför `src/router/index.js` med följande kod:

```js
if (to.meta.requiresAuth && !authenticated) {
  return {
    path: "/login",
    query: { redirect: to.fullPath },
  };
}

if (to.meta.guestOnly && authenticated) {
  const redirect = to.query.redirect;

  if (
    typeof redirect === "string" &&
    redirect.startsWith("/") &&
    !redirect.startsWith("//")
  ) {
    return redirect;
  }

  return "/";
}
```

Den nya lösningen innebär att:

- Användaren skickas till `/login` när användaren försöker öppna en skyddad sida utan att vara inloggad.
- Den ursprungliga adressen sparas i query-parametern `redirect`.
- Efter lyckad inloggning kan användaren skickas tillbaka till rätt sida, exempelvis `/fakturor`.
- Redirect-värdet kontrolleras så att användaren bara skickas till en intern sökväg och inte till en extern adress.
- Om ingen giltig redirect finns skickas användaren till startsidan `/`.

Vi behöll övriga delar av routern, inklusive routes för `/login`, `/`, `/fakturor`, `/flytt` och `/profil`.

### 2. Uppdatering av `LoginView.vue`

Vi uppdaterade även inloggningskomponenten `LoginView.vue` så att den kan läsa redirect-värdet från routern.

Efter lyckad inloggning kontrolleras om det finns en giltig redirect i URL:en. Om det finns en sådan skickas användaren tillbaka till den ursprungliga sidan med `router.replace()`. Om ingen giltig redirect finns skickas användaren till startsidan `/`.

Detta gör att inloggningsflödet fungerar tillsammans med den uppdaterade router-guarden.

### 3. Korrigering av Playwright-testet

Vi korrigerade sökningen efter fakturan `F-2026-06` i `e2e/smoke.spec.js`.

Tidigare använde vi rollen `cell`, men fakturan ligger i en tabellrad med rollen `rowheader`. Därför ändrade vi testet till:

```js
await expect(
  page.getByRole("rowheader", {
    name: "F-2026-06",
    exact: true,
  }),
).toBeVisible();
```

Efter ändringen hittar Playwright fakturan med rätt tillgänglighetsroll.

### 4. Stabilare tester

Vi tog bort onödiga extra klick och fasta väntetider (`waitForTimeout`). I stället använder vi Playwrights automatiska väntan med `expect`.

Det gör testerna tydligare och minskar risken för instabila tester.

### Resultat av ändringarna

Efter ändringarna fungerar redirect-flödet som förväntat. En användare kan försöka öppna en skyddad sida, logga in och sedan komma tillbaka till rätt sida.

Alla fem Playwright-tester passerar.

## Aktuell teststatus – Playwright

<badge color="success">5 passed</badge>

Senaste körningen av:

```powershell
npm run e2e:pw
```

Resultat:

```text
5 passed
0 failed
```

Alla fem aktiva Playwright-tester passerar.

## Tillgänglighetstest med Vitest

Vi har även arbetat med ett tillgänglighetstest för inloggningssidan `LoginView.vue`.

Testfil:

`src/a11y/LoginView.a11y.test.js`

Testet kontrollerar:

- Att inloggningssidan inte har några identifierade tillgänglighetsproblem med axe.
- Att fälten för e-postadress och lösenord är kopplade till synliga etiketter.

Testet körs med:

```powershell
npx vitest run src/a11y/LoginView.a11y.test.js
```

**Resultat:** Testet passerar. Båda kontrollerna är gröna.

## Skillnaden mellan E2E-test och komponenttest

Vi använder två olika typer av tester:

- **Playwright:** Testar hela användarflöden i webbläsaren, till exempel inloggning och navigering.
- **Vitest:** Testar komponenter och tillgänglighet, till exempel `LoginView.vue`.

Dessa tester kompletterar varandra. Playwright kontrollerar att användarflöden fungerar medan Vitest kontrollerar komponenternas funktion och tillgänglighet.

## Slutsats

Vi fortsätter att använda Playwright som verktyg för E2E-tester. Den 30 oktober 2026 åtgärdade vi redirect-problemet efter inloggning genom att uppdatera `src/router/index.js` och `LoginView.vue`. Vi korrigerade även fakturalokaliseringen i Playwright-testet och förbättrade testernas stabilitet.

Resultatet är att alla fem Playwright-tester nu passerar. Vi har även ett godkänt tillgänglighetstest för `LoginView.vue` med Vitest och axe.
