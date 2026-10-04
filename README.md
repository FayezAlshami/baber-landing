# Trimio — landingspagina

**Trimio** is een product van **[Nivx](https://nivx.nl)**: premium websites met
directe online boekingen voor barbershops. Dit is de meertalige
marketing-landingspagina (NL · EN · TR · AR).

Gebouwd met **Next.js 16 (App Router, Turbopack)**, **React 19**,
**TypeScript**, **Tailwind CSS 4**, **Motion** (animaties), **Lenis** (smooth
scroll) en **Phosphor Icons**. Volledig statisch, mobile-first, toegankelijk en
snel.

---

## Aan de slag

```bash
npm install
npm run dev      # ontwikkelserver op http://localhost:3000
npm run build    # productie-build
npm run start    # productieserver (na build)
npm run lint     # ESLint 9 (flat config, eslint.config.mjs)
npm run images -- <map-met-foto's>   # beelden opnieuw genereren (zie hieronder)
npm run icons    # app-iconen (PNG, maskable, apple-touch) uit de favicon
```

---

## Aanpassen — alles op één plek

- `src/config/site.ts` — WhatsApp-nummer, prijzen, valuta (incl. TRY), merk.
- `src/i18n/{nl,en,tr,ar}.ts` — alle zichtbare teksten per taal.

### WhatsApp-nummer

```ts
export const WHATSAPP_NUMBER = "31600000000"; // internationaal, zonder + of spaties
```

### Prijzen & pakketten

`PACKAGE_PRICES_EUR` in `src/config/site.ts`. Andere valuta worden indicatief
omgerekend via `CURRENCIES`.

---

## Huisstijl (Trimio brand kit)

| Rol                         | Kleur     | Tailwind      |
| --------------------------- | --------- | ------------- |
| Achtergrond / tekst op licht | `#202338` | `ink`         |
| Accent, knoppen, schaar     | `#FFA985` | `brand`       |
| Licht / tekst op donker     | `#FFF8EF` | `bone`        |
| Kaarten op donker           | `#2D314B` | `neutral-800` |
| Secundaire tekst op donker  | `#B9B9C7` | `muted`       |
| Oranje tekst op licht       | `#AD4522` | `brand-700`   |

Op apricot-knoppen staat altijd **navy** tekst (`text-ink`), niet wit.
Kleine gedempte tekst op navy gebruikt minimaal `text-bone/55`, zodat alles
aan WCAG AA voldoet.

De kleuren, lettertypen, radii en animaties staan als tokens in `@theme` in
`app/globals.css` (Tailwind 4 heeft geen `tailwind.config.ts` meer).

Iconen komen uit **Phosphor** via `components/ui/Icon.tsx`: `light` voor de UI,
`duotone` voor de feature-tegels, de merklogo's voor WhatsApp, Instagram, TikTok
en Google. De schaar is ons eigen merkteken.

Lettertypen (SIL OFL, lokaal via `next/font/local` uit `app/fonts/`):
**Manrope** voor Latijns schrift (ook Turks) en **Alexandria** voor Arabisch.

Logo's en favicon staan in `public/brand/`. In de UI wordt het logo inline
gerenderd door `components/ui/Logo.tsx`; de schaar is een los component
(`components/ui/Scissors.tsx`) waarvan de twee bladen kunnen openen en sluiten.

---

## Intro & interacties

- **Intro** (`components/Intro.tsx`): een filmische knipbeurt van ~5 s.
  Letterbox-balken, filmkorrel en vignet; haar in twee dieptelagen onder een
  langzame camera-push; een warme lichtbundel en een grote kam glijden door het
  haar; de schaar knipt met een glinstering per knip en een "blade light" langs
  de kniplijn; het afgeknipte haar zweeft naar beneden. Daarna een titelkaart
  (logo + tagline `intro.tagline`) en de "kapmantel" wordt weggetrokken.
  Speelt bij elke paginalading, overslaan met klik of Esc, uit bij
  `prefers-reduced-motion`. De hero-entree wacht via `html[data-stage]`.
  Onder de intro staat de hero al klaar (zodra de webfonts binnen zijn), zodat
  de intro de LCP niet ophoudt; bij de overdracht speelt de entree gewoon af.
- **Smooth scroll** (`components/SmoothScroll.tsx`): Lenis, traag en zacht
  (duration 1.6, expo-ease), plus parallax via `data-parallax` en de
  voortgangslijn bovenaan.
- **Afwerking** (`components/Atmosphere.tsx`): filmkorrel en vignet over de
  site, cursor-ring, magnetische knoppen en een spotlight op kaarten (alleen
  bij muis/trackpad). Koppen rijzen op uit een masker, secties zijn genummerd
  ("01"), beelden openen met een wipe (`<Img wipe parallax={0.08} />`).
- **Galerij** (`components/Showcase.tsx`): op desktop pint de sectie en
  schuift een filmstrip met 8 genummerde beelden horizontaal mee met de scroll;
  op mobiel een swipe-carrousel met scroll-snap.
- **Afwerking**: koppen komen woord voor woord uit een masker
  (`components/ui/SplitWords.tsx`), accentwoorden hebben een trage metalen
  glans, de populaire prijskaart en het formulier een draaiende rand
  (`@property --angle`), de cursor toont labels uit `data-cursor`, de telefoon
  in de hero kantelt mee met de muis, taalwissel via de View Transitions API,
  een barbierspaal als voortgangslijn en een groot "trimio" in de footer dat
  zich vult tijdens het scrollen (`animation-timeline: view()`).
- **FAQ**: open schaar = antwoord tonen, gesloten schaar = antwoord sluiten.

---

## Talen

`nl` staat op `/`, de andere talen op `/en/`, `/tr/` en `/ar/` (RTL). Bij een
eerste bezoek aan `/` wordt de browsertaal gekozen; een handmatige keuze wordt
onthouden. Een taal toevoegen: dictionary in `src/i18n/`, `LOCALES` en
`loaders` in `src/i18n/index.ts`, `DICTS` in `src/lib/content.ts` en
`generateStaticParams` in `app/(intl)/[locale]/layout.tsx`. Hreflang, sitemap,
llms.txt en de social cards volgen `LOCALES` vanzelf.

De teksten zijn geschreven als een kleine studio die met barbiers werkt: concreet
("de avond ervoor een herinnering"), weinig gedachtestreepjes, geen
marketingvulling. Houd dat zo bij nieuwe teksten.

---

## Afbeeldingen

`scripts/build-images.mjs` (sharp) maakt van bronfoto's responsive WebP's
(`public/img/<slot>-<breedte>.webp`), een basisbeeld voor de social cards
(`public/img/og.jpg`) en `src/lib/images.json` met afmetingen en
blur-placeholders. Het hero-beeld wordt via React 19 `preload()` vooraf geladen.

Welke foto in welk slot komt (en eventuele uitsnede) staat in
`scripts/images.map.json`. Nieuwe beelden: pas de map aan en draai
`npm run images -- <map-met-foto's>`.

---

## SEO & GEO

Gericht op Google én op AI-assistenten (ChatGPT, Claude, Perplexity, Gemini).

- **Metadata per taal**: titel, beschrijving, lokale keywords, canonical,
  hreflang (nl/en/tr/ar + x-default), Open Graph en Twitter Cards.
- **Social cards**: `app/og/[image]/route.tsx` rendert bij de build per taal een
  1200×630 JPEG met `next/og` (`/og/nl.jpg`, `/og/en.jpg`, …).
- **Structured data** (`src/lib/seo.tsx`): één verbonden `@graph` per pagina met
  `Organization`, `Brand`, `WebSite`, `WebPage` (met `speakable` en
  `dateModified`), `SoftwareApplication` en `Service` met een `Offer` per pakket
  en periode, `HowTo` (de vier stappen), `FAQPage` en `BreadcrumbList`. Er
  worden geen beoordelingen of reviews geclaimd.
- **llms.txt** en **llms-full.txt** (`src/lib/llms.ts`): een korte en een
  volledige briefing voor AI-assistenten, gegenereerd uit dezelfde dictionaries.
- **robots.txt** laat zoekmachines en AI-crawlers (GPTBot, OAI-SearchBot,
  ClaudeBot, PerplexityBot, Google-Extended, …) expliciet toe.
- **Sitemap** met builddatum, x-default en beelden; **manifest** met PNG- en
  maskable-iconen.
- **Antwoord eerst**: elke FAQ begint met een direct antwoord, en de sectie
  "Wat is Trimio?" (`#about`) geeft een korte definitie die AI-assistenten
  letterlijk kunnen overnemen.

Stel de publieke URL in via `NEXT_PUBLIC_SITE_URL` (zie `src/config/site.ts`).

---

## Publiceren (GitHub Pages)

`.github/workflows/pages.yml` bouwt bij elke push naar `main` een statische
export en zet die op GitHub Pages. `actions/configure-pages` levert het
basispad en de publieke URL, dus de build past zich vanzelf aan:

- zonder eigen domein: `https://fayezalshami.github.io/baber-landing/`
- met eigen domein: `https://barber.fayezalshami.com/`

Eigen domein koppelen:

1. DNS bij Hostinger (fayezalshami.com): `CNAME` record `barber` →
   `fayezalshami.github.io` (TTL 300).
2. GitHub → repo **Settings → Pages → Custom domain**:
   `barber.fayezalshami.com`, en daarna **Enforce HTTPS** aanvinken.
3. De workflow opnieuw draaien (Actions → *Deploy GitHub Pages* → *Run
   workflow*), zodat canonical, sitemap en llms.txt het nieuwe domein gebruiken.
