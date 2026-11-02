# Tillgänglighet – M8

**Datum:** 24 oktober 2026  
**Tid:** 08:53  
**Branch/PR:** `feat/m8-component-library`  
**PR:** [PR #23 – Component Library och tillgänglighetsförbättringar](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/pull/23)

## 1. Syfte och status

Det här dokumentet beskriver komponentbiblioteket, tillgänglighetsförbättringarna och resultaten från automatiserade och manuella kontroller under M8.

Målet med M8 är att skapa ett gemensamt komponentbibliotek och förbättra tillgängligheten i applikationens gränssnitt. Arbetet omfattar bland annat semantiska HTML-element, tydliga fokusmarkeringar, korrekt kopplade formuläretiketter och automatiserade accessibility-tester.

**Status:** De automatiserade testerna och byggena lyckades vid den lokala kontrollen den 24 oktober 2026 kl. 08:53.

| Kontroll                       | Resultat               |
| ------------------------------ | ---------------------- |
| Accessibility-tester           | 4 av 4 godkända        |
| Samtliga automatiserade tester | 35 av 35 godkända      |
| Produktionsbuild               | Lyckades               |
| Storybook-build                | Lyckades med varningar |

Det är viktigt att skilja mellan lyckade automatiserade tester och en fullständig tillgänglighetsgranskning. Att tester och byggen lyckas innebär inte automatiskt att alla tillgänglighetskrav är uppfyllda.

Se även [Milstolpar](milestones.md).

## 2. Komponentbiblioteket

### KButton

- **Fil:** `src/components/KButton.vue`
- **Syfte:** Gemensam knappkomponent baserad på det semantiska HTML-elementet `<button>`.
- **Varianter:** `primary`, `secondary` och `success`.
- **Egenskaper:** Knappens typ och inaktiverat läge.
- **Storybook-fil:** `src/components/KButton.stories.js`.
- **Stories:** Primary, Secondary, Success och Disabled.

KButton används för att skapa ett enhetligt utseende och beteende för knappar i applikationen.

Tillgänglighetsförbättringarna omfattar semantisk knappstruktur och fokusmarkering. Komponentens olika tillstånd kan visas och kontrolleras i Storybook.

### Vyer och komponenter som ändrats

PR #23 innehåller tillgänglighetsrelaterade ändringar i följande delar:

- `LoginView`
- `MoveFormView`
- `ProfileView`
- `App.vue`
- `InvoicesView.vue`

Ändringarna omfattar bland annat:

- Användning av den gemensamma komponenten `KButton`.
- Ersättning av klickbara `div`- och `span`-element med semantiska knappar eller länkar.
- Förbättrad fokusmarkering med `:focus-visible`.
- Förbättrad hantering av formulärfält och etiketter.
- Förbättrad semantik i interaktiva element.

## 3. Identifierade problem och åtgärder

| Problem                               | Åtgärd                                | Hur det upptäcktes         | Status/bevis                                |
| ------------------------------------- | ------------------------------------- | -------------------------- | ------------------------------------------- |
| Flera olika knappvarianter            | Gemensam `KButton`                    | Kodgranskning              | Ändringar finns i PR #23                    |
| Klickbara `div`- och `span`-element   | Semantiska knappar eller länkar       | Kodgranskning              | Ändringar finns i PR #23                    |
| Formulärfält utan korrekt etikett     | Etiketter kopplade med `for` och `id` | Kodgranskning och testning | Accessibility-tester körda                  |
| Otillräcklig fokusmarkering           | Förbättrad `:focus-visible`           | Kodgranskning              | Ändringar finns i PR #23                    |
| Kontrastproblem                       | Färgjusteringar där det behövs        | Kontrastkontroll           | Resultat dokumenteras efter faktisk mätning |
| Saknat `lang`, alt-text eller `scope` | Korrigering där det behövs            | Kodgranskning              | Kontroll dokumenteras separat               |

## 4. CI och automatiserade kontroller

Följande lokala resultat dokumenterades den 24 oktober 2026 kl. 08:53.

### 4.1 Testresultat

| Kommando                  | Resultat                         |
| ------------------------- | -------------------------------- |
| `npm run test:a11y`       | 2 testfiler, 4 tester godkända   |
| `npm run test:run`        | 10 testfiler, 35 tester godkända |
| `npm run build`           | Produktionsbygget lyckades       |
| `npm run build-storybook` | Storybook-bygget lyckades        |

### 4.2 Accessibility-tester

Accessibility-testningen kördes för följande filer:

| Testfil                           | Resultat                   |
| --------------------------------- | -------------------------- |
| `src/a11y/KButton.a11y.test.js`   | 2 tester godkända          |
| `src/a11y/LoginView.a11y.test.js` | 2 tester godkända          |
| **Totalt**                        | **4 av 4 tester godkända** |

Kommandot som användes:

```bash
npm run test:a11y
```

### 4.3 Samtliga automatiserade tester

Kommandot:

```bash
npm run test:run
```

Resultat:

- 10 testfiler godkända.
- 35 tester godkända.
- Inga testfel rapporterades.

Testerna omfattade bland annat validering, fakturor, användardata, förbrukning, priser och accessibility.

### 4.4 Produktionsbuild

Kommandot:

```bash
npm run build
```

**Resultat:** Produktionsbygget lyckades.

Vite byggde applikationen utan byggfel.

### 4.5 Storybook-build

Kommandot:

```bash
npm run build-storybook
```

**Resultat:** Storybook-bygget lyckades.

Storybook byggdes till katalogen `storybook-static`.

Följande varningar visades under bygget:

- `@storybook/addon-docs` kunde inte hittas och hoppades över.
- `vue-docgen-api` är deprecated.
- Vissa bundle-filer överstiger 500 kB.

Varningarna påverkade inte resultatet av Storybook-bygget.

## 5. CI/CD och Lighthouse

Följande tidigare dokumenterade GitHub Actions-körningar finns angivna för den 24 oktober 2026.

| Kontroll               | Dokumenterat resultat              | Bevis                                                                                                                          |
| ---------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| CI/CD – Test & Build   | Lyckades                           | [GitHub Actions – körning](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/runs/40123434442/job/120959705548) |
| CI                     | Lyckades, körning 101              | [CI workflow](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/workflows/ci.yml)                               |
| Lighthouse Performance | Lyckades, körning 19               | [Lighthouse workflow](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/workflows/lighthouse.yml)               |
| Playwright Tests       | Tidigare dokumenterat som pågående | [Playwright-körning](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/runs/40123434298/job/120959704904)       |

De lokala testerna som redovisas i avsnitt 4 är godkända. Playwright-resultatet ska däremot bedömas utifrån den faktiska GitHub Actions-körningen och inte utifrån de lokala Vitest-resultaten.

## 6. Storybook

Storybook används för att visa och kontrollera komponenternas olika tillstånd.

### Kommandon

Starta Storybook:

```bash
npm run storybook
```

Bygg Storybook:

```bash
npm run build-storybook
```

### Stories att kontrollera för KButton

- Primary
- Secondary
- Success
- Disabled

Storybook-build har lyckats lokalt. Ett lyckat bygge är dock inte samma sak som att varje story har granskats med Storybooks Accessibility-funktion.

Accessibility-resultatet för varje story ska dokumenteras efter faktisk kontroll. Ange `Violations 0` endast om kontrollen har genomförts och inte visar några avvikelser.

## 7. Manuell tangentbordsgranskning före ändringarna

En manuell granskning ska dokumentera hur applikationen fungerade före tillgänglighetsförbättringarna.

### Testinformation

- **Datum:** 24 oktober 2026, om kontrollen genomfördes detta datum.
- **Testare:** Suzan.
- **Commit före ändringarna:** Hämtas med `git rev-parse HEAD` från aktuell före-version.
- **Webbläsare:** Dokumenteras vid kontrollen.

Testet genomförs med enbart tangentbord.

Använd:

- `Tab` för att gå framåt mellan interaktiva element.
- `Shift + Tab` för att gå bakåt.
- `Enter` för att aktivera relevanta länkar och knappar.
- `Space` för att aktivera relevanta knappar och kontroller.
- Piltangenter där komponenten kräver det.

| Vy                    | Resultat före ändringarna | Observerade problem         | Bevis   |
| --------------------- | ------------------------- | --------------------------- | ------- |
| Inloggning            | Ej verifierat             | Dokumenteras efter kontroll | Fylls i |
| Översikt/startvy      | Ej verifierat             | Dokumenteras efter kontroll | Fylls i |
| Förbrukning/diagram   | Ej verifierat             | Dokumenteras efter kontroll | Fylls i |
| Fakturor              | Ej verifierat             | Dokumenteras efter kontroll | Fylls i |
| Övriga relevanta vyer | Ej verifierat             | Dokumenteras efter kontroll | Fylls i |

Om en vy inte finns eller inte ingår i M8 ska detta anges uttryckligen.

## 8. Manuell tangentbordsgranskning efter ändringarna

Samma test genomförs efter tillgänglighetsförbättringarna och med samma vyer som före ändringarna.

### Testinformation

- **Datum:** 24 oktober 2026, om kontrollen genomfördes detta datum.
- **Testare:** Suzan.
- **Commit som testades:** Hämtas med `git rev-parse HEAD`.
- **Webbläsare:** Dokumenteras vid kontrollen.

Kontrollera följande:

1. Att fokusmarkeringen är tydlig.
2. Att fokusordningen är logisk.
3. Att knappar och länkar kan aktiveras med tangentbord.
4. Att formulärfält kan nås och användas.
5. Att användaren inte fastnar i en tangentbordsfälla.
6. Att fokus inte försvinner på ett oväntat sätt.

| Vy                    | Resultat efter ändringarna | Kvarstående problem                          | Bevis   |
| --------------------- | -------------------------- | -------------------------------------------- | ------- |
| Inloggning            | Ej manuellt slutverifierat | Slutkontroll dokumenteras efter genomförande | Fylls i |
| Översikt/startvy      | Ej manuellt slutverifierat | Slutkontroll dokumenteras efter genomförande | Fylls i |
| Förbrukning/diagram   | Ej manuellt slutverifierat | Slutkontroll dokumenteras efter genomförande | Fylls i |
| Fakturor              | Ej manuellt slutverifierat | Slutkontroll dokumenteras efter genomförande | Fylls i |
| Övriga relevanta vyer | Ej manuellt slutverifierat | Slutkontroll dokumenteras efter genomförande | Fylls i |

### 8.1 Sammanfattning före och efter

- **Verifierade automatiska resultat:** 4 av 4 accessibility-tester och 35 av 35 tester totalt godkända.
- **Verifierade byggen:** Produktionsbygget och Storybook-bygget lyckades.
- **Dokumenterade kodförbättringar:** Semantiska knappar, förbättrad fokusmarkering och förbättrad hantering av formulärfält finns i PR #23.
- **Manuell kontroll:** Resultatet från den fullständiga manuella tangentbordsgranskningen behöver dokumenteras separat.
- **Uppföljning:** Genomför tangentbordstestet och dokumentera resultatet för varje relevant vy.

## 9. Vad axe inte hittar

Axe kan identifiera många tekniska tillgänglighetsproblem, men noll rapporterade avvikelser garanterar inte att hela gränssnittet är tillgängligt.

Manuell kontroll behövs bland annat för att bedöma:

- Om tangentbordsordningen är logisk.
- Om fokusmarkeringen är tydlig i den faktiska designen.
- Om knapptexter, instruktioner och felmeddelanden är begripliga.
- Om hela användarflödet fungerar med enbart tangentbord.
- Om diagram och komplex information har användbara textalternativ.
- Om dynamiska uppdateringar och fel kommuniceras begripligt med hjälpmedel.
- Om kontrast och läsbarhet fungerar i olika tillstånd och bakgrunder.

Automatiserade axe-tester kompletteras därför med manuell tangentbordsnavigering och vid behov skärmläsartest.

### Manuella kontroller

Följande kontroller ska dokumenteras när de genomförts:

- Tangentbordsnavigering med `Tab` och `Shift + Tab` i inloggningsvyn.
- Kontroll av synlig fokusmarkering på formulärfält och knappar.
- Kontroll av färgkontrast i Storybooks Accessibility-flik.
- Dokumentation av eventuella kvarstående kontrastproblem under Kända brister.

Kontroller ska inte beskrivas som genomförda förrän de faktiskt har utförts.

## 10. Kända brister och uppföljning

Kvarstående brister dokumenteras efter granskningen. Det ska inte anges att inga brister finns innan kontrollerna har utförts.

| Kontroll                       | Status                           | Uppföljning                            |
| ------------------------------ | -------------------------------- | -------------------------------------- |
| Lokala accessibility-tester    | Godkända, 4/4                    | Inget testfel i aktuell körning        |
| Lokala automatiserade tester   | Godkända, 35/35                  | Inget testfel i aktuell körning        |
| Produktionsbuild               | Lyckades                         | Inget byggfel                          |
| Storybook-build                | Lyckades med varningar           | Se Storybook-avsnittet                 |
| Playwright                     | Separat status behöver bekräftas | Kontrollera GitHub Actions-resultatet  |
| Storybook Accessibility        | Inte fullständigt dokumenterat   | Kontrollera varje story                |
| Manuell tangentbordsgranskning | Inte fullständigt dokumenterat   | Genomför och dokumentera testet        |
| Kontrastresultat               | Behöver dokumenteras             | Kontrollera färger och uppmätta värden |

### Kontroller att följa upp

- Kontrollera Playwright-resultatet.
- Kontrollera Storybook Accessibility-fliken.
- Verifiera axe-testernas resultat.
- Genomför och dokumentera manuell tangentbordsgranskning.
- Kontrollera att eventuella kontrastproblem har åtgärdats.

## 11. PR, CI och referenser

- **M8 Definition of Done:** [docs/milestones.md](milestones.md)
- **PR för komponentbibliotek och tillgänglighet:** [PR #23](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/pull/23)
- **CI/CD:** [GitHub Actions – dokumenterad körning](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/runs/40123434442/job/120959705548)
- **CI workflow:** [GitHub Actions workflow](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/workflows/ci.yml)
- **Lighthouse Performance:** [GitHub Actions workflow](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/workflows/lighthouse.yml)
- **Playwright:** [Kontrollera körningens slutresultat](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/runs/40123434298/job/120959704904)
- **Commit som testades:** Hämta med `git rev-parse HEAD`.
- **Datum för lokal testkörning:** 2026-10-24.
- **Tid för lokal testkörning:** 08:53.

---

## Slutsats

M8 har genomfört viktiga förbättringar av komponentbiblioteket och gränssnittets semantik.

Vid den lokala körningen den 24 oktober 2026 kl. 08:53 godkändes samtliga automatiserade tester:

- 4 av 4 accessibility-tester.
- 35 av 35 tester totalt.
- Produktionsbygget lyckades.
- Storybook-bygget lyckades med varningar.

Dessa resultat visar att de automatiserade kontrollerna och byggena fungerade vid den dokumenterade körningen. Den fullständiga tillgänglighetsstatusen fastställs genom att även dokumentera Playwright, Storybook Accessibility och den manuella tangentbordsgranskningen.
