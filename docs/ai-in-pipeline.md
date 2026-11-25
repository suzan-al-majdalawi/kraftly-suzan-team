# AI-granskning i CI

## Syfte

AI-granskningen är ett extra stöd vid granskning av pull requests i Kraftly Mina sidor. Den granskar ändringar under `src/` och föreslår möjliga problem inom säkerhet, buggar, tillgänglighet och prestanda.

AI-granskningen är ett förslag och ersätter inte mänsklig kodgranskning. Den är inte ett obligatoriskt CI-krav och får inte göra en pull request röd om AI-tjänsten misslyckas.

## Hur det fungerar

Workflowen `.github/workflows/ai-review.yml` skickar en diff till `scripts/ai-review.mjs`. Skriptet skickar diffen till Anthropic API och skriver granskningsresultatet som Markdown. Workflowen publicerar resultatet som en kommentar på pull requesten.

API-nyckeln läses från miljövariabeln `ANTHROPIC_API_KEY`. Nyckeln ska hanteras som en hemlighet och får inte sparas i repot eller visas i loggar.

AI-granskningen kan hoppas över om:

- API-nyckeln saknas.
- Pull requesten inte innehåller ändringar under `src/`.

Om AI-tjänsten misslyckas ska övriga CI-kontroller kunna fortsätta.

## Lokalt test och resultat

Jag testade skriptet lokalt med följande kommando:

```powershell
node scripts/ai-review.mjs diff.patch
```

Miljövariabeln `ANTHROPIC_API_KEY` var inställd, men API-anropet misslyckades med HTTP 401 och meddelandet `invalid x-api-key`.

**Resultat:** Det lokala testet kunde inte genomföras eftersom API-nyckeln inte godkändes. Testet visar att skriptet nådde autentiseringssteget, men bekräftar inte att ett lokalt test med en giltig API-nyckel fungerar.

## Utvärdering av pull requests

Följande pull requests användes för att undersöka AI-granskningen:

| Pull request                                                               | AI-kommentar                                                               | Bedömning             | Motivering                                                                                                                                                                  |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [PR #29](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/pull/29) | Granskningen hoppades över eftersom API-nyckeln saknades.                  | Osäker                | Ingen AI-analys genomfördes.                                                                                                                                                |
| [PR #30](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/pull/30) | Kommentarer om StatusChip, tillgänglighet och fakturastatusar.             | Träffar               | AI:n identifierade konkreta risker i statusvisning och fakturalogik. Efterföljande ändringar gjordes och en senare granskning gav resultatet "Inget att anmärka på".        |
| [PR #31](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/pull/31) | Kommentarer om KAlert, live-regioner, meddelanden och fokus vid stängning. | Träffar               | AI:n identifierade flera relevanta tillgänglighetsproblem. Efterföljande commits behandlade flera av förslagen. En senare granskning gav resultatet "Inget att anmärka på". |
| [PR #32](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/pull/32) | Kommentarer om autentisering, användardata och `fetchMessages`.            | Både träffar och miss | Flera förslag beskrev verkliga risker, men påståendet om `fetchMessages` stämde inte med användningen i applikationskoden.                                                  |

### Vad räknas som en träff eller miss?

- **Träff:** En kommentar som pekar på ett verkligt och relevant problem i koden.
- **Miss:** En kommentar som är felaktig, saknar stöd i koden eller föreslår en onödig ändring.
- **Osäker:** Underlaget räcker inte för att avgöra om kommentaren är korrekt.

AI-förslag kontrolleras mot koden innan de accepteras.

## PR #30 – StatusChip för fakturastatus

AI-granskningen identifierade tre förbättringsområden:

1. `StatusChip.vue`: användningen av `role="status"` på varje chip kunde orsaka onödiga uppläsningar i en fakturatabell.
2. `StatusChip.vue`: den visuella modifieringen skilde inte tydligt mellan obetalda och förfallna fakturor.
3. `invoice.js`: okända eller saknade statusvärden riskerade att klassificeras som förfallna.

**Bedömning: Träffar.**

Förslagen pekade på relevanta risker inom tillgänglighet och fakturalogik. Efter granskningen uppdaterades fakturahanteringen i commit `4c5cf7f` med meddelandet "Update invoice status handling and remove duplicate component".

En senare AI-granskning gav resultatet "Inget att anmärka på". PR #30 mergades till `main` och samtliga 10 checks passerade.

## PR #31 – Tillgänglighet för fakturameddelanden

AI-granskningen identifierade flera möjliga problem:

1. `KAlert.vue`: `role="alert"` användes för alla meddelandetyper, även information och success.
2. Live-regionens innehåll behövde hanteras så att skärmläsare kunde läsa upp uppdateringar på ett tillförlitligt sätt.
3. `InvoicesView.vue`: meddelanden behövde kunna stängas och visas igen på ett korrekt sätt.
4. Fokus behövde återställas när ett meddelande stängdes.
5. `activeInvoiceId` behövde återställas när meddelandet stängdes.
6. `KButton.vue`: fokusfärgen behövde kontrolleras för tillräcklig kontrast mellan bakgrund och text.

**Bedömning: Relevanta träffar.**

Flera efterföljande commits visar att förslagen användes vid förbättringar, bland annat:

- `f73f0fc` – Improve KAlert accessibility and dismissal behavior.
- `299a77a` – Lägg skärmbild och test.
- `3e1cab8` – Address AI review feedback for invoice accessibility.

En senare granskning gav resultatet "Inget att anmärka på". PR #31 mergades till `main` och samtliga 10 checks passerade.

Under PR #31 förekom också körningar där AI-granskningen hoppades över på grund av saknad API-nyckel eller för att inga ändringar fanns under `src/`. Det förekom även ett svar där modellen inte returnerade någon text. Dessa körningar räknas inte som lyckade AI-analyser.

## PR #32 – Utvärdering av AI-granskning: träffar och missar

I PR #32 granskade AI:n flera delar av autentiseringsflödet och hanteringen av användardata. Förslagen jämfördes med koden.

### 1. Race condition vid autentisering

**AI:ns förslag:**

AI:n identifierade att routern och `auth.restore()` kunde starta flera refresh-anrop samtidigt när applikationen startade.

**Bedömning: Träff – accepterad.**

Jag hade själv observerat problemet. Ibland kördes två refresh-anrop samtidigt, där det ena fick HTTP 401 och det andra HTTP 200. Trots att ett anrop lyckades kunde användaren behöva logga in igen efter en sidomladdning.

Förslaget beskrev ett verkligt problem.

**Åtgärd:**

Jag arbetade med att låta samtidiga anrop dela på samma pågående Promise för sessionsåterställning.

### 2. Samtidiga anrop till `restore()`

**AI:ns förslag:**

AI:n påpekade att `restore()` kunde returnera autentiseringsstatus innan det första refresh-anropet hade slutförts. Den föreslog att efterföljande anrop skulle invänta samma Promise.

**Bedömning: Träff – accepterad.**

Detta var relevant eftersom flera delar av applikationen kan behöva återställa sessionen samtidigt. En gemensam Promise gör att anropen väntar på samma resultat.

**Åtgärd:**

Sessionsåterställningen hanterades med en gemensam Promise och kontroller av aktuell session.

### 3. AI:ns påstående om borttagna `fetchMessages`

**AI:ns förslag:**

AI:n påstod att funktionen `fetchMessages` hade tagits bort utan ersättning och att komponenter som importerade funktionen därför kunde sluta fungera.

**Bedömning: Miss – avvisad.**

Jag kontrollerade koden med `git grep` efter `fetchMessages`, `message` och `messages`. Jag hittade inga importer eller användningar av `fetchMessages` i applikationskoden.

AI:n drog därför slutsatsen att funktionen fortfarande behövdes utan att först verifiera om den faktiskt användes.

Detta är ett konkret exempel på en felaktig AI-granskning. Att återinföra en funktion som inte används hade inte varit en nödvändig lösning.

**Åtgärd:**

Jag avvisade förslaget efter att ha kontrollerat kodbasen.

### 4. Osäker hantering av användardata från API:et

**AI:ns förslag:**

AI:n identifierade en risk med att slå ihop API-svaret direkt med användarobjektet. Om svaret innehöll ett nästlat `user`-objekt eller text i stället för ett objekt kunde användardata hanteras felaktigt.

**Bedömning: Träff – accepterad.**

Förslaget beskrev en relevant risk i hanteringen av olika API-svarsformat.

**Åtgärd:**

Jag arbetade med normalisering och kontroll av API-svaret innan användarens data uppdateras i Pinia-storen.

### 5. Oanvänd import av `NorwayNotice`

**AI:ns förslag:**

AI:n påpekade att `NorwayNotice` importerades utan att användas i Dashboard-vyn.

**Bedömning: Behöver verifieras mot den aktuella versionen.**

En oanvänd import kan öka bundle-storleken i onödan. Förslaget måste kontrolleras mot den aktuella mallen och den exakta versionen av filen vid granskningstillfället.

**Åtgärd:**

Kontrollera om komponenten används i mallen. Om den används ska importen behållas; annars ska den tas bort.

### Sammanfattning av PR #32

| AI-förslag                                           | Bedömning          |
| ---------------------------------------------------- | ------------------ |
| Samtidiga refresh-anrop vid applikationsstart        | Träff              |
| `restore()` returnerar innan återställningen är klar | Träff              |
| `fetchMessages` saknas och behövs                    | Miss               |
| Osäker hantering av API-svar i användarstoren        | Träff              |
| Oanvänd import av `NorwayNotice`                     | Behöver verifieras |

PR #32 visar att AI-granskningen kan identifiera verkliga problem, särskilt i autentiseringsflödet och hanteringen av användardata. Den visar också att AI:n kan göra felaktiga antaganden om funktioner som inte används i projektet.

## Vår regel för att lita på AI-granskningen

AI-granskningen är ett stöd, inte ett beslut om att godkänna en pull request.

Vi verifierar varje kommentar mot koden innan vi ändrar något. Vi prioriterar konkreta och reproducerbara problem framför spekulativa förslag.

När vi inte håller med kontrollerar vi sammanhanget och dokumenterar varför kommentaren är felaktig eller inte relevant. Vi accepterar inte en ändring enbart för att AI:n föreslår den, och vi avfärdar inte en kommentar utan att undersöka den.

Den slutliga bedömningen görs av en mänsklig granskare. AI-granskningen får inte ersätta obligatoriska tester eller mänskligt godkännande.

## Status och återstående arbete

- [x] Dokumentera syftet med AI-granskningen.
- [x] Dokumentera hur workflowen och `scripts/ai-review.mjs` fungerar.
- [x] Dokumentera det lokala testet och HTTP 401-felet.
- [x] Samla PR #29, PR #30, PR #31 och PR #32 för utvärdering.
- [x] Dokumentera relevanta AI-förslag från PR #30 och PR #31.
- [x] Dokumentera flera exempel på träffar.
- [x] Dokumentera ett konkret exempel på en miss från PR #32.
- [x] Visa att AI-granskningen har publicerat kommentarer på pull requests.
- [x] Dokumentera att vissa körningar hoppades över på grund av saknad API-nyckel eller avsaknad av ändringar under `src/`.
- [ ] Genomföra och dokumentera ett separat lokalt test med en giltig API-nyckel, utan HTTP 401.
- [x] Verifiera att workflowen har publicerat AI-kommentarer på pull requests vid lyckade körningar.
- [x] Jämföra AI-kommentarerna från PR #30 och PR #31 med efterföljande kodändringar.

**Nuvarande status:**

AI-granskningen har utvärderats med hjälp av PR #29, PR #30, PR #31 och PR #32. Utvärderingen innehåller både exempel på relevanta AI-förslag och ett konkret exempel där AI:n hade fel.

GitHub Actions har publicerat AI-kommentarer på pull requests vid lyckade körningar. Det finns också dokumenterade körningar som hoppades över på grund av saknad API-nyckel, avsaknad av ändringar under `src/` eller ett tomt modellsvar.

Det lokala testet med en giltig API-nyckel behöver fortfarande genomföras separat för att även bekräfta den lokala körningen utan autentiseringsfel.
