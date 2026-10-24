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

För WCAG AA gäller normalt minst **4,5:1 för vanlig text** och **3:1 för stor text**. Icke-textbaserade komponenter och visuella indikatorer omfattas av egna kontrastkrav.

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

### 5.2 Manuell testchecklista

- [ ] Alla interaktiva element går att nå med `Tab` och `Shift + Tab`.
- [ ] Fokusmarkeringen är tydlig på alla relevanta bakgrunder.
- [ ] Knappar och länkar fungerar med tangentbord.
- [ ] Fokusordningen är logisk.
- [ ] Formulär har synliga etiketter.
- [ ] Felmeddelanden går att förstå och uppfattas av hjälpmedel.
- [ ] Laddning och lyckade åtgärder ger tydlig återkoppling.
- [ ] Tabeller har korrekt kopplade rubriker.
- [ ] Diagraminformation finns även i ett textbaserat format.
- [ ] Text- och komponentkontrast har kontrollerats.
- [ ] Innehållet fungerar vid smal skärmbredd och förstoring.
- [ ] Sidans språk, rubriker och landmärken är korrekta.

Fyll i checklistan först efter att respektive kontroll har genomförts.

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

Fyll i tabellen efter att testerna har körts:

| Kontroll                     | Datum / commit  | Resultat               |
| ---------------------------- | --------------- | ---------------------- |
| `npm run test:a11y`          | Ej dokumenterat | Fylls i efter körning  |
| `npm run test:run`           | Ej dokumenterat | Fylls i efter körning  |
| `npm run build`              | Ej dokumenterat | Fylls i efter körning  |
| Storybook Accessibility      | Ej dokumenterat | Fylls i efter kontroll |
| Manuell tangentbordskontroll | Ej dokumenterat | Fylls i efter kontroll |
| Kontrastgranskning av SVG    | Ej dokumenterat | Fylls i efter kontroll |

## 10. Slutsats

Kraftlys tillgänglighetsarbete bör kombinera återanvändbara komponenter, semantisk HTML, tydlig fokusmarkering, korrekta formuläretiketter och automatiserade tester med manuell verifiering.

De viktigaste nästa stegen är att testa hela användarflöden med tangentbord, kontrollera faktiska kontrastförhållanden och säkerställa att tabeller, diagram och dynamiska meddelanden fungerar med hjälpmedel.

Rapporten ska uppdateras när kontrollerna är genomförda, så att den speglar projektets faktiska status och inte enbart planerade åtgärder.

---

**Relaterad miljö:** [Kraftly staging](https://kraftly-suzan-team-staging-ny.onrender.com/)  
**Föreslagen sökväg:** `docs/tillganglighetsanalys.md`
