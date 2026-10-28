# Architecture – Kraftly Mina sidor

## Översikt

Systemet består av en Vue 3 Single Page Application (SPA), en Nginx-container som serverar frontend-filer och vidarebefordrar API-anrop, samt Kraftlys externa test-API.

Docker-imagen byggs i GitHub Actions, publiceras till GitHub Container Registry (GHCR) och hämtas av Render vid deployment.

## Arkitekturdiagram

```mermaid
flowchart LR
    subgraph GitHub["GitHub"]
        CI["GitHub Actions<br/>ci.yml<br/>Bygger Docker-image"]
        GHCR[("GHCR<br/>Image taggad med SHA")]
        CI -->|"docker push SHA"| GHCR
    end

    subgraph Browser["Kundens webbläsare"]
        SPA["Vue 3 SPA<br/>Pinia · vue-router<br/>Access token i minnet"]
    end

    subgraph Render["Render – en container per miljö"]
        NGINX["nginx:1.27-alpine<br/>dist/ + config.js<br/>CSP och säkerhetsheaders"]
    end

    subgraph ExternalAPI["Kraftly – externt API"]
        API["Kraftlys test-API v2<br/>Lokal mock-API för utveckling"]
    end

    GHCR -.->|"Render hämtar imagen"| NGINX
    CI -.->|"Deploy Hook med commit-SHA"| NGINX

    NGINX -->|"index.html, assets och config.js"| SPA
    SPA -->|"/api/v2/...<br/>Bearer-token"| NGINX
    SPA -->|"/api/v2/auth/...<br/>Refresh-cookie"| NGINX
    NGINX -->|"proxy_pass + X-API-Key"| API
```

## Komponenter

### Vue 3 SPA

- Vue 3 används för användargränssnittet.
- Pinia hanterar applikationens tillstånd.
- vue-router hanterar navigering.
- Access token lagras i minnet enligt diagrammet.

### Nginx

- Serverar frontendens byggda filer från `dist/`.
- Serverar `config.js`.
- Vidarebefordrar API-anrop till det externa API:t.
- Konfigurerar CSP och säkerhetsheaders.

### GitHub Actions och GHCR

- GitHub Actions bygger Docker-imagen.
- Imagen taggas med commitens SHA.
- Imagen publiceras till GHCR.
- Render hämtar imagen vid deployment.

### Render

Render används för att köra applikationens container i respektive miljö. Enligt projektets deployment-konfiguration används staging före produktion.

### Externt API

Kraftlys test-API v2 ligger utanför teamets ägarskap. Under lokal utveckling kan en mock-API användas.

## API-kommunikation och säkerhet

Frontend skickar API-anrop via Nginx. Nginx vidarebefordrar anropen med `proxy_pass` och konfigurerar `X-API-Key`.

Refresh-cookie används endast för autentiseringsflödet enligt projektets konfiguration. API-nycklar ska hanteras på serversidan och inte exponeras i frontendens publika filer.

## Begränsningar

Diagrammet visar systemets huvudsakliga komponenter och kommunikationsvägar. Exakta detaljer om tokenhantering, cookie-attribut, API-rutter och deployment ska verifieras mot den faktiska koden och konfigurationen.
