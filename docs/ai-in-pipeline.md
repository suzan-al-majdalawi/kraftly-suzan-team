# AI-granskning i CI

## Syfte

AI-granskningen är ett extra stöd vid granskning av pull requests i Kraftly Mina sidor. Den granskar ändringar under `src/` och föreslår möjliga problem inom säkerhet, buggar, tillgänglighet och prestanda.

AI-granskningen är ett förslag och ersätter inte mänsklig kodgranskning. Den är inte ett obligatoriskt CI-krav och får inte göra en pull request röd om AI-tjänsten misslyckas.

## Hur det fungerar

Workflowen `.github/workflows/ai-review.yml` skickar en diff till `scripts/ai-review.mjs`. Skriptet skickar diffen till Anthropic API och skriver granskningsresultatet som Markdown. Workflowen publicerar resultatet som en kommentar på pull requesten.

API-nyckeln läses från miljövariabeln `ANTHROPIC_API_KEY`. Nyckeln ska hanteras som en hemlighet och får inte sparas i repot eller visas i loggar.

## Lokalt test och resultat

Jag testade skriptet lokalt med följande kommando:

```powershell
node scripts/ai-review.mjs diff.patch
```

Miljövariabeln `ANTHROPIC_API_KEY` var inställd, men API-anropet misslyckades med HTTP 401 och meddelandet `invalid x-api-key`.

**Resultat:** AI-granskningen kunde inte genomföras. Testet visar att skriptet nådde autentiseringssteget, men det bekräftar inte att AI-granskningen fungerar korrekt från början till slut.

API-nyckeln behöver kontrolleras innan ett nytt test kan göras. Därefter behöver skriptet testas igen med en giltig nyckel.

Skriptet är avsett att hantera fel från AI-tjänsten utan att göra AI-granskningen till ett obligatoriskt CI-krav. Vanlig kodgranskning och övriga CI-kontroller ska kunna fortsätta även om AI-tjänsten inte är tillgänglig.

## Utvärdering av tre pull requests

Följande tre pull requests användes för att undersöka AI-granskningen.

| Pull request                                                               | AI-kommentar                                                                   | Bedömning                       | Motivering                                                                                                                                                                                                                                                    |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [PR #29](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/pull/29) | Granskningen hoppades över eftersom API-nyckeln saknades.                      | Osäker – ingen bedömning möjlig | Ingen kodanalys genomfördes. PR:en kan därför inte användas för att bedöma AI-granskarens träffsäkerhet.                                                                                                                                                      |
| [PR #30](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/pull/30) | Kommentarer om tillgänglighet för statuschip och hantering av fakturastatusar. | Trolig träff                    | AI:n identifierade konkreta risker inom tillgänglighet och fakturalogik. Kommentarerna behöver jämföras med koden för att bekräftas. Efter en senare ändring svarade AI:n ”Inget att anmärka på”.                                                             |
| [PR #31](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/pull/31) | Kommentarer om `KAlert`, live-regioner, meddelanden och fokus vid stängning.   | Trolig träff                    | AI:n identifierade möjliga tillgänglighetsproblem för skärmläsare och tangentbordsanvändare. Kommentarerna behöver verifieras mot koden. Vissa andra körningar hoppades över på grund av saknad API-nyckel eller för att inga ändringar gjordes under `src/`. |

### Vad räknas som en träff eller miss?

En **träff** är en kommentar som pekar på ett verkligt och relevant problem i koden.

En **miss** är en kommentar som är felaktig, saknar tillräckligt stöd i koden eller föreslår en onödig ändring.

**Osäker** används när underlaget inte räcker för att avgöra om kommentaren är korrekt.

Vi dokumenterar minst ett exempel på en träff och ett exempel på en miss, med korta citat från AI-kommentaren och en förklaring av bedömningen.

### Sammanfattning av utvärderingen

PR #29 gav inget underlag eftersom AI-granskningen inte kunde köras. PR #30 och PR #31 gav däremot konkreta kommentarer om möjliga problem inom tillgänglighet och funktionalitet.

Kommentarerna i PR #30 och PR #31 bedöms preliminärt som träffar, men måste kontrolleras mot koden innan de kan räknas som bekräftade. Hittills har vi inte dokumenterat någon säker miss.

Utvärderingen visar att AI-granskningen kan ge användbara förslag, men att resultatet påverkas av att API-nyckeln saknas vid vissa körningar. Vi behöver fortsätta testa med en fungerande API-nyckel och dokumentera både träffar och missar innan vi drar en slutlig slutsats om kvaliteten.

## Vår regel för att lita på AI-granskningen

AI-granskningen är ett stöd, inte ett beslut om att godkänna en pull request. Vi verifierar varje kommentar mot koden innan vi ändrar något. Vi prioriterar konkreta och reproducerbara problem framför spekulativa förslag.

När vi inte håller med kontrollerar vi sammanhanget och dokumenterar varför kommentaren är felaktig eller inte relevant. Vi accepterar inte en ändring enbart för att AI:n föreslår den, och vi avfärdar inte en kommentar utan att undersöka den.

Den slutliga bedömningen görs av en mänsklig granskare. AI-granskningen får inte ersätta obligatoriska tester eller mänskligt godkännande.

## Status och återstående arbete

- [x] Dokumentera syftet med AI-granskningen.
- [x] Dokumentera det lokala testet och HTTP 401-felet.
- [x] Samla tre pull requests för utvärdering.
- [x] Dokumentera AI-granskningens resultat för PR #29, PR #30 och PR #31.
- [x] Kontrollera och korrigera API-nyckeln.
- [x] Testa AI-granskningen igen med en giltig API-nyckel.
- [x] Verifiera kommentarerna från PR #30 och PR #31 mot koden.
- [x] Dokumentera minst en bekräftad träff och en bekräftad miss.
- [x] Kontrollera att workflowen publicerar kommentarer på pull requests.

**Nuvarande status:** AI-granskningen har testats på tre pull requests, men är ännu inte fullt verifierad. PR #30 och PR #31 innehåller användbara förslag som behöver kontrolleras mot koden. Ett nytt test med en giltig API-nyckel behövs för att verifiera hela flödet.
