## rubriken M7 med DoD-punkterna nedan och beviset inklistrat under varje (länk, siffra, utdrag).

under rubriken M7. Alla punkter ska vara uppfyllda på main när taggen sätts.

# M7

[ ] Mätmetoden står skriven: verktyg och inställningar i docs/performance.md (produktionsbygget, enhetsläge, nätverksstrypning, cache av, median av flera körningar) – samma för före och efter
[ ] Minst tre optimeringar med före/efter-mätning i docs/performance.md, varav minst en som förbättrar LCP eller CLS på dashboarden och minst en som minskar mängden JavaScript. Varje optimering har en egen PR, länkad i dokumentet
[ ] Dashboarden inom gränserna: LCP under 2,5 s och CLS under 0,1 (lokalt produktionsbygge, iPhone 12 Pro, Fast 4G, cache av) – siffrorna i dokumentet
[ ] Prestandabudget i CI: lighthouserc.json med minst LCP, CLS och JavaScript-storlek som "error", och jobbet Prestandabudget (Lighthouse) körs på varje PR. Länk till en grön körning i docs/milestones.md
[ ] Budgeten stoppar: jobbet är en required status check på main, och publish väntar på det (needs). JavaScript-taket ligger strax över er faktiska siffra, motiverat i dokumentet
[ ] Testerna gröna – och om ni bytt import av ett bibliotek som mockas i testerna, är mocken flyttad med (inga getContext-fel i testloggen)
[ ] Ett beslutsdokument docs/decisions/rendering.md: SPA, SSR (Nuxt) eller SSG för portalen – jämförelse, beslut, och när beslutet ska omprövas

### Valfritt (räknas inte i DoD): gzip/brotli verifierat med curl mot staging (eller påslaget i nginx) · responsiva bilder med srcset · dashboarden i CI med inloggning (Lighthouse CI har stöd för ett inloggningsskript, puppeteerScript) · Nuxt-spiken från övning 2B som bilaga till beslutsdokumentet – ett starkt VG-samtal.
