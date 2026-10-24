# Tillgänglighet – M8

## Syfte och status

Det här dokumentet beskriver komponentbiblioteket, tillgänglighetsförbättringarna och resultaten från automatiska och manuella kontroller under M8.

**Status:** Pågår. Fyll endast i resultat som faktiskt har verifierats. Ett test som inte har körts ska markeras som ej testat.

Se även [`docs/milestones.md`](milestones.md) för M8:s Definition of Done.

## Komponentbiblioteket

### KButton

- **Fil:** `src/components/KButton.vue`
- **Syfte:** Gemensam knappkomponent som använder det semantiska HTML-elementet `<button>`.
- **Varianter:** `primary`, `secondary` och `success`.
- **Övriga egenskaper:** Knappens typ och inaktiverat läge kan anges.
- **Storybook-fil:** `src/components/KButton.stories.js`
- **Stories som ska kontrolleras:** Primary, Secondary, Success och Disabled.
- **Accessibility-resultat:** [Dokumentera resultatet för varje story.]

### Vyer som ändrats

PR #23 beskriver ändringar i följande filer och vyer:

- `LoginView`
- `MoveFormView`
- `ProfileView`
- `App.vue`
- `InvoicesView.vue`

Ändringarna omfattar användning av `KButton`, ersättning av klickbara `div`- och `span`-element med riktiga knappar samt förbättrad fokusmarkering.

Kontrollera den aktuella koden och dokumentera om ytterligare gemensamma komponenter har ändrats.

## Problem och åtgärder

| Problem                               | Åtgärd                                        | Hur det upptäcktes                 | Bevis                        |
| ------------------------------------- | --------------------------------------------- | ---------------------------------- | ---------------------------- |
| Flera knappvarianter                  | Gemensam `KButton`                            | Kodgranskning                      | PR #23                       |
| Klickbara `div`- och `span`-element   | Semantiska knappar                            | Kodgranskning                      | PR #23                       |
| Formulärfält utan korrekt etikett     | Synliga etiketter kopplade med `for` och `id` | Kodgranskning och `getByLabelText` | [Testresultat]               |
| Otillräcklig fokusmarkering           | Förbättrad `:focus-visible`                   | Manuell tangentbordskontroll       | [Testresultat]               |
| Kontrastproblem                       | [Dokumentera eventuella korrigeringar]        | Kontrastverktyg                    | [Färger och uppmätta värden] |
| Saknat `lang`, alt-text eller `scope` | [Dokumentera verifierade ändringar]           | Kodgranskning                      | [Fil och resultat]           |

## Tangentbordsgranskning före ändringarna

- **Datum:** [ÅÅÅÅ-MM-DD]
- **Testare:** [Namn eller roll]
- **Commit:** [SHA före ändringarna]
- **Webbläsare:** [Fyll i]

Testa med enbart tangentbord. Använd `Tab`, `Shift+Tab`, `Enter`, `Space` och piltangenter där de är relevanta.

| Vy                    | Resultat före ändringarna      | Observerade problem | Bevis/anteckningar |
| --------------------- | ------------------------------ | ------------------- | ------------------ |
| Inloggning            | Ej testad – fyll i efter test  | [Fyll i]            | [Fyll i]           |
| Översikt/startvy      | Ej testad – fyll i efter test  | [Fyll i]            | [Fyll i]           |
| Förbrukning/diagram   | Ej testad – fyll i efter test  | [Fyll i]            | [Fyll i]           |
| Fakturor              | Ej testad – fyll i efter test  | [Fyll i]            | [Fyll i]           |
| Övriga relevanta vyer | Lista och testa relevanta vyer | [Fyll i]            | [Fyll i]           |

Om en vy inte ingår i projektet eller M8 ska det anges uttryckligen i stället för att ett testresultat hittas på.

## Tangentbordsgranskning efter ändringarna

- **Datum:** [ÅÅÅÅ-MM-DD]
- **Testare:** [Namn eller roll]
- **Commit:** [SHA som testades]
- **Webbläsare:** [Fyll i]

Upprepa samma steg i samma vyer som före ändringarna. Kontrollera att fokus är synligt, ordningen är begriplig, kontroller kan nås och aktiveras och att ingen tangentbordsfälla uppstår.

| Vy                    | Resultat efter ändringarna     | Kvarstående problem | Bevis/anteckningar |
| --------------------- | ------------------------------ | ------------------- | ------------------ |
| Inloggning            | Ej testad – fyll i efter test  | [Fyll i]            | [Fyll i]           |
| Översikt/startvy      | Ej testad – fyll i efter test  | [Fyll i]            | [Fyll i]           |
| Förbrukning/diagram   | Ej testad – fyll i efter test  | [Fyll i]            | [Fyll i]           |
| Fakturor              | Ej testad – fyll i efter test  | [Fyll i]            | [Fyll i]           |
| Övriga relevanta vyer | Lista och testa relevanta vyer | [Fyll i]            | [Fyll i]           |

### Sammanfattning före och efter

- **Förbättringar som verifierats:** [Fyll i efter test.]
- **Problem som kvarstår:** [Fyll i.]
- **Åtgärder att följa upp:** [Fyll i.]

## Automatiserade axe-tester

- **KButton-test:** [Bekräfta sökväg och resultat.]
- **Inloggningsvy-test:** [Bekräfta sökväg och resultat.]
- **Kontroll av formulärfält:** Inloggningstestet ska använda `getByLabelText`.
- **`npm run test:a11y`:**
  ```text
  [Klistra in de sista raderna från en lyckad körning.]
  ```
- **`npm run test:run`:**
  ```text
  [Klistra in de sista raderna från en lyckad körning.]
  ```
- **`npm run build`:**
  ```text
  [Klistra in de sista raderna från en lyckad körning.]
  ```

## Storybook

- **Startkommando:** `npm run storybook`
- **Buildkommando:** `npm run build-storybook`
- **Stories som kontrollerades:** [Lista stories.]
- **Accessibility-resultat:** [Dokumentera resultat per story.]
- **Bekräftade avvikelser:** [Ange antal. Markera `Violations 0` endast efter faktisk kontroll.]

## Vad axe inte hittar

Axe upptäcker många tekniska tillgänglighetsproblem, men noll rapporterade avvikelser garanterar inte att hela gränssnittet är tillgängligt.

Manuell kontroll behövs bland annat för att bedöma:

- om tangentbordsordningen är logisk;
- om fokusmarkeringen är tydlig i den faktiska designen;
- om knapptexter, instruktioner och felmeddelanden är begripliga;
- om hela flödet kan genomföras med enbart tangentbord;
- om diagram och komplex information har användbara textalternativ;
- om dynamiska uppdateringar och fel kommuniceras begripligt med hjälpmedel;
- om kontrast och läsbarhet fungerar i olika tillstånd och bakgrunder.

Därför kompletteras axe med manuell tangentbordsnavigering och, vid behov, skärmläsartest.

**Manuella kontroller som faktiskt genomfördes:** [Fyll i.]

## Kända brister

Dokumentera kvarstående brister efter granskningen. Markera inte att inga brister finns innan kontrollerna är genomförda.

| Brist                     | Påverkan | Prioritet       | Plan/ansvarig |
| ------------------------- | -------- | --------------- | ------------- |
| [Fyll i efter granskning] | [Fyll i] | [Hög/medel/låg] | [Fyll i]      |

**Kontroller som återstår:** [Lista sådant som ännu inte har verifierats.]

## PR, CI och referenser

- **M8 DoD:** [`docs/milestones.md`](milestones.md)
- **PR för komponentbibliotek och tillgänglighet:** https://github.com/suzan-al-majdalawi/kraftly-suzan-team/pull/23
- **PR-status:** Öppen vid senaste kontrollen; inväntar granskning.
- **GitHub Actions:** https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions
- **Senaste commit som visades i PR-historiken vid kontroll:** `93bdf07`. Bekräfta aktuell SHA med `git rev-parse HEAD`.
- **Grön CI:** Inte bekräftad. Kontrollera den senaste körningen och dokumentera resultatet.
- **Testloggar och skärmbilder:** [Lägg till länkar eller korta utdrag.]

### Tidigare CI-fel att kontrollera

En tidigare GitHub Actions-körning misslyckades vid `npm ci` eftersom `package-lock.json` saknade poster för `@emnapi/core@1.11.3` och `@emnapi/runtime@1.11.3`.

Kontrollera den senaste körningen för att se om felet fortfarande finns. Lokalt godkända tester räcker inte för att markera CI som grön.
