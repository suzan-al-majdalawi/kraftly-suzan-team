# Deploy – Kraftly Mina sidor

## 1. Syfte

Det här dokumentet beskriver hur Kraftly Mina sidor byggs, publiceras och driftsätts till staging med Docker, GitHub Actions, GitHub Container Registry (GHCR) och Render.

Dokumentet beskriver även:

- CI/CD-flödet från pull request till staging.
- Hur Docker-imagen byggs och publiceras.
- Hur Render använder en publicerad image.
- Skillnaden mellan lokal konfiguration och staging-konfiguration.
- Hantering av miljövariabler och secrets.
- Runtime-konfiguration och feature flags.
- Verifiering efter deploy.
- Rollback om en ny version orsakar problem.
- Kända begränsningar och återstående arbete.

Målet är att deployen ska vara spårbar och reproducerbar. Det ska gå att se vilken commit som byggdes, vilken image som publicerades och vilken version som faktiskt körs i staging.

## 2. Miljöer och infrastruktur

Projektet använder en lokal utvecklingsmiljö och en stagingmiljö.

| Miljö   | URL                     | Image                                                | API                     | Uppdatering                             |
| ------- | ----------------------- | ---------------------------------------------------- | ----------------------- | --------------------------------------- |
| Lokal   | `http://localhost:8080` | Lokal Docker-build                                   | `http://localhost:4000` | Manuellt med Docker Compose             |
| Staging | Render staging-URL      | `ghcr.io/suzan-al-majdalawi/kraftly-suzan-team:main` | Render API-URL          | GitHub Actions → GHCR → Render redeploy |

**Staging:**  
https://kraftly-suzan-team-staging-ny.onrender.com/

**Produktion:**  
https://kraftly-suzan-team-production-ny.onrender.com/

Produktionsadressen finns dokumenterad, men det innebär inte i sig att produktionsmiljön är färdigkonfigurerad eller att den har samma deployflöde som staging.

### Infrastrukturens ansvar

| Tjänst         | Ansvar                                                       |
| -------------- | ------------------------------------------------------------ |
| GitHub         | Källkod, branches och pull requests                          |
| GitHub Actions | CI, Docker-build och publicering                             |
| GHCR           | Lagring av Docker-images                                     |
| Render         | Körning av staging-tjänsten                                  |
| Docker         | Paketering av frontend och runtime-miljö                     |
| Nginx          | Servering av frontend och hantering av runtime-konfiguration |

## 3. CI/CD-flödet

Det övergripande flödet är:

```text
Utveckling
    ↓
Pull request
    ↓
CI – tester och build
    ↓
Granskning och godkännande
    ↓
Merge till main
    ↓
GitHub Actions
    ↓
Docker-build
    ↓
Publicera image till GHCR
    ↓
Render – deploy/redeploy
    ↓
Verifiering av staging
```

### Steg 1 – Ändring och pull request

Utvecklaren gör en ändring i en feature-branch och pushar den till GitHub.

En pull request skapas mot `main`.

Innan ändringen mergas ska relevanta kontroller genomföras, exempelvis:

- Kodgranskning.
- Unit- och komponenttester.
- API-tester.
- Tillgänglighetstester.
- Produktionsbuild.
- Eventuella E2E-tester.

Syftet är att upptäcka fel innan ändringen når staging.

### Steg 2 – CI körs

GitHub Actions kör projektets konfigurerade kontroller.

Exempel på kontroller:

```bash
npm run test:run
npm run test:api
npm run test:a11y
npm run build
```

Om projektets workflow innehåller ytterligare tester ska även dessa köras.

En pull request ska inte mergas om obligatoriska kontroller misslyckas, om inte teamet uttryckligen har beslutat om ett undantag.

### Steg 3 – Merge till main

När pull requesten har granskats och godkänts mergas den till `main`.

Detta utlöser det publiceringsflöde som är konfigurerat i GitHub Actions.

### Steg 4 – Docker-image byggs

GitHub Actions bygger frontendens Docker-image med projektets `Dockerfile`.

Builden paketerar applikationen och dess runtime-miljö så att samma image kan användas i olika miljöer.

Det är viktigt att skilja på:

- **Build:** Docker-imagen skapas.
- **Publish:** Imagen laddas upp till GHCR.
- **Deploy:** Render startar en tjänst med imagen.

Dessa steg är inte samma sak.

### Steg 5 – Image publiceras till GHCR

Efter en lyckad build publicerar GitHub Actions imagen till GitHub Container Registry.

Image-taggen som används är:

```text
ghcr.io/suzan-al-majdalawi/kraftly-suzan-team:main
```

Taggen `main` pekar på den image som senast publicerats med den taggen. Den är därför inte en permanent versionsidentifierare.

För bättre spårbarhet bör även en image med commit-SHA användas, exempelvis:

```text
ghcr.io/suzan-al-majdalawi/kraftly-suzan-team:<commit-sha>
```

Då går det att identifiera exakt vilken kodversion en image innehåller.

### Steg 6 – Render använder imagen

Render-konfigurationen använder en redan byggd Docker-image via alternativet **Existing Image**.

Render hämtar imagen från GHCR och startar tjänsten med den konfiguration som finns i Render.

**Viktigt:** När GitHub Actions publicerar en ny image innebär det inte automatiskt att Render börjar köra den nya imagen.

En ny image behöver följas av en ny deploy eller redeploy i Render, om inte ett separat automatiserat deployflöde är konfigurerat.

Om en Render Deploy Hook används kan GitHub Actions anropa den efter att publiceringen till GHCR har lyckats.

### Steg 7 – Deploy verifieras

Efter deploy kontrolleras att:

1. Render har genomfört deployen utan fel.
2. Tjänsten har status `Live`.
3. Rätt image och commit körs.
4. Staging-URL svarar.
5. Frontend laddas utan runtime-fel.
6. API-anrop fungerar.
7. Runtime-konfigurationen har rätt miljöinställningar.
8. Render-loggarna inte visar nya start- eller konfigurationsfel.

En lyckad Docker-build betyder inte automatiskt att deployen är lyckad. Verifieringen måste göras efter att Render har startat den nya versionen.

## 4. Docker och lokal utveckling

Lokalt används Docker Compose för att starta frontend och mock-API tillsammans.

Frontend nås normalt via:

```text
http://localhost:8080
```

API nås via:

```text
http://localhost:4000
```

Starta den lokala miljön med:

```bash
docker compose up --build
```

Stoppa miljön med:

```bash
docker compose down
```

Om containrarna redan är byggda och ingen ny build behövs kan de startas utan `--build`.

### Lokal miljövariabel

Den lokala filen `.env` innehåller lokala värden och ska inte committas.

Exempel:

```env
API_KEY=lokal-utvecklingsnyckel
API_URL=http://localhost:4000
```

Kontrollera att `.env` är undantagen i `.gitignore`.

### Docker Compose-konfiguration

Web-containern använder bland annat miljövariabler för att kommunicera med API-containern.

Exempel:

```yaml
environment:
  APP_ENV: staging
  API_URL: http://api:4000
  API_KEY: ${API_KEY:?API_KEY saknas – kontrollera .env}
```

Observera att `api` är tjänstens nätverksnamn inne i Docker Compose. Det är därför inte samma adress som `localhost:4000`.

`APP_ENV` ska sättas till rätt miljö. Om konfigurationen används lokalt bör värdet inte ange staging om det inte är avsiktligt.

## 5. Konfiguration – var finns variablerna?

Miljövariabler används för att skilja mellan lokal utveckling och staging.

| Variabel             | Hemlig? | Lokalt                                             | Staging                                               | Används av                            |
| -------------------- | ------- | -------------------------------------------------- | ----------------------------------------------------- | ------------------------------------- |
| `API_KEY`            | Ja      | `.env`                                             | Render Environment                                    | API och eventuell serverkonfiguration |
| `API_URL`            | Nej     | `http://localhost:4000` eller intern Docker-adress | Render API-URL                                        | Web/Nginx eller runtime-konfiguration |
| `PORT`               | Nej     | Enligt lokal serverkonfiguration                   | Render-port, exempelvis `10000`                       | Server/Render                         |
| `APP_ENV`            | Nej     | `local`                                            | `staging`                                             | Runtime-konfiguration                 |
| `RENDER_DEPLOY_HOOK` | Ja      | Behövs normalt inte                                | GitHub Actions secret om hook används                 | GitHub Actions                        |
| `STAGING_URL`        | Nej     | Behövs normalt inte                                | GitHub Actions/CI                                     | Verifiering                           |
| `GITHUB_TOKEN`       | Ja      | Behövs normalt inte                                | GitHub Actions tillhandahåller normalt `GITHUB_TOKEN` | GitHub/GHCR                           |

Den exakta användningen av variablerna ska följa projektets Docker-, Nginx- och workflow-konfiguration.

### Secrets

Hemliga värden ska lagras i en säker miljö:

- Lokalt i `.env`.
- I Render Environment för relevanta tjänster.
- I GitHub Actions Secrets om workflowen behöver dem.

Hemligheter får inte skrivas in i:

- Frontend-kod.
- `config.js`.
- `compose.yaml` som hårdkodade värden.
- Dockerfile.
- README eller deploydokumentation.
- Git-historiken.

`GITHUB_TOKEN` är en särskild GitHub Actions-variabel och behöver normalt inte skapas manuellt. Workflowen ska ha rätt behörigheter, exempelvis `packages: write`, för att publicera till GHCR.

## 6. Runtime-konfiguration

Frontend-imagen använder:

```text
docker/40-runtime-config.sh
```

Skriptet skapar `config.js` när Nginx-containern startar.

Det gör att samma frontend-image kan användas i flera miljöer med olika inställningar.

Exempel på runtime-konfiguration för staging:

```javascript
window.__KRAFTLY__ = {
  env: "staging",
  features: {
    norway: true,
  },
};
```

### Miljöinställningar

- `env` anger vilken miljö frontend kör i.
- `features.norway` styr om Norge-funktionen är aktiverad.

I staging är Norge-funktionen aktiverad:

```javascript
norway: true;
```

Produktionsmiljön ska konfigureras separat och ska inte automatiskt ärva staging-inställningen.

Om Norge-funktionen ska vara avstängd i produktion ska konfigurationen exempelvis ange:

```javascript
norway: false;
```

### Varför runtime-konfiguration?

Runtime-konfiguration innebär att samma Docker-image kan användas i flera miljöer utan att frontend behöver byggas om för varje miljö.

Det minskar risken för att staging och produktion använder olika kodversioner enbart på grund av miljöspecifika inställningar.

### Säkerhet

`config.js` är tillgänglig för webbläsaren och ska därför betraktas som offentlig information.

Filen får aldrig innehålla:

- `API_KEY`
- `JWT_SECRET`
- Lösenord
- Privata tokens
- Andra hemligheter

Endast publika inställningar, exempelvis miljönamn och feature flags, ska exponeras där.

## 7. API-nyckeln

### Den gamla nyckeln

Den tidigare API-nyckeln gav HTTP `401 Unauthorized` vid test med `curl`.

En `401` betyder att API:et inte accepterade autentiseringen. Det kan exempelvis bero på fel nyckel, fel format eller att nyckeln har återkallats.

Den gamla nyckeln ska inte fortsätta användas utan kontroll.

### Den nya nyckeln

Den nya nyckeln ska lagras som en secret/environment variable i den miljö där API:et körs.

Exempel på variabelnamn:

```text
API_KEY=<nyckeln>
```

Det faktiska värdet ska aldrig skrivas in i dokumentationen.

### Git-historiken

Om en API-nyckel har committats ska den betraktas som exponerad, även om filen senare har ändrats.

Rekommenderad åtgärd:

1. Återkalla eller rotera den gamla nyckeln.
2. Skapa en ny nyckel.
3. Lägg den nya nyckeln i rätt secrets-hantering.
4. Kontrollera att API:et använder den nya nyckeln.
5. Testa autentiseringen.
6. Kontrollera att nyckeln inte exponeras i frontend eller loggar.

Om en aktiv secret har läckt i Git-historiken bör historiken saneras enligt projektets säkerhetsrutiner. Att bara ta bort nyckeln från den senaste versionen räcker inte.

## 8. Verifiering efter deploy

Varje staging-deploy ska verifieras innan den betraktas som färdig.

### Kontroll 1 – Render-status

Öppna Render-dashboarden och kontrollera att tjänsten har status:

```text
Live
```

Kontrollera även deployhistoriken och att den senaste deployen har slutförts.

### Kontroll 2 – Staging-URL

Öppna:

https://kraftly-suzan-team-staging-ny.onrender.com/

Kontrollera att:

- Startsidan laddas.
- Inloggningssidan fungerar.
- Inloggning fungerar med testkonto.
- Navigationen fungerar.
- Relevanta vyer laddas.
- Inga kritiska fel visas i webbläsarens konsol.

### Kontroll 3 – API

Kontrollera att API-tjänsten svarar.

Om health-endpointen finns tillgänglig:

```text
/healthz
```

Exempel:

```bash
curl -i https://<staging-api-url>/healthz
```

Kontrollera att API:et ger ett förväntat svar.

Ett lyckat health-check visar att tjänsten svarar, men det bevisar inte att alla API-funktioner fungerar. Därför behöver även relevanta API-anrop testas.

### Kontroll 4 – Version och commit

Om `/version.txt` är tillgänglig kan den användas för att kontrollera vilken version som körs.

Exempel:

```bash
curl -i https://<staging-url>/version.txt
```

Jämför resultatet med commit-SHA för den version som skulle deployas.

Om endpointen inte finns ska motsvarande versionsinformation kontrolleras via Render och GHCR.

### Kontroll 5 – Loggar

Öppna Render-loggarna och kontrollera:

- Att containern startar.
- Att Nginx startar korrekt.
- Att runtime-konfigurationen skapas.
- Att API-anslutningen fungerar.
- Att inga nya kritiska fel uppstår.

### Kontroll 6 – Funktionell kontroll

Testa de viktigaste användarflödena efter deploy:

- Inloggning och utloggning.
- Laddning av dashboard.
- Hämtning av användaruppgifter.
- Fakturavy.
- Förbrukningsinformation.
- Relevanta feature flags.
- Norge-funktionen i staging.

Det är särskilt viktigt att testa funktioner som har ändrats i den aktuella pull requesten.

## 9. Rollback

Rollback används om en ny deploy orsakar fel som påverkar användarna eller gör staging instabil.

Målet är att snabbt återgå till en tidigare fungerande version.

### Metod 1 – Rollback till tidigare Docker-image

1. Identifiera den senaste fungerande image-taggen eller commit-SHA.
2. Öppna Render-dashboarden.
3. Öppna aktuell staging-service.
4. Kontrollera vilken image som används.
5. Välj den tidigare fungerande imagen.
6. Spara ändringen.
7. Starta en ny deploy/redeploy.
8. Vänta tills Render visar `Live`.
9. Öppna staging-URL.
10. Kontrollera versionen och API-anropen.

Exempel på image med commit-SHA:

```text
ghcr.io/suzan-al-majdalawi/kraftly-suzan-team:<previous-commit-sha>
```

Att använda en SHA-tagg är säkrare än att använda `main` vid rollback eftersom SHA-taggen pekar på en specifik version.

### Metod 2 – Rollback genom Git

Om ändringen ska återställas i källkoden används en revert.

1. Identifiera den commit som orsakade problemet.
2. Skapa en revert av ändringen.
3. Kontrollera ändringen lokalt.
4. Skapa en pull request om projektets arbetsflöde kräver det.
5. Granska och godkänn pull requesten.
6. Mergа återställningen till `main`.
7. GitHub Actions kör CI.
8. En ny Docker-image byggs.
9. Imagen publiceras till GHCR.
10. Render deployas/redeployas med den nya imagen.
11. Verifiera staging och kontrollera loggarna.

En Git-revert skapar en ny commit. Den skriver inte om den tidigare historiken.

### Kontroll efter rollback

Rollbacken betraktas som genomförd när:

- Render visar tjänsten som `Live`.
- Staging-URL svarar.
- Applikationen laddas utan kritiska runtime-fel.
- API-anrop fungerar.
- Rätt version eller commit körs.
- Render-loggarna inte visar nya start- eller konfigurationsfel.
- De funktioner som påverkades av den tidigare deployen fungerar igen.

## 10. Uppmätta deploytider

Följande tider har noterats under deploytestet:

| Steg                                   |   Uppmätt tid |
| -------------------------------------- | ------------: |
| Merge → GitHub Actions publish klar    | 10,6 sekunder |
| Deploy hook/redeploy → rätt SHA svarar | 29,3 sekunder |
| Totalt: merge → verifierad staging     |     Ska mätas |
| Kallstart                              |     Ska mätas |

De två uppmätta delstegen summerar till cirka 39,9 sekunder.

Detta är inte automatiskt samma sak som den totala tiden från merge till verifierad staging. Den totala tiden behöver mätas separat med samma start- och sluttidpunkt.

Tiderna kan variera beroende på build, kötid i GitHub Actions, image-publicering och Render-start.

### Hur tiderna ska mätas

- **Merge → publish klar:** från merge-tidpunkt till dess att GitHub Actions har publicerat imagen.
- **Deploy → rätt SHA svarar:** från start av deploy/redeploy till dess att versionskontrollen visar rätt commit.
- **Total deploytid:** från merge till godkänd verifiering av staging.
- **Kallstart:** från första anrop efter inaktivitet till dess att tjänsten svarar normalt.

Använd faktiska mätningar och dokumentera datum och vilken commit som testades.

## 11. Kända begränsningar och risker

### Render-kallstart

Render kan behöva starta om en tjänst efter inaktivitet.

Det kan göra att det första anropet tar längre tid än efterföljande anrop.

Det är viktigt att skilja på en långsam kallstart och ett faktiskt driftfel.

### Deploy sker inte nödvändigtvis automatiskt

GitHub Actions kan bygga och publicera en ny image utan att Render automatiskt börjar använda den.

Om en Deploy Hook används ska det kontrolleras att:

- Hooken ligger som GitHub Actions secret.
- Workflowen anropar hooken efter lyckad publicering.
- Deployen använder rätt image.
- Workflowen kontrollerar resultatet.

Om detta inte är automatiserat måste redeploy göras manuellt i Render.

### Render-konto och behörigheter

Det ska vara tydligt vem som äger och administrerar Render-kontot.

Teamet behöver veta:

- Vem som kan ändra staging-service.
- Vem som kan ändra environment variables.
- Vem som kan starta redeploy.
- Vem som kan genomföra rollback.

Secrets och deploy-behörigheter ska inte delas genom osäkra kanaler.

### CPU-arkitektur

Docker-imagen behöver byggas för en arkitektur som stöds av Render.

För den aktuella deploymenten är avsedd arkitektur:

```text
linux/amd64
```

Om GitHub Actions-workflowen ändras ska det kontrolleras att rätt plattform fortfarande byggs.

### GHCR-behörigheter

GitHub Actions behöver behörighet att publicera Docker-images till GHCR.

Kontrollera workflowens permissions, exempelvis:

```yaml
permissions:
  contents: read
  packages: write
```

Om GHCR-imagen är privat måste Render också ha rätt att hämta den.

### Ingen verifierad produktionsprocess

Staging är den miljö som beskrivs i det nuvarande deployflödet.

Produktion ska inte betraktas som färdigkonfigurerad förrän följande är etablerat och verifierat:

- Separat produktionsservice.
- Produktionsspecifika environment variables.
- Produktionsspecifika secrets.
- API-anslutning.
- Feature flag-konfiguration.
- Deploy med godkännande.
- Verifiering efter deploy.
- Rollback-rutin.

## 12. Produktion och M5

Målet för M5 är att produktion ska deployas med samma Docker-image och commit-SHA som har verifierats i staging.

Det innebär följande flöde:

```text
Merge till main
      ↓
CI
      ↓
Build Docker-image
      ↓
Publicera image till GHCR
      ↓
Deploy till staging
      ↓
Verifiera staging
      ↓
Approval
      ↓
Deploy samma image till produktion
      ↓
Verifiera produktion
```

Produktionsdeployen ska använda samma image som verifierats i staging. Den ska inte bygga en separat image med annan kod.

Miljöspecifika inställningar, till exempel API-URL och feature flags, ska däremot konfigureras separat.

Produktionsdeploy ska kräva ett uttryckligt godkännande innan den genomförs.

## 13. Viktiga filer

| Fil                           | Syfte                                                              |
| ----------------------------- | ------------------------------------------------------------------ |
| `Dockerfile`                  | Bygger frontend/Nginx-imagen                                       |
| `mock-api/Dockerfile`         | Bygger backend-imagen för mock-API med Node.js och Express         |
| `compose.yaml`                | Startar lokal web och API                                          |
| `nginx.config.template`       | Nginx-konfiguration med runtime-variabler                          |
| `docker/40-runtime-config.sh` | Skapar `config.js` vid containerstart                              |
| `.env`                        | Lokala secrets och miljövariabler                                  |
| `mock-api/.env`               | Lokala miljövariabler och secrets för mock-API. Ska inte committas |
| `.env.example`                | Exempel på lokala och mock-API miljövariabler                      |
| `.github/workflows/`          | CI/CD och publicering till GHCR                                    |

Kontrollera alltid att filnamnen stämmer med projektets aktuella struktur.

## 14. Checklista inför och efter deploy

### Inför deploy

- [x] Pull request är granskad och godkänd.
- [x] Obligatoriska CI-kontroller är gröna.
- [x] Produktionsbuild fungerar.
- [x] Ändringen är mergad till `main`.
- [x] GitHub Actions har byggt imagen.
- [x] Imagen har publicerats till GHCR.
- [x] Rätt commit-SHA finns tillgänglig.
- [x] Render använder rätt image.

### Efter deploy

- [x] Render visar `Live`.
- [x] Rätt image/commit körs.
- [x] Staging-URL svarar.
- [x] API health-check fungerar.
- [x] Frontend laddas utan kritiska fel.
- [x] Inloggning fungerar.
- [x] Viktiga användarflöden fungerar.
- [x] Runtime-konfigurationen är korrekt.
- [x] Feature flags har rätt värden.
- [x] Render-loggarna är kontrollerade.
- [x] Deploytiden är dokumenterad.

## 15. Sammanfattning

Kraftly Mina sidor använder GitHub Actions för CI och för att bygga och publicera Docker-images till GHCR. Render använder en publicerad image för att köra staging.

Det är viktigt att skilja mellan att bygga en image, publicera den och faktiskt driftsätta den. En publicerad image innebär inte automatiskt att Render kör den senaste versionen.

Varje deploy ska därför följas av verifiering av tjänstens status, image/commit, frontend, API och relevanta användarflöden.

Rollback ska kunna göras genom att återgå till en tidigare image eller genom att revert:a en ändring i Git.

Målet för M5 är att samma SHA/image som har verifierats i staging ska kunna deployas till produktion efter ett uttryckligt godkännande.
