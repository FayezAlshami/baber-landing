# Trimio — landingspagina

**Trimio** is een product van **[Nivx](https://nivx.nl)**: premium websites met
directe online boekingen voor barbershops. Dit is de meertalige
marketing-landingspagina (NL · EN · TR · AR).

Gebouwd met **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**,
**Motion** (animaties) en **Lenis** (smooth scroll). Volledig statisch,
mobile-first, toegankelijk en snel.

---

## Aan de slag

```bash
npm install
npm run dev      # ontwikkelserver op http://localhost:3000
npm run build    # productie-build
npm run start    # productieserver (na build)
npm run images -- <map-met-foto's>   # beelden opnieuw genereren (zie hieronder)
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
- **Smooth scroll** (`components/SmoothScroll.tsx`): Lenis, traag en zacht
  (duration 1.6, expo-ease), plus parallax via `data-parallax` en de
  voortgangslijn bovenaan.
- **Afwerking** (`components/Atmosphere.tsx`): filmkorrel en vignet over de
  site, cursor-ring, magnetische knoppen en een spotlight op kaarten (alleen
  bij muis/trackpad). Koppen rijzen op uit een masker, secties zijn genummerd
  ("01"), beelden openen met een wipe (`<Img wipe parallax={0.08} />`).
- **FAQ**: open schaar = antwoord tonen, gesloten schaar = antwoord sluiten.

---

## Talen

`nl` staat op `/`, de andere talen op `/en/`, `/tr/` en `/ar/` (RTL). Bij een
eerste bezoek aan `/` wordt de browsertaal gekozen; een handmatige keuze wordt
onthouden. Een taal toevoegen: dictionary in `src/i18n/`, `LOCALES` en
`loaders` in `src/i18n/index.ts`, `generateStaticParams` in
`app/(intl)/[locale]/layout.tsx`, en de hreflang-lijsten in `src/lib/seo.tsx` en
`app/sitemap.ts`.

---

## Afbeeldingen

`scripts/build-images.mjs` (sharp) maakt van bronfoto's responsive WebP's
(`public/img/<slot>-<breedte>.webp`), een OpenGraph-beeld (`public/img/og.jpg`)
en `src/lib/images.json` met afmetingen en blur-placeholders.

Welke foto in welk slot komt (en eventuele uitsnede) staat in
`scripts/images.map.json`. Nieuwe beelden: pas de map aan en draai
`npm run images -- <map-met-foto's>`.

---

## SEO

- Titels, beschrijvingen en keywords per taal
- Open Graph + Twitter Cards, canonical, hreflang (nl/en/tr/ar), sitemap
- JSON-LD: `Organization`, `Brand`, `SoftwareApplication` en `FAQPage`

Stel de publieke URL in via `NEXT_PUBLIC_SITE_URL` (zie `src/config/site.ts`).
