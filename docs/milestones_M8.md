# Milstolpar

## M8 – Komponentbibliotek och tillgänglighet

**Status:** Pågår – CI och Lighthouse har lyckats, men slutlig verifiering av Playwright, tillgänglighetskraven och merge till `main` återstår.

### Definition of Done (DoD)

- [ ] **Gemensamma komponenter**
  - `KButton` används som gemensam knappkomponent.
  - Inga gamla `BaseButton`, `AppButton`, `.btn` eller `.button-secondary` finns kvar där de ska ha ersatts.
  - Klickbara `div`- och `span`-element har ersatts med semantiska knappar eller länkar.
  - Inget `@click` används på element som varken är knappar eller länkar.
  - **Bevis:** PR #23 och kodgranskning.

- [ ] **Formulär, fokus, kontrast och HTML**
  - Alla formulärfält har synliga etiketter kopplade med `for` och `id`.
  - Fokus är synligt vid tangentbordsnavigering.
  - `:focus-visible` används där det är lämpligt.
  - Ingen relevant fokusmarkering har tagits bort med `outline: none`.
  - Textkontrasten är minst 4,5:1 för vanlig text.
  - HTML-dokumentet har `lang="sv"`.
  - Bilder har relevanta alt-texter.
  - Fakturatabellens kolumnrubriker har `scope`.
  - **Bevis:** [Fyll i verifierade filer, kontrastvärden och manuella testresultat.]

- [ ] **Storybook**
  - `npm run storybook` startar.
  - `npm run build-storybook` lyckas.
  - Stories finns för `KButton` och övriga gemensamma komponenter som ändrats i M8.
  - Accessibility-fliken visar `Violations 0` för varje relevant story.
  - Kända `KButton`-stories: Primary, Secondary, Success och Disabled.
  - **Bevis:** [Lägg till resultat från Storybook-build och Accessibility-fliken.]

- [ ] **Automatiserade tillgänglighetstester**
  - Ett axe-test finns för `KButton`.
  - Ett axe-test finns för inloggningsvyn.
  - Inloggningstestet använder `getByLabelText`.
  - `npm run test:a11y` lyckas.
  - `npm run test:run` lyckas.
  - `npm run build` lyckas.
  - **Bevis:** [Bekräfta testfilerna och dokumentera de lokala testresultaten.]

- [ ] **Manuell tangentbordsgranskning**
  - Relevanta vyer har testats med enbart tangentbord.
  - Resultaten före och efter ändringarna finns i `docs/accessibility.md`.
  - Fokusordning, synlig fokusmarkering, aktivering och eventuella tangentbordsfällor har kontrollerats.
  - **Bevis:** Ifyllda tabeller i `docs/accessibility.md`.

### CI och GitHub Actions

**Kontrollerade körningar den 24 oktober 2026:**

| Workflow               | Resultat                         | Länk                                                                                                                             |
| ---------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| CI/CD                  | Lyckades – jobbet `Test & bygg`  | [Öppna körningen](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/runs/40123434442/job/120959705548)            |
| CI                     | Lyckades – körning 101 på PR #23 | [Öppna CI](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/workflows/ci.yml)                                    |
| Lighthouse Performance | Lyckades – körning 19 på PR #23  | [Öppna Lighthouse](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/workflows/lighthouse.yml)                    |
| Playwright Tests       | Pågick vid senaste kontrollen    | [Öppna Playwright-körningen](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/runs/40123434298/job/120959704904) |

**Tolkning:** CI/CD, CI och Lighthouse har rapporterat lyckade körningar. Playwright ska kontrolleras igen och får inte markeras som godkänt förrän körningen är klar.

### PR och leveransbevis

- **PR för komponentbibliotek och tillgänglighet:** https://github.com/suzan-al-majdalawi/kraftly-suzan-team/pull/23
- **PR-status:** [Bekräfta om PR:en är öppen eller mergad.]
- **Grön CI/CD:** Bekräftad i körningen ovan.
- **Grön CI:** Bekräftad i körning 101.
- **Grön Lighthouse:** Bekräftad i körning 19.
- **Playwright:** Väntar på slutresultat.
- **Storybook-build:** [Dokumentera efter kontroll.]
- **Lokala axe-tester:** [Klistra in testresultat.]
- **Senaste testade commit:** [Bekräfta SHA med `git rev-parse HEAD`.]
- **Datum för verifiering:** 2026-10-24.

### Slutkontroll före M8-tagg

- [ ] Alla DoD-punkter är verifierade.
- [ ] PR:en är godkänd och mergad till `main`.
- [ ] CI är grön på den slutliga committen.
- [ ] Playwright är färdig och grön.
- [ ] Storybook-build och Accessibility-resultat är dokumenterade.
- [ ] Resultaten från `npm run test:a11y`, `npm run test:run` och `npm run build` är dokumenterade.
- [ ] Tangentbordsgranskningen före och efter ändringarna är dokumenterad.
- [ ] Kända brister finns dokumenterade i `docs/accessibility.md`.
- [ ] Inga blockerande tillgänglighetsbrister återstår.
- [ ] M8-taggen sätts först när samtliga krav är uppfyllda.
