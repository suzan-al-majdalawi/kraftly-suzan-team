# Daily Standup – Suzan Al Majdalawi

## Datum: 2026-08-28, 2026-09-01, 2026-09-14, 2026-10-25 och 2026-10-29

---

## 2026-11-02 – generalrepetition slutdemon

- **Vilka var med:** [Fyll i namn på deltagarna]
- **Hur lång den blev:** [Fyll i antal] min (mål: 10 min)
- **Vad som ändrades i körschemat:** [Beskriv eventuella ändringar, eller skriv "Inga ändringar"]
- **Reserven provad:** Ja / Nej – [Beskriv om skärmdumparna eller inspelningen fungerade och om reservplanen kunde genomföras]

Tech lead, på main, efter att sista PR:en mergats och pipelinen på main är grön:

git checkout main && git pull
npm ci
npm run test:run
npm run build
gh run list --branch main --limit 1 # senaste körningen på main: completed, success
grep -o 'docs/[A-Za-z0-9/_.-]*' README.md | sort -u | xargs ls -d # varje fil README pekar på finns
git tag -a M10 -m "M10 – Feature freeze"
git push origin M10

---

## 2026-08-28 och 2026-09-01 Individuellt arbete med M0-M1-M2

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

---

## 2026-09-14 – Individuellt arbete med M3

### Vad har jag gjort sedan senast?

Jag repeterade innehållet från tidigare lektioner och fortsatte arbeta med M3. Torsdagen veckan innan arbetade jag tillsammans med två olika team i klassen med samma uppgift. Nu arbetar jag självständigt med samma uppgift i mitt eget team.

Det har varit lärorikt att arbeta med olika personer och jämföra olika sätt att lösa samma problem. Jag har också fått möjlighet att förklara för andra hur man kan gå tillväga steg för steg, vilket hjälpte mig att själv förstå de tekniska lösningarna bättre.

Jag arbetade vidare med README och dokumentationen för Docker, så att det blir tydligt hur projektet startas både med och utan Docker. Jag uppdaterade även `containers`-filen och färdigställde den sista filen som behövde fixas.

Jag kontrollerade sedan min Pull Request och såg till att alla kontroller och tester blev gröna. När allt var färdigt testade jag även projektet från `main`-branchen genom att hämta de senaste ändringarna och starta projektet med Docker.

### Vad ska jag göra idag?

Jag ska göra den sista kontrollen av M3 genom att säkerställa att projektet fungerar från `main` och att inloggningen fungerar när projektet startas med Docker.

När allt är godkänt ska jag skapa och pusha M3-taggen:

```bash
git checkout main
git pull
docker compose up --build
git tag -a M3 -m "M3 – Containeriserad"
git push origin M3
```

### Några hinder – vad var svårt?

Det som var mest utmanande var att få alla delar att fungera tillsammans, framför allt Docker, containers-konfigurationen och projektets start från en ren `main`-branch.

Det var också viktigt att kontrollera att ändringarna verkligen fungerade från det färdiga repositoryt och inte bara från min lokala arbetsbranch. Därför testade jag projektet efter att ha bytt till `main` och hämtat de senaste ändringarna.

### Vad gjorde teamet?

Eftersom jag arbetade individuellt med M3 fokuserade jag på att färdigställa de delar som behövdes för att projektet skulle vara klart för M3. Jag uppdaterade dokumentationen, containers-konfigurationen och den sista filen som behövde färdigställas.

Den nya tech leaden har också presenterats för teamet, så vi har nu en tydligare ansvarsfördelning inför det fortsatta arbetet.

### Vem gjorde vad?

Jag, Suzan Al Majdalawi, arbetade med README, Docker-dokumentationen, containers-filen och den sista filen som behövde fixas. Jag kontrollerade även Pull Requesten och såg till att den blev grön innan M3 färdigställdes.

Jag använde ChatGPT som stöd när jag behövde förstå tekniska problem, kontrollera Docker-konfigurationen och diskutera olika lösningar. Jag genomförde själv ändringarna i projektet och kontrollerade att de fungerade.

M3 är färdig enligt mina tidigare anteckningar. Nästa steg var att skapa och pusha taggen `M3`.

---

## 2026-10-25 – M9: Reusable Form Components and Accessibility

### Vad har jag gjort sedan senast?

Jag har arbetat vidare med M9 och skapat den återanvändbara komponenten `KField.vue` för formulär i Kraftly-projektet.

Komponenten stöder etiketter, hjälptexter, felmeddelanden, `v-model` och vanliga attribut för HTML-inputfält. Jag har integrerat den i `LoginView.vue`, `ProfileView.vue` och `MoveFormView.vue`.

Jag har även skapat Storybook-stories för ett standardfält, ett fält med hjälptext och ett fält med felmeddelande. Dessutom har jag arbetat med valideringen i flyttformuläret så att användaren får tydliga felmeddelanden när uppgifter saknas eller är felaktiga.

Jag har lagt till tillgänglighetstester för `KField`. Just nu innehåller `src/components/KField.a11y.test.js` två tester. De två återstående planerade testerna är inte implementerade ännu och kommer att kompletteras senare.

Jag har också granskat GitHub Actions-konfigurationerna för CI/CD och identifierat att Storybook-bygget och uppladdningen av dess artifact behöver verifieras i GitHub Actions.

### Vad ska jag göra härnäst?

Jag ska fortsätta med M9 genom att komplettera tillgänglighetstesterna och kontrollera att felmeddelanden är korrekt kopplade till respektive formulärfält.

Jag ska också säkerställa att CI/CD-workflowen bygger Storybook och laddar upp `storybook-static` som ett artifact. Därefter ska jag kontrollera resultatet i GitHub Actions och verifiera att de obligatoriska statuskontrollerna är korrekt konfigurerade.

### Några hinder – vad var svårt?

En viktig del av arbetet är att säkerställa att formulär inte bara fungerar visuellt, utan även är tillgängliga för användare som använder hjälpmedel. Felmeddelanden måste vara tydligt kopplade till rätt inmatningsfält och fält med fel måste exponera sin status korrekt.

Jag stötte också på ett tillfälligt Windows-fel (`EPERM`) vid installation av npm-paket eftersom `esbuild.exe` inte kunde tas bort. Efter att ha hanterat problemet lyckades `npm ci` köras.

### Vad gjorde teamet?

Det här arbetet har främst genomförts individuellt inom M9. Fokus har varit återanvändbara formulärkomponenter, tillgänglighet, Storybook och automatiserade kontroller.

### Vem gjorde vad?

Jag, Suzan Al Majdalawi, arbetade med `KField.vue`, integrationen i formulärvyerna, Storybook-stories och de inledande tillgänglighetstesterna. Jag granskade även CI/CD-workflowen och körde projektets test- och byggkommandon lokalt.

Jag använde ChatGPT som stöd för att förstå tekniska fel, diskutera tillgänglighetskrav och granska möjliga lösningar. Jag genomförde ändringarna i projektet och kontrollerade resultaten i min lokala utvecklingsmiljö.

### Lokal verifiering

Följande kommandon kördes framgångsrikt lokalt:

- `npm ci`
- `npm run test:a11y`
- `npm run test:run`
- `npm run build`
- `npm run build-storybook`

Detta bekräftar de lokala kontrollerna, men innebär inte i sig att GitHub Actions eller distributionen till staging och produktion har verifierats.

### Kvarstående arbete

- [x] Komplettera de två återstående planerade `KField`-tillgänglighetstesterna.
- [x] Implementera eller slutföra tillgänglighetstestet för `MoveFormView`.
- [x] Verifiera att samtliga relevanta tester passerar.
- [x] Säkerställa att CI/CD bygger Storybook och laddar upp `storybook-static` som artifact.
- [x] Kontrollera att GitHub Actions-jobben lyckas på en Pull Request.
- [x] Verifiera att obligatoriska statuskontroller är korrekt konfigurerade.

### Aktuell status

**M9 pågår fortfarande.**

Den återanvändbara `KField`-komponenten, dess Storybook-stories och två tillgänglighetstester finns på plats. Ytterligare tester och verifiering av CI/CD återstår innan milstolpen kan betraktas som färdig.

## 2026-10-29 – M10: Dokumentation, arkitektur och readiness

### Vad har jag gjort sedan senast?

Jag har påbörjat arbetet med M10, som fokuserar på att förbättra projektets dokumentation och göra Kraftly Mina sidor enklare att förstå och ta över för en ny utvecklare.

Jag har gått igenom instruktionerna för M10 och de fem frågor som en ny kollega ska kunna besvara genom att läsa projektets README och dokumentation:

- Hur startar jag applikationen lokalt, och hur vet jag att den fungerar?
- Var finns hemligheterna, och hur får jag tillgång till dem?
- Hur går en ändring till produktion, och hur gör man en rollback?
- Varför ser arkitekturen ut som den gör, och var dokumenteras besluten?
- Vad är känt trasigt eller medvetet inte implementerat?

Jag har arbetat vidare med projektets README i root och granskat hur dokumentationen är organiserad. Målet är att README ska fungera som projektets huvudsakliga ingång och innehålla tydliga länkar till de mer detaljerade dokumenten i `docs/`.

Jag har även arbetat med arkitekturdokumentationen i `docs/architecture.md`. Där ska systemets viktigaste komponenter, kommunikationsflöden och miljöer beskrivas med Mermaid-diagram. Jag har också sett över hur de arkitektoniska besluten ska dokumenteras i `docs/decisions/`.

En viktig del av M10 är att dokumentationen ska beskriva projektets faktiska implementation och inte bara hur vi önskar att den fungerade.

### Vad ska jag göra härnäst?

Jag ska fortsätta med M10 genom att:

- Förbättra README så att en ny kollega kan komma igång utan att behöva fråga teamet.
- Kontrollera att dokumentationstabellen innehåller de relevanta filerna i `docs/`.
- Färdigställa arkitekturskissen och kontrollera att Mermaid-diagrammen renderas korrekt på GitHub.
- Dokumentera de viktigaste arkitektoniska besluten i `docs/decisions/`.
- Skapa eller uppdatera `docs/readiness.md` med status och bevis för varje punkt.
- Dokumentera kända brister i `docs/known-issues.md`.
- Förbereda dokumentationen inför M10:s slutliga kontroll och taggning.

Jag ska också kontrollera att dokumentationen stämmer med de faktiska GitHub Actions-workflowsen och deployment-processen.

### Några hinder – vad var svårt?

En utmaning är att säkerställa att dokumentationen beskriver den verkliga tekniska lösningen. Det är lätt att skriva hur arkitekturen borde fungera, men viktigt att kontrollera hur komponenterna faktiskt kommunicerar och var de körs.

Det är också viktigt att skilja mellan sådant som är färdigt, sådant som är en känd brist och sådant som medvetet har utgått. Readiness-dokumentationen måste vara ärlig och innehålla bevis för de punkter som markeras som färdiga.

En annan utmaning är att dokumentera de arkitektoniska besluten på ett sätt som förklarar varför vi valde en viss lösning, vilka alternativ vi övervägde och när beslutet kan behöva omprövas.

### Vad gjorde teamet?

Teamet arbetade med M10:s tre dokumentationsspår:

1. README och arkitekturskissen.
2. Arkitektoniska beslutsdokument.
3. Readiness och kända brister.

Arbetet fördelades mellan teammedlemmarna för att undvika att flera personer gjorde ändringar i samma dokument samtidigt.

Vi utgick från partnerteamets granskning av vårt repository och använde deras frågor och problem som underlag för att identifiera vad som behövde förbättras.

### Vem gjorde vad?

Jag, Suzan Al Majdalawi, arbetade med dokumentationen för Kraftly Mina sidor och fokuserade på att göra projektet tydligare för en ny utvecklare.

Jag arbetade med README, arkitekturdokumentationen och de arkitektoniska besluten. Jag granskade även hur dokumentationen kopplas till projektets CI/CD-pipeline, deployment och readiness.

Jag använde ChatGPT som stöd för att förstå instruktionerna, strukturera dokumentationen och diskutera tekniska lösningar. Jag genomförde själv ändringarna i projektet och ansvarar för att kontrollera att dokumentationen stämmer med repositoryt.

### Aktuell status

**M10 pågår.**

Arbetet fokuserar på att förbättra projektets dokumentation och säkerställa att en ny kollega kan förstå hur applikationen startas, hur arkitekturen fungerar, hur deployment genomförs och var viktiga tekniska beslut dokumenteras.

Nästa steg är att färdigställa readiness-dokumentationen, dokumentera kända brister och kontrollera att samtliga krav i M10:s Definition of Done är uppfyllda.
