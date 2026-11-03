# Slutdemo torsdag 5/11

**Demo-ansvarig:** SUZAN-Team  
**Miljö:** Produktion – [https://dashboard.render.com/web/srv-db1d1ck9v7es73f0a41g]  
**Tid:** 10 minuter demo + 5 minuter frågor  
**Version:** `v1.0`

## Syfte

Visa vad Kraftly Mina sidor klarar i dag, hur lösningen fungerar för användaren och vilka tekniska beslut som ligger bakom. Demonstrationen ska fokusera på ett tydligt exempel per område, inte en fullständig rundtur i alla funktioner.

## Körschema

| Minut | Vad                                               | Vem    | Vad som ska synas                                                                                                                            |
| ----- | ------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 0–1   | Introduktion: uppdraget och vad vi har tagit över | [Namn] | Kort sammanfattning av projektet och dokumenterade tekniska skulder                                                                          |
| 1–3   | Inloggning och skyddade sidor                     | [Namn] | Logga in med testkonto. Visa att en utloggad användare skickas till inloggningen och kommer tillbaka till den begärda sidan efter inloggning |
| 3–5   | Mina sidor och användarflöde                      | [Namn] | Visa startsidan och ett centralt flöde, exempelvis fakturor eller profil                                                                     |
| 5–7   | Flyttanmälan och formulär                         | [Namn] | Visa flyttformuläret, fältens tillgängliga etiketter och validering                                                                          |
| 7–9   | Kvalitet och teknisk lösning                      | [Namn] | Visa Playwright-tester, CI/CD och relevanta arkitekturbeslut                                                                                 |
| 9–10  | Begränsningar och sammanfattning                  | [Namn] | Visa `docs/known-issues.md` och sammanfatta vad portalen klarar i dag                                                                        |
| 10–15 | Frågor                                            | Alla   | Frågor och svar                                                                                                                              |

## Förberedelser

- [ ] Demo-ansvarig och presentatörer är utsedda.
- [ ] Produktionsmiljön är verifierad samma morgon.
- [ ] `/version.txt` visar rätt commit-SHA för den version som ska demonstreras.
- [ ] Produktionsmiljön har öppnats minst tio minuter före demon.
- [ ] Alla flikar är öppna i rätt ordning: startsida, inloggning, fakturor, profil och flyttformulär.
- [ ] Ett testkonto fungerar och inloggningen har verifierats.
- [ ] En separat flik visar hur en utloggad användare omdirigeras till inloggningen.
- [ ] Playwright-tester och CI-resultat finns tillgängliga att visa.
- [ ] `docs/known-issues.md` är uppdaterad.
- [ ] Reservmaterial finns på skrivbordet: skärmdumpar av varje demoögonblick eller en inspelning.
- [ ] Eventuella kommandon och texter som ska visas live är förberedda och går att kopiera.

## Om något går fel

| Om                                      | Då                                                                                                        |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Produktion svarar inte                  | Använd skärmdumparna eller inspelningen. Förklara vilket användarflöde som skulle ha visats.              |
| Inloggningen fungerar inte              | Använd den förberedda inspelningen eller skärmdumpen. Visa därefter testresultatet för inloggningsflödet. |
| Nätet slutar fungera                    | Fortsätt med lokalt sparat reservmaterial och den förberedda presentationen.                              |
| En funktion fungerar inte som förväntat | Avbryt inte demon. Förklara begränsningen och hänvisa till `docs/known-issues.md`.                        |
| Vi ligger efter i tid                   | Korta ned den tekniska genomgången först. Behåll sammanfattningen och tiden för frågor.                   |

## Repetition och uppföljning

- [ ] Genomför en repetition måndag 2/11 eller tisdag 3/11.
- [ ] Kontrollera att varje presentatör håller sin del inom tidsramen.
- [ ] Kontrollera att reservmaterialet fungerar.
- [ ] Dokumentera genomförd repetition i `docs/log.md`.
- [ ] Kontrollera att alla länkar och dokument som visas under demon fungerar.

**Målet:** Efter demon ska beställaren förstå vad portalen kan göra, hur användaren använder den, hur lösningen har testats och vilka begränsningar som återstår.
