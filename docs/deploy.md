# Deploy – Kraftly Mina sidor

## 1. Syfte

Det här dokumentet beskriver hur Kraftly Mina sidor byggs, publiceras och driftsätts till staging och produktion med Docker, GitHub Actions, GitHub Container Registry (GHCR) och Render.

Dokumentet beskriver även:

- CI/CD-flödet från pull request till deployment.
- Hur Docker-imagen byggs och publiceras.
- Hur Render använder en publicerad image.
- Skillnaden mellan lokal konfiguration, staging och produktion.
- Hantering av miljövariabler och secrets.
- Runtime-konfiguration och feature flags.
- Verifiering efter deploy.
- Rollback om en ny version orsakar problem.
- Kända begränsningar och återstående arbete.

Målet är att deployen ska vara spårbar och reproducerbar. Det ska gå att se vilken commit som byggdes, vilken image som publicerades och vilken version som faktiskt körs i respektive miljö.

## 2. Miljöer och infrastruktur

Projektet använder en lokal utvecklingsmiljö samt staging och produktion.

| Miljö      | URL                                                                          | Image                               | API                                                | Uppdatering                      |
| ---------- | ---------------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------- | -------------------------------- |
| Lokal      | `http://localhost:8080`                                                      | Lokal Docker-build                  | `http://localhost:4000` eller intern Docker-adress | Manuellt med Docker Compose      |
| Staging    | [Kraftly staging](https://kraftly-suzan-team-staging-ny.onrender.com/)       | GHCR-image taggad med commit-SHA    | Kraftlys test-API v2                               | GitHub Actions → GHCR → Render   |
| Produktion | [Kraftly production](https://kraftly-suzan-team-production-ny.onrender.com/) | Samma SHA-taggade image som staging | Enligt produktionskonfigurationen                  | Efter godkänd staging-deployment |

CD-workflowen använder en SHA-taggad image för att säkerställa att samma byggda version används i staging och produktion.

Taggen `main` kan också publiceras, men den är inte en permanent versionsidentifierare. Vid deployment och rollback är commit-SHA den tydligare referensen.

### Infrastrukturens ansvar

| Tjänst         | Ansvar                                                    |
| -------------- | --------------------------------------------------------- |
| GitHub         | Källkod, branches och pull requests                       |
| GitHub Actions | CI, verifiering, Docker-build, publicering och deployment |
| GHCR           | Lagring av Docker-images                                  |
| Render         | Körning av staging- och produktionstjänster               |
| Docker         | Paketering av frontend och runtime-miljö                  |
| Nginx          | Servering av frontend och reverse proxy för API-anrop     |

## 3. CI/CD-flödet

Projektet använder två separata workflows:

- `.github/workflows/ci.yml` kör separata kvalitetskontroller.
- `.github/workflows/cd.yml` innehåller egna verifieringssteg och ansvarar för Docker-build, publicering och deployment.

Det övergripande CD-flödet är:

```text
Ändring och pull request
          ↓
Granskning och merge till main
          ↓
CD – verify
          ↓
Tester, tillgänglighet och build
          ↓
Bygg Storybook
          ↓
Bygg Docker-image
          ↓
Publicera image till GHCR
          ↓
Deploy till staging
          ↓
Verifiera staging
          ↓
Deploy samma SHA-image till produktion
          ↓
Verifiera produktion om PROD_URL finns
```

`ci.yml` och `cd.yml` är separata workflows. CD-workflowen har egna verifieringssteg. Det ska därför inte förutsättas att `ci.yml` automatiskt startar `cd.yml`.

### Steg 1 – Ändring och pull request

Utvecklaren gör en ändring i en feature-branch och pushar den till GitHub.

En pull request skapas mot `main`.

Innan ändringen mergas bör relevanta kontroller genomföras, exempelvis:

- Kodgranskning.
- Unit- och komponenttester.
- Tillgänglighetstester.
- Produktionsbuild.
- Eventuella E2E-tester.

Vilka kontroller som är obligatoriska avgörs av projektets workflow och branch protection-inställningar.

### Steg 2 – CI körs

CI-workflowen i `ci.yml` kör projektets konfigurerade kvalitetskontroller vid relevanta push- och pull request-händelser.

CD-workflowen har dessutom egna verifieringssteg i jobbet `verify`.

Dessa omfattar bland annat:

```bash
npm ci
npm run test:a11y
npm run test:run
npm run build
```

CD-flödet bygger även Storybook innan Docker-imagen byggs.

### Steg 3 – Merge till main

När pull requesten har granskats och godkänts mergas den till `main`.

CD-workflowens villkor avgör när Docker-imagen publiceras och när deployment genomförs. Publicering och deployment sker enligt workflowens villkor för `main` och pull requests.

### Steg 4 – Docker-image byggs

CD-workflowen bygger frontendens Docker-image med projektets `Dockerfile` efter godkända verifieringssteg.

Builden paketerar applikationen och dess runtime-miljö så att samma image kan användas i flera miljöer.

Det är viktigt att skilja på:

- **Build:** Docker-imagen skapas.
- **Publish:** Imagen laddas upp till GHCR.
- **Deploy:** Render startar en tjänst med imagen.

Dessa steg är inte samma sak.

### Steg 5 – Image publiceras till GHCR

GitHub Actions publicerar imagen till GitHub Container Registry enligt workflowens villkor.

Image-namnet är:

```text
ghcr.io/suzan-al-majdalawi/kraftly-suzan-team
```

Imagen taggas med commitens SHA. En `main`-tagg kan också publiceras.

Exempel på SHA-taggad image:

```text
ghcr.io/suzan-al-majdalawi/kraftly-suzan-team:<commit-sha>
```

Taggen `main` pekar på den image som senast publicerats med den taggen. Den är därför inte en permanent versionsidentifierare.

SHA-taggen gör det möjligt att identifiera exakt vilken kodversion en image innehåller.

### Steg 6 – Render deployar staging

Efter att imagen har publicerats initierar GitHub Actions deployment till staging via Render Deploy Hook.

Render hämtar den SHA-taggade imagen från GHCR och startar staging-tjänsten med den konfiguration som finns i Render.

CD-workflowen väntar därefter på att staging ska kunna verifieras.

### Steg 7 – Staging verifieras

CD-workflowen verifierar staging genom att kontrollera `/version.txt`.

Versionskontrollen används för att säkerställa att den förväntade versionen har startat.

Om staging-verifieringen misslyckas ska produktionsdeploymenten inte fortsätta.

Utöver workflowens versionskontroll bör relevanta användarflöden och API-funktioner kontrolleras vid behov.

### Steg 8 – Render deployar produktion

Efter godkänd staging initierar CD-workflowen deployment till produktion.

Produktionen använder samma SHA-taggade Docker-image som redan har verifierats i staging.

Imagen byggs alltså inte om mellan miljöerna.

Miljöspecifika inställningar, exempelvis API-URL och feature flags, konfigureras separat för respektive Render-tjänst.

### Steg 9 – Produktion verifieras

CD-workflowen kan kontrollera produktionsversionen genom `/version.txt` om `PROD_URL` är konfigurerad.

Om `PROD_URL` saknas hoppas versionskontrollen över med en varning. Det innebär att en lyckad deployment inte i sig bevisar att produktionsversionen har verifierats genom denna kontroll.

## 4. Docker och lokal utveckling

Lokalt används Docker Compose för att starta frontend och mock-API tillsammans.

Frontend nås normalt via:

```text
http://localhost:8080
```

API nås normalt via:

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

Exempel på konfiguration:

```yaml
environment:
  APP_ENV: local
  API_URL: http://api:4000
  API_KEY: ${API_KEY:?API_KEY saknas – kontrollera .env}
```

Observera att `api` är tjänstens nätverksnamn inne i Docker Compose. Det är därför inte samma adress som `localhost:4000`.

`APP_ENV` ska ange den miljö som faktiskt används. För lokal utveckling ska den inte ange `staging` om det inte är avsiktligt.

Kontrollera även att `API_URL` motsvarar Nginx-konfigurationens förväntade basadress. Om Nginx lägger till `/api/` i `proxy_pass` ska API-URL:en inte redan innehålla samma sökväg.

## 5. Konfiguration – var finns variablerna?

Miljövariabler används för att skilja mellan lokal utveckling, staging och produktion.

| Variabel             | Hemlig? | Lokal miljö                                 | Staging                                  | Produktion                                      |
| -------------------- | ------- | ------------------------------------------- | ---------------------------------------- | ----------------------------------------------- |
| `API_KEY`            | Ja      | `.env`                                      | Render Environment                       | Render Environment                              |
| `API_URL`            | Nej     | Lokal API-adress eller intern Docker-adress | Render Environment                       | Render Environment                              |
| `PORT`               | Nej     | Enligt lokal serverkonfiguration            | Render-port                              | Render-port                                     |
| `APP_ENV`            | Nej     | `local`                                     | `staging`                                | `production`                                    |
| `FEATURE_NORWAY`     | Nej     | Enligt lokal konfiguration                  | Enligt staging-konfigurationen           | `false` enligt produktionskravet                |
| `RENDER_DEPLOY_HOOK` | Ja      | Behövs normalt inte                         | GitHub Actions secret                    | GitHub Actions secret för produktion            |
| `STAGING_URL`        | Nej     | Behövs normalt inte                         | GitHub Actions variabel/konfiguration    | –                                               |
| `PROD_URL`           | Nej     | Behövs normalt inte                         | –                                        | GitHub Actions variabel för produktionskontroll |
| `GITHUB_TOKEN`       | Ja      | Behövs normalt inte                         | Tillhandahålls normalt av GitHub Actions | Tillhandahålls normalt av GitHub Actions        |

Den exakta användningen av variablerna ska följa projektets Docker-, Nginx-, Render- och workflow-konfiguration.

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

Exempel på runtime-konfiguration:

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

Staging kan ha Norge-funktionen aktiverad enligt staging-konfigurationen.

Produktionsmiljön konfigureras separat. Enligt produktionskravet ska Norge-funktionen vara avstängd:

```javascript
norway: false,
```

CD-flödet kontrollerar att `FEATURE_NORWAY` är avstängd i produktion.

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

Den nya nyckeln ska lagras som en secret/environment variable i den miljö där API-anslutningen konfigureras.

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
4. Kontrollera att API-anslutningen använder den nya nyckeln.
5. Testa autentiseringen.
6. Kontrollera att nyckeln inte exponeras i frontend eller loggar.

Om en aktiv secret har läckt i Git-historiken bör historiken saneras enligt projektets säkerhetsrutiner. Att bara ta bort nyckeln från den senaste versionen räcker inte.

## 8. Verifiering efter deploy

Varje deployment ska verifieras innan den betraktas som färdig.

### Kontroll 1 – Render-status

Öppna Render-dashboarden och kontrollera att tjänsten har status:

```text
Live
```

Kontrollera även deployhistoriken och att den senaste deploymenten har slutförts.

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

### Kontroll 3 – Produktion

Öppna:

https://kraftly-suzan-team-production-ny.onrender.com/

Kontrollera att:

- Tjänsten är tillgänglig.
- Startsidan och inloggningssidan laddas.
- Relevanta användarflöden fungerar.
- API-anrop fungerar.
- Norge-funktionen är avstängd.
- Inga nya kritiska fel visas i webbläsarens konsol.

### Kontroll 4 – API

Kontrollera att API-tjänsten svarar.

Om en health-endpoint finns tillgänglig kan den användas:

```text
/healthz
```

Exempel:

```bash
curl -i https://<api-url>/healthz
```

Kontrollera att API:et ger ett förväntat svar.

Ett lyckat health-check visar att tjänsten svarar, men det bevisar inte att alla API-funktioner fungerar. Därför behöver även relevanta API-anrop testas.

### Kontroll 5 – Version och commit

Om `/version.txt` är tillgänglig kan den användas för att kontrollera vilken version som körs.

Staging:

```bash
curl -i https://kraftly-suzan-team-staging-ny.onrender.com/version.txt
```

Produktion:

```bash
curl -i https://kraftly-suzan-team-production-ny.onrender.com/version.txt
```

Jämför resultatet med commit-SHA för den version som skulle deployas.

CD-workflowen kontrollerar staging-versionen. Produktionskontrollen körs om `PROD_URL` är konfigurerad.

Om endpointen inte finns ska motsvarande versionsinformation kontrolleras via Render och GHCR.

### Kontroll 6 – Loggar

Öppna Render-loggarna och kontrollera:

- Att containern startar.
- Att Nginx startar korrekt.
- Att runtime-konfigurationen skapas.
- Att API-anslutningen fungerar.
- Att inga nya kritiska fel uppstår.

### Kontroll 7 – Funktionell kontroll

Testa de viktigaste användarflödena efter deploy:

- Inloggning och utloggning.
- Laddning av dashboard.
- Hämtning av användaruppgifter.
- Fakturavy.
- Förbrukningsinformation.
- Relevanta feature flags.
- Norge-funktionen i staging.
- Att Norge-funktionen är avstängd i produktion.

Det är särskilt viktigt att testa funktioner som har ändrats i den aktuella pull requesten.

## 9. Rollback

Rollback används om en ny deployment orsakar fel som påverkar användarna eller gör en miljö instabil.

Målet är att snabbt återgå till en tidigare fungerande version.

### Metod 1 – Rollback till tidigare Docker-image

1. Identifiera den senaste fungerande image-taggen eller commit-SHA.
2. Öppna Render-dashboarden.
3. Öppna aktuell staging- eller produktionstjänst.
4. Kontrollera vilken image som används.
5. Välj den tidigare fungerande imagen.
6. Spara ändringen.
7. Starta en ny deploy/redeploy.
8. Vänta tills Render visar `Live`.
9. Öppna miljöns URL.
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
7. GitHub Actions kör relevanta workflows enligt deras triggers.
8. CD-workflowen verifierar och bygger en ny Docker-image.
9. Imagen publiceras till GHCR enligt workflowens villkor.
10. Render deployas med den nya imagen.
11. Verifiera staging och produktion enligt respektive deployflöde.

En Git-revert skapar en ny commit. Den skriver inte om den tidigare historiken.

### Kontroll efter rollback

Rollbacken betraktas som genomförd när:

- Render visar tjänsten som `Live`.
- Miljöns URL svarar.
- Applikationen laddas utan kritiska runtime-fel.
- API-anrop fungerar.
- Rätt version eller commit körs.
- Render-loggarna inte visar nya start- eller konfigurationsfel.
- De funktioner som påverkades av den tidigare deploymenten fungerar igen.

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

### Produktionsverifiering

CD-workflowen verifierar staging innan produktionsdeploymenten initieras.

Produktionskontrollen av `/version.txt` körs om `PROD_URL` är konfigurerad. Om variabeln saknas hoppas kontrollen över med en varning.

För att få en fullständig automatiserad produktionsverifiering behöver `PROD_URL` vara korrekt konfigurerad.

### Render-konto och behörigheter

Det ska vara tydligt vem som äger och administrerar Render-kontot.

Teamet behöver veta:

- Vem som kan ändra staging-service.
- Vem som kan ändra produktionstjänsten.
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

## 12. Produktion och M5

Målet för M5 är att produktion ska deployas med samma Docker-image och commit-SHA som har verifierats i staging.

Flödet är:

```text
Merge till main
      ↓
CD – verify
      ↓
Tester och build
      ↓
Bygg Docker-image
      ↓
Publicera image till GHCR
      ↓
Deploy till staging
      ↓
Verifiera staging
      ↓
Deploy samma image till produktion
      ↓
Verifiera produktion om PROD_URL finns
```

Produktionsdeployen använder samma image som verifierats i staging. Den ska inte bygga en separat image med annan kod.

Miljöspecifika inställningar, till exempel API-URL och feature flags, konfigureras separat.

Eventuellt krav på manuellt godkännande före produktionsdeployment ska dokumenteras utifrån den faktiska konfigurationen i GitHub Environments och workflowen. Det ska inte beskrivas som obligatoriskt om det inte är konfigurerat.

## 13. Viktiga filer

| Fil                           | Syfte                                                              |
| ----------------------------- | ------------------------------------------------------------------ |
| `Dockerfile`                  | Bygger frontend/Nginx-imagen                                       |
| `mock-api/Dockerfile`         | Bygger backend-imagen för mock-API med Node.js och Express         |
| `compose.yaml`                | Startar lokal web och API                                          |
| `nginx.conf.template`         | Nginx-konfiguration med runtime-variabler                          |
| `docker/40-runtime-config.sh` | Skapar `config.js` vid containerstart                              |
| `.env`                        | Lokala secrets och miljövariabler                                  |
| `mock-api/.env`               | Lokala miljövariabler och secrets för mock-API. Ska inte committas |
| `.env.example`                | Exempel på lokala och mock-API miljövariabler                      |
| `.github/workflows/ci.yml`    | Separata CI-kontroller                                             |
| `.github/workflows/cd.yml`    | Verifiering, Docker-build, GHCR-publicering och deployment         |

Kontrollera alltid att filnamnen stämmer med projektets aktuella struktur.

## 14. Checklista inför och efter deploy

Checklistorna är generella och ska bockas av för varje deployment. En ikryssad ruta ska inte tolkas som att kontrollen redan har genomförts.

### Inför deploy

- [x] Pull request är granskad och godkänd.
- [x] Obligatoriska CI-kontroller är gröna.
- [x] CD-workflowens verifieringssteg är gröna.
- [x] Produktionsbuild fungerar.
- [x] Ändringen är mergad till `main`.
- [x] GitHub Actions har byggt imagen.
- [x] Imagen har publicerats till GHCR.
- [x] Rätt commit-SHA finns tillgänglig.

### Efter staging-deploy

- [x] Render visar `Live`.
- [x] Rätt image/commit körs.
- [x] Staging-URL svarar.
- [x] `/version.txt` visar förväntad version.
- [x] API-anrop fungerar.
- [x] Frontend laddas utan kritiska fel.
- [x] Inloggning fungerar.
- [x] Viktiga användarflöden fungerar.
- [x] Runtime-konfigurationen är korrekt.
- [x] Feature flags har rätt värden.
- [x] Render-loggarna är kontrollerade.

### Efter produktionsdeploy

- [x] Render visar `Live`.
- [x] Samma SHA-taggade image som staging används.
- [x] Produktions-URL svarar.
- [x] Produktionsversionen är verifierad, om `PROD_URL` är konfigurerad.
- [x] API-anrop fungerar.
- [x] Frontend laddas utan kritiska fel.
- [x] Viktiga användarflöden fungerar.
- [x] Norge-funktionen är avstängd.
- [x] Render-loggarna är kontrollerade.

## 15. Sammanfattning

Kraftly Mina sidor använder GitHub Actions för CI och för att verifiera, bygga och publicera Docker-images till GHCR. Render använder den publicerade SHA-taggade imagen för att köra staging och produktion.

Det är viktigt att skilja mellan att bygga en image, publicera den och faktiskt driftsätta den. En publicerad image innebär inte i sig att Render kör den senaste versionen.

CD-workflowen deployar först till staging och verifierar versionen genom `/version.txt`. Efter godkänd staging deployas samma SHA-taggade image till produktion.

Produktionskontrollen av `/version.txt` körs om `PROD_URL` är konfigurerad. Varje deployment bör dessutom följas av lämplig kontroll av tjänstens status, image/commit, frontend, API och relevanta användarflöden.

Rollback ska kunna göras genom att återgå till en tidigare image eller genom att revert:a en ändring i Git.
