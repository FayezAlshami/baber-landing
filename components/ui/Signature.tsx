import { DOTS, LETTERS } from "./Logo";

/**
 * The Trimio wordmark at poster size across the footer: an apricot outline that fills in as
 * it scrolls into view (CSS scroll-driven animation where supported, a reveal otherwise).
 */
export default function Signature() {
  const glyphs = (
    <>
      {LETTERS.map((d) => (
        <path key={d.slice(0, 12)} d={d} />
      ))}
      {DOTS.map(([cx, cy, r]) => (
        <circle key={cx} cx={cx} cy={cy} r={r} />
      ))}
    </>
  );
  return (
    <div className="signature reveal relative mx-auto mt-16 w-full max-w-[1400px] px-5" aria-hidden dir="ltr">
      <svg viewBox="140 12 296 96" className="block h-auto w-full overflow-visible">
        <defs>
          <linearGradient id="signature-metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFD3C0" />
            <stop offset="0.45" stopColor="#FFA985" />
            <stop offset="1" stopColor="#AD4522" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <g className="signature-outline">{glyphs}</g>
        <g className="signature-fill">{glyphs}</g>
      </svg>
    </div>
  );
}
