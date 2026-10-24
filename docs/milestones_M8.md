# Milstolpar

## M8 – Komponentbibliotek och tillgänglighet

**Status:** Pågår. M8 är färdig först när alla krav är verifierade, relevanta PR:er är mergade till `main` och CI är grön.

### Definition of Done (DoD)

- [ ] **Gemensamma komponenter**
  - `KButton` används som gemensam knappkomponent.
  - Inga gamla `BaseButton`, `AppButton`, `.btn` eller `.button-secondary` finns kvar där de ska ha ersatts.
  - Klickbara `div`- och `span`-element har ersatts med semantiska knappar eller länkar.
  - Inget `@click` används på element som varken är knappar eller länkar.
  - **Bevis:** Kodsökning och granskning av berörda filer.
  - **PR:** https://github.com/suzan-al-majdalawi/kraftly-suzan-team/pull/23

- [ ] **Formulär, fokus, kontrast och HTML**
  - Varje formulärfält har en synlig etikett kopplad med `for` och `id`.
  - Fokus är tydligt synligt vid tangentbordsnavigering.
  - `:focus-visible` används där det är lämpligt.
  - Ingen relevant fokusmarkering har tagits bort med `outline: none`.
  - Textkontrasten är minst 4,5:1 för vanlig text.
  - HTML-dokumentet har `lang="sv"`.
  - Bilder har relevanta alt-texter.
  - Fakturatabellens kolumnrubriker använder `scope`.
  - **Bevis:** Granskade filer, uppmätta kontrastvärden och manuella testresultat.

- [ ] **Storybook**
  - `npm run storybook` startar utan fel.
  - `npm run build-storybook` lyckas.
  - Stories finns för `KButton` och de gemensamma komponenter som ändrats i M8.
  - Accessibility-fliken visar `Violations 0` för varje relevant story.
  - **Kända KButton-stories:** Primary, Secondary, Success och Disabled.
  - **Bevis från Storybook-build:**
    ```text
    [Klistra in resultatet från en lyckad körning.]
    ```
  - **Accessibility-resultat per story:** [Fyll i efter kontroll.]

- [ ] **Automatiserade tillgänglighetstester**
  - Ett axe-test finns för `KButton`.
  - Ett axe-test finns för inloggningsvyn.
  - Inloggningstestet kontrollerar formulärfält med `getByLabelText`.
  - `npm run test:a11y` lyckas.
  - `npm run test:run` lyckas.
  - `npm run build` lyckas.
  - **Testfiler:** [Bekräfta faktiska sökvägar.]
  - **Resultat från `npm run test:a11y`:**
    ```text
    [Klistra in de sista raderna från en lyckad körning.]
    ```
  - **Resultat från `npm run test:run`:**
    ```text
    [Klistra in de sista raderna från en lyckad körning.]
    ```
  - **Resultat från `npm run build`:**
    ```text
    [Klistra in de sista raderna från en lyckad körning.]
    ```

- [ ] **Manuell tangentbordsgranskning**
  - Relevanta vyer har testats med enbart tangentbord.
  - Resultaten före och efter ändringarna dokumenteras i `docs/accessibility.md`.
  - Fokusordning, synlig fokusmarkering, aktivering och eventuella tangentbordsfällor har kontrollerats.
  - **Bevis:** Ifyllda tabeller i `docs/accessibility.md`.

### PR och leveransbevis

- **PR för komponentbibliotek och tillgänglighet:** https://github.com/suzan-al-majdalawi/kraftly-suzan-team/pull/23
- **PR-status:** Öppen; inväntar granskning och verifiering av CI.
- **PR för tillgänglighetsfixar:** Ingår i samma PR, #23, om inga separata PR:er skapas.
- **Senaste commit som visades vid kontroll:** `93bdf07`. Kontrollera aktuell commit lokalt innan den dokumenteras som testad.
- **GitHub Actions:** https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions
- **Grön CI på `main`:** Återstår att verifiera efter merge.
- **Datum för slutlig verifiering:** [ÅÅÅÅ-MM-DD]

### Slutkontroll före M8-tagg

- [ ] Alla DoD-punkter är verifierade.
- [ ] Alla relevanta PR:er är mergade till `main`.
- [ ] CI är grön på den commit som ska taggas.
- [ ] Storybook-build och Accessibility-resultat är dokumenterade.
- [ ] Testresultaten är inklistrade.
- [ ] Tangentbordsgranskningen före och efter ändringarna är dokumenterad.
- [ ] Kända brister är dokumenterade i `docs/accessibility.md`.
- [ ] Inga blockerande tillgänglighetsbrister återstår.
- [ ] M8-taggen sätts först när allt ovan är uppfyllt.
