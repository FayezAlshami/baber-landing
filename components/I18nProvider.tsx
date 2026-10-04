"use client";

import { flushSync } from "react-dom";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, dirOf, loaders, localeHref, type Dict, type Locale } from "@/src/i18n";
import { CURRENCIES, type CurrencyId } from "@/src/config/site";
import { track } from "@/src/lib/track";
import { useStored, writeStored } from "@/src/lib/stores";

type Ctx = {
  locale: Locale;
  t: Dict;
  switching: boolean;
  setLocale: (l: Locale) => void;
  preload: (l: Locale) => void;
  currency: CurrencyId;
  setCurrency: (c: CurrencyId) => void;
};

const I18nContext = createContext<Ctx | null>(null);

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n outside provider");
  return ctx;
}

const LOCALE_KEY = "trimio-locale";
const CURRENCY_KEY = "trimio-currency";

function store(key: string, value?: string) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch {}
  return null;
}

function browserLocale(): Locale | null {
  if (typeof navigator === "undefined") return null;
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.toLowerCase().split("-")[0];
    if (base in loaders) return base as Locale;
  }
  return null;
}

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function I18nProvider({
  initialLocale,
  initialDict,
  children,
}: {
  initialLocale: Locale;
  initialDict: Dict;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState(initialLocale);
  const [t, setT] = useState(initialDict);
  const [switching, setSwitching] = useState(false);
  const cache = useRef<Partial<Record<Locale, Dict>>>({ [initialLocale]: initialDict });
  const current = useRef(initialLocale);

  const preload = useCallback((l: Locale) => {
    if (cache.current[l]) return;
    loaders[l]().then((d) => (cache.current[l] = d));
  }, []);

  const apply = useCallback(async (next: Locale, silent = false) => {
    const prev = current.current;
    if (next === prev) return;
    const dict = cache.current[next] ?? (await loaders[next]());
    cache.current[next] = dict;
    current.current = next;
    const animate = !silent && !reducedMotion();
    const commit = () => {
      setLocaleState(next);
      setT(dict);
      const html = document.documentElement;
      html.lang = next;
      html.dir = dirOf(next);
      document.title = dict.meta.title;
    };

    if (animate && typeof document.startViewTransition === "function") {
      // View Transitions API: the browser snapshots the old page and blurs it into the new
      // language (see ::view-transition rules in globals.css).
      await document.startViewTransition(() => flushSync(commit)).finished.catch(() => {});
    } else if (animate) {
      setSwitching(true);
      await new Promise((r) => setTimeout(r, 200));
      commit();
      requestAnimationFrame(() => requestAnimationFrame(() => setSwitching(false)));
    } else {
      commit();
    }
    window.history.replaceState(window.history.state, "", localeHref(next) + window.location.hash);
    store(LOCALE_KEY, next);
    if (!silent) track("language_switch", { from: prev, to: next });
  }, []);

  const setLocale = useCallback((l: Locale) => void apply(l), [apply]);

  const savedCurrency = useStored(CURRENCY_KEY);
  const currency: CurrencyId = CURRENCIES.find((c) => c.id === savedCurrency)?.id ?? "EUR";
  const setCurrency = useCallback((c: CurrencyId) => {
    writeStored(CURRENCY_KEY, c);
    track("currency_switch", { currency: c });
  }, []);

  // On the root page, honour a saved language first, then the browser's language on a first
  // visit. The dictionary is fetched before switching, so the swap happens in one step.
  useEffect(() => {
    if (initialLocale !== DEFAULT_LOCALE) return;
    const savedLocale = store(LOCALE_KEY) as Locale | null;
    const preferred = savedLocale ?? browserLocale();
    if (!preferred || preferred === DEFAULT_LOCALE || !(preferred in loaders)) return;
    let cancelled = false;
    loaders[preferred]().then((dict) => {
      cache.current[preferred] = dict;
      if (!cancelled) apply(preferred, true);
    });
    return () => {
      cancelled = true;
    };
  }, [apply, initialLocale]);

  // Scroll reveal, conversion tracking, scroll depth, section views.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    // Image wipes start fully clipped, and Chromium counts a target's own clip-path when
    // measuring intersection, so watch each wipe's frame instead of the wipe itself.
    const wipes = new Map<Element, Element[]>();
    const wipeIO = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          wipes.get(e.target)?.forEach((w) => w.classList.add("is-visible"));
          wipeIO.unobserve(e.target);
        }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    const watched = new WeakSet<Element>();
    const scan = (root: ParentNode) => {
      root.querySelectorAll(".reveal").forEach((el) => {
        if (watched.has(el)) return;
        watched.add(el);
        io.observe(el);
      });
      root.querySelectorAll(".wipe").forEach((el) => {
        if (watched.has(el)) return;
        watched.add(el);
        const host = el.parentElement ?? el;
        wipes.set(host, [...(wipes.get(host) ?? []), el]);
        wipeIO.observe(host);
      });
    };
    scan(document);
    // Sections that mount after hydration (e.g. the pinned gallery on desktop) get watched too.
    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n instanceof Element && scan(n.parentElement ?? n));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const seen = new Set<string>();
    const sectionIO = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const id = (e.target as HTMLElement).id;
          if (e.isIntersecting && !seen.has(id)) {
            seen.add(id);
            track("section_view", { section: id, locale: current.current });
            if (id === "pricing") track("pricing_view", { locale: current.current });
          }
        }),
      { threshold: 0.35 }
    );
    document.querySelectorAll("main section[id]").forEach((el) => sectionIO.observe(el));

    const onClick = (ev: MouseEvent) => {
      const el = (ev.target as HTMLElement).closest<HTMLElement>("a, button");
      if (!el) return;
      const name = el.dataset.track;
      if (name) track(name, { label: el.dataset.label, locale: current.current });
      const href = el.getAttribute("href") || "";
      if (href.startsWith("https://wa.me")) track("whatsapp_click", { label: el.dataset.label || name, locale: current.current });
    };
    document.addEventListener("click", onClick);

    const marks = [25, 50, 75, 100];
    const hit = new Set<number>();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 100;
      marks.forEach((m) => {
        if (pct >= m - 1 && !hit.has(m)) {
          hit.add(m);
          track("scroll_depth", { percent: m });
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      wipeIO.disconnect();
      mo.disconnect();
      sectionIO.disconnect();
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t, switching, setLocale, preload, currency, setCurrency }}>
      {children}
    </I18nContext.Provider>
  );
}
