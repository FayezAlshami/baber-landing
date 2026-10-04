import type { MetadataRoute } from "next";
import { SITE_URL } from "@/src/config/site";

export const dynamic = "force-static";

/** Search engines and AI assistants (search, answer and training crawlers) are all welcome. */
const CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "DuckDuckBot",
  "Applebot",
  "Applebot-Extended",
  "Google-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "DuckAssistBot",
  "MistralAI-User",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: CRAWLERS, allow: "/" },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
