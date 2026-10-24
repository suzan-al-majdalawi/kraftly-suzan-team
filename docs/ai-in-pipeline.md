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

**Resultat:** AI-granskningen kunde inte genomföras. Det visar att skriptet nådde autentiseringssteget, men det bekräftar inte att AI-granskningen fungerar korrekt från början till slut. API-nyckeln behöver kontrolleras innan ett nytt test kan göras.

Skriptet avslutades utan att göra AI-felet till ett misslyckat CI-krav. Den avsedda funktionen är att vanlig kodgranskning och övriga CI-kontroller ska fortsätta även om AI-tjänsten inte är tillgänglig.

## Utvärdering av riktiga pull requests

AI-kommentarer ska utvärderas mot den faktiska koden innan vi drar slutsatser om kvaliteten. Följande tabell fylls i efter att minst tre riktiga pull requests har granskats.

| Pull request | AI-kommentar      | Bedömning             | Motivering              |
| ------------ | ----------------- | --------------------- | ----------------------- |
| PR 1         | Fyll i efter test | Träff / miss / osäker | Fyll i efter granskning |
| PR 2         | Fyll i efter test | Träff / miss / osäker | Fyll i efter granskning |
| PR 3         | Fyll i efter test | Träff / miss / osäker | Fyll i efter granskning |

En **träff** är en kommentar som pekar på ett verkligt och relevant problem. En **miss** är en kommentar som är felaktig eller saknar tillräckligt stöd i koden. **Osäker** används när underlaget inte räcker för att avgöra om kommentaren är korrekt.

Vi dokumenterar minst ett exempel på en träff och ett exempel på en miss, med korta citat från AI-kommentaren och en förklaring av bedömningen.

## Vår regel för att lita på AI-granskningen

AI-granskningen är ett stöd, inte ett beslut om att godkänna en pull request. Vi verifierar varje kommentar mot koden innan vi ändrar något. Vi prioriterar konkreta och reproducerbara problem framför spekulativa förslag.

När vi inte håller med kontrollerar vi sammanhanget och dokumenterar varför kommentaren är felaktig eller inte relevant. Vi accepterar inte en ändring enbart för att AI:n föreslår den, och vi avfärdar inte en kommentar utan att undersöka den.

Den slutliga bedömningen görs av en mänsklig granskare. AI-granskningen får inte ersätta obligatoriska tester eller mänskligt godkännande.
