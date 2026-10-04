import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { BRAND, PACKAGE_PRICES_EUR, SITE_URL, BASE_PATH, type PackageId, type PeriodId } from "@/src/config/site";
import { DEFAULT_LOCALE, LOCALES, dirOf, type Locale } from "@/src/i18n";
import { BILLING, BUILD_DATE, DICTS, aboutText, ogImageUrl, pageUrl } from "@/src/lib/content";
import "@/app/globals.css";

export { DICTS };

/* Trimio typefaces (SIL OFL): Manrope for Latin (incl. Turkish), Alexandria for Arabic. */
const manrope = localFont({
  src: [
    { path: "../../app/fonts/manrope-400.woff", weight: "400" },
    { path: "../../app/fonts/manrope-600.woff", weight: "600" },
    { path: "../../app/fonts/manrope-700.woff", weight: "700" },
  ],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
const alexandria = localFont({
  src: [
    { path: "../../app/fonts/alexandria-400.woff", weight: "400" },
    { path: "../../app/fonts/alexandria-600.woff", weight: "600" },
    { path: "../../app/fonts/alexandria-700.woff", weight: "700" },
  ],
  variable: "--font-alexandria",
  display: "swap",
  preload: false,
  fallback: ["system-ui", "sans-serif"],
});

export const viewport: Viewport = { themeColor: "#202338", width: "device-width", initialScale: 1 };

export function buildMetadata(locale: Locale): Metadata {
  const t = DICTS[locale].meta;
  const og = ogImageUrl(locale);
  const brand = (file: string) => `${BASE_PATH}/brand/${file}`;
  return {
    metadataBase: new URL(SITE_URL + "/"),
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    applicationName: BRAND.product,
    authors: [{ name: BRAND.company, url: BRAND.companyUrl }],
    creator: BRAND.company,
    publisher: BRAND.company,
    category: "business",
    formatDetection: { telephone: false, email: false, address: false },
    alternates: {
      canonical: pageUrl(locale),
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l.id, pageUrl(l.id)])),
        "x-default": pageUrl(DEFAULT_LOCALE),
      },
      types: { "text/plain": `${SITE_URL}/llms.txt` },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    openGraph: {
      type: "website",
      url: pageUrl(locale),
      siteName: BRAND.product,
      title: t.title,
      description: t.description,
      locale: LOCALES.find((l) => l.id === locale)!.og,
      alternateLocale: LOCALES.filter((l) => l.id !== locale).map((l) => l.og),
      images: [{ url: og, width: 1200, height: 630, alt: t.ogAlt, type: "image/jpeg" }],
    },
    twitter: { card: "summary_large_image", title: t.title, description: t.description, images: [{ url: og, alt: t.ogAlt }] },
    icons: {
      icon: [
        { url: brand("trimio-favicon.svg"), type: "image/svg+xml" },
        { url: brand("icon-192.png"), type: "image/png", sizes: "192x192" },
      ],
      apple: [{ url: brand("apple-touch-icon.png"), sizes: "180x180" }],
    },
    appleWebApp: { title: BRAND.product, statusBarStyle: "black-translucent" },
  };
}

/**
 * One connected schema.org graph per page: who makes Trimio, what it is, what it costs,
 * how setup works and the FAQ. Every fact here is also visible on the page; no ratings
 * or reviews are claimed (the testimonials on the page are labelled as samples).
 */
function jsonLd(locale: Locale) {
  const t = DICTS[locale];
  const page = pageUrl(locale);
  const id = (key: string) => `${SITE_URL}/#${key}`;
  const ref = (at: string) => ({ "@id": at });

  const offers = t.pricing.packages.flatMap((p) =>
    t.pricing.periods.map((period) => {
      const price = PACKAGE_PRICES_EUR[p.id as PackageId][period.id as PeriodId];
      return {
        "@type": "Offer",
        "@id": `${page}#offer-${p.id}-${period.id}`,
        name: `${BRAND.product} ${p.name} (${period.label})`,
        description: p.desc,
        url: `${page}#pricing`,
        price,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        seller: ref(id("org")),
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price,
          priceCurrency: "EUR",
          billingDuration: BILLING[period.id as PeriodId],
          valueAddedTaxIncluded: false,
        },
      };
    }),
  );

  const crumbs: { name: string; item: string }[] = [{ name: BRAND.product, item: pageUrl(DEFAULT_LOCALE) }];
  if (locale !== DEFAULT_LOCALE) crumbs.push({ name: LOCALES.find((l) => l.id === locale)!.label, item: page });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": id("org"),
        name: BRAND.company,
        url: BRAND.companyUrl,
        email: BRAND.email,
        address: { "@type": "PostalAddress", addressLocality: BRAND.city, addressCountry: BRAND.country },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: BRAND.email,
          availableLanguage: LOCALES.map((l) => l.id),
        },
        brand: ref(id("brand")),
      },
      {
        "@type": "Brand",
        "@id": id("brand"),
        name: BRAND.product,
        logo: `${SITE_URL}/brand/trimio-logo.svg`,
        slogan: t.intro.tagline,
      },
      {
        "@type": "WebSite",
        "@id": id("website"),
        url: `${SITE_URL}/`,
        name: BRAND.product,
        inLanguage: LOCALES.map((l) => l.id),
        publisher: ref(id("org")),
      },
      {
        "@type": "WebPage",
        "@id": `${page}#webpage`,
        url: page,
        name: t.meta.title,
        description: t.meta.description,
        inLanguage: locale,
        isPartOf: ref(id("website")),
        about: ref(id("software")),
        primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}/img/hero-1600.webp`, caption: t.hero.imageAlt },
        image: ogImageUrl(locale),
        dateModified: BUILD_DATE,
        breadcrumb: ref(`${page}#breadcrumb`),
        speakable: { "@type": "SpeakableSpecification", cssSelector: [".hero-sub", ".about-definition"] },
      },
      {
        "@type": "SoftwareApplication",
        "@id": id("software"),
        name: BRAND.product,
        url: page,
        description: aboutText(locale),
        inLanguage: locale,
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Barbershop website and booking software",
        operatingSystem: "Web browser",
        brand: ref(id("brand")),
        publisher: ref(id("org")),
        featureList: t.features.tabs.flatMap((x) => x.items),
        offers,
      },
      {
        "@type": "Service",
        "@id": `${page}#service`,
        name: t.meta.title.split(" | ")[0],
        serviceType: "Barbershop website and online booking system",
        description: t.process.intro,
        provider: ref(id("org")),
        brand: ref(id("brand")),
        audience: { "@type": "BusinessAudience", audienceType: "Barbershops" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: t.pricing.eyebrow,
          itemListElement: offers.map((o) => ref(o["@id"])),
        },
      },
      {
        "@type": "HowTo",
        "@id": `${page}#how`,
        name: `${t.process.title} ${t.process.titleAccent}`,
        description: t.process.intro,
        inLanguage: locale,
        totalTime: "P14D",
        step: t.process.steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.title,
          text: s.body,
          url: `${page}#how`,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${page}#faq`,
        inLanguage: locale,
        isPartOf: ref(`${page}#webpage`),
        mainEntity: t.faq.items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${page}#breadcrumb`,
        itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.item })),
      },
    ],
  };
}

/**
 * Runs before first paint. Reduced-motion users skip the intro; everyone else gets
 * data-stage="intro", which holds the hero entrance until the intro hands over (with a
 * timer as a failsafe that does not depend on React). data-fonts marks the moment the web
 * fonts are in, so the hero can be painted under the intro without a font-swap shift.
 */
const INTRO_GATE = `try{var d=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.intro="off"}else{d.dataset.stage="intro";setTimeout(function(){d.dataset.stage="ready"},9000)}var f=function(){d.dataset.fonts="1"};setTimeout(f,1800);document.fonts.ready.then(f)}catch(e){}`;

export function Document({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      lang={locale}
      dir={dirOf(locale)}
      className={`${manrope.variable} ${alexandria.variable}`}
    >
      <body>
        {/* Intro gate: see INTRO_GATE. */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_GATE }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(locale)) }} />
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}.intro{display:none!important}.wipe{clip-path:none!important}.line-inner{transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
