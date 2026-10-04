"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useI18n } from "./I18nProvider";
import { usePrefersReducedMotion } from "@/src/lib/stores";
import SectionHeading from "./ui/SectionHeading";
import Icon, { type IconName } from "./ui/Icon";
import Img, { type ImageName } from "./ui/Img";
import { Wordmark } from "./Header";
import Logo from "./ui/Logo";
import Scissors from "./ui/Scissors";
import Signature from "./ui/Signature";
import { fill } from "@/src/i18n";
import { track } from "@/src/lib/track";
import { BRAND, PACKAGE_PRICES_EUR, formatPrice, whatsappLink } from "@/src/config/site";

const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` });

/* ------------------------------------------------------------------ Proof */
export function Proof() {
  const { t, locale } = useI18n();
  const items = [...t.proof.marquee, ...t.proof.marquee];
  return (
    <section aria-label="Highlights" className="border-y border-white/6 bg-neutral-950">
      <div className="container-x grid grid-cols-2 gap-px bg-white/6 lg:grid-cols-4">
        {t.proof.items.map((p, i) => (
          <div key={p.v} style={d(i * 80)} className="reveal bg-neutral-950 px-2 py-8 sm:px-6">
            <p className="text-4xl font-light tracking-tight text-bone" dir="ltr">{p.k}</p>
            <p className="mt-2 text-[13px] leading-snug text-bone/50">{p.v}</p>
          </div>
        ))}
      </div>
      <div className="mask-fade-x overflow-hidden border-t border-white/6 py-8 md:py-10" aria-hidden>
        <div className={`flex w-max gap-12 ${locale === "ar" ? "animate-marquee-rtl" : "animate-marquee"} hover:[animation-play-state:paused]`}>
          {items.map((m, i) => (
            <span
              key={i}
              className={`flex items-center gap-12 whitespace-nowrap text-[clamp(1.75rem,3.4vw,3.25rem)] font-semibold leading-none tracking-[-0.03em] ${
                i % 2 ? "marquee-outline" : "text-bone/85"
              }`}
            >
              {m}
              <Scissors className="h-7 w-7 opacity-80 md:h-9 md:w-9" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Problem */
const painIcons: IconName[] = ["inbox", "phone", "calendar", "chart"];
export function Problem() {
  const { t } = useI18n();
  const p = t.problem;
  return (
    <section id="why" aria-labelledby="why-title" className="section">
      <div className="container-x">
        <SectionHeading id="why-title" eyebrow={p.eyebrow} title={p.title} accent={p.titleAccent} intro={p.intro} />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {p.pains.map((x, i) => (
            <article key={x.title} style={d(i * 80)} className="reveal surface p-7">
              <Icon name={painIcons[i]} weight="duotone" className="h-6 w-6 text-brand" />
              <h3 className="mt-6 text-[17px] font-medium text-bone">{x.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-bone/55">{x.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="reveal rounded-card border border-white/[0.07] p-8">
            <p className="text-[12px] uppercase tracking-[0.2em] text-bone/40">{p.beforeLabel}</p>
            <ul className="mt-6 space-y-4">
              {p.before.map((b) => (
                <li key={b} className="flex gap-3 text-[15px] text-bone/45">
                  <Icon name="x" className="mt-0.5 h-4 w-4 shrink-0 text-bone/30" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div style={d(120)} className="reveal rounded-card border border-brand/30 bg-linear-to-br from-brand/10 to-transparent p-8">
            <p className="text-[12px] uppercase tracking-[0.2em] text-brand">{p.afterLabel}</p>
            <ul className="mt-6 space-y-4">
              {p.after.map((b, i) => (
                <li key={b} className="flex gap-3 text-[15px] text-bone">
                  <svg viewBox="0 0 24 24" style={d(300 + i * 110)} className="check-draw mt-0.5 h-4 w-4 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12.5l4.2 4.2L19 7" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Platform */
const pillarIcons: IconName[] = ["layout", "calendar", "users", "trend"];
export function Platform() {
  const { t } = useI18n();
  const p = t.platform;
  return (
    <section id="platform" aria-labelledby="platform-title" className="section border-t border-white/5 bg-neutral-950">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="reveal relative order-2 aspect-4/5 overflow-hidden rounded-[32px] lg:order-1">
          <Img name="fade" alt={p.imageAlt} sizes="(min-width:1024px) 45vw, 100vw" className="h-full w-full" wipe parallax={0.08} />
          <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent" />
          <div className="surface absolute inset-x-5 bottom-5 flex items-center gap-4 p-4 backdrop-blur-xl">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-brand text-ink">
              <Icon name="calendar" className="h-5 w-5" />
            </span>
            <span className="text-[13px] leading-snug">
              <span className="block text-bone">{t.hero.phone.confirmed}</span>
              <span className="text-bone/50">{t.hero.phone.service} · 14:30</span>
            </span>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <SectionHeading id="platform-title" eyebrow={p.eyebrow} title={p.title} accent={p.titleAccent} intro={p.intro} />
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {p.pillars.map((x, i) => (
              <div key={x.title} style={d(i * 90)} className="reveal">
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/4">
                  <Icon name={pillarIcons[i]} weight="duotone" className="h-5 w-5 text-brand" />
                </span>
                <h3 className="mt-5 text-[17px] font-medium text-bone">{x.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-bone/55">{x.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Features */
const tabIcons: IconName[] = ["layout", "calendar", "users", "card", "search", "chart"];
export function Features() {
  const { t } = useI18n();
  const f = t.features;
  const [active, setActive] = useState(0);
  const tab = f.tabs[active];
  return (
    <section id="features" aria-labelledby="features-title" className="section border-t border-white/5">
      <div className="container-x">
        <SectionHeading id="features-title" align="center" eyebrow={f.eyebrow} title={f.title} accent={f.titleAccent} intro={f.intro} />
        <div role="tablist" aria-label={f.eyebrow} className="no-scrollbar reveal -mx-5 mt-12 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
          {f.tabs.map((x, i) => (
            <button
              key={x.id}
              id={`tab-${x.id}`}
              role="tab"
              type="button"
              aria-selected={active === i}
              aria-controls="feature-panel"
              onClick={() => setActive(i)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] transition-all duration-300 ${
                active === i ? "border-bone bg-bone text-ink" : "border-white/10 text-bone/60 hover:border-white/25 hover:text-bone"
              }`}
            >
              <Icon name={tabIcons[i]} weight="duotone" className="h-4 w-4" />
              {x.label}
            </button>
          ))}
        </div>
        <div id="feature-panel" role="tabpanel" aria-labelledby={`tab-${tab.id}`} className="surface mt-8 overflow-hidden">
          <div key={tab.id} className="grid animate-fade-up gap-10 p-8 md:p-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 ring-1 ring-brand/30">
                <Icon name={tabIcons[active]} weight="duotone" className="h-6 w-6 text-brand" />
              </span>
              <h3 className="mt-7 text-2xl font-light leading-snug text-bone md:text-3xl">{tab.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-bone/55">{tab.body}</p>
            </div>
            <ul className="grid content-start gap-3 sm:grid-cols-2">
              {tab.items.map((it, i) => (
                <li key={it} className="flex items-start gap-3 rounded-2xl border border-white/6 bg-white/2 p-4 text-[14px] text-bone/80">
                  <svg viewBox="0 0 24 24" style={d(i * 70)} className="check-draw is-on mt-0.5 h-4 w-4 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12.5l4.2 4.2L19 7" />
                  </svg>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Team/branches */
const branchImgs: ImageName[] = ["interior", "chair", "beard"];
export function Team() {
  const { t } = useI18n();
  const m = t.team;
  const [b, setB] = useState(0);
  const br = m.branches[b];
  return (
    <section id="team" aria-labelledby="team-title" className="section border-t border-white/5 bg-neutral-950">
      <div className="container-x">
        <SectionHeading id="team-title" eyebrow={m.eyebrow} title={m.title} accent={m.titleAccent} intro={m.intro} />
        <div className="reveal mt-12 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <div className="relative min-h-[360px] overflow-hidden rounded-card">
            {branchImgs.map((img, i) => (
              <div key={img} className={`absolute inset-0 transition-opacity duration-700 ${i === b ? "opacity-100" : "opacity-0"}`}>
                <Img name={img} alt={m.imageAlts[i]} sizes="(min-width:1024px) 55vw, 100vw" className="h-full w-full" parallax={0.06} />
              </div>
            ))}
            <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/30 to-transparent" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
              <div role="tablist" aria-label={m.branchLabel} className="flex gap-1 rounded-full border border-white/10 bg-ink/60 p-1 backdrop-blur-sm">
                {m.branches.map((x, i) => (
                  <button key={x.name} role="tab" type="button" aria-selected={i === b} onClick={() => setB(i)} className={`rounded-full px-3.5 py-1.5 text-[12px] transition-colors ${i === b ? "bg-bone text-ink" : "text-bone/70 hover:text-bone"}`}>
                    {x.name}
                  </button>
                ))}
              </div>
              <span className="tag-sample hidden bg-ink/50 sm:inline-flex">{m.demoBadge}</span>
            </div>
            <div key={b} className="absolute inset-x-0 bottom-0 animate-fade-up p-6 md:p-8">
              <p className="text-3xl font-light text-bone">{br.name}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="chip"><Icon name="pin" className="h-3.5 w-3.5" />{br.address}</span>
                <span className="chip"><Icon name="clock" className="h-3.5 w-3.5" /><span dir="ltr">{br.hours}</span></span>
                <span className="chip"><Icon name="store" className="h-3.5 w-3.5" />{br.chairs} {m.chairs}</span>
                <span className="chip border-emerald-400/30 text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse2 rounded-full bg-emerald-400" />{m.open}</span>
              </div>
            </div>
          </div>
          <div className="surface p-6 md:p-7">
            <p className="text-[12px] uppercase tracking-[0.2em] text-bone/40">{m.teamLabel}</p>
            <ul key={b} className="mt-5 space-y-2.5">
              {m.staff.slice(0, 4 - (b === 2 ? 1 : 0)).map((s, i) => (
                <li key={s.name} style={{ animationDelay: `${i * 70}ms` }} className="group flex animate-fade-up items-center gap-4 rounded-2xl border border-white/6 bg-white/2 p-3.5 transition-colors hover:border-brand/40">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-linear-to-br from-neutral-600 to-neutral-800 text-[14px] font-medium text-bone ring-1 ring-white/10 transition-all group-hover:ring-brand/60">
                    {s.name.slice(0, 1)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-medium text-bone">{s.name}</span>
                    <span className="block text-[12px] text-bone/45">{s.role} · {s.specialty}</span>
                  </span>
                  <span className="text-end text-[11px] text-bone/40">
                    {m.nextFree}
                    <span className="block text-[13px] text-bone" dir="ltr">{["13:30", "14:15", "15:00", "16:45"][(i + b) % 4]}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- SEO */
export function Seo() {
  const { t } = useI18n();
  const s = t.seo;
  const r = s.serp;
  return (
    <section id="seo" aria-labelledby="seo-title" className="section border-t border-white/5 bg-neutral-950">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <div>
          <SectionHeading id="seo-title" eyebrow={s.eyebrow} title={s.title} accent={s.titleAccent} intro={s.intro} />
          <dl className="mt-10 grid gap-6 sm:grid-cols-2">
            {s.points.map((p, i) => (
              <div key={p.title} style={d(i * 80)} className="reveal border-s border-white/10 ps-5">
                <dt className="text-[15px] font-medium text-bone">{p.title}</dt>
                <dd className="mt-1.5 text-[14px] leading-relaxed text-bone/50">{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="reveal relative" aria-hidden>
          <span className="tag-sample absolute -top-9 inset-e-0">{r.demo}</span>
          <div className="rounded-card bg-[#f7f5f2] p-5 text-[#202124] shadow-[0_50px_120px_-40px_rgba(0,0,0,.9)] md:p-7">
            <div className="flex items-center gap-3 rounded-full border border-black/10 bg-white px-5 py-3 shadow-xs">
              <Icon name="search" className="h-4 w-4 text-black/40" />
              <span className="text-[14px]">{r.query}</span>
            </div>
            <p className="mt-5 text-[11px] uppercase tracking-[0.15em] text-black/40">{r.sponsored}</p>
            <div className="mt-2 grid grid-cols-[1fr_1.1fr] overflow-hidden rounded-2xl border border-black/10 bg-white">
              <div className="relative bg-[#e9ece4]">
                <svg viewBox="0 0 200 160" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
                  <path d="M0 110 L200 70 M40 0 L90 160 M130 0 L150 160 M0 40 L200 55" stroke="#fff" strokeWidth="8" fill="none" />
                  <circle cx="98" cy="72" r="9" fill="#EA4335" />
                  <circle cx="98" cy="72" r="3.5" fill="#fff" />
                  <circle cx="150" cy="115" r="6" fill="#9aa0a6" />
                  <circle cx="45" cy="40" r="6" fill="#9aa0a6" />
                </svg>
              </div>
              <div className="p-4">
                <p className="text-[14px] font-medium" dir="ltr">Studio Noir</p>
                <p className="mt-1 flex items-center gap-1 text-[12px] text-black/60">
                  <span dir="ltr">4.9</span>
                  <span className="flex text-[#f4b400]">{[0, 1, 2, 3, 4].map((k) => <Icon key={k} name="star" className="h-3 w-3 fill-current" />)}</span>
                  <span dir="ltr">(318)</span>
                </p>
                <p className="mt-1 text-[12px] text-[#188038]">{r.open}</p>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-[12px] text-black/55" dir="ltr">{r.url}</p>
              <p className="mt-1 text-[18px] leading-snug text-[#1a0dab]">{r.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-black/65">{r.desc}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {r.links.map((l) => (
                  <span key={l} className="rounded-full border border-black/10 px-3 py-1 text-[12px] text-[#1a0dab]">{l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Insights */
function Counter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setN] = useState(0);
  const reduced = usePrefersReducedMotion();
  const n = reduced ? value : count;
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / 1400, 1);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value, reduced]);
  return <span ref={ref} dir="ltr">{prefix}{n}{suffix}</span>;
}

const WEEK = [38, 44, 52, 61, 86, 100, 24];
const HEAT = [
  [1, 1, 2, 2, 3, 2, 2, 3, 3, 2],
  [1, 2, 2, 3, 3, 2, 3, 3, 4, 3],
  [2, 2, 3, 3, 3, 3, 3, 4, 4, 3],
  [2, 3, 3, 4, 4, 3, 4, 4, 5, 4],
  [3, 3, 4, 5, 5, 4, 5, 5, 5, 4],
];
export function Insights() {
  const { t } = useI18n();
  const s = t.insights;
  return (
    <section id="insights" aria-labelledby="insights-title" className="section border-t border-white/5">
      <div className="container-x">
        <SectionHeading id="insights-title" eyebrow={s.eyebrow} title={s.title} accent={s.titleAccent} intro={s.intro} />
        <div className="reveal surface mt-12 p-4 md:p-6">
          <div className="flex items-center justify-between px-2 pb-4">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            </span>
            <span className="tag-sample">{s.sample}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {s.kpis.map((k) => (
              <div key={k.label} className="rounded-2xl border border-white/6 bg-ink/60 p-5">
                <p className="text-[12px] text-bone/45">{k.label}</p>
                <p className="mt-3 text-3xl font-light text-bone md:text-4xl"><Counter value={k.value} prefix={k.prefix} suffix={k.suffix} /></p>
                <p className="mt-2 text-[12px] text-emerald-400" dir="ltr">{k.delta}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/6 bg-ink/60 p-5">
              <p className="text-[13px] text-bone/70">{s.bookingsTitle}</p>
              <div className="mt-6 flex h-40 items-end gap-2.5" aria-hidden>
                {WEEK.map((v, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full origin-bottom rounded-t-lg bg-linear-to-t from-brand/40 to-brand transition-transform duration-1000 in-[.is-visible]:scale-y-100 scale-y-0" style={{ height: `${v}%`, transitionDelay: `${i * 70}ms` }} />
                    <span className="text-[10px] text-bone/40">{s.days[i].slice(0, 3)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/6 bg-ink/60 p-5">
              <p className="text-[13px] text-bone/70">{s.peakTitle}</p>
              <div className="mt-6 grid gap-1.5" aria-hidden dir="ltr">
                {HEAT.map((row, r) => (
                  <div key={r} className="grid grid-cols-10 gap-1.5">
                    {row.map((v, c) => (
                      <span key={c} className="aspect-square rounded-[5px]" style={{ background: `rgba(255,169,133,${0.08 + v * 0.17})` }} />
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between text-[11px] text-bone/40">
                <span>{s.peakLegend[0]}</span>
                <span>{s.peakLegend[1]}</span>
              </div>
            </div>
            <div className="rounded-2xl border border-white/6 bg-ink/60 p-5">
              <p className="text-[13px] text-bone/70">{s.sourcesTitle}</p>
              <ul className="mt-5 space-y-3.5">
                {s.sources.map((x, i) => (
                  <li key={x.label}>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-bone/70">{x.label}</span>
                      <span className="text-bone/45" dir="ltr">{x.pct}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/6">
                      <div className="h-full origin-left rounded-full bg-bone/80 transition-transform duration-1000 rtl:origin-right in-[.is-visible]:scale-x-100 scale-x-0" style={{ width: `${x.pct * 2.4}%`, transitionDelay: `${200 + i * 80}ms` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Growth */
const growthIcons: IconName[] = ["bell", "card", "gift", "crown", "star", "tag", "plus", "repeat"];
export function Growth() {
  const { t } = useI18n();
  const g = t.growth;
  return (
    <section id="growth" aria-labelledby="growth-title" className="section border-t border-white/5 bg-neutral-950">
      <div className="container-x">
        <SectionHeading id="growth-title" align="center" eyebrow={g.eyebrow} title={g.title} accent={g.titleAccent} intro={g.intro} />
        <div className="mt-14 grid gap-px overflow-hidden rounded-card border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
          {g.items.map((x, i) => (
            <article key={x.title} style={d((i % 4) * 70)} className="reveal group bg-neutral-950 p-7 transition-colors duration-500 hover:bg-neutral-900">
              <Icon name={growthIcons[i]} weight="duotone" className="h-6 w-6 text-bone/70 transition-colors group-hover:text-brand" />
              <h3 className="mt-6 text-[16px] font-medium text-bone">{x.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-bone/50">{x.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Brand */
const SWATCHES = [
  { accent: "#FFA985", bg: "#202338", fg: "#FFF8EF", on: "#202338" },
  { accent: "#C9A46A", bg: "#15120e", fg: "#F1E9DC", on: "#15120e" },
  { accent: "#3F8F6B", bg: "#0d1411", fg: "#E6EFE9", on: "#fff" },
  { accent: "#1c1c1c", bg: "#F3EEE6", fg: "#1c1c1c", on: "#F3EEE6" },
];
export function Brand() {
  const { t } = useI18n();
  const b = t.brand;
  const [s, setS] = useState(0);
  const sw = SWATCHES[s];
  return (
    <section id="brand" aria-labelledby="brand-title" className="section border-t border-white/5">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <div>
          <SectionHeading id="brand-title" eyebrow={b.eyebrow} title={b.title} accent={b.titleAccent} intro={b.intro} />
          <ul className="mt-10 space-y-4">
            {b.points.map((p, i) => (
              <li key={p} style={d(i * 80)} className="reveal flex gap-3 text-[15px] text-bone/80">
                <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={2} />
                {p}
              </li>
            ))}
          </ul>
          <div className="reveal mt-10">
            <p className="text-[12px] text-bone/45">{b.swatchLabel}</p>
            <div className="mt-3 flex gap-2">
              {SWATCHES.map((x, i) => (
                <button key={i} type="button" onClick={() => setS(i)} aria-pressed={s === i} className={`flex items-center gap-2 rounded-full border px-3 py-2 text-[12px] transition-colors ${s === i ? "border-bone text-bone" : "border-white/10 text-bone/55"}`}>
                  <span className="h-3.5 w-3.5 rounded-full ring-1 ring-white/20" style={{ background: x.accent }} />
                  {b.swatches[i]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="reveal" aria-hidden>
          <div className="overflow-hidden rounded-[22px] border border-white/10 shadow-[0_50px_120px_-40px_rgba(0,0,0,.9)]">
            <div className="flex items-center gap-3 bg-neutral-800 px-4 py-3">
              <span className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="h-2.5 w-2.5 rounded-full bg-white/20" /></span>
              <span className="flex flex-1 items-center gap-2 rounded-lg bg-ink/60 px-3 py-1.5 text-[12px] text-bone/70" dir="ltr">
                <Icon name="shield" className="h-3 w-3 text-emerald-400" />
                <span className="text-bone">yourshop</span>.nl
              </span>
            </div>
            <div className="relative h-[340px] transition-colors duration-700" style={{ background: sw.bg, color: sw.fg }}>
              <Img name="chair" alt="" sizes="(min-width:1024px) 45vw, 100vw" className="absolute inset-0 h-full w-full" imgClassName={`transition-opacity duration-700 ${s === 3 ? "opacity-20" : "opacity-45"}`} />
              <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${sw.bg} 30%, transparent)` }} />
              <div className="relative flex h-full flex-col p-7">
                <div className="flex items-center justify-between text-[11px] opacity-80">
                  <span className="text-[15px] font-semibold tracking-tight" dir="ltr">YOURSHOP<span style={{ color: sw.accent === "#1c1c1c" ? "#AD4522" : sw.accent }}>.</span></span>
                  <span className="hidden gap-4 sm:flex">{b.mock.nav.map((n) => <span key={n}>{n}</span>)}</span>
                </div>
                <div className="mt-auto">
                  <p className="text-5xl font-semibold tracking-[-0.03em]">{b.mock.title}</p>
                  <p className="mt-2 text-[12px] opacity-60">{b.mock.sub}</p>
                  <span className="mt-6 inline-block rounded-full px-5 py-2.5 text-[12px] font-medium transition-colors duration-700" style={{ background: sw.accent, color: sw.on }}>
                    {b.mock.cta}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Process */
export function Process() {
  const { t } = useI18n();
  const p = t.process;
  return (
    <section id="how" aria-labelledby="how-title" className="section border-t border-white/5 bg-neutral-950">
      <div className="container-x">
        <SectionHeading id="how-title" eyebrow={p.eyebrow} title={p.title} accent={p.titleAccent} intro={p.intro} />
        <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
          <span className="absolute inset-x-0 top-[22px] hidden h-px bg-linear-to-r from-brand/60 via-white/10 to-transparent md:block rtl:bg-linear-to-l" aria-hidden />
          {p.steps.map((s, i) => (
            <li key={s.title} style={d(i * 110)} className="reveal relative">
              <span className="relative grid h-11 w-11 place-items-center rounded-full border border-brand/50 bg-ink text-[14px] text-bone">{i + 1}</span>
              <p className="mt-6 text-[12px] uppercase tracking-[0.18em] text-brand">{s.when}</p>
              <h3 className="mt-2 text-lg font-medium text-bone">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-bone/50">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Compare */
type V = "y" | "p" | "n";
const MATRIX: V[][] = [
  ["y", "n", "p", "y"],
  ["y", "n", "y", "p"],
  ["y", "n", "y", "p"],
  ["y", "p", "p", "p"],
  ["y", "p", "n", "y"],
  ["y", "n", "p", "n"],
  ["y", "n", "p", "p"],
  ["y", "n", "y", "n"],
  ["y", "n", "p", "p"],
  ["y", "p", "y", "p"],
  ["y", "n", "p", "n"],
];
function Mark({ v, first }: { v: V; first?: boolean }) {
  const { t } = useI18n();
  const label = v === "y" ? t.a11y.yes : v === "p" ? t.a11y.part : t.a11y.no;
  return (
    <span className="inline-grid place-items-center" title={label}>
      <span className="sr-only">{label}</span>
      {v === "y" ? (
        <span className={`grid h-7 w-7 place-items-center rounded-full ${first ? "bg-brand text-ink" : "bg-white/10 text-bone"}`}>
          <Icon name="check" className="h-4 w-4" strokeWidth={2.2} />
        </span>
      ) : v === "p" ? (
        <span className="grid h-7 w-7 place-items-center rounded-full border border-dashed border-white/25 text-bone/50">
          <Icon name="minus" className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
      ) : (
        <Icon name="x" className="h-4 w-4 text-bone/25" strokeWidth={2} />
      )}
    </span>
  );
}
export function Compare() {
  const { t } = useI18n();
  const c = t.compare;
  return (
    <section id="compare" aria-labelledby="compare-title" className="section border-t border-white/5">
      <div className="container-x">
        <SectionHeading id="compare-title" align="center" eyebrow={c.eyebrow} title={c.title} accent={c.titleAccent} intro={c.intro} />
        <div className="reveal no-scrollbar relative -mx-5 mt-14 overflow-x-auto px-5">
          <table className="w-full min-w-[760px] border-separate border-spacing-0 text-[14px]">
            <caption className="sr-only">{c.title} {c.titleAccent}</caption>
            <thead>
              <tr>
                <th scope="col" className="w-[34%]" />
                {c.cols.map((col, i) => (
                  <th key={col} scope="col" className={`px-3 pb-5 text-center align-bottom text-[13px] font-medium ${i === 0 ? "rounded-t-2xl bg-brand/10 pt-5 text-bone" : "text-bone/50"}`}>
                    {i === 0 ? <Logo className="mx-auto h-auto w-[104px]" title={col} /> : col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.rows.map((row, r) => (
                <tr key={row} className="group">
                  <th scope="row" className="border-t border-white/6 py-4 pe-4 text-start font-normal text-bone/75 group-hover:text-bone">{row}</th>
                  {MATRIX[r].map((v, i) => (
                    <td key={i} className={`border-t border-white/6 px-3 py-4 text-center ${i === 0 ? "bg-brand/10" : ""} ${i === 0 && r === c.rows.length - 1 ? "rounded-b-2xl" : ""}`}>
                      <Mark v={v} first={i === 0} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-[12px] text-bone/45">
          <span className="flex items-center gap-2"><Mark v="y" />{c.legend.yes}</span>
          <span className="flex items-center gap-2"><Mark v="p" />{c.legend.part}</span>
          <span className="flex items-center gap-2"><Mark v="n" />{c.legend.no}</span>
        </div>
        <p className="mt-4 text-center text-[12px] text-bone/35">{c.note}</p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- Testimonials */
export function Testimonials() {
  const { t } = useI18n();
  const s = t.testimonials;
  const track_ = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track_.current;
    if (!el) return;
    const rtl = document.documentElement.dir === "rtl" ? -1 : 1;
    el.scrollBy({ left: dir * rtl * (el.clientWidth * 0.8), behavior: "smooth" });
  };
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="section border-t border-white/5 bg-neutral-950">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading id="reviews-title" eyebrow={s.eyebrow} title={s.title} accent={s.titleAccent} intro={s.intro} />
          <div className="flex gap-2">
            <button type="button" onClick={() => scroll(-1)} aria-label={s.prev} className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-bone transition-colors hover:border-bone">
              <Icon name="arrow" className="h-4 w-4 -scale-x-100 rtl:scale-x-100" />
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label={s.next} className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-bone transition-colors hover:border-bone">
              <Icon name="arrow" className="h-4 w-4 rtl:-scale-x-100" />
            </button>
          </div>
        </div>
        <div ref={track_} className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2">
          {s.items.map((x, i) => (
            <figure key={i} className="surface flex w-[85%] shrink-0 snap-start flex-col p-8 sm:w-[420px]">
              <div className="flex items-center justify-between">
                <span className="flex text-brand" aria-hidden>{[0, 1, 2, 3, 4].map((k) => <Icon key={k} name="star" className="h-4 w-4 fill-current" />)}</span>
                <span className="tag-sample">{s.badge}</span>
              </div>
              <blockquote className="mt-6 flex-1 text-[18px] font-light leading-relaxed text-bone">“{x.quote}”</blockquote>
              <figcaption className="mt-8 flex items-center gap-3 border-t border-white/[0.07] pt-5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white/6"><Icon name="user" className="h-4 w-4 text-bone/50" /></span>
                <span className="text-[13px]">
                  <span className="block text-bone/80">{x.name}</span>
                  <span className="text-bone/45">{x.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- FAQ */
export function Faq() {
  const { t } = useI18n();
  const f = t.faq;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="faq-title" className="section border-t border-white/5">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <SectionHeading id="faq-title" eyebrow={f.eyebrow} title={f.title} accent={f.titleAccent} intro={f.intro}>
          <a href={whatsappLink(t.wa.general)} target="_blank" rel="noopener noreferrer" data-track="cta_secondary" data-label="faq" className="btn-ghost mt-8">
            <Icon name="whatsapp" className="h-4 w-4" />
            WhatsApp
          </a>
        </SectionHeading>
        <div className="reveal divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {f.items.map((x, i) => {
            const isOpen = open === i;
            return (
              <div key={x.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => {
                      setOpen(isOpen ? null : i);
                      if (!isOpen) track("faq_open", { index: i });
                    }}
                    className="group/faq flex w-full items-center justify-between gap-6 py-5 text-start text-[16px] text-bone transition-colors hover:text-brand-300"
                  >
                    {x.q}
                    {/* Open scissors = "open me"; closed scissors = "close" */}
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${isOpen ? "border-brand bg-brand" : "border-white/15 group-hover/faq:border-brand/60"}`}>
                      <Scissors open={isOpen ? 0 : 1.1} fill={isOpen ? "#202338" : "#FFA985"} className="h-6 w-6 rotate-33 transition-transform duration-500 group-hover/faq:scale-110" />
                    </span>
                  </button>
                </h3>
                <div id={`faq-${i}`} role="region" className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-bone/55">{x.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Final CTA */
export function FinalCta() {
  const { t } = useI18n();
  const c = t.cta;
  const started = useRef(false);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) || "").trim();
    const msg = fill(t.wa.form, { name: v("name"), shop: v("shop"), city: v("city"), branches: v("branches") });
    track("form_submit", { branches: v("branches") });
    window.open(whatsappLink(msg), "_blank", "noopener,noreferrer");
  };
  const field = "w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3.5 text-[15px] text-bone placeholder:text-bone/35 transition-colors focus:border-brand/70 focus:bg-white/6 focus:outline-hidden";
  return (
    <section id="contact" aria-labelledby="contact-title" className="grain relative isolate overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 -z-10">
        <Img name="tools" alt={c.imageAlt} sizes="100vw" className="h-full w-full" imgClassName="opacity-35" parallax={0.12} />
        <div className="absolute inset-0 bg-linear-to-b from-ink via-ink/80 to-ink" />
      </div>
      <div className="container-x grid items-center gap-14 py-28 md:py-36 lg:grid-cols-2">
        <SectionHeading id="contact-title" eyebrow={c.eyebrow} title={c.title} accent={c.titleAccent} intro={c.sub}>
          <p className="mt-8 text-[14px] text-bone/50">
            {c.or}{" "}
            <a href={`mailto:${BRAND.email}`} className="text-bone underline decoration-brand underline-offset-4">{BRAND.email}</a>
          </p>
        </SectionHeading>
        <form
          onSubmit={onSubmit}
          onFocus={() => {
            if (!started.current) {
              started.current = true;
              track("form_start");
            }
          }}
          className="reveal surface living-border grid gap-3 p-6 backdrop-blur-xl md:p-8"
        >
          <label className="grid gap-1.5 text-[13px] text-bone/60">{c.form.name}<input name="name" required autoComplete="name" className={field} /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-[13px] text-bone/60">{c.form.shop}<input name="shop" required autoComplete="organization" className={field} /></label>
            <label className="grid gap-1.5 text-[13px] text-bone/60">{c.form.city}<input name="city" required autoComplete="address-level2" className={field} /></label>
          </div>
          <fieldset className="mt-1">
            <legend className="text-[13px] text-bone/60">{c.form.branches}</legend>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {c.form.branchOpts.map((o, i) => (
                <label key={o} className="cursor-pointer">
                  <input type="radio" name="branches" value={o} defaultChecked={i === 0} className="peer sr-only" />
                  <span className="block rounded-2xl border border-white/10 px-2 py-3 text-center text-[13px] text-bone/60 transition-colors peer-checked:border-brand peer-checked:bg-brand/10 peer-checked:text-bone peer-focus-visible:ring-2 peer-focus-visible:ring-brand">{o}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <button type="submit" className="btn-primary mt-3 w-full">
            <Icon name="whatsapp" className="h-4 w-4" />
            {c.form.submit}
          </button>
          <p className="text-center text-[12px] text-bone/35">{c.form.note}</p>
        </form>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Footer */
/* ------------------------------------------------------------------ About */
/** A plain, quotable definition of Trimio: what it is, who makes it, what it costs. */
export function About() {
  const { t, locale } = useI18n();
  const a = t.about;
  const from = formatPrice(PACKAGE_PRICES_EUR.essential.month, "EUR", locale);
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-white/5 py-20 md:py-28">
      <div className="container-x grid gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
        <div className="reveal">
          <p className="eyebrow">
            <span className="h-px w-8 bg-brand/60" aria-hidden />
            {a.eyebrow}
          </p>
          <h2 id="about-title" className="mt-5 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-tight tracking-[-0.02em] text-bone">
            {a.title}
          </h2>
        </div>
        <div className="reveal" style={d(120)}>
          <p className="about-definition text-[clamp(1.05rem,1.6vw,1.3rem)] leading-relaxed text-bone/80">{fill(a.body, { from })}</p>
          <p className="mt-5 text-[14px] text-bone/50">
            {fill(a.who, { email: BRAND.email })}
          </p>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useI18n();
  const f = t.footer;
  return (
    <footer className="border-t border-white/6 bg-neutral-950 pb-28 pt-16 md:pb-12">
      <div className="container-x grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-bone/45">{f.tagline}</p>
        </div>
        <nav aria-label={f.product}>
          <p className="text-[12px] uppercase tracking-[0.2em] text-bone/35">{f.product}</p>
          <ul className="mt-4 space-y-2.5 text-[14px]">
            {t.nav.links.map((l) => <li key={l.href}><a href={l.href} className="text-bone/60 hover:text-bone">{l.label}</a></li>)}
          </ul>
        </nav>
        <div>
          <p className="text-[12px] uppercase tracking-[0.2em] text-bone/35">{f.contact}</p>
          <ul className="mt-4 space-y-2.5 text-[14px]">
            <li><a href={whatsappLink(t.wa.general)} target="_blank" rel="noopener noreferrer" className="text-bone/60 hover:text-bone">WhatsApp</a></li>
            <li><a href={`mailto:${BRAND.email}`} className="text-bone/60 hover:text-bone">{BRAND.email}</a></li>
            <li><a href={BRAND.companyUrl} target="_blank" rel="noopener" className="text-bone/60 hover:text-bone">nivx.nl</a></li>
          </ul>
        </div>
      </div>
      <Signature />
      <div className="container-x mt-10 flex flex-col justify-between gap-3 border-t border-white/6 pt-6 text-[12px] text-bone/35 sm:flex-row">
        <p>© {new Date().getFullYear()} {BRAND.company}. {f.rights} {f.byNivx}.</p>
        <p>{f.imageCredit}</p>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------- Mobile CTA */
export function MobileCta() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/85 p-3 backdrop-blur-xl transition-transform duration-500 md:hidden ${show ? "translate-y-0" : "translate-y-full"}`} style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
      <div className="flex gap-2">
        <a href="#pricing" tabIndex={show ? 0 : -1} className="btn-ghost min-h-[46px] flex-1 px-4">{t.mobileCta.secondary}</a>
        <a href={whatsappLink(t.wa.general)} target="_blank" rel="noopener noreferrer" tabIndex={show ? 0 : -1} data-track="cta_primary" data-label="sticky_mobile" className="btn-primary min-h-[46px] flex-[1.6] px-4">
          <Icon name="whatsapp" className="h-4 w-4" />
          {t.mobileCta.primary}
        </a>
      </div>
    </div>
  );
}
