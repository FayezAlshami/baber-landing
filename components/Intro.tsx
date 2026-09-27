"use client";

import { useEffect, useState } from "react";
import { useAnimate } from "motion/react";
import { useI18n } from "./I18nProvider";
import Logo from "./ui/Logo";
import { ScissorsShape } from "./ui/Scissors";
import { setScrollLock } from "./SmoothScroll";

const EASE_CUT: [number, number, number, number] = [0.65, 0, 0.35, 1];
const EASE_CURTAIN: [number, number, number, number] = [0.76, 0, 0.24, 1];

/**
 * "Cut here" curtain intro. A dashed cut line runs down the middle of the screen with the
 * scissors waiting at its foot. They snip, cut their way up the line, and the two halves
 * part like the curtains of a barbershop window to reveal the page.
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
    const timers = [setTimeout(() => setSnip(true), 380), setTimeout(() => setSnip(false), 1780)];
    const q = (s: string) => scope.current!.querySelector<HTMLElement>(s)!;

    const controls = animate([
      [q(".intro-scissors"), { opacity: [0, 1], scale: [0.7, 1] }, { duration: 0.4, ease: "easeOut", at: 0.15 }],
      [q(".intro-travel"), { y: ["0vh", "-68vh"] }, { duration: 0.95, ease: EASE_CUT, at: 0.85 }],
      [q(".intro-cut"), { scaleY: [0, 1] }, { duration: 0.95, ease: EASE_CUT, at: 0.85 }],
      [q(".intro-scissors"), { opacity: 0, scale: 0.85 }, { duration: 0.3, at: 1.8 }],
      [q(".intro-seam"), { opacity: 0 }, { duration: 0.3, at: 1.85 }],
      [q(".intro-logo"), { opacity: [0, 1], y: [10, 0] }, { duration: 0.5, ease: "easeOut", at: 2.0 }],
      [q(".intro-logo"), { opacity: 0, scale: 1.04 }, { duration: 0.4, at: 2.6 }],
      [scope.current!.querySelectorAll(".intro-pole"), { opacity: [0, 0.9] }, { duration: 0.3, at: 2.45 }],
      [q(".intro-left"), { x: "-101%" }, { duration: 0.9, ease: EASE_CURTAIN, at: 2.55 }],
      [q(".intro-right"), { x: "101%" }, { duration: 0.9, ease: EASE_CURTAIN, at: 2.55 }],
    ]);

    const skip = () => {
      controls.speed = 5;
      setSnip(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && skip();
    window.addEventListener("keydown", onKey);
    scope.current?.addEventListener("click", skip);
    const el = scope.current;

    controls.then(() => {
      setDone(true);
      setScrollLock(false);
    });

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", onKey);
      el?.removeEventListener("click", skip);
      controls.stop();
      setScrollLock(false);
    };
  }, [animate, scope]);

  if (done) return null;

  return (
    <div ref={scope} className="intro fixed inset-0 z-[100] cursor-pointer overflow-hidden" aria-hidden="true">
      <div className="intro-left intro-panel absolute inset-y-0 left-0 w-1/2">
        <span className="intro-pole absolute inset-y-0 right-0 w-[6px]" />
      </div>
      <div className="intro-right intro-panel absolute inset-y-0 right-0 w-1/2">
        <span className="intro-pole absolute inset-y-0 left-0 w-[6px]" />
      </div>

      <div className="intro-seam pointer-events-none absolute inset-0">
        {/* Dashed "cut here" line with spacing between the dashes */}
        <span className="intro-dash absolute left-1/2 top-[14vh] ml-[-1px] h-[72vh] w-[2px] origin-top" />
        {/* The part that has been cut, growing up behind the scissors */}
        <span className="intro-cut absolute bottom-[14vh] left-1/2 ml-[-1px] h-[68vh] w-[2px] origin-bottom" />
        {/* Scissors waiting at the foot of the line, blades pointing up the cut */}
        <div className="intro-travel absolute bottom-[11vh] left-1/2">
          <div className="intro-scissors">
            <svg viewBox="0 0 184 168" className="h-[96px] w-[105px] -translate-x-[45.3%] -translate-y-[53.1%] -rotate-[57deg] [transform-origin:45.3%_53.1%]">
              <ScissorsShape open={1.15} snip={snip} />
            </svg>
          </div>
        </div>
      </div>

      <div className="intro-logo pointer-events-none absolute inset-0 grid place-items-center opacity-0">
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
