/**
 * TRIMIO — central configuration.
 * Everything that changes often lives here: WhatsApp number, prices, currencies, brand.
 * All visible copy lives in src/i18n/{nl,en,tr,ar}.ts.
 */

/** WhatsApp number in international format WITHOUT "+" or spaces, e.g. "31612345678". */
export const WHATSAPP_NUMBER = "31600000000";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://trimio.nivx.nl").replace(/\/$/, "");

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const BRAND = {
  product: "Trimio",
  company: "Nivx",
  companyUrl: "https://nivx.nl",
  email: "hello@nivx.nl",
  city: "Amsterdam",
  country: "NL",
} as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* -------------------------------------------------------------------------- */
/*  PRICING — amounts are in EUR (billing currency).                          */
/*  Other currencies are shown as an indicative conversion.                   */
/* -------------------------------------------------------------------------- */

export type PeriodId = "month" | "half" | "year";
export const PERIOD_MONTHS: Record<PeriodId, number> = { month: 1, half: 6, year: 12 };

export type PackageId = "essential" | "professional" | "multi";

export const PACKAGE_PRICES_EUR: Record<PackageId, Record<PeriodId, number>> = {
  essential: { month: 29, half: 149, year: 279 },
  professional: { month: 49, half: 259, year: 479 },
  multi: { month: 79, half: 419, year: 749 },
};

export const POPULAR_PACKAGE: PackageId = "professional";

export type CurrencyId = "EUR" | "USD" | "GBP" | "TRY" | "AED" | "SAR";

/** Indicative rates from EUR. Update when needed. */
export const CURRENCIES: { id: CurrencyId; symbol: string; rate: number }[] = [
  { id: "EUR", symbol: "€", rate: 1 },
  { id: "USD", symbol: "$", rate: 1.1 },
  { id: "GBP", symbol: "£", rate: 0.85 },
  { id: "TRY", symbol: "₺", rate: 50 },
  { id: "AED", symbol: "AED", rate: 4.0 },
  { id: "SAR", symbol: "SAR", rate: 4.1 },
];

export function convertPrice(eur: number, currency: CurrencyId): number {
  const c = CURRENCIES.find((x) => x.id === currency) ?? CURRENCIES[0];
  const raw = eur * c.rate;
  if (c.rate === 1) return raw;
  if (raw < 100) return Math.round(raw);
  if (raw < 1000) return Math.round(raw / 5) * 5;
  return Math.round(raw / 10) * 10;
}

export function formatPrice(value: number, currency: CurrencyId, locale: string): string {
  const intlLocale = locale === "ar" ? "ar-u-nu-latn" : locale === "nl" ? "nl-NL" : locale === "tr" ? "tr-TR" : "en-GB";
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}
