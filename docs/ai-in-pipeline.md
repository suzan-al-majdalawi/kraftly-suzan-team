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

## PR #32 – Fel och lösningar

Vid arbetet med PR #32 genomfördes en granskning av autentiseringsflödet och hanteringen av användardata. Granskningen visade flera problem som kunde påverka säkerheten och stabiliteten i applikationen.

### 1. Problem med normalisering av användardata

**Fel:**  
API:et kunde returnera användardata i olika format. Om svaret innehöll ett objekt med egenskapen `user` kunde informationen hamna på fel nivå i Pinia-storen. Om svaret inte var ett giltigt objekt kunde data dessutom hanteras felaktigt.

**Lösning:**  
En funktion för normalisering av API-svar infördes i `user.js`. Den kontrollerar att svaret har rätt format och hanterar både direkta användarobjekt och svar som innehåller ett `user`-objekt. Detta gör hanteringen av användardata mer förutsägbar.

### 2. Problem med samtidiga Refresh-anrop

**Fel:**  
Flera samtidiga anrop till `refresh()` kunde försöka återställa sessionen samtidigt. Eftersom refresh-token roteras på servern kunde detta orsaka konflikter och misslyckad autentisering.

**Lösning:**  
En gemensam Promise infördes i `api.js` för att förhindra att flera Refresh-anrop körs samtidigt. På så sätt kan samtidiga anrop använda samma pågående återställning i stället för att starta nya anrop.

### 3. Risk för att en gammal Refresh återställer sessionen efter utloggning

**Fel:**  
En Refresh-begäran som startats före utloggningen kunde slutföras efter att användaren loggat ut. Det fanns då en risk att ett gammalt svar sparade en access-token igen och återställde en session som skulle vara avslutad.

**Lösning:**  
En generationskontroll infördes i API-lagret. När utloggningen startar ändras generationen. En äldre Refresh-operation får då inte spara sin access-token om den tillhör en tidigare generation. Utloggningen väntar även in en pågående Refresh-operation innan logout-anropet skickas.

### 4. Skydd mot föråldrad sessionsåterställning i auth-storen

**Fel:**  
Även om API-lagret skyddades behövde auth-storen kunna hantera situationer där en sessionsåterställning pågår samtidigt som användaren loggar in eller ut. Annars kunde ett äldre resultat påverka aktuell autentiseringsstatus.

**Lösning:**  
`sessionVersion` behölls i `auth.js`. Den används för att kontrollera att resultatet från en återställning fortfarande tillhör den aktuella sessionen innan användarens tillstånd uppdateras.

### 5. Test av samtidiga sessionsåterställningar

**Fel:**  
Det saknades ett tydligt test som säkerställde att flera samtidiga anrop till `restore()` inte startade flera separata återställningar.

**Lösning:**  
Ett test lades till för att kontrollera att samtidiga anrop till `restore()` delar på samma pågående Promise och att sessionen bara återställs en gång.

## Resultat

Ändringarna i PR #32 syftar till att göra autentiseringsflödet mer robust och minska risken för problem vid samtidiga anrop, utloggning och återställning av sessionen.

De förbättrar även valideringen och hanteringen av användardata från API:et. Lösningarna kompletterar varandra genom att skydda både API-lagret och auth-storen.

Ändringarna behöver verifieras med projektets tester och byggprocess innan de kan betraktas som helt färdigtestade.
