import type { MetadataRoute } from "next";
import { SITE_URL } from "@/src/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { nl: `${SITE_URL}/`, en: `${SITE_URL}/en/`, tr: `${SITE_URL}/tr/`, ar: `${SITE_URL}/ar/` };
  return Object.values(languages).map((url) => ({
    url,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));
}
