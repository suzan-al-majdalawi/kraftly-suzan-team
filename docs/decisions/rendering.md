# Rendering Decision – Kraftly Customer Portal

# Beslut: rendering

**Datum:** 2026-10-30  
**Status:** Föreslaget  
**Beslut:** Vi fortsätter att rendera Kraftly Mina sidor som en SPA med Vue och Vite.

## Bakgrund

Vi behövde välja hur Kraftly Mina sidor ska renderas och jämföra olika alternativ utifrån portalens behov, prestanda, säkerhet och drift.

## Jämförelse

| Fråga                              | SPA                                                                                          | SSR                                                                                              | SSG                                                                                                                         |
| ---------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| När skapas HTML?                   | I webbläsaren vid varje besök. JavaScript bygger sidan efter att `index.html` har laddats.   | På servern vid varje besök. Färdig HTML skickas till webbläsaren för varje förfrågan.            | Vid byggtillfället. Färdig HTML genereras för utvalda routes.                                                               |
| Vilken typ av sida passar det för? | Applikationer bakom inloggning, exempelvis dashboards och kundportaler med data från API:er. | Publika sidor där innehållet ändras ofta och behöver anpassas efter varje besökare.              | Publika sidor med innehåll som ändras sällan och kan förgenereras.                                                          |
| Syns innehållet före JavaScript?   | Nej, inte huvudinnehållet. Webbläsaren behöver köra JavaScript för att bygga sidan.          | Ja, HTML-innehållet finns med i det första svaret från servern.                                  | Ja, för de sidor som har förgenererats. Dynamisk data efter inloggning hanteras separat.                                    |
| Drift                              | Statiska filer som kan levereras via exempelvis Nginx. Ingen separat renderingsserver krävs. | Kräver en server, exempelvis Node.js eller en serverless-lösning, som behöver drivas och skalas. | Statiska filer som kan levereras via exempelvis Nginx. Bygget blir mer omfattande eftersom HTML genereras vid varje deploy. |

## Motivering

### Ska sidan hittas eller delas?

I nuläget behöver Kraftly Mina sidor inte vara sökbar eller fungera som en publik informationssida. Portalen är avsedd för befintliga kunder och innehållet visas först efter inloggning.

Om publika sidor för marknadsföring eller information till potentiella kunder tillkommer i framtiden kan renderingsstrategin omprövas.

### Behöver innehållet synas före inloggning?

Nej. Användare som inte är inloggade skickas automatiskt till `/login`. Det finns därför inget större innehåll som behöver visas eller indexeras innan inloggning.

### Är vi beredda att drifta en separat renderingsserver?

Nej, inte i nuläget. SSR skulle innebära ytterligare drift och underhåll utan tillräcklig nytta för portalens nuvarande användningsområde.

### Kan prestandan förbättras utan att byta renderingsteknik?

Ja. Vi kan först optimera den befintliga SPA-lösningen genom exempelvis koddelning, lazy loading, minskad JavaScript-mängd och optimering av resurser. Vi bör mäta resultatet innan vi överväger en större arkitekturförändring.

## Prestandamätningar – lokala mätvärden

Den 2026-10-30 genomfördes lokala mätningar efter att fem olika sidvyer hade öppnats. Mätverktyget registrerade mjuk navigering och visade värden för Core Web Vitals.

### Resultat

| Mätning |    LCP | LCP-element | CLS |        INP | Typ av interaktion              |
| ------- | -----: | ----------- | --: | ---------: | ------------------------------- |
| 1       | 0,25 s | `img.hero`  |   0 |      32 ms | Pointer                         |
| 2       | 0,22 s | `caption`   |   0 |      32 ms | Pointer                         |
| 3       | 0,05 s | `p.intro`   |   0 |      48 ms | Pointer                         |
| 4       | 0,06 s | `h1`        |   0 |      32 ms | Keyboard                        |
| 5       | 0,27 s | `h1`        |   0 | Ej uppmätt | Ingen interaktion registrerades |

### Sammanfattning av resultaten

- **LCP:** Mellan 0,05 och 0,27 sekunder. Medelvärdet för de fem mätningarna var cirka **0,17 sekunder**.
- **CLS:** 0 i samtliga fem mätningar. Ingen layoutförskjutning registrerades.
- **INP:** Mellan 32 och 48 millisekunder i de fyra mätningar där en interaktion registrerades. Medelvärdet var **36 millisekunder**.
- **INP i mätning 5:** Inget värde registrerades eftersom ingen interaktion genomfördes. Det ska därför inte tolkas som ett INP-värde på 0 ms.

Samtliga uppmätta värden ligger inom de rekommenderade gränserna för goda Core Web Vitals:

| Mätvärde | Gräns för bra resultat | Uppmätt resultat |
| -------- | ---------------------: | ---------------- |
| LCP      |            Högst 2,5 s | 0,05–0,27 s      |
| CLS      |              Högst 0,1 | 0                |
| INP      |           Högst 200 ms | 32–48 ms         |

### Tolkning

Mätningarna visar att den befintliga SPA-lösningen har mycket god prestanda i den lokala testmiljön. Sidorna visas snabbt vid mjuk navigering, ingen layoutförskjutning registrerades och de uppmätta interaktionerna svarade snabbt.

LCP-elementen varierade mellan exempelvis `img.hero`, `caption`, `p.intro` och `h1`. Det visar vilka element som var de största innehållselementen i respektive mätning.

Det är viktigt att skilja mellan lokala mätvärden och fältmätvärden. De lokala resultaten beskriver prestandan i den testmiljö och under de förhållanden där mätningarna genomfördes. De garanterar inte samma resultat för alla användare, enheter eller nätverksförhållanden. Fältdata behöver därför följas upp separat när sådan data finns tillgänglig.

## Konsekvenser

Vi behåller Vue och Vite som SPA. Det innebär att vi kan fortsätta använda nuvarande hostinglösning med statiska filer och undvika att införa en separat renderingsserver.

De lokala mätningarna ger stöd för att den nuvarande lösningen har god prestanda. Det finns därför inget som i dessa mätningar motiverar ett byte till SSR eller SSG. Vi bör fortsätta följa upp prestandan och optimera den befintliga lösningen vid behov.

Beslutet kan omprövas om Kraftly Mina sidor utvecklas från en kundportal till en mer publik webbplats med informations- eller marknadsföringssidor. I så fall behöver vi utvärdera behovet av SEO, indexerbarhet och innehåll som ska kunna läsas av sökmotorernas crawlers.

Innan vi byter renderingsteknik ska vi undersöka om den önskade prestandan kan uppnås genom optimering av den befintliga SPA-lösningen.

---

---

## Status

Proposed — to be reviewed and approved by the team.

## Context

The Kraftly customer portal is a Vue application built with Vite. The dashboard currently has performance issues that need to be addressed as part of milestone M7.

The main concerns are:

- Improving Largest Contentful Paint (LCP).
- Keeping Cumulative Layout Shift (CLS) below 0.1.
- Reducing the amount of JavaScript downloaded and executed.
- Loading only the code needed for each page.
- Enforcing performance budgets through Lighthouse CI.

The portal contains authenticated customer pages and retrieves customer-specific information from an API. Performance must therefore be improved without exposing private customer data.

## Options considered

### 1. SPA — Single-Page Application

A SPA loads the application shell and renders pages in the browser using JavaScript.

**Advantages**

- Fits the existing Vue and Vite architecture.
- Supports interactive forms and authenticated customer dashboards.
- Can use lazy-loaded routes to reduce the initial JavaScript bundle.
- Requires relatively little migration work.

**Disadvantages**

- Large JavaScript bundles can delay rendering and increase LCP.
- The browser must download, parse and execute JavaScript.
- Performance depends on efficient code splitting and asset delivery.

### 2. SSR — Server-Side Rendering with Nuxt

SSR renders pages on the server and sends HTML to the browser before client-side hydration.

**Advantages**

- Can improve initial rendering for suitable pages.
- Can provide useful HTML before the client application is fully initialized.
- Offers integrated routing and rendering conventions through Nuxt.

**Disadvantages**

- Requires architectural migration and server-side deployment.
- Introduces additional operational and debugging complexity.
- Authenticated pages still require secure authorization and careful handling of customer data.
- Hydration and server rendering do not automatically guarantee better performance.

### 3. SSG — Static Site Generation

SSG generates HTML pages during the build process.

**Advantages**

- Static pages can be served quickly through a CDN.
- Reduces server work for content that does not change per request.
- Works well for public, mostly static content.

**Disadvantages**

- Customer-specific dashboards cannot safely be generated as shared static pages containing private data.
- Dynamic customer information still needs to be fetched after loading.
- Build-time generation is less suitable for frequently changing authenticated content.

## Decision

**The proposed decision is to keep the existing Vue SPA with Vite and improve its performance incrementally.**

This is the lowest-risk option because it preserves the current architecture while addressing the measured performance problems.

The planned improvements are:

1. Optimize the dashboard hero image and deliver appropriately sized image assets.
2. Introduce lazy-loaded routes so each page loads only the JavaScript it needs.
3. Reduce the initial JavaScript bundle by removing unnecessary code or dependencies.
4. Prevent layout shifts by reserving space for images and other dynamic content.
5. Add Lighthouse CI budgets for LCP, CLS and JavaScript transfer size.

Each optimization should be delivered in its own pull request and measured before and after using the same production-build measurement conditions.

The team must verify the results rather than assume that these changes improve performance.

## Consequences

### Positive consequences

- Avoids a large migration during M7.
- Allows incremental improvements that can be measured and reviewed independently.
- Keeps authenticated customer data behind the existing API authorization.
- Makes regressions easier to detect through automated performance budgets.

### Trade-offs

- The initial page load still depends on client-side JavaScript.
- SEO and first-render benefits available from SSR or SSG are not the primary focus.
- The team must maintain effective code splitting, image optimization and performance monitoring.

## Security considerations

Rendering choices must not expose authenticated customer information.

- Authorization must be enforced by the API.
- Private customer data must not be embedded in publicly shared static HTML.
- Cached responses must not leak one customer's information to another.
- Performance optimizations must preserve authentication and access-control behavior.

## When should we reconsider this decision?

The team should reconsider SPA versus SSR or SSG if:

- Measured LCP remains above 2.5 seconds after the planned optimizations.
- The dashboard cannot meet its performance budgets on the agreed test device and network.
- Public, indexable pages become an important product requirement.
- Measurements show that server rendering would materially improve the user experience.
- The application grows enough that the current rendering architecture creates significant maintenance or performance problems.

Any change should be supported by measurements or a small prototype comparing the alternatives.

## Validation and evidence

The decision will be evaluated using:

- A production build rather than the Vite development server.
- Chrome DevTools Performance measurements using iPhone 12 Pro emulation, Fast 4G and disabled cache.
- The median of three runs for comparable before-and-after measurements.
- Lighthouse CI checks for LCP, CLS and JavaScript size.
- Automated tests to verify that authentication and customer workflows still work.

Detailed results and the JavaScript budget belong in `docs/performance.md`. M7 completion evidence and links to successful CI runs belong in `docs/milestones.md`.

**Final approval:** The team should review and approve this decision before treating it as the final M7 rendering decision.

---

---

# Rendering Strategy for the Kraftly Customer Portal

- **Status:** Proposed
- **Decision:** Retain the Vue + Vite SPA for the authenticated customer portal.
- **Scope:** Rendering strategy for the customer portal and potential public-facing routes.
- **Review trigger:** Performance targets missed after optimization, new SEO requirements, or evidence that another rendering strategy offers a material net benefit.

## Context

Kraftly currently uses Vue and Vite to deliver a single-page application (SPA). The portal serves authenticated customers and includes interactive, user-specific functionality.

Three approaches are under consideration:

1. Client-side rendering with the existing Vue + Vite SPA.
2. Server-side rendering (SSR) using Nuxt.
3. Static site generation (SSG).

The decision must balance initial rendering performance, layout stability, client JavaScript cost, security, development effort, and deployment complexity.

No measured Kraftly performance data or comparative SSR prototype results are assumed in this decision. The choice is therefore provisional and should be validated against production user journeys.

## Decision

Retain the existing Vue + Vite SPA for authenticated portal routes. Optimize the current implementation before undertaking a framework migration.

This decision is based on the following assumptions, which must be verified:

- The portal is primarily authenticated and interactive.
- Its main content does not require public search-engine indexing.
- The current SPA can meet acceptable performance targets through incremental optimization.
- Avoiding migration and additional server infrastructure provides value while the performance case for SSR remains unproven.

This is not a conclusion that SPA rendering is inherently faster or superior to SSR. It is a decision to avoid migration until measured benefits justify its cost.

## Alternatives considered

### 1. Vue + Vite SPA

**Advantages**

- Preserves the existing architecture and minimizes migration effort.
- Supports highly interactive workflows and client-side navigation.
- Can be deployed as static assets behind a CDN, with authenticated data served by APIs.
- Avoids a server-rendering runtime and its associated operational costs.
- Supports route-level code splitting, lazy loading, dependency optimization, and caching.

**Disadvantages**

- Initial content may be delayed while JavaScript downloads, executes, and fetches authenticated data.
- Large initial bundles and expensive initialization can degrade LCP and responsiveness.
- Initial HTML may contain little meaningful content before the application starts.

**Assessment:** Preferred for the current authenticated portal, provided measured performance is acceptable.

### 2. SSR with Nuxt

**Advantages**

- Can deliver meaningful HTML before client-side hydration.
- May improve initial content rendering on slower devices.
- Supports dynamic, request-specific content and server-side data loading.
- Can support public SEO-sensitive pages and route-specific rendering strategies.

**Disadvantages**

- Requires SSR-compatible components and changes to browser-dependent code.
- Introduces server runtime, scaling, monitoring, and failure-handling responsibilities.
- Adds hydration complexity and can increase total infrastructure cost.
- Requires careful handling of authentication, request isolation, caching, and serialized state.
- Does not eliminate client JavaScript or guarantee better LCP.

**Assessment:** Reconsider if the current SPA remains too slow after targeted optimization or if product requirements favor server-rendered initial content.

### 3. Static site generation (SSG)

**Advantages**

- Serves pre-generated HTML without rendering each page on demand.
- Can provide excellent initial-load performance through CDN delivery.
- Requires little runtime infrastructure for static content.
- Is well suited to public, relatively stable content.

**Disadvantages**

- Generated content can become stale between builds or regeneration events.
- Build pipelines and cache invalidation must be maintained.
- Personalized content cannot safely be embedded in publicly accessible generated HTML.
- Interactive routes may still require substantial client JavaScript.

**Assessment:** Do not adopt SSG for personalized account pages. Consider it for public documentation, help content, marketing pages, and other non-sensitive content.

## Comparison

| Criterion          | SPA                                            | Nuxt SSR                                                        | SSG                                         |
| ------------------ | ---------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------- |
| LCP                | May be delayed by JS execution and API calls   | Can improve initial content rendering                           | Often excellent for static content          |
| CLS                | Depends on loading states and layout stability | Depends on stable HTML and correct hydration                    | Depends on stable generated markup          |
| Client JS          | Depends on bundling and route splitting        | Hydration and client bundles remain necessary                   | Depends on required interactivity           |
| Security           | Backend must authorize protected resources     | Requires secure server-side authorization and request isolation | Generated HTML must not expose private data |
| Development effort | Lowest incremental cost                        | Higher migration and maintenance cost                           | Low to moderate for suitable public content |
| Deployment         | Static hosting plus APIs                       | Server/runtime and operational monitoring                       | Static hosting, builds, and invalidation    |

These are qualitative expectations. Actual results depend on the implementation, data dependencies, infrastructure, and user environment.

## Security requirements

Rendering strategy does not replace backend authorization. All protected API operations must enforce access control independently of the client.

If SSR is introduced:

- Authenticate and authorize each request before rendering protected content.
- Prevent cross-request leakage of user-specific state.
- Do not place secrets or sensitive tokens in rendered HTML or hydration payloads.
- Ensure personalized responses cannot be served from shared caches to other users.
- Test session handling, error responses, and cache headers.

For SSG, generated output must contain only content approved for public access. Authentication gates must not be treated as sufficient protection for sensitive data already embedded in static artifacts.

## Performance measurement plan

Establish a baseline before changing the rendering architecture.

Measure representative journeys, including initial login or authenticated entry, dashboard loading, order or account-detail navigation, and important interactions.

Collect:

- LCP, CLS, and INP at the 75th percentile, segmented by mobile and desktop.
- LCP phase breakdown and the identity of the largest content element.
- TTFB, API response latency, and JavaScript download, parse, and execution costs.
- Compressed initial-route JavaScript size and route-level bundle composition.
- Interaction responsiveness and long tasks.
- SSR latency under load, infrastructure costs, error rates, and caching behavior if a prototype is built.
- Security behavior for authenticated HTML, API responses, and caches.

Use real-user monitoring for actual customer experience and repeatable lab tests for diagnosis. Lab measurements alone are insufficient to establish production outcomes.

### Initial targets

Use the published Core Web Vitals good thresholds as starting goals:

- LCP: at most 2.5 seconds.
- CLS: at most 0.1.
- INP: at most 200 milliseconds.

Evaluate these targets at the 75th percentile and segment by device class. Establish portal-specific budgets for JavaScript and interaction readiness based on the measured baseline and product requirements.

## Optimization before migration

Prioritize the following work:

1. Identify the actual LCP element and determine whether the dominant delay comes from server response, resource loading, JavaScript execution, or API latency.
2. Reduce initial JavaScript through route-level code splitting, lazy loading, and removal of unnecessary dependencies.
3. Optimize critical assets, fonts, caching, and network request waterfalls.
4. Reduce expensive application initialization and avoid blocking the initial render on non-critical requests.
5. Reserve layout space for asynchronous content and improve loading and error states.
6. Measure interaction performance and defer non-critical work.

Re-measure after these changes rather than assuming that they have solved the bottleneck.

## Conditions for reconsideration

Reopen this decision when any of the following occurs:

- LCP or other critical performance targets remain unmet after a documented optimization cycle.
- A representative Nuxt SSR prototype demonstrates a meaningful, repeatable improvement under equivalent conditions.
- Initial content must be available before client JavaScript executes for important customer journeys.
- Public, SEO-sensitive routes become a significant product requirement.
- Performance, infrastructure, or maintenance costs materially change the trade-off.

Any SSR migration proposal must include measured performance gains, migration effort, operating costs, security controls, and a rollback plan.

SSG should be evaluated separately for routes with public, stable content. A future Nuxt implementation could combine prerendered public pages with SSR or client-side rendering for authenticated routes.

## Consequences

The immediate decision avoids migration risk and preserves the current deployment model. It also requires explicit performance measurement so that retaining the SPA remains evidence-based.

The main risk is that client-side rendering may continue to delay initial content on slower devices. If targeted optimizations cannot meet the agreed targets, the architecture must be reconsidered rather than treating incremental optimization as an indefinite commitment.

**Review outcome:** Retain the SPA for now, establish a performance baseline, optimize measurable bottlenecks, and revisit SSR or hybrid rendering if the evidence supports a change.
