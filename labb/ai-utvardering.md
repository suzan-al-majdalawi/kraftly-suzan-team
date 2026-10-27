# Utvärdering av AI-granskningen

Fyll i efter varje PR. Skriv en rad för varje punkt i AI-kommentaren.

- **Träff:** Kommentaren är korrekt och problemet är värt att åtgärda.
- **Miss:** Kommentaren är felaktig eller gäller något oviktigt (brus).
- **Oavgjord:** En människa måste avgöra eftersom modellen saknar viktig information.

Läs alltid diffen själva innan ni läser AI-kommentaren. Skriv också vad ni själva upptäckte men som modellen missade.

## PR A – Visa kundnummer och senaste faktura

**PR-nummer:** #2

**Datum och tid för AI-granskningen:** Behöver verifieras i GitHub.

| Punkt från AI-kommentaren                                                    | Bedömning | Varför?                                                                                                           | Det modellen missade                      |
| ---------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Den första AI-granskningen misslyckades med `401`: API-nyckeln godtogs inte. | Oavgjord  | Detta är ett tekniskt fel och inte ett kodfynd. Det går inte att bedöma AI:ns kodgranskning utifrån detta försök. | Kan inte fastställas från felmeddelandet. |

**Notering:** Kontrollera den senaste AI-kommentaren på PR A. Om en senare granskning lyckades ska dess faktiska fynd dokumenteras separat. Blanda inte ihop ett misslyckat försök med resultatet från en senare körning.

## PR B – Snabbare fakturalista

**PR-nummer:** #3

**Datum och tid för AI-granskningen:** Behöver verifieras i GitHub.

| Punkt från AI-kommentaren                                                                | Bedömning | Varför?                                                                                                            | Det modellen missade                                                   |
| ---------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| AI-granskningens workflow rapporterades senare som lyckat, efter ett tidigare `401`-fel. | Oavgjord  | Ett lyckat workflow visar att jobbet kördes klart, men själva AI-kommentaren måste läsas för att bedöma kodfynden. | Kan inte fastställas utan att läsa kommentaren och jämföra med diffen. |

**Notering:** PR B:s kontroller rapporterades som lyckade. AI-review lyckades på 15 sekunder i den rapporterade körningen. Det finns inte tillräckligt med information här för att bedöma enskilda AI-fynd.

## PR C – Städa testdata

**PR-nummer:** #4

**Datum och tid för AI-granskningen:** En kommentar med `401` visades i GitHub. Den senaste lyckade AI-review-kontrollen tog 18 sekunder; exakt datum och tid behöver verifieras i GitHub.

| Punkt från AI-kommentaren                                                   | Bedömning | Varför?                                                                                                     | Det modellen missade                                                            |
| --------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| En tidigare AI-kommentar rapporterade att API-nyckeln inte godtogs (`401`). | Oavgjord  | Kommentaren innehöll inget konkret kodfynd. Den tidigare granskningen kunde inte köras.                     | Kan inte fastställas från felmeddelandet.                                       |
| En senare AI-review-kontroll rapporterades som lyckad på 18 sekunder.       | Oavgjord  | Det bekräftar att jobbet lyckades, men vi behöver läsa själva AI-kommentaren innan vi kan bedöma dess fynd. | Kan inte fastställas utan den senaste kommentaren och en jämförelse med diffen. |

**CI-resultat för PR C efter att cache-posterna togs bort:**

| Kontroll                          | Resultat   |    Tid |
| --------------------------------- | ---------- | -----: |
| AI-review (suggestion)            | Lyckades   |   18 s |
| CI / Bygg                         | Lyckades   |   21 s |
| CI / E2E-smoke (Playwright)       | Lyckades   | 15 min |
| CI / Image GHCR                   | Lyckades   |   36 s |
| CI / Lint & unit tests            | Lyckades   |   27 s |
| CI / Prestandabudget (Lighthouse) | Lyckades   |   54 s |
| Deploy → production               | Överhoppat |      – |
| Deploy → staging                  | Överhoppat |      – |

Alla sex aktiva kontroller lyckades. Båda deploy-jobben hoppades över.

**Observation:** E2E-smoke tog 15 minuter i denna körning, jämfört med 43 sekunder i en tidigare PR C-körning. Orsaken till skillnaden är inte fastställd och bör undersökas i E2E-loggarna.

**Viktigt:** Att cache-posterna togs bort visar inte automatiskt att samtliga jobb kördes utan cache. Cache-statusen behöver kontrolleras i respektive jobblogg.

## Summering

| Mätvärde                             |           Antal |
| ------------------------------------ | --------------: |
| Dokumenterade tekniska observationer |               4 |
| Träff                                |       0 bedömda |
| Miss                                 |       0 bedömda |
| Oavgjord / behöver verifieras        | 5 observationer |
| Konkreta AI-kodfynd bedömda          |               0 |

**Begränsning:** Summeringen ovan räknar endast de tekniska observationer som dokumenterats i denna fil. Den är inte en slutlig bedömning av alla AI-kommentarer. Läs kommentarerna från respektive PR och lägg till en rad för varje faktiskt AI-fynd innan den slutliga summeringen görs.

## Prompten – steg 5

**Vilken regel ändrade vi i systemprompten?**

Behöver fyllas i utifrån den faktiska ändringen som gjordes i labben. Hitta inte på en regel om den inte kan bekräftas i ändringshistoriken eller labbinstruktionen.

**Blev den falska positiva kommentaren i PR C kvar efter ändringen?**

Behöver verifieras genom att jämföra AI-kommentarerna före och efter promptändringen. Den rapporterade `401`-kommentaren är ett tekniskt fel, inte den falska positiva kodkommentaren i sig.

**Vad sa modellen efter ändringen?**

Klistra in eller sammanfatta den faktiska AI-kommentaren efter ändringen. Om ingen ny granskning med en fungerande AI-körning gjordes ska det anges.

## Vår regel

**När litar vi på AI-kommentaren, och vad gör vi när vi inte håller med?**

Vi läser alltid diffen själva innan vi läser AI-kommentaren. Vi kontrollerar varje påstående mot koden och testerna.

- **Träff:** Vi kan visa att problemet finns och att det är relevant.
- **Miss:** Vi kan visa att påståendet är felaktigt eller oviktigt och dokumenterar varför.
- **Oavgjord:** Vi saknar tillräcklig information och ber en människa granska frågan.

AI-granskningen är ett stöd, inte ett automatiskt beslut. Ett lyckat workflow innebär inte automatiskt att alla AI-fynd är korrekta. Ett `401`-fel innebär att granskningen inte kunde genomföras och ska inte räknas som ett kodfynd.
