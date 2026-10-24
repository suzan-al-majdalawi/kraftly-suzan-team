# Tillgänglighet – M8

## Syfte och status

Det här dokumentet beskriver komponentbiblioteket, tillgänglighetsförbättringarna och resultaten från automatiserade och manuella kontroller under M8.

**Status:** CI och Lighthouse har lyckats. Slutlig kontroll av Playwright, Storybook, axe och manuell tangentbordsnavigering ska dokumenteras med faktiska resultat.

Se även [`docs/milestones.md`](milestones.md).

## Komponentbiblioteket

### KButton

- **Fil:** `src/components/KButton.vue`
- **Syfte:** Gemensam knappkomponent baserad på det semantiska HTML-elementet `<button>`.
- **Varianter:** `primary`, `secondary` och `success`.
- **Egenskaper:** Typ och inaktiverat läge.
- **Storybook-fil:** `src/components/KButton.stories.js`
- **Stories att kontrollera:** Primary, Secondary, Success och Disabled.
- **Accessibility-resultat:** [Dokumentera resultatet för varje story.]

### Vyer och komponenter som ändrats

PR #23 beskriver ändringar i:

- `LoginView`
- `MoveFormView`
- `ProfileView`
- `App.vue`
- `InvoicesView.vue`

Ändringarna omfattar användning av `KButton`, ersättning av klickbara `div`- och `span`-element med semantiska knappar samt förbättrad fokusmarkering.

Kontrollera den slutliga koden och lägg till andra gemensamma komponenter som ändrats i M8.

## Problem och åtgärder

| Problem                               | Åtgärd                                        | Hur det upptäcktes                 | Bevis                                                                      |
| ------------------------------------- | --------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------- |
| Flera knappvarianter                  | Gemensam `KButton`                            | Kodgranskning                      | [PR #23](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/pull/23) |
| Klickbara `div`- och `span`-element   | Semantiska knappar eller länkar               | Kodgranskning                      | PR #23                                                                     |
| Formulärfält utan korrekt etikett     | Synliga etiketter kopplade med `for` och `id` | Kodgranskning och `getByLabelText` | [Bekräfta testresultat]                                                    |
| Otillräcklig fokusmarkering           | Förbättrad `:focus-visible`                   | Manuell tangentbordskontroll       | [Fyll i resultat]                                                          |
| Kontrastproblem                       | [Dokumentera eventuella korrigeringar]        | Kontrastverktyg                    | [Färger och uppmätta värden]                                               |
| Saknat `lang`, alt-text eller `scope` | [Dokumentera verifierade ändringar]           | Kodgranskning                      | [Filer och resultat]                                                       |

## CI och automatiserade kontroller

Senaste kontrollen den 24 oktober 2026:

| Kontroll               | Status                        | Bevis                                                                                                         |
| ---------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| CI/CD – Test & bygg    | Lyckades                      | [Körning](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/runs/40123434442/job/120959705548) |
| CI                     | Lyckades, körning 101         | [Workflow](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/workflows/ci.yml)                 |
| Lighthouse Performance | Lyckades, körning 19          | [Workflow](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/workflows/lighthouse.yml)         |
| Playwright Tests       | Pågick vid senaste kontrollen | [Körning](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/runs/40123434298/job/120959704904) |

Att CI och Lighthouse lyckas är positivt, men det bevisar inte i sig att alla manuella tillgänglighetskrav är uppfyllda.

### axe-tester

- **KButton-test:** [Bekräfta sökväg och resultat.]
- **Inloggningsvy-test:** [Bekräfta sökväg och resultat.]
- **Formulärfält:** Kontrollera att inloggningstestet använder `getByLabelText`.
- **`npm run test:a11y`:**
  ```text
  [Klistra in resultatet från en lyckad lokal körning.]
  ```
- **`npm run test:run`:**
  ```text
  [Klistra in resultatet från en lyckad lokal körning.]
  ```
- **`npm run build`:**
  ```text
  [Klistra in resultatet från en lyckad lokal körning.]
  ```

### Storybook

- **Startkommando:** `npm run storybook`
- **Buildkommando:** `npm run build-storybook`
- **Stories som kontrollerades:** [Lista stories.]
- **Accessibility-resultat:** [Dokumentera resultat per story.]
- **Avvikelser:** Ange `Violations 0` endast efter att respektive story faktiskt har kontrollerats.

## Tangentbordsgranskning före ändringarna

- **Datum:** [Fyll i.]
- **Testare:** [Namn eller roll.]
- **Commit före ändringarna:** [SHA.]
- **Webbläsare:** [Fyll i.]

Testa med enbart tangentbord. Använd `Tab`, `Shift+Tab`, `Enter`, `Space` och piltangenter där det är relevant.

| Vy                    | Resultat före ändringarna     | Observerade problem | Bevis    |
| --------------------- | ----------------------------- | ------------------- | -------- |
| Inloggning            | Ej testad – fyll i efter test | [Fyll i]            | [Fyll i] |
| Översikt/startvy      | Ej testad – fyll i efter test | [Fyll i]            | [Fyll i] |
| Förbrukning/diagram   | Ej testad – fyll i efter test | [Fyll i]            | [Fyll i] |
| Fakturor              | Ej testad – fyll i efter test | [Fyll i]            | [Fyll i] |
| Övriga relevanta vyer | Lista och testa               | [Fyll i]            | [Fyll i] |

Om en vy inte finns eller inte ingår i M8 ska det anges uttryckligen.

## Tangentbordsgranskning efter ändringarna

- **Datum:** [Fyll i.]
- **Testare:** [Namn eller roll.]
- **Commit som testades:** [SHA.]
- **Webbläsare:** [Fyll i.]

Upprepa samma steg i samma vyer som före ändringarna. Kontrollera synlig fokusmarkering, logisk ordning, aktivering och att ingen tangentbordsfälla uppstår.

| Vy                    | Resultat efter ändringarna    | Kvarstående problem | Bevis    |
| --------------------- | ----------------------------- | ------------------- | -------- |
| Inloggning            | Ej testad – fyll i efter test | [Fyll i]            | [Fyll i] |
| Översikt/startvy      | Ej testad – fyll i efter test | [Fyll i]            | [Fyll i] |
| Förbrukning/diagram   | Ej testad – fyll i efter test | [Fyll i]            | [Fyll i] |
| Fakturor              | Ej testad – fyll i efter test | [Fyll i]            | [Fyll i] |
| Övriga relevanta vyer | Lista och testa               | [Fyll i]            | [Fyll i] |

### Sammanfattning före och efter

- **Verifierade förbättringar:** [Fyll i efter test.]
- **Problem som kvarstår:** [Fyll i.]
- **Åtgärder att följa upp:** [Fyll i.]

## Vad axe inte hittar

Axe kan hitta många tekniska tillgänglighetsproblem, men noll rapporterade avvikelser garanterar inte att hela gränssnittet är tillgängligt.

Manuell kontroll behövs bland annat för att bedöma:

- om tangentbordsordningen är logisk;
- om fokusmarkeringen är tydlig i den faktiska designen;
- om knapptexter, instruktioner och felmeddelanden är begripliga;
- om hela flödet fungerar med enbart tangentbord;
- om diagram och komplex information har användbara textalternativ;
- om dynamiska uppdateringar och fel kommuniceras begripligt med hjälpmedel;
- om kontrast och läsbarhet fungerar i olika tillstånd och bakgrunder.

Därför kompletteras axe med manuell tangentbordsnavigering och vid behov skärmläsartest.

**Manuella kontroller som faktiskt genomfördes:**

- Tangentbordsnavigering med Tab och Shift+Tab i inloggningsvyn.
- Kontroll av synlig fokusmarkering på formulärfält och knappar.
- Kontroll av färgkontrast i Storybooks Accessibility-flik.
- Kvarstående kontrastproblem dokumenteras under Kända brister tills de har åtgärdats och verifierats.

## Kända brister

Dokumentera kvarstående brister efter granskningen. Markera inte att inga brister finns innan kontrollerna har utförts.

| Brist                     | Påverkan | Prioritet       | Plan/ansvarig |
| ------------------------- | -------- | --------------- | ------------- |
| [Fyll i efter granskning] | [Fyll i] | [Hög/medel/låg] | [Fyll i]      |

**Kontroller som återstår:** Kontrollera Playwright-resultatet, Storybook Accessibility-fliken, axe-testernas resultat och den manuella tangentbordsgranskningen.

## PR, CI och referenser

- **M8 DoD:** [`docs/milestones.md`](milestones.md)
- **PR för komponentbibliotek och tillgänglighet:** https://github.com/suzan-al-majdalawi/kraftly-suzan-team/pull/23
- **CI/CD:** [Lyckad körning](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/runs/40123434442/job/120959705548)
- **CI:** [Workflow](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/workflows/ci.yml)
- **Lighthouse Performance:** [Workflow](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/workflows/lighthouse.yml)
- **Playwright:** [Kontrollera slutresultatet](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/runs/40123434298/job/120959704904)
- **Commit som testades:** [Bekräfta med `git rev-parse HEAD`.]
- **Datum för CI-kontroll:** 2026-10-24.
