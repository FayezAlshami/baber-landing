"use client";

import { useEffect, useId, useRef, useState } from "react";
import { animate, useSpring } from "motion/react";

/*
 * The Trimio scissors mark (brand kit `scissors.svg`, viewBox 184×168), split into its two
 * blades so they can pivot around the screw. At rest (open = 1) the mark is drawn exactly
 * as in the kit; open = 0 swings both blades together until they close.
 */
const PIVOT = "83.3 89.2";
const CLOSE_DEG = 19;

const BLADES = [
  { sign: -1, blade: "M47 88C61 82 70 82 85 85L173 66C164 77 154 83 140 86L49 105Z", ring: { cx: 32, cy: 101, rx: 22, ry: 17, hx: 13, hy: 8.7 } },
  { sign: 1, blade: "M66 131L75 95C79 84 82 75 93 64L146 9C145 25 139 37 129 49L87 100L82 135Z", ring: { cx: 72, cy: 142, rx: 20, ry: 15.8, hx: 11.3, hy: 8.2 } },
] as const;

type ShapeProps = {
  /** 0 = closed, 1 = open as drawn in the brand kit. Values above 1 open wider. */
  open?: number;
  /** Loop a quick open/close "snip". */
  snip?: boolean;
  fill?: string;
};

/** The scissors as an SVG <g>, in the kit's 184×168 coordinate space. */
export function ScissorsShape({ open = 1, snip = false, fill = "#FFA985" }: ShapeProps) {
  const uid = useId().replace(/:/g, "");
  const refs = [useRef<SVGGElement>(null), useRef<SVGGElement>(null)];
  const value = useSpring(open, { stiffness: 420, damping: 22, mass: 0.6 });
  // First paint (incl. server HTML) matches the initial state; later changes are painted by the spring.
  const [initial] = useState(open);

  useEffect(() => {
    const paint = (v: number) =>
      BLADES.forEach((b, i) =>
        refs[i].current?.setAttribute("transform", `rotate(${b.sign * CLOSE_DEG * (1 - v)} ${PIVOT})`)
      );
    paint(value.get());
    return value.on("change", paint);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (!snip) {
      value.set(open);
      return;
    }
    const controls = animate(value, [open, 0, open], {
      duration: 0.34,
      ease: [0.65, 0, 0.35, 1],
      repeat: Infinity,
      repeatDelay: 0.04,
    });
    return () => {
      controls.stop();
      value.set(open);
    };
  }, [snip, open, value]);

  return (
    <g fill={fill}>
      {BLADES.map((b, i) => {
        const id = `${uid}-b${i}`;
        const { cx, cy, rx, ry, hx, hy } = b.ring;
        const tilt = `rotate(-34 ${cx} ${cy})`;
        return (
          <g key={i} ref={refs[i]} transform={`rotate(${b.sign * CLOSE_DEG * (1 - initial)} ${PIVOT})`}>
            <defs>
              <mask id={id} maskUnits="userSpaceOnUse" x="-40" y="-40" width="264" height="248">
                <path fill="white" d="M-40 -40H224V208H-40Z" />
                <ellipse fill="black" cx={cx} cy={cy} rx={hx} ry={hy} transform={tilt} />
                <circle fill="black" cx="83.3" cy="89.2" r="3.15" />
              </mask>
            </defs>
            <g mask={`url(#${id})`}>
              <path d={b.blade} />
              <ellipse cx={cx} cy={cy} rx={rx} ry={ry} transform={tilt} />
            </g>
          </g>
        );
      })}
    </g>
  );
}

type Props = ShapeProps & { className?: string; title?: string };

/** Standalone scissors icon. Decorative unless a title is given. */
export default function Scissors({ className = "", title, ...shape }: Props) {
  return (
    <svg
      viewBox="0 0 184 168"
      className={className}
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
    >
      <ScissorsShape {...shape} />
    </svg>
  );
}
