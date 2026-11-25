# Säkerhet – Kraftly Suzan Team

## Hotbilden i en mening

Kraftly-portalen hanterar kunduppgifter och fakturainformation som måste skyddas från obehörig åtkomst. En angripare kan försöka komma åt en annan kunds uppgifter, manipulera indata eller missbruka inloggningen.

## Autentiseringen (M6)

Frontend använder Vites proxy för API-anrop via `/api`. API-adressen konfigureras med miljövariabeln `API_URL`, och proxykonfigurationen skickar `X-Api-Key` från `API_KEY`.

Den externa API-adressen är `https://kraftly-api.sprinto.cloud`. API-nyckeln ska förvaras i miljövariabler och inte committas till Git eller exponeras i frontendens kod.

Vi behöver verifiera hur användarens access token lagras, hur refresh fungerar och hur API:t kontrollerar behörighet till skyddade resurser. Vi ska inte förlita oss enbart på kontroller i frontend.

## OWASP Top 10 – genomgång

| #   | Risk                                  | Gäller oss?                          | Vad vi hittade                                                                                                                                                                                                                                                                                                              | Vad vi gjorde                                                                                                                                               | Kontroll                                                                                                                                                      |
| --- | ------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A01 | Broken Access Control                 | Ja – behöver verifieras              | Vi behöver kontrollera att en kund inte kan hämta en annan kunds fakturor genom att ändra ett ID eller en parameter.                                                                                                                                                                                                        | Vi dokumenterar detta som en kontrollpunkt och granskar hur API:t verifierar kundens behörighet.                                                            | Testa med två testkonton och verifiera att konto A inte kan läsa konto B:s fakturor.                                                                          |
| A02 | Security Misconfiguration             | Ja                                   | Staging-sidan svarade med `HTTP/1.1 200 OK`. Svaret innehöll `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` och `Referrer-Policy: strict-origin-when-cross-origin`. Serverinformation: `Server: cloudflare` och `x-render-origin-server: nginx/1.27.5`. | Vi verifierade säkerhetsheaders med `curl -i` och uppdaterade dokumentationen med de faktiska resultaten från staging.                                      | Kör `curl -i https://kraftly-suzan-team-staging-ny.onrender.com` och kontrollera headers på både normala svar och relevanta felsvar.                          |
| A03 | Software Supply Chain Failures        | Ja – behöver verifieras              | Projektet använder npm-paket som kan innehålla kända sårbarheter. Resultatet från `npm audit` har inte dokumenterats här.                                                                                                                                                                                                   | Vi behöver granska beroenden och bedöma eventuella sårbarheter innan vi uppdaterar paket.                                                                   | Kör `npm audit` och dokumentera resultatet samt eventuella kvarstående problem.                                                                               |
| A04 | Cryptographic Failures                | Ja – behöver verifieras              | Frontend är tillgänglig via HTTPS. Vi behöver kontrollera att hemligheter och känsliga uppgifter inte exponeras i klientkod eller Git.                                                                                                                                                                                      | API-nyckeln ska lagras som en miljövariabel och inte i versionshanterad kod.                                                                                | Granska Git och byggda klientfiler efter hemligheter. Kontrollera att trafik till API:t använder HTTPS.                                                       |
| A05 | Injection (XSS för oss)               | Ja – risken har kontrollerats delvis | Sökningen efter `v-html` i `src` och `tests` gav inga träffar. Tidigare träffar kom från `node_modules`, där Vue och ESLint innehåller referenser till direktivet.                                                                                                                                                          | Ingen användning av `v-html` hittades i de sökta mapparna. Vi ska fortsätta använda Vue-interpolation för vanlig text och undvika osanerad HTML från API:t. | Kör sökningen igen i `src` och `tests`. Testa att HTML-liknande indata visas som text och inte körs.                                                          |
| A06 | Insecure Design                       | Ja – behöver verifieras              | Vi behöver kontrollera att skyddade funktioner kräver autentisering och att behörigheten kontrolleras av API:t.                                                                                                                                                                                                             | Vi granskar flödena för inloggning, kunddata och fakturor.                                                                                                  | Testa skyddade endpoints utan giltig autentisering och verifiera att obehöriga anrop nekas.                                                                   |
| A07 | Authentication Failures               | Ja – behöver verifieras              | Vi har ännu inte verifierat skydd mot upprepade inloggningsförsök, hantering av utgångna token eller skillnader mellan felaktig e-post och felaktigt lösenord.                                                                                                                                                              | Vi behöver granska autentiseringsflödet och dokumentera vilka kontroller som faktiskt finns i API:t.                                                        | Testa felaktiga inloggningsuppgifter och utgången token. Kontrollera att skyddade endpoints nekar obehöriga anrop och undersök om upprepade försök begränsas. |
| A08 | Software/Data Integrity Failures      | Ja – behöver verifieras              | Vi behöver kontrollera att API:t inte litar på klientens uppgifter om roller, ägarskap eller behörigheter.                                                                                                                                                                                                                  | Behörighetskontroller och validering ska göras på serversidan.                                                                                              | Försök ändra en relevant parameter i ett testanrop och kontrollera att API:t nekar otillåtna ändringar.                                                       |
| A09 | Logging & Alerting Failures           | Ja – behöver verifieras              | Vi har inte verifierat vilka säkerhetshändelser som loggas eller hur fel upptäcks.                                                                                                                                                                                                                                          | Vi behöver granska loggningen och se till att lösenord, API-nycklar och token inte skrivs till loggar.                                                      | Granska loggar efter ett misslyckat inloggningsförsök och kontrollera att inga hemligheter förekommer.                                                        |
| A10 | Mishandling of Exceptional Conditions | Ja                                   | Staging returnerade `429 Too Many Requests` vid ett API-anrop. Vi har inte verifierat hur frontend hanterar detta svar.                                                                                                                                                                                                     | Vi behöver kontrollera att frontend hanterar begränsningar, nätverksfel och autentiseringsfel utan att krascha eller visa känslig information.              | Testa hur frontend hanterar `401`, `429` och nätverksfel. Kontrollera att användaren får ett begripligt felmeddelande.                                        |

## Säkerhetsheaders i staging

Vi kontrollerade staging med:

```powershell
curl -i https://kraftly-suzan-team-staging-ny.onrender.com
```

Kontrollen genomfördes den 24 november 2026.

Svaret hade status:

```text
HTTP/1.1 200 OK
```

Följande säkerhetsheaders observerades:

```text
content-security-policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'

referrer-policy: strict-origin-when-cross-origin

strict-transport-security: max-age=31536000; includeSubDomains

x-content-type-options: nosniff

x-frame-options: DENY
```

Serverinformation:

```text
Server: cloudflare
x-render-origin-server: nginx/1.27.5
```

Resultatet visar att följande säkerhetsheaders finns i staging-svaret vid kontrollen:

- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`

Vi har därmed verifierat säkerhetsheaders i ett normalt HTTP 200-svar. Det behöver även kontrolleras om headers finns på relevanta felsvar.

Serverversionsinformationen `nginx/1.27.5` behöver granskas vidare.

## Kända brister (medvetet kvar)

- Åtkomstkontroll mellan kunder behöver verifieras med testkonton.
- Säkerhetsheaders har verifierats i ett normalt HTTP 200-svar på staging. Headers behöver även kontrolleras på relevanta felsvar. Serverversionsinformationen behöver fortfarande granskas.
- Skydd mot upprepade inloggningsförsök och hantering av token behöver verifieras.
- Resultatet från `npm audit` behöver granskas och dokumenteras.
- Hanteringen av `429 Too Many Requests` i frontend behöver testas.
- Vi har inte dokumenterat att dessa kontroller är åtgärdade förrän resultaten kan verifieras med kod eller test.
