# Arkitektoniskt beslutsregister (ADR)

Det här dokumentet är registret över projektets Architecture Decision Records (ADR).

Ett ADR beskriver ett viktigt arkitektoniskt beslut, varför beslutet fattades, vilka alternativ som övervägdes och vilka konsekvenser beslutet får för systemet.

## ADR-register

|  Nr | Beslut                 | Dokument                             | Datum      | Status     |
| --: | ---------------------- | ------------------------------------ | ---------- | ---------- |
| 001 | Val av E2E-testverktyg | [e2e-verktyg.md](e2e-verktyg.md)     | 2026-08-28 | Godkänt    |
| 002 | Hosting                | [hosting.md](hosting.md)             | 2026-09-18 | Godkänt    |
| 003 | Feature flags          | [feature-flags.md](feature-flags.md) | 2026-09-28 | Godkänt    |
| 004 | Tokenlagring           | [tokenlagring.md](tokenlagring.md)   | 2026-10-05 | Godkänt    |
| 005 | Rendering              | [rendering.md](rendering.md)         | 2026-10-30 | Föreslaget |

Datum och status ska uppdateras när ett beslut faktiskt har fattats. Ett ADR med statusen `Föreslaget` är inte ett godkänt arkitekturbeslut.

## Viktiga arkitektoniska beslut

### Tokenlagring

Access token lagras i minnet och inte i `localStorage`. Refresh token hanteras via en `HttpOnly`-cookie. Sessionen kan återställas genom ett refresh-anrop.

Se [ADR 004 – Tokenlagring](tokenlagring.md).

### Hosting och deployment

Projektets hosting- och deploymentlösning bygger på Docker, GitHub Container Registry (GHCR), GitHub Actions och Render.

Se [ADR 002 – Hosting](hosting.md).

### Feature flags

Feature flags används för att styra funktionalitet som kan aktiveras eller inaktiveras beroende på miljö, bland annat Norge-stödet.

Se [ADR 003 – Feature flags](feature-flags.md).

## Föreslagna beslut

Följande beslut finns registrerade men är ännu inte godkända:

- **ADR 005 – Rendering:** beskriver det föreslagna valet av Vue SPA med Vite.

Statusen ska ändras till `Godkänt` först när beslutet har diskuterats och godkänts enligt projektets arbetssätt.

## Så dokumenterar du ett nytt beslut

Skapa ett nytt Markdown-dokument i katalogen `docs/decisions/`.

Använd ett beskrivande filnamn som följer projektets befintliga filnamnskonvention. Exempel:

```text
docs/decisions/nytt-beslut.md
```

Lägg därefter till beslutet i tabellen ovan med:

- Nästa lediga ADR-nummer.
- Beslutets titel.
- Länk till dokumentet.
- Datum för beslutet, om det finns.
- Aktuell status.

Varje ADR bör innehålla följande rubriker:

```markdown
# ADR XXX – Beslutets titel

## Status

Föreslaget

## Datum

ÅÅÅÅ-MM-DD

## Kontext

Beskriv problemet eller behovet som kräver ett arkitektoniskt beslut.

## Beslut

Beskriv vilket alternativ som valts eller föreslås.

## Alternativ

Beskriv vilka alternativ som övervägdes.

## Konsekvenser

Beskriv positiva och negativa konsekvenser av beslutet.
```

Använd nästa lediga nummer i registret. Återanvänd inte ett nummer som redan tillhör ett annat beslut.

## Statusdefinitioner

| Status     | Betydelse                                                 |
| ---------- | --------------------------------------------------------- |
| Föreslaget | Beslutet är dokumenterat men ännu inte godkänt.           |
| Godkänt    | Beslutet har diskuterats och godkänts.                    |
| Ersatt     | Beslutet har ersatts av ett senare arkitektoniskt beslut. |

Om ett godkänt beslut ändras ska det tidigare beslutets status uppdateras till `Ersatt` och det nya beslutet länkas till det tidigare ADR-dokumentet.

## Relaterad dokumentation

- [Systemarkitektur](../architecture.md)
- [CI/CD-pipeline](../pipeline.md)
- [Containerlösning](../containers.md)
- [Säkerhet](../security.md)
- [Tillgänglighet – M8](../accessability.md)
- [Tillgänglighetsanalys och åtgärdsplan](../tillganglighetsanalys.md)
