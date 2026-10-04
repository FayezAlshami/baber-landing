import { preload } from "react-dom";
import manifest from "@/src/lib/images.json";
import { BASE_PATH } from "@/src/config/site";

export type ImageName = keyof typeof manifest;

type Props = {
  name: ImageName;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Reveal with a clip-path wipe when scrolled into view. */
  wipe?: boolean;
  /** Scroll parallax speed for the photo inside its frame (e.g. 0.08). */
  parallax?: number;
};

/** Responsive WebP with a blurred placeholder painted underneath until the image decodes. */
export default function Img({ name, alt, sizes, className = "", imgClassName = "", priority, wipe, parallax }: Props) {
  const m = manifest[name];
  const srcSet = m.widths.map((w) => `${BASE_PATH}/img/${name}-${w}.webp ${w}w`).join(", ");
  const fallback = `${BASE_PATH}/img/${name}-${m.widths[Math.min(1, m.widths.length - 1)]}.webp`;
  // React 19 hoists this into <head> as <link rel="preload">, so the LCP image starts before the CSS settles.
  if (priority) preload(fallback, { as: "image", imageSrcSet: srcSet, imageSizes: sizes, fetchPriority: "high" });
  return (
    <div
      className={`relative overflow-hidden bg-neutral-900 bg-cover bg-center ${wipe ? "wipe" : ""} ${className}`}
      style={{ backgroundImage: `url(${m.blur})` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={fallback}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={m.w}
        height={m.h}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        {...(priority ? { fetchPriority: "high" as const } : {})}
        {...(parallax ? { "data-parallax": parallax, style: { transform: "scale(1.14)" } } : {})}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
