# Beslut: hosting för Kraftly Mina sidor

**Datum:** 2026-09-18  
**Beslutat av:** Teamet (tech lead: Suzan)  
**Status:** Gäller – verifiera att den nuvarande konfigurationen fortfarande motsvarar beslutet

## Beslut

Vi använder **Render** för att köra staging som en containertjänst baserad på en färdig Docker-image från GitHub Container Registry (GHCR).

Målet är att GitHub Actions bygger och publicerar imagen och att Render kör den avsedda versionen. Deployen ska kunna verifieras mot den commit eller SHA som har byggts.

En deploy hook kan användas för att starta en deploy från GitHub Actions. Det måste verifieras i workflowet att hooken faktiskt används och att Render kör rätt image efter deploy.

## Bakgrund

Portalen byggs som en Docker-image med frontend och Nginx. Vi behöver kunna publicera staging på internet och ha ett reproducerbart flöde från kodändring till driftsatt version.

Våra krav är:

- En lösning som fungerar inom teamets budget.
- Möjlighet att köra en färdig container-image.
- Hemligheter lagras i miljön eller plattformen, inte i repot eller frontend-koden.
- Samma image ska kunna användas i olika miljöer när konfigurationen tillåter det.
- Deploy och rollback ska gå att dokumentera och verifiera.

## Alternativ som jämfördes

| Alternativ           | Bedömning                                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| Render               | Vald lösning för staging.                                                                                 |
| Azure Container Apps | Alternativ för containerdrift och skalning.                                                               |
| Google Cloud Run     | Alternativ för containerdrift och skalning.                                                               |
| Vercel / Netlify     | Kan passa statisk frontend, men passar inte direkt samma containerbaserade Nginx-upplägg utan anpassning. |

Kostnader, krav på faktureringskonto och aktuella begränsningar ska kontrolleras mot respektive leverantörs villkor innan ett framtida byte.

## Motivering

Render valdes för att förenkla driftsättningen av staging och möjliggöra körning av en container-image.

En viktig princip är att hålla applikationen så portabel som möjligt. Docker-imagen, Nginx-konfigurationen och miljövariablerna ska inte göras onödigt beroende av Render.

Leverantörsspecifika delar, exempelvis deploy hook och tjänstekonfiguration, dokumenteras separat så att de går att byta vid behov.

## Konsekvenser

- Staging kan ha kallstarter eller längre svarstid efter inaktivitet. Detta ska kontrolleras mot Render-inställningarna och mätas vid behov.
- Teamet behöver dokumentera vem som administrerar Render-tjänsten och hur åtkomst överförs när ansvaret ändras.
- Render behöver kunna hämta den image som publiceras i GHCR. Om paketet är privat måste åtkomst och behörigheter konfigureras.
- En publicerad image innebär inte i sig att Render automatiskt kör den nya versionen. Deployen måste utlösas och verifieras.
- Staging och produktion ska hanteras som separata miljöer. Produktion får inte betraktas som färdig innan separat konfiguration, secrets, verifiering och rollback-rutin finns.

## Säkerhet

Hemligheter, exempelvis `API_KEY` och `RENDER_DEPLOY_HOOK`, ska lagras som secrets i respektive lokal eller hostad miljö.

Hemligheter får inte checkas in i Git, bäddas in i frontend-koden eller skrivas till en publik runtime-konfigurationsfil.

Om en API-nyckel har avvisats med `401 Unauthorized` ska orsaken undersökas. Kontrollera att rätt nyckel och rätt API används. Om nyckeln är exponerad eller inte längre giltig ska den roteras eller återkallas enligt projektets säkerhetsrutiner.

## Relaterade dokument och filer

- `docs/deploy.md` – praktisk deploy, verifiering och rollback.
- `docs/architecture.md` – systemarkitektur och komponenternas ansvar.
- `docs/security.md` – säkerhetsrisker och säkerhetsåtgärder, om filen finns.
- `Dockerfile` – bygger container-imagen.
- `compose.yaml` – lokal containerkonfiguration.
- `docker/40-runtime-config.sh` – skapar runtime-konfiguration vid containerstart.
- `.github/workflows/` – GitHub Actions-workflows för CI/CD och publicering.
- `.env.example` – exempel på lokala miljövariabler utan riktiga secrets.

Filernas existens och de faktiska workflow-stegen ska verifieras i repot innan dokumentationen betraktas som slutligt kontrollerad.

## Verifiering

Beslutet och dess implementation ska kontrolleras genom att:

1. Granska GitHub Actions-workflowet.
2. Bekräfta vilken image och tagg eller SHA som publiceras till GHCR.
3. Bekräfta hur Render hämtar imagen och startar en ny deploy.
4. Kontrollera att staging svarar och att rätt version körs.
5. Kontrollera att secrets inte exponeras i frontend eller Git.
6. Dokumentera hur rollback utförs och verifieras.

**Status för verifieringen:** Verifierad – GitHub Actions, publicering till GHCR, Render-deploy, versionskontroll och hantering av secrets har kontrollerats. Staging svarar och rollback-rutinen är dokumenterad.
