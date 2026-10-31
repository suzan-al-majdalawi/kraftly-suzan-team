# Arkitektoniska beslutsregister (ADR)

Det här registret samlar projektets arkitektoniska beslut (Architecture Decision Records). Varje större beslut dokumenteras i en separat Markdown-fil enligt mallen:

**Datum · Beslut · Bakgrund · Alternativ · Motivering · Konsekvenser**

## Beslutsregister

| ADR                                                                           | Beslut                                                                                          | Datum      | Status     |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------- | ---------- |
| [ADR 001 – Verktyg för E2E-tester](e2e-verktyg.md)                            | Dokumenterar valet av Playwright för automatiserade E2E-tester.                                 | 2026-08-28 | Godkänt    |
| [ADR 002 – Hosting för Kraftly Mina sidor](hosting.md)                        | Beskriver valet av Render för staging och hur container-imagen publiceras och driftsätts.       | 2026-09-18 | Godkänt    |
| [ADR 003 – Norge-stödet bakom en feature flag](feature-flags.md)              | Dokumenterar beslutet att styra Norge-stödet med en feature flag.                               | 2026-09-28 | Godkänt    |
| [ADR 004 – Tokenlagring](tokenlagring.md)                                     | Beskriver hur access token och refresh token lagras och hanteras.                               | 2026-10-05 | Godkänt    |
| [ADR 005 – Rendering: SPA med Vue och Vite](rendering.md)                     | Dokumenterar valet att fortsätta använda SPA i stället för SSR eller SSG.                       | 2026-10-30 | Föreslaget |
| [ADR 006 – Användarroller och behörigheter](roller-och-behorigheter.md)       | Beskriver förslaget för användarroller och åtkomst till systemets funktioner.                   | Ej angivet | Föreslaget |
| [ADR 007 – Autentisering och användardata](autentisering-och-anvandardata.md) | Dokumenterar hantering av sessioner, samtidiga refresh-anrop och normalisering av användardata. | Ej angivet | Föreslaget |

## De tre viktigaste besluten – och varför

Följande tre områden är särskilt viktiga för den som ska förstå, vidareutveckla eller ta över projektet.

1. **[Tokenlagring](tokenlagring.md):** Hanteringen av access token och refresh token påverkar säkerheten och hela inloggningsflödet. Den som arbetar med autentisering behöver förstå hur token lagras och hanteras.

2. **[Hosting](hosting.md):** Beslutet påverkar hur applikationen byggs, publiceras och körs i olika miljöer. En ny teammedlem behöver förstå hur staging hostas, hur Docker-imagen publiceras till GHCR och hur Render-deployen verifieras.

3. **[Feature flags](feature-flags.md):** Beslutet om att lägga Norge-stödet bakom en feature flag visar hur funktionalitet kan aktiveras och styras utan att påverka övriga användare. Det är viktigt att förstå när nya funktioner eller marknadsstöd utvecklas.

## Beslut som saknar eget dokument

Det finns för närvarande inga ytterligare ADR-filer i registret. Nya arkitektoniska beslut ska dokumenteras i egna filer innan de läggs till här.

Eventuella framtida beslut om exempelvis användarroller, behörigheter eller hantering av användardata kan få egna ADR-dokument när beslut har fattats och dokumentationen har skapats.

## Så dokumenterar du ett nytt beslut

När ett nytt arkitektoniskt beslut ska dokumenteras:

1. Skapa en ny Markdown-fil i den här katalogen.
2. Använd ett tydligt filnamn med ADR-nummer, till exempel `006-nytt-beslut.md` tex. `005-autentisering-och-anvandardata.md`.
3. Beskriv bakgrunden och problemet som behöver lösas.
4. Dokumentera vilka alternativ som övervägdes.
5. Beskriv vilken lösning som valdes och varför.
6. Beskriv konsekvenserna av beslutet, både fördelar och eventuella nackdelar.
7. Ange datum och beslutets status.
8. Uppdatera beslutsregistret ovan.

Ett ADR bör följa strukturen:

- Datum
- Beslut
- Bakgrund
- Alternativ
- Motivering
- Konsekvenser

Om ett godkänt beslut ändras ska ett nytt ADR skapas som ersätter det tidigare beslutet. Det tidigare ADR:et ska behållas för att bevara beslutshistoriken.

## Beslutens status

- **Föreslaget (Proposed):** Beslutet diskuteras fortfarande eller väntar på godkännande.
- **Godkänt (Accepted):** Beslutet har godkänts av teamet.
- **Ersatt (Superseded):** Beslutet har ersatts av ett nyare beslut.

## Relaterad dokumentation

- [Systemarkitektur](../architecture.md)
- [CI/CD-pipeline](../pipeline.md)
- [Projektets README](../../README.md)
- [Kända problem](../known-issues.md)
