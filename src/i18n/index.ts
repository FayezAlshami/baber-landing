import type { Dict } from "./en";
import { BASE_PATH } from "@/src/config/site";

export type { Dict };
export type Locale = "nl" | "en" | "tr" | "ar";

export const LOCALES: { id: Locale; label: string; short: string; dir: "ltr" | "rtl"; og: string }[] = [
  { id: "nl", label: "Nederlands", short: "NL", dir: "ltr", og: "nl_NL" },
  { id: "en", label: "English", short: "EN", dir: "ltr", og: "en_GB" },
  { id: "tr", label: "Türkçe", short: "TR", dir: "ltr", og: "tr_TR" },
  { id: "ar", label: "العربية", short: "ع", dir: "rtl", og: "ar_AR" },
];

export const DEFAULT_LOCALE: Locale = "nl";

/** Narrow a route segment to a supported locale (routes only build for known locales). */
export const asLocale = (value: string): Locale => (LOCALES.some((l) => l.id === value) ? (value as Locale) : DEFAULT_LOCALE);

export const dirOf = (l: Locale) => (l === "ar" ? "rtl" : "ltr");

/** Path of a locale's page, without base path. */
export const localePath = (l: Locale) => (l === DEFAULT_LOCALE ? "/" : `/${l}/`);

export const localeHref = (l: Locale) => `${BASE_PATH}${localePath(l)}`;

export const loaders: Record<Locale, () => Promise<Dict>> = {
  nl: () => import("./nl").then((m) => m.default),
  en: () => import("./en").then((m) => m.default),
  tr: () => import("./tr").then((m) => m.default),
  ar: () => import("./ar").then((m) => m.default),
};

export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
