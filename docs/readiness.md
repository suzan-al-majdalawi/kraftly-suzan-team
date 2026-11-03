# Readiness – Kraftly

## Status och bedömningsprincip

Statusen ska visa vad teamet kan styrka med dokumenterade underlag, testresultat, konfiguration eller andra verifierbara bevis.

Följande statusar används:

- `klart` – kravet är uppfyllt och det finns underlag som styrker det.
- `känd brist` – en begränsning eller ett verifieringsbehov är känt och dokumenterat.
- `saknas` – tillgängliga bevis räcker inte för att avgöra om kravet är uppfyllt.
- `utgår (beslut 12/10)` – punkten har tagits bort ur kursens omfattning enligt beslutet.
- `v.12` – release-raden, enligt planeringen.

En kodändring eller en dokumenterad ambition räcker inte i sig för att markera en punkt som klar.

## Readiness-tabell

| Område                         | Punkt                                                 | Varför                                                                       | Så bevisar ni det                                                                                                                         | Kraftly | Status               |
| ------------------------------ | ----------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------------------- |
| Repo och samarbete             | Branch protection, PR-mall, CODEOWNERS                | Ingen kod når `main` utan att någon annan sett den                           | Inställningen i GitHub, en PR som blockerats                                                                                              | M0      | saknas               |
|                                | Skuldinventering                                      | Man kan inte betala av det man inte skrivit upp                              | `docs/debt.md`                                                                                                                            | M0      | klart                |
|                                | Arbetslogg och beslut                                 | Nästa person ska kunna läsa sig till _varför_                                | `docs/log.md`, `docs/decisions/`                                                                                                          | Löpande | saknas               |
| Kvalitet                       | Enhets- och komponenttester                           | Regressioner syns innan kunden ser dem                                       | Minst 10 tester, minst 1 regressionstest på en bugg ur skulden                                                                            | M1      | saknas               |
|                                | Lint och format i pre-commit                          | Stilfrågor tas av maskinen, inte i code review                               | En commit som stoppats lokalt                                                                                                             | M1      | klart                |
|                                | Teststrategi                                          | Alla vet vad som testas var                                                  | `docs/testing.md`                                                                                                                         | M1      | saknas               |
| CI                             | Lint + test + build på varje PR, röd status blockerar | "Funkar på min maskin" slutar gälla                                          | Grön och röd körning länkade, required check                                                                                              | M2      | saknas               |
|                                | Smoke-test i browsern                                 | Enhetstester ser inte att sidan inte laddar                                  | Playwright-jobbet i pipelinen som verifierar att sidan startar och fungerar i browsern                                                    | M2      | saknas               |
|                                | Beroendecache med uppmätt vinst                       | En snabb pipeline används, en långsam kringgås                               | Skärmdumpar från GitHub Actions med och utan npm-cache dokumenterade i `docs/pipeline.md`, avsnitt 10.1                                   | M2      | känd brist           |
|                                | Container                                             | Multi-stage Dockerfile, liten image                                          | `docker images` under 100 MB                                                                                                              | M3      | saknas               |
|                                | `docker compose up` startar allt                      | En ny kollega är igång på minuter                                            | Kommandot och vad som startar                                                                                                             | M3      | saknas               |
| Leverans                       | Merge till `main` deployar till staging               | Varje ändring testas i en riktig miljö                                       | Deploy-jobbet, `/version.txt` med sha                                                                                                     | M4      | klart                |
|                                | Imagen byggs en gång, taggas med sha                  | Det som testats är det som körs                                              | Taggen i registret = sha på `main`                                                                                                        | M4      | klart                |
|                                | Hemligheter utanför koden, roterade                   | Läckta nycklar är en vanlig incidentrisk                                     | `git log -S` tomt, nyckeln bara i plattformen                                                                                             | M4      | saknas               |
| Drift                          | Prod skild från staging, konfig via variabler         | Man ska kunna testa utan att röra kund                                       | Samma image, olika variabler                                                                                                              | M5      | klart                |
|                                | Feature flag                                          | Slå av en funktion på sekunder, utan release                                 | Flaggan på i staging, av i prod                                                                                                           | M5      | saknas               |
|                                | Cache-headers på statiska assets                      | Färre bytes över nätet, snabbare sida                                        | `curl -I` före/efter                                                                                                                      | M5      | saknas               |
|                                | Rollback genomförd                                    | Man övar inte för första gången under en incident                            | Logg eller skärmdump av rollbacken                                                                                                        | M5      | saknas               |
|                                | Skalningsstrategi på egna mätvärden                   | Gissningar skalar inte                                                       | `docs/scaling.md` med siffror                                                                                                             | M5      | saknas               |
| Säkerhet                       | Riktig autentisering, skyddade routes                 | En fejkad inloggning är ingen inloggning                                     | Token-flödet, en route som svarar 401                                                                                                     | M6      | klart                |
|                                | OWASP-genomgång                                       | De tio vanligaste hålen är kända – kolla dem                                 | `docs/security.md`, kolumnen _Kontroll_                                                                                                   | M6      | saknas               |
|                                | CORS och CSP                                          | Begränsar vad som får prata med och köras i er sida                          | `curl -I` på headrarna                                                                                                                    | M6      | saknas               |
| Prestanda                      | Mätmetod skriven ner                                  | Med olika metoder jämför man inställningar, inte kod                         | `docs/performance.md`, _Så mäter vi_                                                                                                      | M7      | saknas               |
|                                | Minst 3 optimeringar med före/efter                   | En förbättring utan mätning är en åsikt                                      | Tabellen i `docs/performance.md`                                                                                                          | M7      | saknas               |
|                                | Budget i CI som stoppar                               | Annars växer bundlen tillbaka                                                | Required check, en röd körning                                                                                                            | M7      | saknas               |
| Tillgänglighet och komponenter | Ett komponentbibliotek                                | En knapp att göra rätt, i stället för tre                                    | `KButton`, inga gamla kvar (M8) · `KField` (M9)                                                                                           | M8, M9  | saknas               |
|                                | Labels, fokus, kontrast, `lang`, alt, `scope`         | Det tangentbordet och skärmläsaren behöver – och ett lagkrav sedan juni 2025 | `docs/accessibility.md` och tillgänglighetsanalysen                                                                                       | M8      | känd brist           |
|                                | Storybook och axe lokalt                              | Komponenterna testas en och en, i isolering                                  | Stories och axe-resultat enligt M8. Stories för alla komponenter och axe per formulärvy utgår enligt beslut 12/10                         | M8      | utgår (beslut 12/10) |
|                                | Tangentbordsgenomgång före/efter                      | Axe ser inte allt                                                            | Före- och eftertabellerna i `docs/accessibility.md`                                                                                       | M8      | känd brist           |
| Automation och hållbarhet      | Storybook-jobbet i pipelinen                          | Det som bara körs lokalt körs inte                                           | Jobbet _Storybook_ i pipelinen, required check                                                                                            | M9      | saknas               |
|                                | AI-steg utvärderat                                    | AI i flödet utan utvärdering är brus                                         | Tabellen träff / miss / oavgjord på minst tre riktiga PR:ar, två exempel (en träff, en miss) och teamets regel i `docs/ai-in-pipeline.md` | M9      | känd brist           |
|                                | Hållbarhetsanalys med siffror                         | Bytes är energi                                                              | `docs/sustainability.md` och mätning med `scripts/co2.mjs`                                                                                | M9      | klart                |
| Dokumentation                  | README, beslutsdokument, arkitekturskiss              | Nästa team ska kunna ta över                                                 | `docs/` komplett, nya kollegan-testet klarat, `docs/readiness.md` ifylld                                                                  | M10     | saknas               |
|                                | Inga kända kritiska brister                           | Det som är kvar är medvetet, och skrivet                                     | `docs/known-issues.md` (brist · påverkan · varför), ingen kritisk kvar                                                                    | M10     | känd brist           |
| Release                        | Taggad release, demo live i prod                      | Det är det här allt handlade om                                              | `v1.0`, slutdemon                                                                                                                         | v.12    | v.12                 |

## Hållbarhetsmätning

Den senaste mätningen genomfördes den 3 november 2026 med:

```powershell
npm run co2
```

Resultatet från `scripts/co2.mjs`:

| Mätvärde                     | Resultat |
| ---------------------------- | -------: |
| Överförd datamängd per besök |   356 kB |
| CO₂e per besök – Sverige     |  0,021 g |
| CO₂e per månad – Sverige     |   2,7 kg |
| CO₂e per månad – globalt     |   6,6 kg |
| Energiförbrukning per månad  | 13,7 kWh |

Beräkningen bygger på följande antaganden:

- 40 000 kunder × 3,2 besök per månad = 128 000 besök.
- Andel förstabesök: 100 %.
- Svensk elmix: 35,89 g CO₂e/kWh.
- Global elmix: 472,94 g CO₂e/kWh.
- Sustainable Web Design V4 använder även en global faktor på 494 g CO₂e/kWh för tillverkning av enheter, nätverk och datacenter.

Resultatet är en modellbaserad uppskattning, inte en direkt mätning av webbplatsens faktiska klimatpåverkan.

En tidigare mätning efter M7 visade 334 kB per besök, 0,020 g CO₂e per besök i Sverige, 2,5 kg per månad i Sverige och 6,2 kg per månad globalt. Den senaste mätningen visar något högre värden. Det går därför inte att hävda en verifierad numerisk förbättring mellan dessa mättillfällen.

## Beslut 12/10

M9 är avgränsad medvetet. Stories för samtliga komponenter och ett axe-test per formulärvy utgår ur kursens omfattning enligt beslut 12/10. De är borttagna, inte flyttade till ett senare moment.

I pipelinen räcker jobbet _Storybook_. Ett separat axe-jobb behövs inte enligt beslutet.

## Kvar att verifiera

Följande punkter behöver kompletterande bevis innan status kan ändras:

- GitHub branch protection, PR-mall och CODEOWNERS.
- Arbetslogg och beslutsdokument.
- Testomfattning och regressionstest kopplat till skulden.
- Grön och röd CI-körning samt required checks.
- Playwright-smoke-test i pipelinen.
- Docker image-storlek och att `docker compose up` fungerar för en ny utvecklare.
- Hemlighetshantering och eventuell nyckelrotation.
- Feature flag i staging respektive produktion.
- Cache-headers verifierade med `curl -I`.
- Genomförd rollback och skalningsstrategi med mätvärden.
- OWASP-kontroller och verifierade CORS/CSP-headers.
- Dokumenterad prestandametod, optimeringar och CI-budget.
- Komponentbibliotekets omfattning och manuell tangentbordsgranskning.
- Storybook som required check.
- AI-utvärdering på minst tre riktiga PR:ar.
- Fullständighet i dokumentationen och genomfört nya kollegan-test.
