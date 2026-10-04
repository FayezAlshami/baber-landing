import type { CSSProperties } from "react";

type Part = { text: string; accent?: boolean };

/**
 * Splits a heading into words that each rise from their own mask, staggered.
 * - "reveal": plays when an ancestor `.reveal` gets `.is-visible` (scroll reveal).
 * - "hero": a CSS animation held by html[data-stage="intro"] until the intro hands over.
 * Words stay real text with real spaces, so the heading reads and indexes normally.
 */
export default function SplitWords({
  parts,
  mode = "reveal",
  start = 0,
  step = 55,
}: {
  parts: Part[];
  mode?: "reveal" | "hero";
  /** Delay before the first word, in ms. */
  start?: number;
  /** Delay between words, in ms. */
  step?: number;
}) {
  let i = 0;
  const words = parts.flatMap((p) =>
    p.text
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ w, accent: p.accent, n: i++ }))
  );
  return (
    <>
      {words.map(({ w, accent, n }) => (
        <span key={n}>
          {n > 0 && " "}
          <span className="word-mask">
            <span
              className={`${mode === "hero" ? "hero-word" : "word"} ${accent ? "accent" : ""}`}
              style={{ "--wd": `${start + n * step}ms` } as CSSProperties}
            >
              {w}
            </span>
          </span>
        </span>
      ))}
    </>
  );
}
