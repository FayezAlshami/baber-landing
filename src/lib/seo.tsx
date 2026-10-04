import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { BRAND, PACKAGE_PRICES_EUR, SITE_URL, BASE_PATH } from "@/src/config/site";
import { LOCALES, dirOf, localePath, type Dict, type Locale } from "@/src/i18n";
import nl from "@/src/i18n/nl";
import en from "@/src/i18n/en";
import ar from "@/src/i18n/ar";
import tr from "@/src/i18n/tr";
import "@/app/globals.css";

export const DICTS: Record<Locale, Dict> = { nl, en, ar, tr };

/* Trimio typefaces (SIL OFL): Manrope for Latin (incl. Turkish), Alexandria for Arabic. */
const manrope = localFont({
  src: [
    { path: "../../app/fonts/manrope-400.woff", weight: "400" },
    { path: "../../app/fonts/manrope-600.woff", weight: "600" },
    { path: "../../app/fonts/manrope-700.woff", weight: "700" },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
const alexandria = localFont({
  src: [
    { path: "../../app/fonts/alexandria-400.woff", weight: "400" },
    { path: "../../app/fonts/alexandria-600.woff", weight: "600" },
    { path: "../../app/fonts/alexandria-700.woff", weight: "700" },
  ],
  variable: "--font-ar",
  display: "swap",
  preload: false,
  fallback: ["system-ui", "sans-serif"],
});

const url = (l: Locale) => `${SITE_URL}${localePath(l)}`;

export const viewport: Viewport = { themeColor: "#202338", width: "device-width", initialScale: 1 };

export function buildMetadata(locale: Locale): Metadata {
  const t = DICTS[locale].meta;
  const og = `${SITE_URL}/img/og.jpg`;
  return {
    metadataBase: new URL(SITE_URL + "/"),
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    applicationName: BRAND.product,
    authors: [{ name: BRAND.company, url: BRAND.companyUrl }],
    alternates: {
      canonical: url(locale),
      languages: { nl: url("nl"), en: url("en"), tr: url("tr"), ar: url("ar"), "x-default": url("nl") },
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    openGraph: {
      type: "website",
      url: url(locale),
      siteName: BRAND.product,
      title: t.title,
      description: t.description,
      locale: LOCALES.find((l) => l.id === locale)!.og,
      alternateLocale: LOCALES.filter((l) => l.id !== locale).map((l) => l.og),
      images: [{ url: og, width: 1200, height: 630, alt: t.ogAlt }],
    },
    twitter: { card: "summary_large_image", title: t.title, description: t.description, images: [og] },
    icons: { icon: [{ url: `${BASE_PATH}/brand/trimio-favicon.svg`, type: "image/svg+xml" }] },
  };
}

function jsonLd(locale: Locale) {
  const t = DICTS[locale];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: BRAND.company,
        url: BRAND.companyUrl,
        email: BRAND.email,
      },
      {
        "@type": "Brand",
        "@id": `${SITE_URL}/#brand`,
        name: BRAND.product,
        logo: `${SITE_URL}/brand/trimio-logo.svg`,
      },
      {
        "@type": "SoftwareApplication",
        name: BRAND.product,
        url: url(locale),
        inLanguage: locale,
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Barbershop booking software",
        operatingSystem: "Web",
        description: t.meta.description,
        brand: { "@id": `${SITE_URL}/#brand` },
        publisher: { "@id": `${SITE_URL}/#org` },
        featureList: t.features.tabs.flatMap((x) => x.items).join(", "),
        offers: t.pricing.packages.map((p) => ({
          "@type": "Offer",
          name: p.name,
          price: PACKAGE_PRICES_EUR[p.id as keyof typeof PACKAGE_PRICES_EUR].month,
          priceCurrency: "EUR",
          description: p.desc,
        })),
      },
      {
        "@type": "FAQPage",
        inLanguage: locale,
        mainEntity: t.faq.items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

/**
 * Runs before first paint. Reduced-motion users skip the intro; everyone else gets
 * data-stage="intro", which holds the hero entrance until the intro hands over (with a
 * timer as a failsafe that does not depend on React).
 */
const INTRO_GATE = `try{var d=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.intro="off"}else{d.dataset.stage="intro";setTimeout(function(){d.dataset.stage="ready"},9000)}}catch(e){}`;

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
