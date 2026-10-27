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
- **Password:** `sommar2026`.

## Getting started

### Alternativ 1 – Docker

Det rekommenderade sättet att starta projektet lokalt är med Docker Compose.

1. Installera och öppna Docker Desktop.
2. Öppna terminalen i projektets rotmapp.
3. Kör:

```bash
docker compose up --build
```

Öppna sedan [http://localhost:8080](http://localhost:8080).

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

Starta mock API:t i en terminal:

```bash
npm run api
```

Starta utvecklingsservern i en separat terminal:

```bash
npm run dev
```

Sen

```bash
npm ci
```

Öppna sedan [http://localhost:5173](http://localhost:5173).

I utvecklingsläge proxas `/api` till mock API:t på port 4000.

### Alternativ 3 – Kubernetes lokalt (stretchövning)

Kubernetes-konfigurationen finns i `k8s/kraftly.yaml`. Den innehåller en ConfigMap för publik konfiguration, en Deployment för applikationen och en Service som exponerar applikationen internt i klustret.

Den här instruktionen gäller lokal testning med Docker Desktop Kubernetes. Den ersätter inte projektets vanliga deployment till Render.

#### Förutsättningar

- Docker Desktop är installerat och startat.
- Kubernetes är aktiverat och ett kluster har skapats i Docker Desktop.
- `kubectl` är installerat.
- Docker-imagen finns i GitHub Container Registry (GHCR).
- Du har en giltig API-nyckel för den miljö du vill testa.

#### 1. Kontrollera Kubernetes

Öppna Docker Desktop och vänta tills Kubernetes-klustret är igång.

Öppna sedan PowerShell i projektets rotmapp:

```powershell
kubectl config use-context docker-desktop
kubectl get nodes
```

Kontrollera att nodens status är `Ready`.

#### 2. Gå till Kubernetes-mappen

Kör från projektets rotmapp:

```powershell
cd k8s
```

Kontrollera att manifestet finns:

```powershell
ls
```

Du ska se `kraftly.yaml`.

#### 3. Skapa en Secret för API-nyckeln

Skapa en Kubernetes Secret med en giltig API-nyckel från teamets säkra lagring:

```powershell
kubectl create secret generic kraftly-secrets --from-literal=API_KEY=<DIN_API_NYCKEL>
```

Ersätt `<DIN_API_NYCKEL>` med den riktiga nyckeln. Lägg aldrig en riktig nyckel i README, Git eller ett committat YAML-manifest.
secret/kraftly-secrets created

Om Secret redan finns kan du kontrollera att den finns med:

```powershell
kubectl get secret kraftly-secrets
```

#### 4. Kontrollera konfigurationen

I `kraftly.yaml` ska `Deployment` använda den avsedda Docker-imagen. Exempel på en image:

```yaml
image: ghcr.io/suzan-al-majdalawi/kraftly-suzan-team:39557d93de39df3cd048cbe740fadc69d1fb29ab
```

Använd den image-version som ska testas. För reproducerbara tester är en specifik image-tag eller SHA att föredra framför `latest`.

Om GHCR-paketet är privat måste Kubernetes konfigureras för att autentisera mot registret.

Kontrollera att `ConfigMap` innehåller rätt API-adress för testmiljön, om applikationen läser `API_URL` vid körning:

```yaml
data:
  API_URL: "https://kraftly-api.sprinto.cloud"
```

Kontrollera också att `Deployment` läser `API_KEY` från Secret `kraftly-secrets` med `valueFrom.secretKeyRef`.

**Obs:** Om frontendens `API_URL` byggs in under Vite-bygget räcker det inte nödvändigtvis att ändra en Kubernetes ConfigMap. Följ projektets byggkonfiguration.

#### 5. Deploya applikationen

Kör från mappen `k8s`:

```powershell
kubectl apply -f kraftly.yaml
```

#### 6. Kontrollera status

Visa Pods och följ uppstarten:

```powershell
kubectl get pods -w
```

Avsluta övervakningen med `Ctrl+C`.

Kontrollera Deployment och Service:

```powershell
kubectl get deployments
kubectl get services
```

Om en Pod inte startar, undersök detaljer och loggar:

```powershell
kubectl describe pods
kubectl logs deployment/kraftly
```

Vanliga problem:

- `ImagePullBackOff` eller `ErrImagePull`: kontrollera image-namn, tagg och åtkomst till GHCR.
- `CreateContainerConfigError`: kontrollera att Secret och konfigurationsreferenser finns.
- `CrashLoopBackOff`: kontrollera applikationens loggar och miljövariabler.

#### 7. Öppna applikationen lokalt

När applikationen är redo, kör:

```powershell
kubectl port-forward service/kraftly 8080:80
```

Öppna [http://localhost:8080](http://localhost:8080) i webbläsaren.

Låt terminalfönstret vara öppet medan du testar.

#### 8. Ta bort Kubernetes-resurser efter testet

Kör från mappen `k8s`:

```powershell
kubectl delete -f kraftly.yaml
```

Om du även vill ta bort Secret:

```powershell
kubectl delete secret kraftly-secrets
```

Detta tar bort resurserna från Kubernetes-klustret, men inte Docker-imagen i GHCR.

## Arbetsavtal

### Kommunikation

Vi fokuserar på att lösa problemen tillsammans. Om någon behöver hjälp frågar vi i teamets kommunikationskanal och söker efter problemet tillsammans.

### Mötestider

Vid behov frågar vi i Slack eller annan överenskommen kommunikationskanal.

## Definition of done för PR:er

Beskriv följande i varje Pull Request:

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
- Lokal Kubernetes-testning med Docker Desktop
- CI-badge
- Git- och PR-regler
- Länkar till Production och Staging

## M5: Deployment

Production deployeras via GitHub Actions med staging-verifierad image/SHA och kräver godkännande innan production deployment.

Staging och production ska använda den avsedda image-versionen för respektive release. Verifiera staging innan production-deployen godkänns.

## M7: Performance

Performance-arbetet omfattar:

- Lighthouse CI i GitHub Actions.
- Performance budgets för LCP, CLS och JavaScript-storlek.
- Produktionsbygge med `npm run build`.
- Dokumentation av prestandamätningar och optimeringsbeslut i `docs/performance.md` och `docs/decisions/rendering.md`.
- Dokumentation av projektets milstolpar i `docs/milestones.md`.
