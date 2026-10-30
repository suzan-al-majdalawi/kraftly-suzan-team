# Beslut: var access token lagras i browsern

**Datum:** 2026-10-30 · **Beslutat av:** teamet (tech lead: Suzan) · **Status:** gäller

## Beslut

Access token (JWT, 10 minuter) lagras **bara i minnet**, i en variabel i `src/services/token.js`. Refresh token lagras i en **httpOnly-cookie** (`SameSite=Strict`, `Secure`, `Path=/api/v2/auth`) som bara når API:ts auth-endpoints. Vid omladdning ber appen om en ny access token med cookien innan den visar något.

## Bakgrund

M6 ersätter fejk-inloggningen (`localStorage.kraftly_logged_in`) med riktig autentisering mot Kraftlys API v2. API:t ger en access token och en refresh token; frågan är var browsern ska ha dem. Vi behandlade först `localStorage` som självklart – det är vad de flesta tutorials gör – tills hackerlabbet visade vad en XSS kostar då.

## Alternativ vi jämförde

|                      | `localStorage`                                  | Cookie (httpOnly) för allt                                                  | **Minne + refresh-cookie**                                                          |
| -------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| XSS kan läsa token   | **ja** – `localStorage.kraftly_token` är en rad | nej                                                                         | nej (access token finns i en closure; refresh är httpOnly)                          |
| CSRF                 | nej (skickas inte automatiskt)                  | **ja** – cookien följer med från andra sajter; kräver SameSite + CSRF-token | nej för data (Bearer skickas aldrig automatiskt); refresh-cookien är Strict         |
| Överlever omladdning | ja                                              | ja                                                                          | nej – men refresh-cookien gör att appen hämtar en ny på ~50 ms                      |
| Kod i klienten       | minst                                           | minst                                                                       | en refresh-loop vid 401                                                             |
| Flera flikar         | delar token                                     | delar cookie                                                                | varje flik gör sin egen refresh (rotation gör att bara en vinner – se konsekvenser) |

## Motivering

XSS är den realistiska attacken mot en frontend – ett beroende, en `v-html`, en oskyddad tredjepartswidget. Med token i `localStorage` är en enda XSS lika med stulen inloggning som fungerar från angriparens dator tills token går ut. Med token i minnet måste angriparen köra sina anrop _från vår sida, medan användaren är där_ – fortfarande illa, men inte en stöld man tar med sig. CSP (`connect-src 'self'`) stänger dessutom vägen ut för stulna data.

Att lägga även access token i en cookie hade gett CSRF-problemet i stället, och krävt en CSRF-token per anrop. Refresh-cookien har `SameSite=Strict` och når bara `/api/v2/auth`, så det värsta en CSRF kan göra är att be om en token som angriparen ändå inte får läsa.

## Genomförande – 2026-10-30

Beslutet implementerades i samband med arbetet med autentiseringen i Kraftlys frontend och mock-API.

- Access token hanteras i minnet via `src/services/token.js`, inte i `localStorage`.
- API-anrop använder access token som `Authorization: Bearer ...`.
- Refresh sker via `/api/v2/auth/refresh` med httpOnly-cookien.
- Inloggning, refresh och utloggning hanteras via `src/services/api.js`.
- Frontendens sessionskontroll använder `hasSession` och refresh-flödet vid sidladdning.
- Backendens refresh-cookie är konfigurerad med `httpOnly`, `SameSite=Strict` och sökvägen `/api/v2/auth`.

**Verifiering:** Vi har arbetat med och testat autentiseringsflödet lokalt den 2026-10-30. Kontrollera att inloggning, omladdning av sidan och utloggning fungerar innan beslutet markeras som fullt verifierat i staging.

## Konsekvenser

- Varje omladdning kostar ett anrop till `/auth/refresh` innan första sidan visas (~50 ms mot staging).
- Refresh-rotation betyder att två flikar som refreshar samtidigt kan göra att den ena får 401 och loggas ut. Vi accepterar det för nu; lösningen är en kort "grace period" i API:t.
- Token i minnet gör det omöjligt att "spara inloggningen" över en omstart av browsern längre än cookiens 8 timmar. Det är avsiktligt för en kundportal med fakturor.
- Om Kraftly inför extra inloggningsskydd, till exempel MFA eller BankID, kan vi behöva ändra hur inloggningen fungerar. Då kan vi använda en extern inloggningstjänst. Vi kan fortfarande ha access token i minnet och låta tjänsten hantera förnyelsen.

**Omprövas om:** vi ser återkommande problem med samtidiga refresh-anrop mellan flikar, om säkerhetskraven ändras eller om vi inför en extern identitetsleverantör.
