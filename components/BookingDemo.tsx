"use client";

import { useState } from "react";
import { useI18n } from "./I18nProvider";
import SectionHeading from "./ui/SectionHeading";
import Icon from "./ui/Icon";
import { fill } from "@/src/i18n";
import { track } from "@/src/lib/track";

const SLOTS = ["09:30", "10:15", "11:00", "12:30", "13:45", "14:30", "15:15", "16:00", "17:30"];
const TAKEN = new Set([1, 4, 7]);

export default function BookingDemo() {
  const { t } = useI18n();
  const d = t.demo;
  const u = d.ui;
  const [step, setStep] = useState(0);
  const [pick, setPick] = useState<{ b?: number; s?: number; r?: number; time?: string; day: 0 | 1 }>({ day: 0 });
  const done = step === 4;

  const choose = (patch: Partial<typeof pick>) => {
    if (step === 0) track("demo_interaction", { step: "start" });
    setPick((p) => ({ ...p, ...patch }));
    setStep((s) => s + 1);
  };

  const service = pick.s !== undefined ? u.services[pick.s] : undefined;
  const barber = pick.r === undefined ? undefined : pick.r < 0 ? u.anyBarber : u.barbers[pick.r].name;

  const option = (key: string | number, title: string, sub: string, onClick: () => void, right?: string) => (
    <button
      key={key}
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/3 p-3.5 text-start transition-all hover:border-brand/60 hover:bg-brand/6"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-medium text-bone">{title}</span>
        <span className="block text-[12px] text-bone/50">{sub}</span>
      </span>
      {right && <span className="text-[13px] text-bone" dir="ltr">{right}</span>}
      <Icon name="chevron" className="h-4 w-4 text-bone/30 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" />
    </button>
  );

  return (
    <section id="demo" aria-labelledby="demo-title" className="section overflow-hidden">
      <div className="container-x grid items-center gap-16 lg:grid-cols-2">
        <div>
          <SectionHeading id="demo-title" eyebrow={d.eyebrow} title={d.title} accent={d.titleAccent} intro={d.intro} />
          <ol className="mt-12 space-y-2">
            {d.steps.map((s, i) => {
              const state = done || i < step ? "done" : i === step ? "active" : "idle";
              return (
                <li key={s.title} className={`flex gap-5 rounded-2xl p-4 transition-all duration-500 ${state === "active" ? "bg-white/4" : ""}`}>
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-[13px] transition-all duration-500 ${
                      state === "done" ? "border-brand bg-brand text-ink" : state === "active" ? "border-brand text-brand" : "border-white/15 text-bone/40"
                    }`}
                  >
                    {state === "done" ? <Icon name="check" className="h-4 w-4" strokeWidth={2.2} /> : i + 1}
                  </span>
                  <span>
                    <span className={`block text-[15px] font-medium ${state === "idle" ? "text-bone/50" : "text-bone"}`}>{s.title}</span>
                    <span className="mt-1 block text-[14px] leading-relaxed text-bone/50">{s.body}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="reveal relative mx-auto w-full max-w-[380px]">
          <div className="glow absolute -inset-20 -z-10" />
          <p className="tag-sample mb-4 w-fit">{d.demoBadge}</p>
          <div className="rounded-[44px] border border-white/15 bg-neutral-950 p-[10px] shadow-[0_60px_120px_-30px_rgba(0,0,0,.9)]">
            <div className="min-h-[560px] overflow-hidden rounded-[35px] bg-neutral-900 p-5" aria-live="polite">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-bone" dir="ltr">Studio Noir</span>
                <span className="text-[11px] text-bone/40">{fill(t.a11y.currentStep, { n: Math.min(step + 1, 4), total: 4 })}</span>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-1.5">
                {u.stepLabels.map((l, i) => (
                  <span key={l} className={`h-1 rounded-full transition-colors duration-500 ${i < step || done ? "bg-brand" : i === step ? "bg-brand/50" : "bg-white/10"}`} />
                ))}
              </div>

              <div key={step} className="animate-fade-up">
                {step > 0 && !done && (
                  <button type="button" onClick={() => setStep((s) => s - 1)} className="mt-5 inline-flex items-center gap-1 text-[12px] text-bone/50 hover:text-bone">
                    <Icon name="chevron" className="h-3.5 w-3.5 -scale-x-100 rtl:scale-x-100" />
                    {u.back}
                  </button>
                )}

                {step === 0 && (
                  <>
                    <p className="mt-7 text-xl font-light text-bone">{u.chooseBranch}</p>
                    <div className="mt-5 space-y-2.5">
                      {u.branches.map((b, i) => option(b.name, b.name, b.area, () => choose({ b: i })))}
                    </div>
                  </>
                )}
                {step === 1 && (
                  <>
                    <p className="mt-4 text-xl font-light text-bone">{u.chooseService}</p>
                    <div className="mt-5 space-y-2.5">
                      {u.services.map((s, i) => option(s.name, s.name, `${s.dur} ${u.min}`, () => choose({ s: i }), `€${s.price}`))}
                    </div>
                  </>
                )}
                {step === 2 && (
                  <>
                    <p className="mt-4 text-xl font-light text-bone">{u.chooseBarber}</p>
                    <div className="mt-5 space-y-2.5">
                      {option("any", u.anyBarber, u.anyBarberRole, () => choose({ r: -1 }))}
                      {u.barbers.map((b, i) => option(b.name, b.name, b.role, () => choose({ r: i })))}
                    </div>
                  </>
                )}
                {step === 3 && (
                  <>
                    <p className="mt-4 text-xl font-light text-bone">{u.chooseTime}</p>
                    <div className="mt-4 flex gap-2">
                      {[u.today, u.tomorrow].map((label, i) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setPick((p) => ({ ...p, day: i as 0 | 1 }))}
                          className={`rounded-full px-4 py-2 text-[12px] transition-colors ${pick.day === i ? "bg-bone text-ink" : "border border-white/10 text-bone/60"}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2" dir="ltr">
                      {SLOTS.map((time, i) => {
                        const taken = TAKEN.has((i + pick.day * 2) % SLOTS.length);
                        return (
                          <button
                            key={time}
                            type="button"
                            disabled={taken}
                            onClick={() => {
                              setPick((p) => ({ ...p, time }));
                              setStep(4);
                              track("demo_complete", { service: service?.name });
                            }}
                            className="rounded-xl border border-white/10 py-3 text-[13px] text-bone/80 transition-all hover:border-brand hover:bg-brand hover:text-ink disabled:cursor-not-allowed disabled:opacity-25 disabled:line-through disabled:hover:border-white/10 disabled:hover:bg-transparent"
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-5 inline-flex items-center gap-2 text-[12px] text-bone/45">
                      <Icon name="user" className="h-3.5 w-3.5" />
                      {u.noAccount}
                    </p>
                  </>
                )}
                {done && service && (
                  <div className="flex flex-col items-center pt-14 text-center">
                    <span className="grid h-20 w-20 place-items-center rounded-full bg-brand/15 ring-1 ring-brand/40">
                      <svg viewBox="0 0 24 24" className="check-draw is-on h-10 w-10 text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5l4.2 4.2L19 7" />
                      </svg>
                    </span>
                    <p className="mt-6 text-2xl font-light text-bone">{u.confirmedTitle}</p>
                    <p className="mt-2 max-w-[240px] text-[13px] text-bone/55">{u.confirmedBody}</p>
                    <dl className="mt-7 w-full space-y-2 rounded-2xl border border-white/10 bg-white/3 p-4 text-[13px]">
                      {[
                        [u.stepLabels[0], u.branches[pick.b ?? 0].name],
                        [u.stepLabels[1], `${service.name} · €${service.price}`],
                        [u.stepLabels[2], barber],
                        [u.stepLabels[3], `${pick.day ? u.tomorrow : u.today} · ${pick.time}`],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4">
                          <dt className="text-bone/45">{k}</dt>
                          <dd className="text-end text-bone">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <button
                      type="button"
                      onClick={() => {
                        setPick({ day: 0 });
                        setStep(0);
                      }}
                      className="btn-ghost mt-6 min-h-[42px] w-full"
                    >
                      {u.again}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
