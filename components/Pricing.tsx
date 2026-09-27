"use client";

import { useState } from "react";
import { useI18n } from "./I18nProvider";
import SectionHeading from "./ui/SectionHeading";
import Icon from "./ui/Icon";
import { fill } from "@/src/i18n";
import { track } from "@/src/lib/track";
import {
  CURRENCIES,
  PACKAGE_PRICES_EUR,
  PERIOD_MONTHS,
  POPULAR_PACKAGE,
  convertPrice,
  formatPrice,
  whatsappLink,
  type PackageId,
  type PeriodId,
} from "@/src/config/site";

export default function Pricing() {
  const { t, locale, currency, setCurrency } = useI18n();
  const p = t.pricing;
  const [period, setPeriod] = useState<PeriodId>("month");
  const per = p.periods.find((x) => x.id === period)!;

  const savePct = (id: PeriodId) => {
    const base = PACKAGE_PRICES_EUR.professional.month * PERIOD_MONTHS[id];
    return Math.round((1 - PACKAGE_PRICES_EUR.professional[id] / base) * 100);
  };

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="section border-t border-white/[0.05]">
      <div className="container-x">
        <SectionHeading id="pricing-title" align="center" eyebrow={p.eyebrow} title={p.title} accent={p.titleAccent} intro={p.intro} />

        <div className="reveal mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div role="radiogroup" aria-label={p.eyebrow} className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
            {p.periods.map((x) => {
              const id = x.id as PeriodId;
              const active = period === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setPeriod(id);
                    track("pricing_period", { period: id });
                  }}
                  className={`relative rounded-full px-4 py-2.5 text-[13px] transition-all duration-300 ${active ? "bg-bone text-ink" : "text-bone/60 hover:text-bone"}`}
                >
                  {x.label}
                  {id !== "month" && (
                    <span className={`ms-1.5 text-[11px] ${active ? "text-brand-600" : "text-brand"}`}>−{savePct(id)}%</span>
                  )}
                </button>
              );
            })}
          </div>
          <label className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pe-3 ps-4 text-[13px] text-bone/60">
            <Icon name="globe" className="h-4 w-4" />
            <span className="sr-only">{p.currency}</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as typeof currency)}
              className="cursor-pointer appearance-none bg-transparent py-1.5 pe-5 text-bone focus:outline-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-neutral-900">
                  {c.id}
                </option>
              ))}
            </select>
            <Icon name="down" className="pointer-events-none absolute end-3 h-3.5 w-3.5" />
          </label>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {p.packages.map((pkg, i) => {
            const id = pkg.id as PackageId;
            const eur = PACKAGE_PRICES_EUR[id][period];
            const price = formatPrice(convertPrice(eur, currency), currency, locale);
            const popular = id === POPULAR_PACKAGE;
            return (
              <article
                key={id}
                style={{ ["--d" as string]: `${i * 90}ms` }}
                className={`reveal relative flex flex-col rounded-card border p-8 transition-transform duration-500 hover:-translate-y-1 ${
                  popular ? "border-brand/50 bg-gradient-to-b from-brand/[0.12] to-white/[0.02] shadow-[0_40px_100px_-40px_rgba(255,169,133,.6)]" : "border-white/[0.08] bg-white/[0.025]"
                }`}
              >
                {popular && (
                  <span className="absolute -top-3 start-8 rounded-full bg-brand px-3 py-1 text-[11px] font-medium text-ink">{p.popular}</span>
                )}
                <h3 className="text-xl font-medium text-bone">{pkg.name}</h3>
                <p className="mt-2 min-h-[48px] text-[14px] leading-relaxed text-bone/55">{pkg.desc}</p>
                <p className="mt-8 flex items-baseline gap-2">
                  <span key={price} className="animate-fade-up text-5xl font-light tracking-tight text-bone">
                    {price}
                  </span>
                  <span className="text-[13px] text-bone/45">{per.suffix}</span>
                </p>
                <p className="mt-2 h-4 text-[11px] text-bone/35">{currency !== "EUR" ? fill(p.indicative, { cur: currency }) : ""}</p>
                <a
                  href={whatsappLink(fill(t.wa.pkg, { pkg: pkg.name, period: per.msg, price }))}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="cta_primary"
                  data-label={`pricing_${id}`}
                  className={`mt-7 w-full ${popular ? "btn-primary" : "btn-ghost"}`}
                >
                  {fill(p.choose, { pkg: pkg.name })}
                </a>
                <ul className="mt-8 space-y-3 border-t border-white/[0.07] pt-7">
                  {pkg.features.map((f, j) => (
                    <li key={f} className="flex gap-3 text-[14px] text-bone/75">
                      <svg viewBox="0 0 24 24" style={{ ["--d" as string]: `${300 + j * 70}ms` }} className="check-draw mt-0.5 h-4 w-4 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M5 12.5l4.2 4.2L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="reveal surface mt-5 flex flex-col items-start justify-between gap-5 p-7 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-medium text-bone">{p.custom.title}</h3>
            <p className="mt-1 text-[14px] text-bone/55">{p.custom.body}</p>
          </div>
          <a href={whatsappLink(t.wa.custom)} target="_blank" rel="noopener noreferrer" data-track="cta_secondary" data-label="pricing_custom" className="btn-ghost shrink-0">
            {p.custom.cta}
          </a>
        </div>
        <p className="mt-6 text-center text-[12px] text-bone/35">{p.note}</p>
      </div>
    </section>
  );
}
