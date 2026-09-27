"use client";

import { useEffect, useState } from "react";
import { useAnimate, type AnimationSequence } from "motion/react";
import { useI18n } from "./I18nProvider";
import Logo from "./ui/Logo";
import { ScissorsShape } from "./ui/Scissors";
import { setScrollLock } from "./SmoothScroll";

const EASE_SWEEP: [number, number, number, number] = [0.45, 0, 0.25, 1];
const EASE_CAPE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const EASE_FALL: [number, number, number, number] = [0.55, 0, 1, 0.45];

/* ------------------------------------------------------------------ Hair */
// Coordinates are in a 1000×1000 box stretched over the screen. The cut line sits at CUT.
const STRANDS = 110;
const CUT = 440;
const CUT_START = 1.0;
const CUT_DURATION = 1.05;

/** Tiny seeded PRNG so the server and client render the same hair. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Pt = [number, number];
type Strand = { top: string; clip: string; stroke: string; width: number; x: number; fall: Fall };
type Fall = { at: number; y: number; dx: number; rotate: number; duration: number };

const toPath = (pts: Pt[]) => "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L");

const HAIR: Strand[] = (() => {
  const rnd = mulberry32(20260927);
  return Array.from({ length: STRANDS }, (_, i) => {
    const x0 = ((i + rnd() * 0.9) / STRANDS) * 1040 - 20;
    const end = 700 + rnd() * 90;
    const amp = 3 + rnd() * 8;
    const wave = 90 + rnd() * 90;
    const phase = rnd() * Math.PI * 2;
    const drift = (rnd() - 0.5) * 36;
    const pts: Pt[] = Array.from({ length: 15 }, (_, k) => {
      const y = -20 + ((end + 20) * k) / 14;
      return [x0 + amp * Math.sin(y / wave + phase) + drift * ((y + 20) / (end + 20)) ** 2, y];
    });
    // Split the strand where it crosses the cut line.
    const j = pts.findIndex(([, y]) => y >= CUT);
    const [ax, ay] = pts[j - 1];
    const [bx, by] = pts[j];
    const cut: Pt = [ax + ((bx - ax) * (CUT - ay)) / (by - ay), CUT];
    const apricot = rnd() < 0.17;
    const alpha = apricot ? 0.35 + rnd() * 0.3 : 0.16 + rnd() * 0.3;
    return {
      top: toPath([...pts.slice(0, j), cut]),
      clip: toPath([cut, ...pts.slice(j)]),
      stroke: apricot ? `rgba(255,169,133,${alpha.toFixed(2)})` : `rgba(255,248,239,${alpha.toFixed(2)})`,
      width: 1 + rnd() * 1.4,
      x: cut[0],
      fall: {
        // Each clipping drops just after the scissors pass it.
        at: CUT_START + Math.min(Math.max(cut[0], 0), 1000) / 1000 * CUT_DURATION + rnd() * 0.08,
        y: 550 + rnd() * 400,
        dx: (rnd() - 0.5) * 60,
        rotate: (rnd() < 0.5 ? -1 : 1) * (15 + rnd() * 40),
        duration: 0.9 + rnd() * 0.35,
      },
    };
  });
})();

function Comb() {
  return (
    <svg viewBox="0 0 244 64" className="h-[56px] w-[214px] sm:h-[64px] sm:w-[244px]">
      <rect x="0" y="0" width="244" height="16" rx="8" fill="#FFF8EF" />
      {Array.from({ length: 27 }, (_, i) => (
        <rect key={i} x={8 + i * 8.6} y="10" width="4.2" height={i % 2 ? 40 : 50} rx="2.1" fill="#FFF8EF" fillOpacity={0.92} />
      ))}
      <rect x="0" y="0" width="244" height="5" rx="2.5" fill="#FFA985" fillOpacity={0.9} />
    </svg>
  );
}

/**
 * Haircut intro. Strands of hair hang over the screen; a comb glides through them, the
 * scissors snip along a line, the cut hair drops like clippings on a shop floor, and the
 * cape is whipped away to reveal the page.
 *
 * Shown on every page load. An inline script in <Document> hides it before first paint for
 * reduced-motion users, and a CSS failsafe hides it if JS never runs.
 */
export default function Intro() {
  const { t } = useI18n();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [done, setDone] = useState(false);
  const [snip, setSnip] = useState(false);

  useEffect(() => {
    if (document.documentElement.dataset.intro === "off") {
      setDone(true);
      return;
    }
    setScrollLock(true);
    const timers = [setTimeout(() => setSnip(true), 950), setTimeout(() => setSnip(false), 2100)];
    const root = scope.current!;
    const q = (s: string) => root.querySelector<HTMLElement>(s)!;
    const clips = root.querySelectorAll<SVGPathElement>(".intro-clip");

    const sequence: AnimationSequence = [
      [q(".intro-comb"), { x: ["-30vw", "110vw"] }, { duration: 0.9, ease: EASE_SWEEP, at: 0.2 }],
      [q(".intro-scissors"), { opacity: [0, 1] }, { duration: 0.2, at: 0.95 }],
      [q(".intro-travel"), { x: ["-10vw", "110vw"] }, { duration: CUT_DURATION, ease: "linear", at: CUT_START }],
      ...HAIR.map((h, i): AnimationSequence[number] => [
        clips[i],
        { y: [0, h.fall.y], x: [0, h.fall.dx], rotate: [0, h.fall.rotate], opacity: [1, 1, 0] },
        { duration: h.fall.duration, ease: EASE_FALL, at: h.fall.at },
      ]),
      [q(".intro-scissors"), { opacity: 0 }, { duration: 0.2, at: 2.1 }],
      [q(".intro-logo"), { opacity: [0, 1], y: [12, 0] }, { duration: 0.5, ease: "easeOut", at: 2.2 }],
      [q(".intro-logo"), { opacity: 0, y: -24 }, { duration: 0.3, ease: "easeIn", at: 2.85 }],
      [q(".intro-cape"), { y: "-102%" }, { duration: 0.75, ease: EASE_CAPE, at: 2.95 }],
    ];
    const controls = animate(sequence);

    const skip = () => {
      controls.speed = 5;
      setSnip(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && skip();
    window.addEventListener("keydown", onKey);
    root.addEventListener("click", skip);

    controls.then(() => {
      setDone(true);
      setScrollLock(false);
    });

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", onKey);
      root.removeEventListener("click", skip);
      controls.stop();
      setScrollLock(false);
    };
  }, [animate, scope]);

  if (done) return null;

  return (
    <div ref={scope} className="intro fixed inset-0 z-[100] cursor-pointer overflow-hidden" aria-hidden="true">
      {/* The cape: backdrop + the hair that stays, lifted away at the end */}
      <div className="intro-cape absolute inset-0">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="intro-hair absolute inset-0 h-full w-full">
          {HAIR.map((h, i) => (
            <path key={i} d={h.top} className="intro-strand" stroke={h.stroke} strokeWidth={h.width} />
          ))}
        </svg>
        {/* Barber-pole hem, just below the screen until the cape lifts */}
        <span className="intro-cape-edge absolute inset-x-0 top-full h-[6px]" />
      </div>

      {/* The part below the cut line, which falls as the scissors pass */}
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="intro-hair pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        {HAIR.map((h, i) => (
          <path key={i} d={h.clip} className="intro-strand intro-clip" stroke={h.stroke} strokeWidth={h.width} />
        ))}
      </svg>

      {/* Comb gliding through the hair */}
      <div className="intro-comb pointer-events-none absolute left-0 top-[28vh]" style={{ transform: "translateX(-30vw)" }}>
        <Comb />
      </div>

      {/* Scissors riding along the cut line, blades forward */}
      <div className="intro-travel pointer-events-none absolute left-0 top-[44vh]" style={{ transform: "translateX(-10vw)" }}>
        <div className="intro-scissors">
          <svg viewBox="0 0 184 168" className="h-[84px] w-[92px] -translate-x-[45.3%] -translate-y-[53.1%] rotate-[33deg] [transform-origin:45.3%_53.1%]">
            <ScissorsShape open={1.15} snip={snip} />
          </svg>
        </div>
      </div>

      <div className="intro-logo pointer-events-none absolute inset-x-0 top-[62vh] flex justify-center opacity-0">
        <Logo className="w-[190px] sm:w-[240px]" />
      </div>

      <button
        type="button"
        tabIndex={-1}
        className="absolute bottom-6 end-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-bone/40 transition-colors hover:text-bone"
      >
        {t.intro.skip}
      </button>
    </div>
  );
}
