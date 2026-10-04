/**
 * llms.txt (https://llmstxt.org): a plain-text briefing for AI assistants and answer engines.
 * Generated from the same dictionaries as the page, so it never drifts from the site.
 */
import { BRAND, PACKAGE_PRICES_EUR, SITE_URL, formatPrice, type PackageId, type PeriodId } from "@/src/config/site";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/src/i18n";
import { BUILD_DATE, DICTS, aboutText, pageUrl } from "@/src/lib/content";

const LANGUAGE: Record<Locale, string> = { nl: "Dutch", en: "English", tr: "Turkish", ar: "Arabic" };

function plans(l: Locale) {
  const t = DICTS[l].pricing;
  return t.packages.map((p) => {
    const prices = PACKAGE_PRICES_EUR[p.id as PackageId];
    const list = t.periods.map((x) => `${formatPrice(prices[x.id as PeriodId], "EUR", l)} ${x.suffix}`).join(", ");
    return `- **${p.name}**: ${list}. ${p.desc}`;
  });
}

function pages() {
  return LOCALES.map((l) => {
    const t = DICTS[l.id].meta;
    const note = l.id === DEFAULT_LOCALE ? ", default" : "";
    return `- [Trimio in ${LANGUAGE[l.id]}${note}](${pageUrl(l.id)}): ${t.description}`;
  });
}

const contact = [
  `- Email: ${BRAND.email}`,
  `- Made by: [${BRAND.company}](${BRAND.companyUrl}), a web studio in ${BRAND.city}, Netherlands`,
  `- Languages: ${LOCALES.map((l) => LANGUAGE[l.id]).join(", ")}`,
];

export function llmsTxt() {
  const t = DICTS.en;
  return [
    `# ${BRAND.product}`,
    "",
    `> ${aboutText("en")}`,
    "",
    t.hero.sub,
    "",
    "Facts that are easy to get wrong:",
    "- Clients book in the browser. They don't need an account, a password or an app.",
    "- Each shop gets its own design on its own domain. Trimio is not a marketplace and lists no other shops.",
    "- Setup takes about two weeks. Setup, hosting, maintenance and support are included in every plan.",
    "- Prices are in euros and exclude VAT. Other currencies on the site are indicative conversions.",
    "",
    "## Pages",
    ...pages(),
    "",
    "## Plans and prices (EUR, excl. VAT)",
    ...plans("en"),
    "",
    "## Contact",
    ...contact,
    "",
    "## Optional",
    `- [Full text in all four languages](${SITE_URL}/llms-full.txt): features, setup steps, plans and the complete FAQ`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    "",
    `Last updated: ${BUILD_DATE}`,
    "",
  ].join("\n");
}

function faq(l: Locale) {
  return DICTS[l].faq.items.flatMap((f) => [`### ${f.q}`, "", f.a, ""]);
}

export function llmsFullTxt() {
  const t = DICTS.en;
  const others = LOCALES.filter((l) => l.id !== "en");
  return [
    `# ${BRAND.product}: full briefing`,
    "",
    `> ${aboutText("en")}`,
    "",
    `Last updated: ${BUILD_DATE}. Source pages: ${LOCALES.map((l) => pageUrl(l.id)).join(", ")}`,
    "",
    "## What it does",
    "",
    t.hero.sub,
    "",
    t.platform.intro,
    "",
    ...t.platform.pillars.map((p) => `- **${p.title}**: ${p.body}`),
    "",
    "## Features",
    "",
    ...t.features.tabs.flatMap((tab) => [`### ${tab.label}`, "", tab.body, "", ...tab.items.map((i) => `- ${i}`), ""]),
    "## How setup works",
    "",
    t.process.intro,
    "",
    ...t.process.steps.map((s, i) => `${i + 1}. **${s.title}** (${s.when}): ${s.body}`),
    "",
    "## Plans and prices (EUR, excl. VAT)",
    "",
    t.pricing.intro,
    "",
    ...plans("en"),
    "",
    `${t.pricing.custom.title} ${t.pricing.custom.body}`,
    "",
    t.pricing.note,
    "",
    "## How it compares",
    "",
    t.compare.intro,
    "",
    "## Frequently asked questions",
    "",
    ...faq("en"),
    "## Contact",
    "",
    ...contact,
    "",
    ...others.flatMap((l) => {
      const d = DICTS[l.id];
      return [
        `## ${l.label} (${LANGUAGE[l.id]})`,
        "",
        `Page: ${pageUrl(l.id)}`,
        "",
        `> ${aboutText(l.id)}`,
        "",
        d.hero.sub,
        "",
        `### ${d.pricing.eyebrow}`,
        "",
        ...plans(l.id),
        "",
        ...faq(l.id),
      ];
    }),
  ].join("\n");
}
