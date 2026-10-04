"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

let lenis: Lenis | null = null;
const locks = new Set<string>();

/** Pause page scrolling (smooth or native) while an overlay such as the intro or menu is open. */
export function setScrollLock(on: boolean, key = "intro") {
  if (on) locks.add(key);
  else locks.delete(key);
  const locked = locks.size > 0;
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (locked) lenis?.stop();
  else lenis?.start();
}

/** Long, soft exponential ease-out: the page glides to a stop. */
const easeOutExpo = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/**
 * Parallax for `[data-parallax="<speed>"]` elements and the top scroll-progress line.
 * Parallax media is scaled (`data-parallax-scale`, default 1.14) and its shift is clamped to
 * that headroom so edges never show; `data-parallax-free` lifts the clamp.
 */
function paint(parallax: boolean) {
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  const bar = document.getElementById("scroll-progress");
  if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
  if (!parallax) return;
  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const host = el.parentElement ?? el;
    const r = host.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) return;
    const speed = Number(el.dataset.parallax) || 0;
    const scale = Number(el.dataset.parallaxScale ?? 1.14);
    let y = -(r.top + r.height / 2 - vh / 2) * speed;
    if (!("parallaxFree" in el.dataset)) {
      const room = (r.height * (scale - 1)) / 2;
      y = Math.max(-room, Math.min(room, y));
    }
    el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(${scale})`;
  });
}

/** Slow, inertial smooth scrolling with header-aware anchors. Off for reduced-motion users. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const onScroll = () => paint(false);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    lenis = new Lenis({
      autoRaf: true,
      duration: 1.6,
      easing: easeOutExpo,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.1,
      anchors: { offset: -88, duration: 2.2, easing: easeOutExpo },
      prevent: (node) => node.closest("[data-lenis-prevent], #mobile-menu") !== null,
    });
    if (locks.size) lenis.stop();

    const update = () => paint(true);
    lenis.on("scroll", update);
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("resize", update);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return null;
}
