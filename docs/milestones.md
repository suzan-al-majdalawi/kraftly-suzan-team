Definition of Done
Bocka av i docs/milestones.md under rubriken M1. Alla punkter ska vara uppfyllda på main när taggen sätts:

Testsvit med minst 10 meningsfulla test – både logik (enhet) och komponent, körbara med npm run test:run, alla gröna
Minst 5 av testerna är på kod som inte var med i torsdagens övningar (stores, api.js, LoginView, ProfileView, spinnern, det svalda felet …)
Minst ett regressionstest på en bugg ur er docs/debt.md – ett test som hade fångat buggen om den funnits kvar. Skriv i testnamnet eller en kommentar vilken skuld det gäller
ESLint + Prettier körs i pre-commit via husky + lint-staged. npm run lint och npm run format:check går igenom på main utan errors
Teststrategi i docs/testing.md enligt strukturen från workshopen: nivåer, karta över vad som testas var, era fem beslut (inkl. täckningskrav ja/nej och varför), vad ni medvetet inte testar
E2E-beslutet dokumenterat i docs/decisions/e2e-verktyg.md (se nedan), och det valda verktygets smoke-test mergat till main (körbart med npm run e2e:pw eller npm run e2e:cy)
Logg i docs/log.md: en post per arbetsdag – vad ni gjorde, vad som var svårt, vem som gjorde vad
Meningsfulla betyder: varje test skulle fånga en riktig bugg om den återkom. Tio bra test slår trettio tomma. Tester som testar Vue, Chart.js eller ett klassnamn räknas inte.
