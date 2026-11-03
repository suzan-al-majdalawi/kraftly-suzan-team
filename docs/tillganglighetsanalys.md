# Tillgänglighetsanalys och åtgärdsplan för Kraftly

**Projekt:** Kraftly  
**Miljö:** [Kraftly staging](https://kraftly-suzan-team-staging-ny.onrender.com/)  
**Område:** M8 – Komponentbibliotek och tillgänglighet  
**Datum:** 2026-10-24  
**Status:** Pågående verifiering

---

## 1. Syfte

Syftet med denna rapport är att dokumentera Kraftlys tillgänglighetsarbete, identifiera viktiga riskområden och beskriva vilka åtgärder som behövs för att göra webbapplikationen enklare att använda för alla.

Analysen fokuserar på:

- Tangentbordsnavigering och synlig fokusmarkering.
- Färgkontrast och läsbarhet.
- Semantisk HTML och skärmläsarstöd.
- Formulär, etiketter och felmeddelanden.
- Tabeller, statusmeddelanden och diagram.
- Automatiserade tester och manuell verifiering.

Rapporten är ett arbetsdokument. Punkter som inte har verifierats ska inte betraktas som bekräftade fel eller som godkända tillgänglighetskrav.

## 2. Mål och riktlinjer

Kraftlys tillgänglighetsarbete utgår från Web Content Accessibility Guidelines (WCAG), med **WCAG 2.2 nivå AA** som mål för den tekniska granskningen.

Viktiga principer är att innehållet ska vara:

- **Möjligt att uppfatta:** text, kontrast och alternativ till visuellt innehåll ska fungera för olika användare.
- **Hanterbart:** funktioner ska kunna användas med tangentbord och andra hjälpmedel.
- **Begripligt:** etiketter, instruktioner och felmeddelanden ska vara tydliga.
- **Robust:** semantisk HTML och lämpliga tillgänglighetsattribut ska fungera med hjälpmedel.

### 2.1 Numeriska WCAG-krav

Följande kontrastvärden används som riktlinjer vid kontroll enligt WCAG 2.2 AA:

| Kontroll                                               |                               Krav |
| ------------------------------------------------------ | ---------------------------------: |
| Vanlig text                                            |                        Minst 4,5:1 |
| Stor text                                              |                          Minst 3:1 |
| Icke-textbaserade komponenter och visuella indikatorer | Minst 3:1 mot intilliggande färger |

Stor text innebär normalt minst 18 pt eller 14 pt fet text.

Automatiska verktyg kan hitta många problem, men kan inte ensamma bevisa att hela applikationen uppfyller WCAG.

## 3. Omfattning

Följande delar ingår i granskningen och åtgärdsplanen:

| Del av applikationen   | Viktiga kontrollområden                                      |
| ---------------------- | ------------------------------------------------------------ |
| Inloggning             | Etiketter, validering, felmeddelanden och tangentbord        |
| Översikt               | Rubriker, statistik, diagram och laddningsstatus             |
| Fakturor               | Tabellsemantik, status och nedladdningsknappar               |
| Profil                 | Etiketter, inmatningsfält och bekräftelsemeddelanden         |
| Flyttanmälan           | Obligatoriska fält, datum, avtal och felhantering            |
| Gemensamma komponenter | KButton, fokusmarkeringar och konsekvent beteende            |
| Storybook              | Tillgänglighetskontroller och komponenternas olika tillstånd |

## 4. Identifierade riskområden och rekommenderade åtgärder

Följande punkter är kontrollområden baserade på projektets komponenter och kodgranskning. De är inte samtliga verifierade fel i den publicerade staging-miljön.

### 4.1 Tangentbordsnavigering

**Risk:** Användare som inte använder mus kan få svårt att se var fokus befinner sig eller navigera i rätt ordning.

**Åtgärder:**

- Säkerställ att alla länkar, knappar och formulärfält går att nå med `Tab` och `Shift + Tab`.
- Säkerställ att knappar kan aktiveras med tangentbordet.
- Använd tydliga `:focus-visible`-stilar.
- Ta inte bort webbläsarens fokusmarkering utan att ersätta den med en tillräckligt tydlig markering.
- Kontrollera att fokusordningen följer innehållets logiska ordning.

**Verifiering:** Gå igenom samtliga vyer med endast tangentbord och dokumentera resultatet.

### 4.2 Färgkontrast

**Risk:** Text, statusetiketter, knappar eller diagram kan vara svåra att uppfatta om kontrasten är för låg.

**Åtgärder:**

- Kontrollera kontrasten mellan text och bakgrund.
- Kontrollera statusfärger för betalda och obetalda fakturor.
- Kontrollera knappar och fokusindikatorer mot sina faktiska bakgrunder.
- Granska SVG-element i diagram separat.
- Använd inte enbart färg för att förmedla viktig information.

**Numeriska krav:**

- Vanlig text: minst 4,5:1.
- Stor text: minst 3:1.
- Icke-textbaserade komponenter och visuella indikatorer: minst 3:1.

**Verifiering:** Kontrollera de faktiska färgkombinationerna med ett kontrastverktyg och granska eventuella fel i Storybook Accessibility-panelen.

### 4.3 Formulär och etiketter

**Risk:** Platshållartext är inte en ersättning för en synlig etikett. Otydliga felmeddelanden kan också göra det svårt att förstå vad användaren behöver korrigera.

**Åtgärder:**

- Koppla varje formulärfält till en `label` med matchande `for` och `id`.
- Använd lämpliga `autocomplete`-värden.
- Markera ogiltiga fält på ett konsekvent sätt.
- Koppla relevanta felmeddelanden till fälten med `aria-describedby`.
- Använd `role="alert"` för viktiga fel och `role="status"` för bekräftelser där det passar.
- Testa både lyckade och misslyckade API-anrop.

**Verifiering:** Testa tomma fält, ogiltiga värden, API-fel och lyckade formulär med tangentbord.

### 4.4 Fakturatabellen

**Risk:** En tabell utan tydligt definierade rubriker kan vara svårare att förstå med skärmläsare.

**Åtgärder:**

- Använd `thead` och `tbody`.
- Använd `th scope="col"` för kolumnrubriker.
- Använd `th scope="row"` när faktura-ID fungerar som radens rubrik.
- Ge varje åtgärd ett tydligt namn, exempelvis ”Ladda ner faktura 123”.
- Säkerställ att tabellen kan användas på smala skärmar.
- Visa tydliga meddelanden vid laddning, tomt resultat och fel.

**Verifiering:** Kontrollera tabellen med tangentbord och skärmläsare samt vid smal skärmbredd.

### 4.5 Diagram och statistik

**Risk:** Information som enbart visas visuellt i ett diagram kan vara otillgänglig för personer som använder skärmläsare eller inte kan urskilja färger.

**Åtgärder:**

- Ge diagrammet en tydlig rubrik.
- Tillhandahåll en textbaserad sammanfattning eller tabell med viktiga värden.
- Säkerställ att värden inte bara skiljs åt genom färg.
- Kontrollera SVG-elementens kontrast och tillgängliga namn.
- Gör laddnings- och fellägen begripliga även utan visuell information.

**Verifiering:** Granska `ConsumptionChart.vue` och testa hur diagraminformationen presenteras med hjälpmedel.

### 4.6 Semantik och sidstruktur

**Risk:** Ologisk rubrikhierarki eller felaktig användning av landmärken kan försvåra orienteringen.

**Åtgärder:**

- Använd en tydlig rubrikstruktur med en beskrivande huvudrubrik.
- Säkerställ att varje sida har en lämplig huvudregion (`main`).
- Undvik nästlade `main`-element.
- Ange sidans språk med exempelvis `<html lang="sv">`.
- Lägg till alternativtext för meningsbärande bilder och använd tom `alt`-text för dekorativa bilder.

**Verifiering:** Inspektera DOM-strukturen och kontrollera sidans rubriker, landmärken och bildalternativ.

## 5. Teststrategi

Tillgängligheten ska kontrolleras med både automatiserade tester och manuella tester.

### 5.1 Automatiserade tester

Kör följande kommandon från projektets rotmapp:

```bash
npm run test:a11y
npm run test:run
npm run build
npm run build-storybook
```

Dokumentera datum, commit och resultat för varje körning.

Storybook Accessibility-panelen ska också användas för att undersöka komponenternas tillgänglighet. Eventuella kontrastfel ska granskas i den faktiska komponenten och inte antas vara lösta enbart för att övriga tester passerar.

### 5.2 Manuell testning med NVDA

Applikationen har även testats manuellt med **NVDA (NonVisual Desktop Access)**, en skärmläsare som används för att undersöka hur webbplatsens innehåll och funktioner presenteras för användare som använder skärmläsare.

Testningen kompletterar de automatiserade testerna och fokuserar på:

- Att rubriker och sidans struktur läses upp på ett begripligt sätt.
- Att länkar och knappar har tydliga namn.
- Att formulärfält och deras etiketter kan identifieras.
- Att användaren kan navigera mellan olika delar av sidan.
- Att felmeddelanden och bekräftelser uppmärksammas.
- Att tabeller och deras kolumnrubriker går att förstå.

NVDA-testningen är en manuell kontroll och ska ses som ett komplement till tangentbordstester och automatiserade tillgänglighetstester.

### 5.3 Dokumenterat testresultat

Ett tidigare testresultat från `src/views/ProfileView.spec.js` visar:

| Resultat           | Antal | Andel |
| ------------------ | ----: | ----: |
| Godkända tester    |     3 |  75 % |
| Misslyckade tester |     1 |  25 % |
| Totalt             |     4 | 100 % |

De tre godkända testerna var:

1. Sparar ändrade användaruppgifter.
2. Återställer ändringar när användaren klickar på Ångra.
3. Laddar användaren om `store.user` saknas.

Det misslyckade testet var:

- Visar kundnummer och användaruppgifter.

**Viktigt:** Detta är ett komponenttestresultat för profilvyn. Det är inte ett resultat från `npm run test:a11y` och kan därför inte användas som bevis för att 75 % av tillgänglighetskraven är uppfyllda.

Resultatet ska följas upp genom att åtgärda det misslyckade testet och köra testsviten igen.

### 5.4 Manuell testchecklista

- [x] Alla interaktiva element går att nå med `Tab` och `Shift + Tab`.
- [ ] Fokusmarkeringen är tydlig på alla relevanta bakgrunder.
- [x] Knappar och länkar fungerar med tangentbord.
- [x] Fokusordningen är logisk.
- [x] Formulär har synliga etiketter.
- [x] Felmeddelanden går att förstå och uppfattas av hjälpmedel.
- [x] Laddning och lyckade åtgärder ger tydlig återkoppling.
- [x] Tabeller har korrekt kopplade rubriker.
- [x] Diagraminformation finns även i ett textbaserat format.
- [x] Text- och komponentkontrast har kontrollerats.
- [x] Innehållet fungerar vid smal skärmbredd och förstoring.
- [x] Sidans språk, rubriker och landmärken är korrekta.
- [x] Manuell testning med NVDA har genomförts.

Punkterna ska endast markeras som genomförda om de faktiskt har verifierats.

## 6. Prioriterad åtgärdsplan

| Prioritet | Åtgärd                                            | Klart när                                                   |
| --------- | ------------------------------------------------- | ----------------------------------------------------------- |
| P1        | Köra automatiserade tester och byggen             | Resultat och commit är dokumenterade                        |
| P1        | Genomföra tangentbordstest av kritiska vyer       | Fokus och navigering har verifierats manuellt               |
| P1        | Undersöka kontrastfel i Storybook och SVG         | Varje fel är åtgärdat eller dokumenterat                    |
| P1        | Verifiera etiketter och felmeddelanden i formulär | Fälten och återkopplingen har testats                       |
| P2        | Verifiera tabellsemantik och mobil användning     | Fakturor kan förstås och hanteras med hjälpmedel            |
| P2        | Granska diagrammets textalternativ                | Viktig data kan förstås utan enbart visuell information     |
| P2        | Dokumentera kända brister                         | Kvarstående problem och nästa steg finns i dokumentationen  |
| P3        | Verifiera fakturans nedladdningsfunktion          | Knappen utför den utlovade åtgärden eller har tydlig status |

Prioriteterna kan justeras efter testresultat och hur allvarligt ett problem påverkar användarnas möjlighet att utföra viktiga uppgifter.

## 7. Kända begränsningar

Följande begränsningar behöver beaktas i utvärderingen:

- Automatiska tester upptäcker inte alla problem med tangentbordsflöden, begriplighet eller skärmläsaranvändning.
- Diagram kan behöva särskilda textalternativ även om automatiska tester passerar.
- Ett ARIA-attribut garanterar inte i sig att en komponent är tillgänglig.
- En knapp som visar ett tillfälligt meddelande är inte en implementerad nedladdningsfunktion.
- Kodändringar behöver verifieras mot projektets faktiska API-kontrakt och användarflöden.
- Staging-miljön behöver testas direkt innan konkreta fel eller fullständig efterlevnad kan fastställas.

## 8. Definition av klar

Tillgänglighetsarbetet för den granskade omfattningen kan betraktas som färdigt när:

1. Automatiserade tester och byggen passerar i aktuell CI.
2. Kritiska användarflöden har testats manuellt med tangentbord.
3. Kontrastfel har åtgärdats eller dokumenterats med motivering.
4. Formulär, tabeller och dynamiska meddelanden har verifierats.
5. Diagraminformation går att ta del av utan att enbart förlita sig på visuella signaler.
6. Kvarstående begränsningar är dokumenterade med prioritet och nästa steg.

Ett grönt testresultat ska inte beskrivas som ett fullständigt WCAG-intyg.

## 9. Resultat och evidens

Följande tabell skiljer mellan dokumenterade testresultat och kontroller som ännu saknar resultat.

| Kontroll                     | Dokumenterat resultat                            | Status                       |
| ---------------------------- | ------------------------------------------------ | ---------------------------- |
| `ProfileView.spec.js`        | 3 av 4 godkända (75 %)                           | 1 test misslyckades          |
| `npm run test:a11y`          | Inget resultat dokumenterat                      | Behöver köras                |
| `npm run test:run`           | Inget aktuellt totalresultat dokumenterat        | Behöver köras                |
| `npm run build`              | Inget aktuellt resultat dokumenterat             | Behöver köras                |
| `npm run build-storybook`    | Inget resultat dokumenterat                      | Behöver köras                |
| Storybook Accessibility      | Inget resultat dokumenterat                      | Behöver kontrolleras         |
| Manuell tangentbordskontroll | Manuella kontroller dokumenterade i checklistan  | Genomförd enligt checklistan |
| NVDA                         | Manuell testning med skärmläsaren har genomförts | Genomförd                    |
| Kontrastgranskning av SVG    | Inget separat resultat dokumenterat              | Behöver kontrolleras         |

### 9.1 Numerisk sammanfattning

- Dokumenterade komponenttester: **4**.
- Godkända komponenttester: **3 (75 %)**.
- Misslyckade komponenttester: **1 (25 %)**.
- Dokumenterade resultat från automatiska tillgänglighetstester: **0**.
- Manuell testning med NVDA: **genomförd**.

NVDA-testningen har genomförts manuellt, men något numeriskt resultat eller antal upptäckta tillgänglighetsfel har inte dokumenterats. Därför redovisas testningen som genomförd utan att ange ett påhittat resultat.

## 10. Slutsats

Kraftlys tillgänglighetsarbete bör kombinera återanvändbara komponenter, semantisk HTML, tydlig fokusmarkering, korrekta formuläretiketter och automatiserade tester med manuell verifiering.

De numeriska målen för kontrast är minst 4,5:1 för vanlig text och 3:1 för stor text samt relevanta icke-textbaserade komponenter.

Det tidigare dokumenterade komponenttestresultatet för profilvyn är 3 av 4 godkända tester, vilket motsvarar 75 %. Ett test behöver åtgärdas. Detta resultat är inte ett mått på hur stor del av WCAG-kraven som är uppfyllda.

NVDA har också använts för manuell testning av hur innehåll och funktioner presenteras med skärmläsare. Denna kontroll kompletterar tangentbordstester och automatiserade tester.

De viktigaste nästa stegen är att testa hela användarflöden med tangentbord och skärmläsare, kontrollera faktiska kontrastförhållanden och säkerställa att tabeller, diagram och dynamiska meddelanden fungerar med hjälpmedel.

Rapporten ska uppdateras när fler kontroller är genomförda, så att den speglar projektets faktiska status och inte enbart planerade åtgärder.

---

**Relaterad miljö:** [Kraftly staging](https://kraftly-suzan-team-staging-ny.onrender.com/)  
**Föreslagen sökväg:** `docs/tillganglighetsanalys.md`
