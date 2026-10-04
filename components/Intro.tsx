"use client";

import { useEffect, useState } from "react";
import { useAnimate, type AnimationSequence } from "motion/react";
import { useI18n } from "./I18nProvider";
import Logo from "./ui/Logo";
import { ScissorsShape } from "./ui/Scissors";
import { setScrollLock } from "./SmoothScroll";
import { useIntroOff } from "@/src/lib/stores";

type Bezier = [number, number, number, number];
const EASE_SWEEP: Bezier = [0.45, 0, 0.25, 1];
const EASE_OUT: Bezier = [0.16, 1, 0.3, 1];
const EASE_CAPE: Bezier = [0.76, 0, 0.24, 1];
const EASE_FALL: Bezier = [0.55, 0, 1, 0.45];

/* ------------------------------------------------------------------ Hair */
// Coordinates are in a 1000×1000 box stretched over the screen. The cut line sits at CUT.
const STRANDS = 110;
const BACK_STRANDS = 60;
const CUT = 440;
const CUT_START = 2.0;
const CUT_DURATION = 1.2;
const EXIT = 4.7;

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
type Fall = { at: number; y: number; dx: number; rotate: number; duration: number };
type Strand = { top: string; clip: string; stroke: string; width: number; fall: Fall };

const toPath = (pts: Pt[]) => "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L");

function wavy(rnd: () => number, x0: number, end: number): Pt[] {
  const amp = 3 + rnd() * 8;
  const wave = 90 + rnd() * 90;
  const phase = rnd() * Math.PI * 2;
  const drift = (rnd() - 0.5) * 36;
  return Array.from({ length: 15 }, (_, k) => {
    const y = -20 + ((end + 20) * k) / 14;
    return [x0 + amp * Math.sin(y / wave + phase) + drift * ((y + 20) / (end + 20)) ** 2, y];
  });
}

/** The sharp front hair, each strand split where it crosses the cut line. */
const HAIR: Strand[] = (() => {
  const rnd = mulberry32(20260927);
  return Array.from({ length: STRANDS }, (_, i) => {
    const pts = wavy(rnd, ((i + rnd() * 0.9) / STRANDS) * 1040 - 20, 700 + rnd() * 90);
    const j = pts.findIndex(([, y]) => y >= CUT);
    const [ax, ay] = pts[j - 1];
    const [bx, by] = pts[j];
    const cut: Pt = [ax + ((bx - ax) * (CUT - ay)) / (by - ay), CUT];
    const apricot = rnd() < 0.17;
    const alpha = apricot ? 0.4 + rnd() * 0.3 : 0.2 + rnd() * 0.32;
    return {
      top: toPath([...pts.slice(0, j), cut]),
      clip: toPath([cut, ...pts.slice(j)]),
      stroke: apricot ? `rgba(255,169,133,${alpha.toFixed(2)})` : `rgba(255,248,239,${alpha.toFixed(2)})`,
      width: 1 + rnd() * 1.5,
      fall: {
        // Each clipping drops just after the scissors pass it, slow and floaty.
        at: CUT_START + (Math.min(Math.max(cut[0], 0), 1000) / 1000) * CUT_DURATION + rnd() * 0.1,
        y: 520 + rnd() * 420,
        dx: (rnd() - 0.5) * 80,
        rotate: (rnd() < 0.5 ? -1 : 1) * (15 + rnd() * 45),
        duration: 1.3 + rnd() * 0.6,
      },
    };
  });
})();

/** Soft, blurred hair further back, ending above the cut line, for depth. */
const BACK_HAIR = (() => {
  const rnd = mulberry32(19840412);
  return Array.from({ length: BACK_STRANDS }, (_, i) => ({
    d: toPath(wavy(rnd, ((i + rnd()) / BACK_STRANDS) * 1060 - 30, 280 + rnd() * 140)),
    stroke: `rgba(255,${rnd() < 0.3 ? "169,133" : "248,239"},${(0.1 + rnd() * 0.14).toFixed(2)})`,
    width: 2 + rnd() * 2.5,
  }));
})();

/** A barber's comb: champagne-metal spine with an apricot inlay and long teeth. */
function Comb() {
  const teeth = 34;
  return (
    <svg viewBox="0 0 480 116" className="h-auto w-[min(74vw,330px)] sm:w-[min(46vw,480px)]">
      <defs>
        <linearGradient id="intro-comb-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFDF8" />
          <stop offset="0.45" stopColor="#F3E4D0" />
          <stop offset="1" stopColor="#D8BE9E" />
        </linearGradient>
        <linearGradient id="intro-comb-teeth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6E9D8" />
          <stop offset="1" stopColor="#FFF8EF" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {Array.from({ length: teeth }, (_, i) => (
        <rect
          key={i}
          x={13 + (i * 448) / (teeth - 1) - 3.2}
          y="18"
          width="6.4"
          height={i % 2 ? 78 : 92}
          rx="3.2"
          fill="url(#intro-comb-teeth)"
        />
      ))}
      <rect x="0" y="0" width="480" height="28" rx="14" fill="url(#intro-comb-metal)" />
      <rect x="16" y="11" width="448" height="5" rx="2.5" fill="#FFA985" />
      <rect x="20" y="3.5" width="440" height="3" rx="1.5" fill="#FFFFFF" fillOpacity="0.8" />
    </svg>
  );
}

/** Four-point sparkle that flashes on the blade tips with every snip. */
function Glint({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className={`intro-glint absolute h-9 w-9 ${on ? "is-on" : ""}`}>
      <path d="M20 0C21.5 13 27 18.5 40 20C27 21.5 21.5 27 20 40C18.5 27 13 21.5 0 20C13 18.5 18.5 13 20 0Z" fill="#FFF8EF" />
    </svg>
  );
}

/**
 * Cinematic haircut intro. Letterbox bars close in on a film-grained scene where hair hangs
 * in two depths under a slow camera push; a warm light sweeps across as a comb glides
 * through, the scissors snip along a line with a glint on every cut, and the clippings
 * drift to the floor. A title card resolves out of blur, then the cape is whipped away and
 * the hero takes over.
 *
 * Shown on every page load. An inline script in <Document> hides it before first paint for
 * reduced-motion users, and a CSS failsafe hides it if JS never runs.
 */
export default function Intro() {
  const { t } = useI18n();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [done, setDone] = useState(false);
  const [snip, setSnip] = useState(false);
  const introOff = useIntroOff();

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.intro === "off") return;
    setScrollLock(true);
    const timers = [setTimeout(() => setSnip(true), 1950), setTimeout(() => setSnip(false), 3250)];
    const root = scope.current!;
    const q = (s: string) => root.querySelector<HTMLElement>(s)!;
    const all = (s: string) => root.querySelectorAll<HTMLElement>(s);
    const clips = root.querySelectorAll<SVGPathElement>(".intro-clip");
    const bar = window.innerWidth < 640 ? "6vh" : "9vh";
    const handOver = () => {
      html.dataset.stage = "ready";
    };

    const sequence: AnimationSequence = [
      // Letterbox closes in; the camera slowly pushes in on the hair.
      [all(".intro-bar"), { height: ["0vh", bar] }, { duration: 0.8, ease: EASE_OUT, at: 0 }],
      [all(".intro-scene"), { scale: [1.07, 1] }, { duration: 3.8, ease: EASE_OUT, at: 0 }],
      // A warm light sweeps across while the comb glides through.
      [q(".intro-beam"), { x: ["-70vw", "130vw"] }, { duration: 2.2, ease: EASE_SWEEP, at: 0.2 }],
      [q(".intro-comb"), { x: ["-55vw", "112vw"], rotate: [-5, 2] }, { duration: 1.85, ease: EASE_SWEEP, at: 0.25 }],
      // Scissors snip along the cut line, a thin blade-light growing behind them.
      [q(".intro-scissors"), { opacity: [0, 1] }, { duration: 0.25, at: 1.9 }],
      [q(".intro-travel"), { x: ["-12vw", "112vw"] }, { duration: CUT_DURATION, ease: "linear", at: CUT_START }],
      [q(".intro-blade-light"), { scaleX: [0, 1], opacity: [1, 1] }, { duration: CUT_DURATION, ease: "linear", at: CUT_START }],
      [q(".intro-blade-light"), { opacity: 0 }, { duration: 0.5, at: CUT_START + CUT_DURATION }],
      ...HAIR.map((h, i): AnimationSequence[number] => [
        clips[i],
        {
          y: [0, h.fall.y],
          x: [0, h.fall.dx * 0.5, h.fall.dx * 0.15, h.fall.dx],
          rotate: [0, h.fall.rotate],
          opacity: [1, 1, 1, 0],
        },
        { duration: h.fall.duration, ease: EASE_FALL, at: h.fall.at, x: { ease: "easeInOut" } },
      ]),
      [q(".intro-scissors"), { opacity: 0 }, { duration: 0.25, at: 3.25 }],
      // Title card resolves out of blur.
      [q(".intro-logo"), { opacity: [0, 1], scale: [1.08, 1], filter: ["blur(14px)", "blur(0px)"] }, { duration: 1.0, ease: EASE_OUT, at: 3.35 }],
      [q(".intro-tagline"), { opacity: [0, 1], y: [10, 0], filter: ["blur(6px)", "blur(0px)"] }, { duration: 1.0, ease: EASE_OUT, at: 3.65 }],
      // Exit: the cape is whipped away, the letterbox opens and the hero takes over.
      [handOver, [0, 1], { duration: 0.01, at: EXIT }],
      [q(".intro-title"), { opacity: 0, y: -26 }, { duration: 0.4, ease: "easeIn", at: EXIT }],
      [q(".intro-falling"), { opacity: 0 }, { duration: 0.4, at: EXIT }],
      [q(".intro-cape"), { y: "-102%" }, { duration: 0.85, ease: EASE_CAPE, at: EXIT }],
      [all(".intro-bar"), { height: "0vh" }, { duration: 0.7, ease: EASE_CAPE, at: EXIT + 0.15 }],
      [all(".intro-film"), { opacity: 0 }, { duration: 0.6, at: EXIT + 0.1 }],
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
      handOver();
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

  if (done || introOff) return null;

  return (
    <div ref={scope} className="intro fixed inset-0 z-[100] cursor-pointer overflow-hidden" aria-hidden="true">
      {/* The cape: backdrop + the hair that stays, lifted away at the end */}
      <div className="intro-cape absolute inset-0">
        <div className="intro-scene absolute inset-0" style={{ transform: "scale(1.07)" }}>
          <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="intro-hair intro-hair-back absolute inset-0 h-full w-full">
            {BACK_HAIR.map((h, i) => (
              <path key={i} d={h.d} className="intro-strand" stroke={h.stroke} strokeWidth={h.width} />
            ))}
          </svg>
          <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="intro-hair absolute inset-0 h-full w-full">
            {HAIR.map((h, i) => (
              <path key={i} d={h.top} className="intro-strand" stroke={h.stroke} strokeWidth={h.width} />
            ))}
          </svg>
        </div>
        {/* Barber-pole hem, just below the screen until the cape lifts */}
        <span className="intro-cape-edge absolute inset-x-0 top-full h-[6px]" />
      </div>

      {/* The hair below the cut line, which falls as the scissors pass */}
      <div className="intro-falling pointer-events-none absolute inset-0">
        <div className="intro-scene absolute inset-0" style={{ transform: "scale(1.07)" }}>
          <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="intro-hair absolute inset-0 h-full w-full overflow-visible">
            {HAIR.map((h, i) => (
              <path key={i} d={h.clip} className="intro-strand intro-clip" stroke={h.stroke} strokeWidth={h.width} />
            ))}
          </svg>
        </div>
      </div>

      {/* Warm light sweeping across the hair */}
      <div className="intro-beam pointer-events-none absolute -top-1/4 left-0 h-[150%] w-[34vw]" style={{ transform: "translateX(-70vw)" }} />

      {/* Comb gliding through the hair */}
      <div className="intro-comb pointer-events-none absolute left-0 top-[24vh]" style={{ transform: "translateX(-55vw)" }}>
        <Comb />
      </div>

      {/* Blade light along the cut line */}
      <span className="intro-blade-light pointer-events-none absolute inset-x-0 top-[44vh] h-px origin-left" style={{ transform: "scaleX(0)" }} />

      {/* Scissors riding along the cut line, blades forward */}
      <div className="intro-travel pointer-events-none absolute left-0 top-[44vh]" style={{ transform: "translateX(-12vw)" }}>
        <div className="intro-scissors relative">
          <svg viewBox="0 0 184 168" className="h-[80px] w-[88px] -translate-x-[45.3%] -translate-y-[53.1%] rotate-[33deg] [transform-origin:45.3%_53.1%] sm:h-[110px] sm:w-[120px]">
            <ScissorsShape open={1.15} snip={snip} />
          </svg>
          <span className="absolute left-[44px] top-[-18px] sm:left-[64px]">
            <Glint on={snip} />
          </span>
        </div>
      </div>

      {/* Title card */}
      <div className="intro-title pointer-events-none absolute inset-x-0 top-[57vh] flex flex-col items-center gap-5 px-6 text-center">
        <div className="intro-logo opacity-0">
          <Logo className="w-[210px] sm:w-[300px]" />
        </div>
        <p className="intro-tagline text-[11px] font-semibold uppercase tracking-[0.3em] text-bone/70 opacity-0 sm:text-[12px]">{t.intro.tagline}</p>
      </div>

      {/* Film: vignette, grain and letterbox */}
      <div className="intro-film intro-vignette pointer-events-none absolute inset-0" />
      <div className="intro-film pointer-events-none absolute inset-0 overflow-hidden">
        <div className="intro-grain absolute -inset-1/2" />
      </div>
      <div className="intro-bar pointer-events-none absolute inset-x-0 top-0 h-0" />
      <div className="intro-bar pointer-events-none absolute inset-x-0 bottom-0 h-0" />

      <button
        type="button"
        tabIndex={-1}
        className="absolute bottom-6 end-6 z-10 text-[11px] font-semibold uppercase tracking-[0.24em] text-bone/45 transition-colors hover:text-bone"
      >
        {t.intro.skip}
      </button>
    </div>
  );
}
