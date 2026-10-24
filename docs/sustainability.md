# Hållbarhet och etik

## Siffrorna

Jag missade att lägga till CO₂-mätningen före M7. Därför skapade jag `scripts/co2.mjs` den 25 oktober 2026 i samband med arbetet med M9. Skriptet använder `co2.js` och Sustainable Web Design-modellen v4 för att uppskatta webbplatsens klimatpåverkan.

Den senaste körningen av `npm run co2` gav följande resultat för det nuvarande bygget:

| kB per besök | g CO₂e per besök (SE) | kg CO₂e per månad (SE) | kg CO₂e per månad (globalt) |
| -----------: | --------------------: | ---------------------: | --------------------------: |
|          350 |                 0,006 |                    0,8 |                         1,9 |

Resultaten är modellberäkningar, inte direkta mätningar av faktiska utsläpp. Beräkningen utgår från att 30 % av besöken är förstabesök. Eftersom skriptet skapades efter M7 har jag ännu inte gjort en verifierad mätning av versionen före M7 med samma skript. Därför gör jag ingen numerisk jämförelse mellan versionerna här.

## Metoden och vad vi inte räknar

Beräkningen utgår från 40 000 kunder och 3,2 sessioner per kund och månad, vilket motsvarar 128 000 besök per månad. Vi bedömer att detta är ett rimligt antagande: en kund kanske loggar in när fakturan kommer och några gånger till för att kontrollera sin förbrukning eller göra exempelvis en adressändring.

Skriptet mäter `dist/index.html` och filerna under `dist/assets/`, inklusive lazy-loaded vyer. Filstorlekarna räknas okomprimerade. I den senaste körningen antas 30 % av besöken vara förstabesök och att återbesök i större utsträckning kan använda cachat innehåll. Andelen på 30 % är ett antagande, inte en uppmätt andel. Beräkningen är förenklad och kan avvika från den faktiska datamängden, eftersom filer kan komprimeras med gzip eller Brotli och återbesök kan använda cachat innehåll.

Modellen använder svensk elmix för utsläpp från drift, medan utsläpp från tillverkning av enheter, nätverk och datacenter beräknas med modellens globala antaganden. Beräkningen omfattar inte den extra processorkraft som JavaScript kan kräva på användarens enhet, till exempel för att rita förbrukningsdiagram. Den omfattar inte heller API-anrop, serverarbete eller den faktiska elmixen hos vår hosting-leverantör. Resultaten ska därför ses som uppskattningar och inte som en fullständig livscykelanalys.

## Etikfall: Chatta med Kraftly

### Situationen

Vi vill erbjuda kunderna en AI-chatt som kan hjälpa dem att hitta information och förstå hur de använder Kraftly. Samtidigt kan uppgifter om elanvändning vara känsliga ur ett integritets- och förtroendeperspektiv. Därför vill vi begränsa AI:ns tillgång till kunddata och undvika att den läser kundernas individuella förbrukningsuppgifter när det inte behövs.

### Vårt beslut

Vi kan erbjuda en AI-chatt, men den ska i nuläget inte ha tillgång till kundernas personliga förbrukningsdata. I stället ska den vägleda kunden till rätt vy eller funktion i appen, där kunden själv kan se sina uppgifter. Vi har ännu inte tillräcklig kontroll över hur kunddata skulle behandlas av en AI-lösning, och vi har inte fastställt förutsättningarna för att använda uppgifterna för detta nya ändamål.

### Varför

Vårt beslut utgår från GDPR:s principer om ändamålsbegränsning, uppgiftsminimering samt integritet och konfidentialitet. Uppgifter om elanvändning används bland annat för fakturering, men det betyder inte automatiskt att de också ska delas med en AI-modell. Vi vill inte lämna ut fler personuppgifter än vad som behövs för att hjälpa kunden.

Innan en AI-lösning eventuellt får behandla kunduppgifter måste vi utreda rättslig grund, informera kunderna tydligt om behandlingen och säkerställa lämpliga skyddsåtgärder. Kundernas förväntningar är också viktiga: den som skriver en fråga i en chatt ska kunna förstå hur informationen används och om den delas med en extern leverantör.

### Vad vi gör i stället och vilka villkor som gäller

I stället för att ge AI-chatten tillgång till kundernas förbrukningsdata låter vi den vägleda användaren till var informationen finns i appen. På så sätt kan kunden få hjälp utan att AI:n behöver läsa eller behandla individuella förbrukningsuppgifter.

Om vi i framtiden vill ge AI:n tillgång till sådana uppgifter behöver vi först säkerställa en lämplig rättslig grund, tydlig information till kunderna, dataminimering och tekniska och organisatoriska skyddsåtgärder. Vi behöver även bedöma hur en eventuell extern AI-leverantör hanterar informationen. Integritet och kundernas förtroende ska väga tyngre än att göra chatten mer avancerad.
