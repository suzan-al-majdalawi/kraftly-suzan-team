# Arkitektoniska beslutsregister (ADR)

Den här katalogen innehåller de arkitektoniska beslut som har fattats för projektet Kraftly Mina sidor.

Arkitektoniska beslutsregister (ADR) används för att dokumentera viktiga tekniska val, varför besluten fattades och vilka konsekvenser de får. Dokumentationen hjälper teamet att förstå varför en viss lösning valdes och ger vägledning vid framtida utveckling.

## Beslutsregister

| ADR                                                                     | Beslut                                                                                        | Status     |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------- |
| [ADR 001 – Rendering och hosting](rendering.md)                         | Dokumenterar hur applikationen renderas och hostas.                                           | Godkänt    |
| [ADR 002 – Tokenlagring](tokenlagring.md)                               | Beskriver hur access token och refresh token lagras och hanteras.                             | Godkänt    |
| [ADR 003 – E2E-tester](e2e-verktyg.md)                                  | Dokumenterar valet av Playwright för automatiserade E2E-tester.                               | Godkänt    |
| [ADR 004 – Användarroller och behörigheter](roller-och-behorigheter.md) | Förslag om hur olika användarroller ska hanteras och vilka delar av systemet de får komma åt. | Föreslaget |

## Kommande beslut och förbättringar

Vi planerar att fortsätta utveckla behörighetshanteringen i Kraftly Mina sidor.

Ett viktigt nästa steg är att införa tydliga användarroller, till exempel:

- **Kund:** Kan se och uppdatera sina egna uppgifter, se sin förbrukning och sina fakturor.
- **Administratör:** Kan hantera kunder och utföra administrativa uppgifter.
- **Support:** Kan hjälpa kunder och se den information som behövs för supportärenden.

Vi behöver också bestämma vilka rättigheter varje roll ska ha och kontrollera behörigheten på API-sidan, inte bara dölja funktioner i frontend.

Detta ska dokumenteras i ett separat ADR innan lösningen implementeras.

## Så dokumenterar du ett nytt beslut

När ett nytt arkitektoniskt beslut ska dokumenteras:

1. Skapa en ny Markdown-fil i den här katalogen.
2. Använd ett tydligt filnamn, till exempel `004-roller-och-behorigheter.md`.
3. Beskriv bakgrunden och problemet som behöver lösas.
4. Dokumentera den valda lösningen och varför den valdes.
5. Beskriv konsekvenserna av beslutet, både fördelar och eventuella nackdelar.
6. Lägg till när beslutet ska omprövas.
7. Uppdatera beslutsregistret ovan.

## Beslutens status

- **Föreslaget (Proposed):** Beslutet diskuteras fortfarande.
- **Godkänt (Accepted):** Beslutet har godkänts av teamet.
- **Ersatt (Superseded):** Beslutet har ersatts av ett nyare beslut.

## Relaterad dokumentation

- [Systemarkitektur](../architecture.md)
- [CI/CD-pipeline](../pipeline.md)
- [Projektets README](../../README.md)
