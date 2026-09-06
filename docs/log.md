## Daily standup – Suzan Al Majdalawi

**Datum:** 2026-08-28 && 2026-09-01

### Vad har jag gjort sedan senast?

Jag har gått igenom lektionerna i Canvas och tränat och övat på uppgifterna tillsammans med teamet. Jag har arbetat vidare med M1 och bland annat med Vitest, Playwright, ESLint, Prettier och pre-commit-hooken.

Under dagen färdigställde vi testmiljön med Vitest och Playwright. Vi skapade ett Playwright-smoketest och dokumenterade vårt beslut att använda Playwright som E2E-verktyg. Vi arbetade också med ESLint och Prettier och såg till att linting, formatering och pre-commit fungerar.

Jag har även arbetat med GitHub och Pull Requests. Jag har två GitHub-konton och har bland annat öppnat och mergat en Pull Request via mobilen och Gmail på mitt äldre konto.

### Vad ska jag göra idag?

Jag ska arbeta vidare med de uppgifter jag har missat och färdigställa dokumentationen inför M1. Jag ska också kontrollera att tester, lint, formattering och Playwright E2E-test fungerar innan ändringarna skickas till `main`.

### Några hinder – vad var svårt?

Det som varit svårt är att jag på grund av sjukdom inte kunde göra och skicka in uppgifterna i samma takt som planerat. Jag hoppas att det blir bättre framöver.

Tekniskt var det svårt att konfigurera ESLint med den nya konfigurationsmodellen. Vi fick också ett runtime-fel med `toFixed` när priset ännu inte hade laddats. Playwright försökte först läsa Vitest-testerna, vilket löstes genom att separera E2E-testerna i `e2e/`.

Inspelningarna av videolektionerna har varit väldigt hjälpsamma. Det är bra att kunna repetera lektionerna två eller flera gånger för att förstå och komma ihåg momenten bättre.

### Vad gjorde teamet?

Teamet arbetade tillsammans med teststrategi, felsökning, ESLint/Prettier-konfiguration, pre-commit och Playwright E2E-test. Vi färdigställde även beslutet om Playwright och dokumentationen kring teststrategin.

### Vem gjorde vad?

Jag, Suzan Al Majdalawi, arbetade med testmiljön, felsökning, ESLint, Prettier, pre-commit, Playwright E2E-test och dokumentationen.

Eftersom jag arbetade själv med uppgifterna använde jag ChatGPT som stöd när jag behövde förstå felmeddelanden, kontrollera konfigurationer och diskutera olika tekniska lösningar. Jag ställde frågor och diskuterade lösningarna steg för steg innan jag gjorde ändringarna i projektet.

De tekniska ändringarna och besluten i koden genomfördes och kontrollerades av mig.
