# kraftly-mina-sidor

Customer portal for Kraftly. Delivered by Webbmakarna AB 2026-06-30.

[![CI](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/workflows/ci.yml/badge.svg)](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/workflows/ci.yml)

## Deployments

| Environment | URL                                                                          |
| ----------- | ---------------------------------------------------------------------------- |
| Production  | [Kraftly Production](https://kraftly-suzan-team-production-ny.onrender.com/) |
| Staging     | [Kraftly Staging](https://kraftly-suzan-team-staging-ny.onrender.com/)       |

### Test account

- **Email:** `anna.andersson@example.com`
- **Password:** Retrieve the team-approved test password from secure team storage.

## Getting started

### Alternativ 1 – Docker

Det rekommenderade sättet att starta projektet är med Docker Compose.

1. Öppna Docker Desktop och kontrollera att Docker körs.
2. Öppna terminalen i projektets rotmapp.
3. Kör:

```bash
docker compose up --build
```

Öppna sedan:

http://localhost:8080

Frontend körs via Nginx och mock API:t körs i en separat container.

#### Att stoppa containrarna

```bash
docker compose down
```

#### Att lista Docker-images

```bash
docker image ls
```

### Alternativ 2 – utan Docker

Installera projektets dependencies:

```bash
npm install
```

Starta mock API:t:

```bash
npm run api
```

Starta utvecklingsservern i en separat terminal:

```bash
npm run dev
```

Öppna sedan:

http://localhost:5173

I utvecklingsläge proxas `/api` till mock API:t på port 4000.

## Arbetsavtal

### Kommunikation

Vi fokuserar på att lösa problemen tillsammans. Om någon behöver hjälp frågar vi i teamets kommunikationskanal och söker efter problemet tillsammans.

### Mötestider

Vid behov frågar vi i Slack eller annan överenskommen kommunikationskanal.

## Definition of done för PR:er

- Vilket ticket eller issue?
- Vad ändrades?
- Varför?
- Hur testar man?

Checklista:

- [ ] Jag har kört appen och verifierat ändringen.
- [ ] Commit-meddelandet följer Conventional Commits.
- [ ] Grenen utgår från en färsk `main`.
- [ ] Ticketets "Klar när"-punkter är avbockade.
- [ ] Relevanta tester och CI-kontroller passerar.

## Tech lead-schema för rotationen

Vecka 1–9.

## Git

Vi använder kortlivade feature branches.

Alla ändringar i `main` går igenom en Pull Request.

Minst en teammedlem måste granska PR:n innan merge.

## Commits

Vi använder Conventional Commits på varje PR.

Exempel:

```bash
git commit -m "feat: add customer dashboard"
git commit -m "fix: resolve login issue"
git commit -m "docs: update README"
git commit -m "ci: add Lighthouse performance checks"
```

## M3: Getting started och dokumentation

README innehåller:

- Docker-instruktioner: `docker compose up --build`
- Stoppa containrar: `docker compose down`
- Frontend lokalt: `localhost:8080`
- Utvecklingsläge utan Docker: `npm install` och `npm run dev`
- CI-badge
- Git- och PR-regler
- Länkar till Production och Staging

## M5: Deployment

Production deployeras via GitHub Actions med staging-verifierad image/SHA och kräver godkännande innan production deployment.

## M7: Performance

Performance-arbetet omfattar:

- Lighthouse CI i GitHub Actions.
- Performance budgets för LCP, CLS och JavaScript-storlek.
- Produktionsbygge med `npm run build`.
- Dokumentation av prestandamätningar och optimeringsbeslut i `docs/performance.md` och `docs/decisions/rendering.md`.
- Dokumentation av projektets milstolpar i `docs/milestones.md`.
