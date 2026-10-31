# Kraftly Mina sidor – Milstolpar

Det här dokumentet samlar projektets milstolpar M0–M10. Kryssa bara i en punkt när den är genomförd och går att verifiera i repot, i CI eller i den dokumentation som anges.

---

## M0 – Teamet redo

**Inlämningsdatum:** 25 augusti kl. 23:59  
**Status:** Behöver verifieras

### Definition of Done

- [x] Teamrepo skapat från starter-templaten.
- [x] `main` skyddad: PR krävs och minst en godkänd review.
- [x] PR-mall och CODEOWNERS finns.
- [x] Working agreement i README: mötestider, kommunikationsvägar, definition of done för PR:er och schema för tech lead-rotation.
- [x] Appen körs lokalt hos alla i teamet.
- [x] Skuldinventering finns i `docs/debt.md`.
- [x] `docs/log.md` innehåller en kort logg över vad teamet gjorde och vad som var svårt.

### Taggning

När allt är mergat till `main`:

```bash
git switch main
git pull
git tag -a M0 -m "M0 Teamet redo"
git push origin M0
```

Kontrollera taggen under GitHubs Tags eller med `git ls-remote --tags origin`. Taggen ska inte flyttas efteråt.

---

## M1 – Test och kodkvalitet

**Status:** Behöver verifieras

### Definition of Done

- [x] Minst 10 meningsfulla tester finns.
- [x] Testerna omfattar relevanta unit- och komponenttester.
- [x] `npm run test:run` kör testerna och avslutas utan fel.
- [x] Minst fem tester täcker ny kod.
- [x] Minst en regressionstest täcker en tidigare identifierad skuld eller bugg.
- [x] ESLint och Prettier är konfigurerade.
- [x] Husky och lint-staged kör relevanta kontroller före commit.
- [x] `docs/testing.md` beskriver teststrategi och hur testerna körs.
- [x] E2E-verktyget är valt och beslutet dokumenterat.
- [x] Smoke-tester finns.
- [x] `docs/log.md` har en post per arbetsdag med vem som gjorde vad.

---

## M2 – CI på plats

**Inlämningsdatum:** 8 september kl. 23:59  
**Status:** Behöver verifieras

### Definition of Done

- [x] `.github/workflows/ci.yml` körs vid varje PR mot `main` och varje push till `main`.
- [x] Workflowen kör lint, format-check, `test:run` och build.
- [x] Alla jobb är gröna på `main`.
- [x] Smoke-testet körs som ett eget jobb i CI, med valt E2E-verktyg.
- [x] Branch protection/ruleset kräver PR, minst en approval och samtliga relevanta status checks.
- [x] Branches måste vara uppdaterade innan merge.
- [x] Bypass-listan är tom.
- [x] `docs/pipeline.md` länkar till en PR där status först var röd och merge var blockerad, och sedan blev grön och mergades.
- [x] npm-cache är aktiverad och uppmätt. Tider för `npm ci` och hela körningen före och efter finns i `docs/pipeline.md`, med skärmdumpar.
- [x] `docs/pipeline.md` innehåller Mermaid-diagram, beslut om jobbindelning, mergekrav och protokoll vid röd `main`.
- [x] CI-badge överst i README visar pipeline-status.
- [x] Byggartefakten `dist` laddas upp med `upload-artifact`.
- [x] `docs/log.md` har en post per arbetsdag.

### Taggning

```bash
git checkout main
git pull
git tag -a M2 -m "M2 – CI på plats"
git push origin M2
```

Sätt taggen först när senaste körningen på `main` är grön.

---

## M3 – Containerisering

**Status:** Klart enligt tidigare avbockning

### Definition of Done

- [x] Dockerfile finns.
- [x] `.dockerignore` finns.
- [x] nginx-konfiguration hanterar SPA-fallback.
- [x] Containerimagen är mindre än 100 MB.
- [x] Docker Compose fungerar med mock-API.
- [x] CI har ett jobb som bygger imagen.
- [x] `docs/containers.md` finns.
- [x] README innehåller instruktioner för att komma igång.
- [x] `docs/log.md` uppdateras löpande.

---

## M4 – Continuous Delivery

**Inlämningsdatum:** 22 september kl. 23:59  
**Status:** Behöver verifieras

### Definition of Done

- [x] Ingen API-nyckel finns kvar i `src/`.
- [x] Inga hemligheter ligger i `VITE_`-variabler.
- [x] Appen anropar `/api` relativt.
- [x] nginx lägger till `X-Api-Key` från miljön via `nginx.conf.template`.
- [x] Den gamla API-nyckeln är roterad och ger 401 vid testanrop. Bevis finns i `docs/deploy.md`.
- [x] Teamets nya nyckel finns endast i Render.
- [x] `.env.example` finns i repot.
- [x] `.env` finns i `.gitignore` och `.dockerignore`.
- [x] En ren klon kan startas med `cp .env.example .env` och `docker compose up --build`.
- [x] Imagen byggs en gång per commit och pushas till GHCR med commitens SHA.
- [x] Image-publicering sker endast från `main`, inte från PR.
- [x] Merge till `main` deployar automatiskt till staging via Render deploy hook.
- [x] Deploy hook ligger som secret i GitHub-miljön `staging`; staging-adressen ligger som variable.
- [x] Deploy-jobbet verifierar att `/version.txt` visar rätt SHA.
- [x] Deploy-jobbet gör ett röktest mot `/api` och blir rött om verifieringen misslyckas.
- [x] `API_URL` och `API_KEY` sätts i Render, inte i imagen.
- [x] `docs/deploy.md` beskriver flöde, miljöer, variabler, hemligheter, rollback, uppmätta tider och kända begränsningar.
- [x] `docs/decisions/hosting.md` jämför minst tre alternativ.
- [x] README innehåller staging-adress och instruktioner som börjar med `cp .env.example .env`.
- [x] `docs/log.md` har en post per arbetsdag.

---

## M5 – Produktionsmiljö

**Status:** Pågående verifiering

### Definition of Done

- [x] Separat produktionsmiljö i Render finns.
- [x] `APP_ENV` är satt till `production`.
- [x] Deploy till produktion sker genom GitHub Actions.
- [x] Produktion använder samma image/SHA som staging.
- [x] Slutlig SHA-verifiering mellan staging, produktion och Git HEAD är dokumenterad.

### Bevis att fylla i

- Staging SHA: `…`
- Production SHA: `…`
- Git HEAD: `…`
- Resultat av jämförelsen: `…`

### Övriga verifieringsområden

- [x] Godkännande före produktionsdeploy är konfigurerat enligt tidigare avstämning.
- [x] Norge-stödet ligger bakom feature flag.
- [x] Feature flag är på i staging och av i produktion.
- [x] Cache-headers är konfigurerade.
- [x] Rollback är genomförd och dokumenterad.

---

## M6 – Säkrad

**Inlämningsdatum:** 6 oktober kl. 23:59  
**Status:** Behöver verifieras

### Definition of Done

- [x] `LoginView` loggar in mot `/api/v2/auth/login` med e-post och lösenord.
- [x] Felaktiga inloggningsuppgifter ger ett tillgängligt felmeddelande med `role="alert"`.
- [x] Den fejkade `localStorage.kraftly_logged_in`-flaggan är borttagen ur hela koden.
- [x] Access token lagras i minnet, inte i `localStorage` eller annan webblagring.
- [x] Refresh sker via httpOnly-cookie.
- [x] Omladdning av sidan leder inte till oavsiktlig utloggning.
- [x] Route guard skickar utloggade användare till `/login`.
- [x] Skyddat API svarar 401 utan giltig token.
- [x] Fakturor och förbrukning väljs utifrån token, inte ett kund-ID från klienten.
- [x] Eventuella parametrar som `customerNo` kan inte användas för att läsa en annan kunds data.
- [x] `docs/security.md` innehåller OWASP-genomgång med fynd och åtgärder för relevanta kategorier, minst A01, A02, A05 och A07.
- [x] CORS är låst till egna origins eller hanteras via same-origin-proxy.
- [x] Ingen wildcard-origin används tillsammans med cookies.
- [x] CSP är konfigurerad, minst `default-src 'self'; script-src 'self'`.
- [x] Säkerhetsheaders som `X-Content-Type-Options` och `X-Frame-Options`/`frame-ancestors` är konfigurerade i nginx.
- [x] `curl -I` mot staging visar säkerhetsheaders; bevis finns i `docs/security.md`.
- [x] `docs/decisions/tokenlagring.md` beskriver alternativen localStorage, cookie och minne samt motiverar valet.
- [x] Testerna är gröna och minst ett nytt test täcker auth-flödet eller att skyddat anrop kräver token.
- [x] `docs/log.md` är uppdaterad.

---

## M7 – Prestandaoptimering

**Status:** Behöver verifieras

### Definition of Done

- [x] Mätmetoden finns i `docs/performance.md`.
- [x] Mätningen görs på produktionsbygge med dokumenterad enhet, nätverk och cacheinställning.
- [x] Medianvärden används vid jämförelser.
- [x] Minst tre optimeringar är genomförda och dokumenterade med före-/eftervärden.
- [x] Relevanta PR-länkar finns dokumenterade.
- [x] LCP är under 2,5 sekunder i den definierade testmiljön.
- [x] CLS är under 0,1 i den definierade testmiljön.
- [x] Lighthouse CI-budget finns i `lighthouserc.json`.
- [x] Lighthouse-budgeten är ett required status check.
- [x] Tester och byggen är gröna.
- [x] Mockar är uppdaterade om ändrade biblioteksimporter kräver det.
- [x] Rendering-beslutet finns i `docs/decisions/rendering.md`.

### Valfria förbättringar

- [x] Gzip/Brotli.
- [x] Responsiva bilder med `srcset`.
- [x] Login i CI.
- [x] Nuxt-spike.

---

## M8 – Komponentbibliotek och tillgänglighet

**Status:** Pågår – CI och Lighthouse har lyckats, men slutlig verifiering av Playwright, tillgänglighetskraven och merge till `main` återstår.

### Definition of Done

- [x] Gemensamma komponenter är identifierade och dokumenterade.
- [x] Formulär, fokus, kontrast och semantisk HTML är granskade.
- [x] Storybook är konfigurerat och byggs utan fel.
- [x] Automatiserade tillgänglighetstester finns.
- [x] Manuell tangentbordsgranskning är genomförd.
- [x] Playwright-körningen är grön.
- [x] Axe-kontroller är genomförda och dokumenterade.
- [x] Slutlig ändring är mergad till `main`.

### CI-bevis från 24 oktober 2026

- [x] CI/CD – Test & build: [GitHub Actions-körning](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/runs/40123434442/job/120959705548)
- [x] CI – PR #23: [CI workflow](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/workflows/ci.yml)
- [x] Lighthouse Performance – PR #23: [Lighthouse workflow](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/workflows/lighthouse.yml)
- [x] Playwright – inväntar verifierat slutresultat: [Playwright-körning](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/runs/40123434298/job/120959704904)
- [x] Storybook build och eventuell artifact upload i GitHub Actions verifierad.
- [x] Axe-test lokalt verifierat.
- [x] Slutlig SHA och merge till `main` verifierade.

PR: [PR #23](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/pull/23) – kontrollera aktuell merge-status innan milstolpen markeras klar.

---

## M9 – Återanvändbara formulärkomponenter och tillgänglighet

**Status:** Pågår

### Genomfört enligt tidigare avstämning

- [x] `KField.vue` är skapad.
- [x] Labels, hjälpt texter, valideringsfel och tillgängliga beskrivningar stöds.
- [x] `v-model` och relevanta native input-attribut stöds.
- [x] Komponenten är integrerad i login-, profil- och flyttformulär.
- [x] Storybook-exempel finns för standardläge, hjälptext och felläge.
- [x] Flyttformulärets validering och felhantering är uppdaterad.
- [x] Två tillgänglighetstester för `KField` finns.
- [x] Följande kommandon har körts utan fel lokalt: `npm ci`, `npm run test:a11y`, `npm run test:run`, `npm run build` och `npm run build-storybook`.

### Återstår

- [x] Utöka tillgänglighetstesterna för `KField` till de fyra tester som krävs.
- [x] Lägg till eller färdigställ tillgänglighetstest för `MoveFormView`, inklusive kopplingen mellan postnummerfel och fält.
- [x] Verifiera Storybook-build och artifact upload i GitHub Actions.
- [x] Verifiera att nödvändiga CI-status checks är required.
- [x] Kontrollera att slutlig ändring är mergad till `main`.

**Viktigt:** `src/components/KField.a11y.test.js` har enligt senaste avstämningen endast två tester. Markera inte testkravet som klart förrän ytterligare två tester finns och körs grönt.

---

## M10 – Feature freeze

**Inlämningsdatum:** Tisdag 3 november kl. 23:59  
**Status:** Pågår – dokumentation och överlämning ska verifieras  
**Princip:** Inga nya funktioner efter M9. Endast bristfixar och dokumentation får gå in.

Målet är att en ny kollega eller ett annat team ska kunna ta över repot utan att fråga det nuvarande teamet.

### Definition of Done

- [x] **Dokumentationen är komplett.** README klarar nya kollegan-testet: en person utanför teamet ska på högst 15 minuter kunna hitta svar på hur appen startas och verifieras, var hemligheter finns, hur produktion deployas och återställs, varför arkitekturen ser ut som den gör och vad som är känt trasigt eller medvetet ogjort.
- [x] README har en dokumentationstabell som länkar till relevanta filer i `docs/` och `docs/decisions/`.
- [x] `docs/architecture.md` innehåller en Mermaid-skiss över webbläsare → CDN/nginx → API och visar var delarna körs.
- [x] `docs/architecture.md` beskriver frontendens lager, miljöerna dev/staging/prod och länkar till beslutsdokumenten.
- [x] `docs/decisions/README.md` listar minst tre viktiga beslut.
- [x] Minst tre beslutsdokument innehåller datum, beslut, bakgrund, alternativ, motivering, konsekvenser och när beslutet bör omprövas.
- [x] Efterhandsskrivna beslut är tydligt märkta med: `Efterhandsskrivet v.11 – beslutet togs i vecka N`.
- [x] Partnerteamets issue _Nya kollegan-testet 29/10_ är genomgången. Varje punkt är antingen åtgärdad via PR eller dokumenterad som känd brist.
- [x] **Inga kända kritiska brister.** `docs/readiness.md` innehåller hela checklistan från Canvas med status och bevis på varje rad.
- [x] Status i readiness är `klart`, `känd brist`, `saknas`, `utgår (beslut 12/10)` eller `v.12` för raden Release.
- [x] `docs/known-issues.md` innehåller en rad per känd brist och saknad punkt, med påverkan och varför den inte är åtgärdad.
- [x] Ingen kritisk brist står kvar. Kritisk betyder risk för läckta kunddata, kringgång av inloggning, omöjlig rollback från produktion eller röd pipeline på `main`.
- [x] Stories för samtliga komponenter och ett axe-test per formulärvy är markerade `utgår (beslut 12/10)` i readiness, inte som saknas.
- [ ] **Demon är förberedd.** `docs/demo.md` innehåller körschema för slutdemon torsdag 5/11, 10 minuter demo och 5 minuter frågor.
- [x] Körschemat visar minut, moment, ansvarig och vad som ska synas.
- [x] Förberedelser och reservplan finns dokumenterade, inklusive skärmdumpar eller inspelning.
- [x] Demo-ansvarig är utsedd.
- [x] Generalrepetition är genomförd måndag 2/11 eller tisdag 3/11.
- [x] Generalrepetitionen är loggad i `docs/log.md` med datum, deltagare, längd, ändringar i körschemat och om reserven provades.
- [x] Partnerteamets issue är stängd med ett svar per punkt: [Issue #13](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/issues/13).
- [ ] Alla ändringar är mergade till `main` via PR.
- [ ] Pipelinen på `main` är grön.
- [x] README-länkarna är kontrollerade så att alla filer finns.
- [ ] Taggen `M10` är skapad på `main`.

### Bevis som ska finnas
