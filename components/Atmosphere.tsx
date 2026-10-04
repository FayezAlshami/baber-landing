"use client";

import { useEffect, useRef } from "react";

/**
 * Site-wide finish: film grain, a soft vignette, the scroll-progress hairline (driven by
 * SmoothScroll), and on precise pointers a trailing cursor ring, magnetic buttons and a
 * spotlight that follows the pointer across cards. Pointer effects are off for touch and
 * reduced-motion users.
 */
export default function Atmosphere() {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ring.current!;
    let x = -100;
    let y = -100;
    let tx = x;
    let ty = y;
    let raf = 0;
    let magnet: HTMLElement | null = null;

    const release = () => {
      magnet?.style.setProperty("--mag-x", "0px");
      magnet?.style.setProperty("--mag-y", "0px");
      magnet = null;
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.dataset.on = "true";
      const target = e.target as Element | null;

      const hit = target?.closest("a, button, [role='button'], input, select, textarea, label");
      el.dataset.mode = !hit ? "" : hit.matches("input, select, textarea") ? "text" : "link";

      const btn = target?.closest<HTMLElement>(".btn") ?? null;
      if (btn !== magnet) release();
      if (btn) {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty("--mag-x", `${((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1)}px`);
        btn.style.setProperty("--mag-y", `${((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1)}px`);
        magnet = btn;
      }

      const card = target?.closest<HTMLElement>(".surface");
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
    };
    const onLeave = () => {
      el.dataset.on = "false";
      release();
    };

    const loop = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      release();
    };
  }, []);

  return (
    <>
      <div
        id="scroll-progress"
        aria-hidden
        className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left rtl:origin-right"
        style={{ transform: "scaleX(0)" }}
      />
      <div aria-hidden className="atmo-vignette pointer-events-none fixed inset-0 z-[64]" />
      <div aria-hidden className="atmo-grain pointer-events-none fixed inset-0 z-[65]" />
      <div ref={ring} aria-hidden data-on="false" className="cursor-ring pointer-events-none fixed left-0 top-0 z-[120]">
        <span />
      </div>
    </>
  );
}
