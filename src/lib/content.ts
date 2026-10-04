import { PACKAGE_PRICES_EUR, SITE_URL, formatPrice, type PeriodId } from "@/src/config/site";
import { fill, localePath, type Dict, type Locale } from "@/src/i18n";
import nl from "@/src/i18n/nl";
import en from "@/src/i18n/en";
import ar from "@/src/i18n/ar";
import tr from "@/src/i18n/tr";

/** All dictionaries, for server-side use (metadata, structured data, llms.txt, OG images). */
export const DICTS: Record<Locale, Dict> = { nl, en, ar, tr };

/** Absolute URL of a locale's page. */
export const pageUrl = (l: Locale) => `${SITE_URL}${localePath(l)}`;

/** Per-locale social card, rendered at build time by app/og/[image]/route.tsx. */
export const ogImageUrl = (l: Locale) => `${SITE_URL}/og/${l}.jpg`;

/** Build day (YYYY-MM-DD), used as dateModified in structured data, the sitemap and llms.txt. */
export const BUILD_DATE = new Date().toISOString().slice(0, 10);

/** ISO 8601 billing period per pricing period. */
export const BILLING: Record<PeriodId, string> = { month: "P1M", half: "P6M", year: "P1Y" };

/** The "What is Trimio?" definition with the entry price filled in. */
export const aboutText = (l: Locale) =>
  fill(DICTS[l].about.body, { from: formatPrice(PACKAGE_PRICES_EUR.essential.month, "EUR", l) });
