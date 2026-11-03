# Kända brister – Kraftly Mina sidor

## Syfte

Det här dokumentet samlar kända brister, begränsningar och verifieringspunkter i Kraftly Mina sidor. Syftet är att synliggöra kvarstående risker och dokumentera påverkan, prioritet, status och nästa steg.

En punkt som ännu inte har verifierats ska inte automatiskt beskrivas som ett bekräftat fel. På samma sätt innebär avsaknad av rapporterade fel inte att applikationen är fri från kritiska brister.

Statusen ska baseras på dokumenterade testresultat, granskningar eller andra verifierbara underlag. Kodändringar innebär inte i sig att en brist är löst.

## Kända brister och begränsningar

| Område                      | Brist eller begränsning                                                                                                                                                                                                                                                          | Påverkan                                                                                                                                                                             | Prioritet | Nästa steg                                                                                                                                                                                                              | Status                                                    |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Autentisering och sessioner | Kodändringar har gjorts för att stärka hanteringen av inloggning, utloggning och återställning av sessioner. Samtidiga autentiseringsanrop och eventuella kapplöpningstillstånd behöver verifieras.                                                                              | Brister i sessionshanteringen kan leda till oväntad utloggning eller att en äldre session påverkar en nyare session.                                                                 | Hög       | Kör tester för inloggning, utloggning, återställning av session, tokenförnyelse och samtidiga anrop. Kontrollera att utloggning avslutar sessionen och att en äldre session inte återaktiveras. Dokumentera resultaten. | Behöver verifieras                                        |
| Användardata                | API-svar normaliseras för att hantera olika svarformat och förhindra att ogiltiga eller oväntade svar behandlas som användardata. Fullständig verifiering av felaktiga och tomma API-svar återstår.                                                                              | Felaktig hantering kan leda till att användaruppgifter visas eller sparas på fel sätt.                                                                                               | Medel     | Testa hämtning och uppdatering av profiluppgifter. Kontrollera tomma, felaktiga och oväntade API-svar samt att felmeddelanden hanteras på ett kontrollerat sätt.                                                        | Behöver verifieras                                        |
| AI-granskning i CI          | Det lokala testet av AI-granskningen misslyckades med HTTP 401 (`invalid x-api-key`). Det är därför inte verifierat att AI-granskningen fungerar från början till slut.                                                                                                          | AI-granskningen kan inte användas som verifierat stöd i granskningsprocessen.                                                                                                        | Medel     | Kontrollera att rätt API-nyckel används och att den hanteras som en hemlighet. Genomför ett nytt test och utvärdera resultatet från minst tre riktiga PR:ar innan funktionen betraktas som verifierad.                  | Öppen                                                     |
| Tillgänglighet              | Slutliga resultat från axe, Storybook Accessibility och manuell tangentbordsgranskning är inte fullständigt dokumenterade.                                                                                                                                                       | Det går ännu inte att bekräfta att alla relevanta vyer uppfyller de avsedda tillgänglighetskraven.                                                                                   | Hög       | Genomför och dokumentera tillgänglighetskontroller för de vyer och komponenter som ingår i projektets omfattning. Dokumentera även beslutade avgränsningar. Åtgärda eller prioritera kvarstående problem.               | Pågående verifiering                                      |
| Hållbarhetsmätning          | En mätning efter M7 har genomförts med `scripts/co2.mjs`. Resultatet är 334 kB per besök, 0,020 g CO₂e per besök i Sverige, 2,5 kg CO₂e per månad i Sverige och 6,2 kg CO₂e per månad globalt. Resultatet är en modellbaserad uppskattning. En jämförbar mätning före M7 saknas. | Det finns nu ett dokumenterat referensvärde efter M7, men det går inte att dra en verifierad numerisk slutsats om förbättringen före och efter M7 utan ett jämförbart referensvärde. | Medel     | Spara mätresultatet som referensvärde efter M7. Om en före/efter-jämförelse krävs ska en mätning före M7 genomföras med samma verktyg, byggstorlek, antaganden och geografiska utsläppsfaktorer.                        | Mätning efter M7 genomförd – jämförelse före/efter saknas |
| Dokumentation och readiness | Dokumentationen och readiness-statusarna behöver verifieras mot faktiska filer, tester, beslut och CI-resultat.                                                                                                                                                                  | Statusen för vissa milstolpar kan annars bli missvisande.                                                                                                                            | Medel     | Kontrollera dokumentlänkar, ADR-beslut, testresultat och krav i `docs/readiness.md`. Ändra status först när det finns ett verifierbart underlag.                                                                        | Pågående                                                  |

## Hållbarhetsmätning efter M7

Mätningen efter M7 genomfördes med kommandot:

`node scripts/co2.mjs`

Resultatet från körningen:

| Mätvärde                     | Resultat |
| ---------------------------- | -------: |
| Överförd datamängd per besök |   334 kB |
| CO₂e per besök – Sverige     |  0,020 g |
| CO₂e per månad – Sverige     |   2,5 kg |
| CO₂e per månad – globalt     |   6,2 kg |

### Beräkningsunderlag

Enligt körningens utskrift användes följande antaganden:

- Energiförbrukning: 12,8 kWh per månad.
- Trafik: 40 kunder × 3,2 besök per månad.
- Andel förstabesök: 100 %.
- Svensk utsläppsfaktor: 35,89 g CO₂e/kWh.
- Global utsläppsfaktor: 472,94 g CO₂e/kWh.
- Global datacenter- och nätverksfaktor i Sustainable Web Design V4: 494 g CO₂e/kWh.

Resultatet är en modellbaserad uppskattning och inte en direkt mätning av webbplatsens faktiska klimatpåverkan.

En jämförbar mätning före M7 saknas. Resultatet kan därför användas som referensvärde för framtida mätningar, men det räcker inte för att fastställa en numerisk förbättring före och efter M7.

För att jämförelsen ska vara rättvis behöver samma verktyg, metod, trafikantaganden, byggförutsättningar och utsläppsfaktorer användas.

## Prioritering

- **Hög:** Kan påverka användarnas möjlighet att utföra viktiga uppgifter, tillgänglighet eller säker användning.
- **Medel:** Behöver åtgärdas eller verifieras, men påverkan och omfattning behöver bedömas.
- **Låg:** Begränsad påverkan eller en förbättring som inte blockerar centrala användarflöden.

Prioriteten ska justeras när bristen har undersökts och dess faktiska påverkan är känd.

## Kriterier för att stänga en brist

En brist kan stängas när:

1. Orsaken eller begränsningen har undersökts.
2. En åtgärd har genomförts, eller en dokumenterad motivering finns till att inte åtgärda den.
3. Relevant test eller annan verifiering har genomförts.
4. Resultat och eventuell kvarstående risk har dokumenterats.
5. Statusen har uppdaterats i detta dokument och i eventuell relaterad readiness-dokumentation.

En brist ska inte markeras som löst enbart för att kod har ändrats.

## Kritiska brister

**Status: Inte slutligt verifierad.**

Innan projektet kan ange att inga kända kritiska brister finns måste teamet granska de öppna punkterna, särskilt autentisering och säkerhet, centrala användarflöden samt tillgänglighet.

Kodförändringar för att stärka autentisering och hantering av användardata är genomförda, men de ska inte betraktas som slutligt verifierade förrän relevanta tester har körts och resultaten dokumenterats.

Formuleringen innebär inte att en kritisk brist har bekräftats. Den innebär att underlaget ännu inte räcker för att fastställa att inga kritiska brister finns.

## Uppdatering av dokumentet

Dokumentet ska uppdateras när:

- nya brister eller begränsningar upptäcks
- befintliga brister åtgärdas
- verifieringsresultat förändras
- prioritet eller påverkan behöver justeras
- en brist stängs eller en kvarstående risk accepteras

När en brist stängs ska relevant testresultat eller annat verifieringsunderlag dokumenteras, så att statusen kan följas upp.
