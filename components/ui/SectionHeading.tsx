import SplitWords from "./SplitWords";
import type { ReactNode } from "react";

export default function SectionHeading({
  eyebrow,
  title,
  accent,
  intro,
  align = "start",
  id,
  children,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  intro?: string;
  align?: "start" | "center";
  id?: string;
  children?: ReactNode;
}) {
  const center = align === "center";
  return (
    <div className={`reveal ${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      <p className={`eyebrow ${center ? "justify-center" : ""}`}>
        {/* Editorial section number from a CSS counter on <main> */}
        <span className="eyebrow-num" aria-hidden />
        <span className="h-px w-8 bg-brand/60" aria-hidden />
        {eyebrow}
      </p>
      <h2 id={id} className="h-display mt-6 text-[clamp(2.25rem,5.2vw,4.25rem)] text-bone">
        <SplitWords parts={[{ text: title }, { text: accent, accent: true }]} start={120} />
      </h2>
      {intro && <p className={`lead mt-6 ${center ? "mx-auto" : ""}`}>{intro}</p>}
      {children}
    </div>
  );
}
