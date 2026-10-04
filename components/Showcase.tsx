"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useI18n } from "./I18nProvider";
import SectionHeading from "./ui/SectionHeading";
import Icon, { type IconName } from "./ui/Icon";
import Img, { type ImageName } from "./ui/Img";
import { useMediaQuery, usePrefersReducedMotion } from "@/src/lib/stores";

const FRAMES: ImageName[] = ["cut", "shave", "beard", "craft", "razor", "chair", "interior", "tools"];
const socialIcons: IconName[] = ["instagram", "tiktok", "google"];
const pad = (n: number) => String(n).padStart(2, "0");

function useAlts() {
  const { t } = useI18n();
  const a = t.showcase.alts;
  return [a.cut, a.shave, a.beard, a.craft, a.razor, t.team.imageAlts[1], t.team.imageAlts[0], t.cta.imageAlt];
}

function Frame({ i, wide }: { i: number; wide: boolean }) {
  const { t } = useI18n();
  const alts = useAlts();
  const f = t.showcase.frames[i];
  return (
    <figure
      data-cursor="view"
      className={`group relative shrink-0 overflow-hidden rounded-card ${
        wide ? `h-[64vh] w-[min(46vw,560px)] ${i % 2 ? "translate-y-[5vh]" : "-translate-y-[3vh]"}` : "h-[62vh] max-h-[520px] w-[80vw] snap-center"
      }`}
    >
      <Img
        name={FRAMES[i]}
        alt={alts[i]}
        sizes={wide ? "46vw" : "80vw"}
        className="h-full w-full"
        imgClassName="transition-transform duration-[1.8s] ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/10 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 flex items-end gap-5 p-6 md:p-8">
        <span className="frame-num text-[clamp(3rem,6vw,5.5rem)] font-semibold leading-[0.8]" dir="ltr" aria-hidden>
          {pad(i + 1)}
        </span>
        <span className="pb-1">
          <span className="block text-[17px] font-semibold text-bone">{f.title}</span>
          <span className="mt-1 block max-w-xs text-[13px] leading-snug text-bone/60">{f.note}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function Social() {
  const { t } = useI18n();
  return (
    <div className="grid gap-3">
      {t.showcase.social.map((x, i) => (
        <div key={x.title} className="surface flex items-center gap-4 p-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/6">
            <Icon name={socialIcons[i]} weight="duotone" className="h-5 w-5 text-bone" />
          </span>
          <span>
            <span className="block text-[15px] font-medium text-bone">{x.title}</span>
            <span className="block text-[13px] text-bone/60">{x.body}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

/** Desktop: the section pins and vertical scroll drives a horizontal filmstrip. */
function PinnedStrip() {
  const { t, locale } = useI18n();
  const s = t.showcase;
  const track = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [current, setCurrent] = useState(1);
  const rtl = locale === "ar";

  useLayoutEffect(() => {
    const measure = () => {
      if (row.current) setDistance(Math.max(0, row.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (row.current) ro.observe(row.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [locale]);

  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, rtl ? distance : -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setCurrent(Math.min(FRAMES.length, Math.max(1, Math.round(p * (FRAMES.length - 1)) + 1)));
  });

  return (
    // Height sets how long the section stays pinned: one screen per ~frame of travel.
    <div ref={track} className="relative" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={row} style={{ x }} className="flex w-max items-center gap-8 px-[8vw] will-change-transform">
          <div className="w-[min(34vw,460px)] shrink-0">
            <SectionHeading id="gallery-title" eyebrow={s.eyebrow} title={s.title} accent={s.titleAccent} intro={s.intro} />
          </div>
          {FRAMES.map((_, i) => (
            <Frame key={i} i={i} wide />
          ))}
          <div className="w-[min(30vw,380px)] shrink-0">
            <Social />
          </div>
        </motion.div>
        <div className="container-x mt-10 flex items-center gap-5" aria-hidden>
          <span className="text-[12px] font-semibold tabular-nums tracking-[0.2em] text-bone/60" dir="ltr">
            {pad(current)} / {pad(FRAMES.length)}
          </span>
          <span className="relative h-px flex-1 overflow-hidden bg-white/10">
            <motion.span style={{ scaleX: bar }} className="absolute inset-0 origin-left bg-brand rtl:origin-right" />
          </span>
        </div>
      </div>
    </div>
  );
}

/** Mobile and reduced motion: a swipeable, snapping carousel. */
function SwipeStrip() {
  const { t } = useI18n();
  const s = t.showcase;
  return (
    <div className="container-x">
      <SectionHeading id="gallery-title" eyebrow={s.eyebrow} title={s.title} accent={s.titleAccent} intro={s.intro} />
      <div className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8">
        {FRAMES.map((_, i) => (
          <Frame key={i} i={i} wide={false} />
        ))}
      </div>
      <div className="mt-4">
        <Social />
      </div>
    </div>
  );
}

export default function Showcase() {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reduced = usePrefersReducedMotion();
  const pinned = desktop && !reduced;
  return (
    <section id="gallery" aria-labelledby="gallery-title" className={`relative border-t border-white/5 ${pinned ? "" : "section"}`}>
      {pinned ? <PinnedStrip /> : <SwipeStrip />}
    </section>
  );
}
