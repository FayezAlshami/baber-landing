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

/** Inertial smooth scrolling with header-aware anchor links. Off for reduced-motion users. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({
      autoRaf: true,
      lerp: 0.11,
      anchors: { offset: -88 },
      prevent: (node) => node.closest("[data-lenis-prevent], #mobile-menu") !== null,
    });
    if (locks.size) lenis.stop();
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return null;
}
