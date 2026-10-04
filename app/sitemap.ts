import type { MetadataRoute } from "next";
import { SITE_URL } from "@/src/config/site";
import { DEFAULT_LOCALE, LOCALES } from "@/src/i18n";
import { BUILD_DATE, pageUrl } from "@/src/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    ...Object.fromEntries(LOCALES.map((l) => [l.id, pageUrl(l.id)])),
    "x-default": pageUrl(DEFAULT_LOCALE),
  };
  return LOCALES.map((l) => ({
    url: pageUrl(l.id),
    lastModified: BUILD_DATE,
    changeFrequency: "monthly",
    priority: l.id === DEFAULT_LOCALE ? 1 : 0.9,
    alternates: { languages },
    images: [`${SITE_URL}/img/hero-1600.webp`, `${SITE_URL}/og/${l.id}.jpg`],
  }));
}
