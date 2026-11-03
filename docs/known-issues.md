# Kända brister – Kraftly Mina sidor

## Syfte

Det här dokumentet samlar kända brister, begränsningar och verifieringspunkter i Kraftly Mina sidor. Syftet är att synliggöra kvarstående risker och dokumentera påverkan, prioritet, status och nästa steg.

En punkt som ännu inte har verifierats ska inte automatiskt beskrivas som ett bekräftat fel. På samma sätt innebär avsaknad av rapporterade fel inte att applikationen är fri från kritiska brister.

Statusen ska baseras på dokumenterade testresultat, granskningar eller andra verifierbara underlag. Kodändringar innebär inte i sig att en brist är löst.

## Kända brister och begränsningar

| Område                      | Brist eller begränsning                                                                                                                                                                                                                                                                                                                                                                                                                                          | Påverkan                                                                                                                                           | Prioritet | Nästa steg                                                                                                                                                                                                                                          | Status                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Autentisering och sessioner | Tester för tokenhantering omfattar access token i minnet, Bearer-token vid skyddade anrop, tokenförnyelse, hantering av 401 vid förnyelse, samordning av samtidiga förnyelseanrop inom samma flik och utloggning även om logout-anropet misslyckas. Fem Playwright-tester för centrala inloggningsflöden har också rapporterats som godkända. Förnyelse av session mellan flera flikar och eventuell påverkan av äldre sessioner behöver fortfarande verifieras. | Brister i sessionshanteringen kan leda till oväntad utloggning eller att en session inte återställs som förväntat.                                 | Hög       | Genomför och dokumentera tester för samtidiga sessioner i flera flikar, tokenrotation och utgångna refresh cookies. Kontrollera att en äldre session inte återaktiveras efter utloggning.                                                           | Grundläggande tester godkända – kompletterande verifiering återstår |
| Användardata                | API-svar normaliseras för att hantera olika svarformat och förhindra att ogiltiga eller oväntade svar behandlas som användardata. Fullständig verifiering av felaktiga och tomma API-svar återstår.                                                                                                                                                                                                                                                              | Felaktig hantering kan leda till att användaruppgifter visas eller sparas på fel sätt.                                                             | Medel     | Testa hämtning och uppdatering av profiluppgifter. Kontrollera tomma, felaktiga och oväntade API-svar samt att felmeddelanden hanteras på ett kontrollerat sätt.                                                                                    | Behöver verifieras                                                  |
| AI-granskning i CI          | Det lokala testet av AI-granskningen misslyckades med HTTP 401 (`invalid x-api-key`). Det är därför inte verifierat att AI-granskningen fungerar från början till slut.                                                                                                                                                                                                                                                                                          | AI-granskningen kan inte användas som verifierat stöd i granskningsprocessen.                                                                      | Medel     | Kontrollera att rätt API-nyckel används och att den hanteras som en hemlighet. Genomför ett nytt test och utvärdera resultatet från minst tre riktiga PR:ar innan funktionen betraktas som verifierad.                                              | Öppen                                                               |
| Tillgänglighet              | Automatiserade tillgänglighetstester och komponentgranskningar har genomförts. Tidigare rapporterade resultat omfattar 4/4 tillgänglighetstester och 35/35 tester för den aktuella testomfattningen. En fullständig manuell tangentbordsgranskning av samtliga relevanta vyer är inte dokumenterad här.                                                                                                                                                          | Det går ännu inte att bekräfta att alla relevanta vyer uppfyller de avsedda tillgänglighetskraven.                                                 | Hög       | Dokumentera vilka vyer och komponenter som omfattas av testerna. Genomför och dokumentera manuell tangentbordsgranskning och komplettera med relevanta automatiserade kontroller. Dokumentera även beslutade avgränsningar och kvarstående problem. | Delvis verifierad – kompletterande granskning återstår              |
| Hållbarhetsmätning          | Den senaste mätningen den 3 november 2026 visar 356 kB per besök, 0,021 g CO₂e per besök i Sverige, 2,7 kg CO₂e per månad i Sverige och 6,6 kg CO₂e per månad globalt. Resultatet är en modellbaserad uppskattning.                                                                                                                                                                                                                                              | Det finns ett aktuellt referensvärde, men mätningen visar inte någon numeriskt verifierad förbättring jämfört med den tidigare mätningen efter M7. | Medel     | Använd den senaste mätningen som referensvärde. Följ upp byggstorlek och klimatberäkning vid kommande ändringar. Använd samma verktyg och antaganden vid framtida jämförelser.                                                                      | Ny mätning genomförd – uppföljning behövs                           |
| Dokumentation och readiness | Dokumentationen och readiness-statusarna behöver verifieras mot faktiska filer, tester, beslut och CI-resultat.                                                                                                                                                                                                                                                                                                                                                  | Statusen för vissa milstolpar kan annars bli missvisande.                                                                                          | Medel     | Kontrollera dokumentlänkar, ADR-beslut, testresultat och krav i `docs/readiness.md`. Ändra status först när det finns ett verifierbart underlag.                                                                                                    | Pågående                                                            |

## Hållbarhetsmätning

Den senaste mätningen genomfördes den 3 november 2026 med kommandot:

```powershell
npm run co2
```

Skriptet som körs är `scripts/co2.mjs`. Mätningen använder Sustainable Web Design V4 och beräknar uppskattad klimatpåverkan utifrån byggstorlek och angivna trafikantaganden.

### Senaste mätresultat – 3 november 2026

| Mätvärde                     | Resultat |
| ---------------------------- | -------: |
| Överförd datamängd per besök |   356 kB |
| CO₂e per besök – Sverige     |  0,021 g |
| CO₂e per månad – Sverige     |   2,7 kg |
| CO₂e per månad – globalt     |   6,6 kg |
| Energiförbrukning per månad  | 13,7 kWh |

### Beräkningsunderlag

Enligt körningens utskrift användes följande antaganden:

- Byggunderlag: `dist/` (index.html och assets, okomprimerat).
- Trafik: 40 000 kunder × 3,2 besök per månad.
- Beräknat antal besök: 128 000 per månad.
- Andel förstabesök: 100 %.
- Energiförbrukning: 13,7 kWh per månad.
- Svensk elmix: 35,89 g CO₂e/kWh.
- Global elmix: 472,94 g CO₂e/kWh.
- Global faktor enligt Sustainable Web Design V4: 494 g CO₂e/kWh för tillverkning av enheter, nätverk och datacenter. Driftens elförbrukning beräknas med den geografiska elmixen.

Resultatet är en modellbaserad uppskattning och inte en direkt mätning av webbplatsens faktiska klimatpåverkan. Det påverkas av verktygets modell, byggstorleken och de antaganden som används.

### Jämförelse med tidigare mätning efter M7

| Mätvärde                    | Tidigare mätning | 3 november 2026 |
| --------------------------- | ---------------: | --------------: |
| Datamängd per besök         |           334 kB |          356 kB |
| CO₂e per besök – Sverige    |          0,020 g |         0,021 g |
| CO₂e per månad – Sverige    |           2,5 kg |          2,7 kg |
| CO₂e per månad – globalt    |           6,2 kg |          6,6 kg |
| Energiförbrukning per månad |         12,8 kWh |        13,7 kWh |

Den senaste mätningen visar högre värden än den tidigare mätningen. Det går därför inte att hävda att den uppmätta byggstorleken eller den uppskattade klimatpåverkan har förbättrats mellan dessa två mättillfällen.

En jämförbar mätning före M7 saknas fortfarande. Resultaten kan användas som referensvärden för framtida uppföljning, men de räcker inte för att fastställa en numerisk förbättring före och efter M7.

För att framtida jämförelser ska vara rättvisa behöver samma verktyg, metod, trafikantaganden, byggförutsättningar och utsläppsfaktorer användas.

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

Grundläggande tester för autentisering och tokenhantering har rapporterats som godkända. Det innebär inte att alla scenarier, exempelvis sessioner mellan flera flikar och tokenrotation, är slutligt verifierade.

Formuleringen innebär inte att en kritisk brist har bekräftats. Den innebär att underlaget ännu inte räcker för att fastställa att inga kritiska brister finns.

## Uppdatering av dokumentet

Dokumentet ska uppdateras när:

- nya brister eller begränsningar upptäcks
- befintliga brister åtgärdas
- verifieringsresultat förändras
- prioritet eller påverkan behöver justeras
- en brist stängs eller en kvarstående risk accepteras

När en brist stängs ska relevant testresultat eller annat verifieringsunderlag dokumenteras, så att statusen kan följas upp.
