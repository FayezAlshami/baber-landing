"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "./I18nProvider";
import Icon from "./ui/Icon";
import Logo from "./ui/Logo";
import { setScrollLock } from "./SmoothScroll";
import { LOCALES, localeHref } from "@/src/i18n";
import { BRAND, whatsappLink } from "@/src/config/site";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} dir="ltr" lang="en">
      <Logo className="h-auto w-[132px] sm:w-[150px]" />
      <span className="hidden border-s border-white/10 ps-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-bone/35 xl:inline">
        by {BRAND.company}
      </span>
    </span>
  );
}

export function LanguageSwitch({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, preload, t } = useI18n();
  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className="relative inline-flex items-center rounded-full border border-white/10 bg-white/4 p-1"
    >
      {LOCALES.map((l) => {
        const active = l.id === locale;
        return (
          <a
            key={l.id}
            href={localeHref(l.id)}
            hrefLang={l.id}
            lang={l.id}
            aria-current={active ? "true" : undefined}
            title={l.label}
            onMouseEnter={() => preload(l.id)}
            onFocus={() => preload(l.id)}
            onClick={(e) => {
              e.preventDefault();
              setLocale(l.id);
            }}
            className={`relative z-10 grid h-8 min-w-[40px] place-items-center rounded-full px-2.5 text-[12px] font-medium transition-colors duration-300 ${
              active ? "bg-bone text-ink" : "text-bone/60 hover:text-bone"
            } ${compact ? "" : ""}`}
          >
            {l.short}
          </a>
        );
      })}
    </div>
  );
}

export default function Header() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setScrollLock(open, "menu");
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:inset-s-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-bone focus:px-4 focus:py-2 focus:text-ink">
        {t.nav.skip}
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "header-glass is-scrolled" : "header-glass"
        }`}
      >
        <div className="container-x flex h-[72px] items-center justify-between gap-6">
          <a href="#top" aria-label={t.nav.home} className="shrink-0">
            <Wordmark />
          </a>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {t.nav.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-[13px] text-bone/60 transition-colors hover:text-bone">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSwitch />
            </div>
            <a
              href={whatsappLink(t.wa.general)}
              target="_blank"
              rel="noopener noreferrer"
              data-track="cta_primary"
              data-label="header"
              className="btn-primary hidden min-h-[40px] px-5 md:inline-flex"
            >
              {t.nav.cta}
            </a>
            <button
              ref={menuBtn}
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t.nav.menu}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-bone lg:hidden"
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={`fixed inset-0 z-60 bg-ink/95 backdrop-blur-2xl transition-[opacity,visibility] duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="container-x flex h-[72px] items-center justify-between">
          <Wordmark />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t.nav.close}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-bone"
            tabIndex={open ? 0 : -1}
          >
            <Icon name="x" />
          </button>
        </div>
        <nav className="container-x mt-6" aria-label="Mobile">
          <ul className="space-y-1">
            {t.nav.links.map((l, i) => (
              <li
                key={l.href}
                className={`transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              >
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  className="flex items-center justify-between border-b border-white/6 py-4 text-2xl font-light text-bone"
                >
                  {l.label}
                  <Icon name="arrow" className="h-5 w-5 text-bone/30 rtl:-scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-4">
            <LanguageSwitch compact />
            <a
              href={whatsappLink(t.wa.general)}
              target="_blank"
              rel="noopener noreferrer"
              data-track="cta_primary"
              data-label="mobile_menu"
              tabIndex={open ? 0 : -1}
              className="btn-primary w-full"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
              {t.nav.cta}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
