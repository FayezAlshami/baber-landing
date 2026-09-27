"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "./I18nProvider";
import Img from "./ui/Img";
import Icon from "./ui/Icon";
import { whatsappLink } from "@/src/config/site";

const TIMES = ["10:30", "11:15", "13:00", "14:30", "15:45", "17:00"];

function PhoneMock() {
  const { t } = useI18n();
  const p = t.hero.phone;
  const [stage, setStage] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage(2);
      return;
    }
    let timer: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) timer = setInterval(() => setStage((s) => (s + 1) % 4), 2200);
    });
    if (ref.current) io.observe(ref.current);
    return () => {
      io.disconnect();
      clearInterval(timer);
    };
  }, []);

  const confirmed = stage === 3;

  return (
    <div ref={ref} className="relative mx-auto w-[280px] sm:w-[300px]" aria-hidden="true">
      <div className="glow absolute -inset-16 -z-10 opacity-80" />
      <div className="relative rounded-[46px] border border-white/15 bg-neutral-950 p-[10px] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.04)]">
        <div className="relative overflow-hidden rounded-[37px] bg-neutral-900">
          <div className="absolute start-1/2 top-2.5 z-20 h-[22px] w-[88px] -translate-x-1/2 rounded-full bg-black rtl:translate-x-1/2" />
          <div className="flex items-center justify-between px-6 pb-2 pt-3.5 text-[11px] font-medium text-bone/80" dir="ltr">
            <span>9:41</span>
            <span className="flex gap-1">
              <span className="h-2 w-3 rounded-sm bg-bone/70" />
              <span className="h-2 w-4 rounded-sm border border-bone/60" />
            </span>
          </div>

          <div className="px-5 pb-6 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-bone" dir="ltr">{p.shop}</span>
              <span className="grid h-7 w-7 place-items-center rounded-full border border-white/10">
                <Icon name="scissors" className="h-3.5 w-3.5 text-brand" />
              </span>
            </div>
            <p className="mt-5 text-[22px] font-light leading-tight text-bone">{p.greeting}</p>

            <div className="relative mt-5 min-h-[330px]">
              {/* Booking */}
              <div className={`absolute inset-0 transition-all duration-500 ${confirmed ? "pointer-events-none scale-95 opacity-0" : "opacity-100"}`}>
                <div className={`rounded-2xl border p-3.5 transition-colors duration-500 ${stage >= 1 ? "border-brand/60 bg-brand/[0.08]" : "border-white/10 bg-white/[0.03]"}`}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.06]">
                      <Icon name="scissors" className="h-4 w-4 text-bone" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-bone">{p.service}</p>
                      <p className="text-[11px] text-bone/50">{p.barber} · 40 min</p>
                    </div>
                    <span className="text-[13px] font-medium text-bone" dir="ltr">€35</span>
                  </div>
                </div>

                <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-bone/40">{p.today}</p>
                <div className="mt-2.5 grid grid-cols-3 gap-2" dir="ltr">
                  {TIMES.map((time, i) => {
                    const on = stage >= 2 && i === 3;
                    return (
                      <span
                        key={time}
                        className={`rounded-xl border py-2.5 text-center text-[12px] transition-all duration-500 ${
                          on ? "border-brand bg-brand text-ink shadow-[0_8px_24px_-8px_rgba(255,169,133,.8)]" : "border-white/10 text-bone/70"
                        } ${i === 1 ? "opacity-35 line-through" : ""}`}
                      >
                        {time}
                      </span>
                    );
                  })}
                </div>

                <div
                  className={`mt-6 flex h-12 items-center justify-center rounded-2xl text-[13px] font-medium transition-all duration-500 ${
                    stage >= 2 ? "bg-brand text-ink" : "bg-white/[0.06] text-bone/40"
                  }`}
                >
                  {p.confirm}
                </div>
              </div>

              {/* Confirmed */}
              <div className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-500 ${confirmed ? "opacity-100" : "pointer-events-none scale-105 opacity-0"}`}>
                <span className="grid h-16 w-16 place-items-center rounded-full bg-brand/15 ring-1 ring-brand/40">
                  <svg viewBox="0 0 24 24" className={`check-draw h-8 w-8 text-brand ${confirmed ? "is-on" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.2 4.2L19 7" />
                  </svg>
                </span>
                <p className="mt-5 text-xl font-light text-bone">{p.confirmed}</p>
                <p className="mt-2 text-[12px] text-bone/50" dir="auto">
                  {p.service} · 14:30
                </p>
                <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-bone/60">
                  <Icon name="bell" className="h-3.5 w-3.5 text-brand" />
                  {p.reminder}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useI18n();
  const h = t.hero;
  const bg = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (bg.current && y < window.innerHeight * 1.2) bg.current.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(1.06)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="top" aria-labelledby="hero-title" className="grain relative isolate overflow-hidden">
      <div ref={bg} className="absolute inset-0 -z-10 will-change-transform" style={{ transform: "scale(1.06)" }}>
        <Img name="hero" alt={h.imageAlt} sizes="100vw" priority className="h-full w-full" imgClassName="opacity-60" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/80 via-ink/60 to-ink" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/70 to-ink/10 rtl:bg-gradient-to-l" />

      <div className="container-x grid min-h-[100svh] items-center gap-14 pb-20 pt-32 lg:grid-cols-[1.25fr_1fr] lg:gap-10 lg:pb-24 lg:pt-36">
        <div>
          <p className="eyebrow animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            {h.eyebrow}
          </p>

          <h1 id="hero-title" className="h-display mt-7 text-[clamp(2.9rem,7.6vw,6.4rem)] text-bone">
            <span className="block animate-fade-up [animation-delay:80ms]">{h.titleA}</span>
            <span className="block animate-fade-up [animation-delay:180ms]">
              {h.titleB} <span className="accent">{h.titleAccent}</span>
            </span>
          </h1>

          <p className="lead mt-7 animate-fade-up [animation-delay:280ms]">{h.sub}</p>

          <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:380ms] sm:flex-row sm:items-center">
            <a
              href={whatsappLink(t.wa.general)}
              target="_blank"
              rel="noopener noreferrer"
              data-track="cta_primary"
              data-label="hero"
              className="btn-primary"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
              {h.ctaPrimary}
            </a>
            <a href="#demo" data-track="cta_secondary" data-label="hero_demo" className="btn-ghost group">
              {h.ctaSecondary}
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
            </a>
          </div>

          <ul className="mt-10 flex animate-fade-up flex-wrap gap-x-6 gap-y-3 [animation-delay:480ms]">
            {h.trust.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[13px] text-bone/60">
                <Icon name="check" className="h-4 w-4 text-brand" strokeWidth={2} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative animate-fade-up [animation-delay:300ms]">
          <div className="lg:animate-float">
            <PhoneMock />
          </div>
          <div className="surface absolute -start-2 top-16 hidden items-center gap-3 px-4 py-3 backdrop-blur-xl sm:flex lg:-start-10">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand/15">
              <Icon name="calendar" className="h-4 w-4 text-brand" />
            </span>
            <span className="text-[12px] leading-tight">
              <span className="block text-bone">+1 · {h.phone.service}</span>
              <span className="text-bone/45">{h.phone.today} · 14:30</span>
            </span>
          </div>
          <div className="surface absolute -end-1 bottom-20 hidden items-center gap-3 px-4 py-3 backdrop-blur-xl sm:flex lg:-end-4">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06]">
              <Icon name="bell" className="h-4 w-4 text-bone" />
            </span>
            <span className="max-w-[150px] text-[12px] leading-tight text-bone/70">{h.phone.reminder}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
