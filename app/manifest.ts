import type { MetadataRoute } from "next";
import { BASE_PATH, BRAND } from "@/src/config/site";
import { DICTS } from "@/src/lib/content";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const t = DICTS.nl;
  return {
    id: `${BASE_PATH}/`,
    name: `${BRAND.product} by ${BRAND.company}`,
    short_name: BRAND.product,
    description: t.meta.description,
    lang: "nl",
    dir: "ltr",
    start_url: `${BASE_PATH}/`,
    scope: `${BASE_PATH}/`,
    display: "standalone",
    background_color: "#202338",
    theme_color: "#202338",
    categories: ["business", "productivity"],
    icons: [
      { src: `${BASE_PATH}/brand/trimio-favicon.svg`, type: "image/svg+xml", sizes: "any" },
      { src: `${BASE_PATH}/brand/icon-192.png`, type: "image/png", sizes: "192x192" },
      { src: `${BASE_PATH}/brand/icon-512.png`, type: "image/png", sizes: "512x512" },
      { src: `${BASE_PATH}/brand/icon-maskable-512.png`, type: "image/png", sizes: "512x512", purpose: "maskable" },
    ],
  };
}
