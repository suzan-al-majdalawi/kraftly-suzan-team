# Kända brister – Kraftly Mina sidor

## Syfte

Det här dokumentet samlar kända brister, begränsningar och verifieringspunkter i Kraftly Mina sidor. Syftet är att göra kvarstående risker synliga och dokumentera påverkan, prioritet och nästa steg.

En punkt som ännu inte har verifierats ska inte automatiskt beskrivas som ett bekräftat fel. På samma sätt innebär avsaknad av rapporterade fel inte att applikationen är fri från kritiska brister.

## Kända brister och begränsningar

| Område                      | Brist eller begränsning                                                                                                                                                                             | Påverkan                                                                                                                       | Prioritet | Nästa steg                                                                                                                                                         | Status                   |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| Autentisering och sessioner | Kodändringar har gjorts för att stärka hanteringen av inloggning, utloggning och återställning av sessioner. Samtidiga autentiseringsanrop och eventuella kapplöpningstillstånd behöver verifieras. | Fel i sessionshanteringen kan leda till att användaren loggas ut oväntat eller att en äldre session påverkar en nyare session. | Hög       | Kör tester för inloggning, utloggning, återställning av session, tokenförnyelse och samtidiga anrop. Kontrollera även att utloggning verkligen avslutar sessionen. | Behöver verifieras       |
| Användardata                | API-svar normaliseras för att hantera olika svarformat och förhindra att ogiltiga eller oväntade svar behandlas som användardata. Fullständig verifiering av felaktiga och tomma API-svar återstår. | Felaktig hantering kan leda till att användaruppgifter visas eller sparas på fel sätt.                                         | Medel     | Testa hämtning och uppdatering av profiluppgifter, inklusive tomma, felaktiga och oväntade API-svar.                                                               | Behöver verifieras       |
| AI-granskning i CI          | Det lokala testet av AI-granskningen misslyckades med HTTP 401 (`invalid x-api-key`).                                                                                                               | AI-granskningen kunde inte verifieras från början till slut.                                                                   | Medel     | Kontrollera API-nyckeln och genomför ett nytt test. Utvärdera därefter minst tre riktiga PR:ar.                                                                    | Öppen                    |
| Tillgänglighet              | Slutliga resultat från axe, Storybook Accessibility och manuell tangentbordsgranskning är inte fullständigt dokumenterade.                                                                          | Det går ännu inte att bekräfta att alla granskade vyer uppfyller de avsedda tillgänglighetskraven.                             | Hög       | Genomför kontrollerna, dokumentera resultat och åtgärda eller prioritera kvarstående problem.                                                                      | Pågående verifiering     |
| Hållbarhetsmätning          | CO₂-resultatet är en modellbaserad uppskattning. En jämförbar mätning före M7 saknas.                                                                                                               | Det går inte att dra en verifierad numerisk slutsats om förbättringen före och efter M7.                                       | Medel     | Behåll nuvarande metod och gör en jämförbar mätning om en före/efter-jämförelse krävs.                                                                             | Dokumenterad begränsning |
| Dokumentation               | Dokumentationen och readiness-statusarna behöver verifieras mot faktiska filer, tester och CI-bevis.                                                                                                | Statusen för vissa milstolpar kan annars bli missvisande.                                                                      | Medel     | Kontrollera dokumentlänkar, beslut, testresultat och krav i `docs/readiness.md`.                                                                                   | Pågående                 |

## Prioritering

- **Hög:** Kan påverka användarnas möjlighet att utföra viktiga uppgifter, tillgänglighet eller säker användning.
- **Medel:** Behöver åtgärdas eller verifieras, men påverkan och omfattning behöver bedömas.
- **Låg:** Begränsad påverkan eller förbättring som inte blockerar centrala användarflöden.

Prioriteten ska justeras när problemet har undersökts och dess faktiska påverkan är känd.

## Kriterier för att stänga en brist

En brist kan stängas när:

1. Orsaken eller begränsningen har undersökts.
2. En åtgärd har genomförts, eller en dokumenterad motivering finns till att inte åtgärda den.
3. Relevant test eller annan verifiering har genomförts.
4. Resultat och eventuell kvarstående risk har dokumenterats.

## Kritiska brister

**Status: Inte slutligt verifierad.**

Innan projektet kan ange att inga kända kritiska brister finns måste teamet granska de öppna punkterna, särskilt autentisering och säkerhet, centrala användarflöden samt tillgänglighet.

Kodförändringar för att stärka autentisering och hantering av användardata är genomförda, men de ska inte betraktas som slutligt verifierade förrän relevanta tester har körts och resultaten dokumenterats.

Detta dokument ska uppdateras när nya brister upptäcks, när befintliga brister åtgärdas och när verifieringsresultat förändras.
