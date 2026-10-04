import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { LOCALES, asLocale, dirOf } from "@/src/i18n";
import { DICTS } from "@/src/lib/content";

/** Branded 1200×630 social cards (JPEG, ~100 KB), one per language, rendered once at build time. */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((l) => ({ image: `${l.id}.jpg` }));
}

const dataUrl = (buf: Buffer, type: string) => `data:${type};base64,${buf.toString("base64")}`;

export async function GET(_req: Request, ctx: RouteContext<"/og/[image]">) {
  const locale = asLocale((await ctx.params).image.replace(/\.jpg$/, ""));
  const h = DICTS[locale].hero;
  const rtl = dirOf(locale) === "rtl";
  // Satori shapes Arabic within a word but has no real bidi, so RTL lines are laid out word by
  // word in reverse, without the trailing full stop and without the Latin part of the eyebrow.
  const line = (text: string) =>
    rtl ? (
      <div style={{ display: "flex", flexDirection: "row-reverse", gap: "0.28em" }}>
        {text
          .replace(/[.!؟]+$/, "")
          .split(" ")
          .map((word, i) => (
            <span key={i}>{word}</span>
          ))}
      </div>
    ) : (
      text
    );
  const eyebrow = rtl ? h.eyebrow.split(" · ").pop()! : h.eyebrow;
  const [photo, logo, manrope, alexandria] = await Promise.all([
    readFile(path.join(process.cwd(), "public", "img", "og.jpg")),
    readFile(path.join(process.cwd(), "public", "brand", "trimio-logo-inverse.svg")),
    readFile(path.join(process.cwd(), "app", "fonts", "manrope-700.woff")),
    readFile(path.join(process.cwd(), "app", "fonts", "alexandria-700.woff")),
  ]);

  const png = new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: "#202338" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataUrl(photo, "image/jpeg")} width={1200} height={630} alt="" style={{ position: "absolute", inset: 0, objectFit: "cover", opacity: 0.55 }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(${rtl ? 270 : 90}deg, rgba(32,35,56,0.97) 0%, rgba(32,35,56,0.86) 52%, rgba(32,35,56,0.35) 100%)`,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: rtl ? "flex-end" : "flex-start",
            padding: "64px 72px",
            width: "100%",
            position: "relative",
            fontFamily: rtl ? "Alexandria" : "Manrope",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dataUrl(logo, "image/svg+xml")} width={258} height={70} alt="" />
          <div style={{ display: "flex", flexDirection: "column", alignItems: rtl ? "flex-end" : "flex-start", maxWidth: 760 }}>
            <div style={{ fontSize: 66, lineHeight: 1.08, color: "#FFF8EF", letterSpacing: rtl ? 0 : -1.5, display: "flex" }}>
              {line(h.titleA)}
            </div>
            <div style={{ fontSize: 66, lineHeight: 1.08, color: "#FFA985", letterSpacing: rtl ? 0 : -1.5, display: "flex" }}>
              {line(`${h.titleB} ${h.titleAccent}`)}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: rtl ? "row-reverse" : "row",
              alignItems: "center",
              gap: 14,
              fontSize: 24,
              color: "rgba(255,248,239,0.72)",
            }}
          >
            <div style={{ width: 40, height: 2, background: "#FFA985" }} />
            <div style={{ display: "flex" }}>{line(eyebrow)}</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Manrope", data: manrope, weight: 700, style: "normal" },
        { name: "Alexandria", data: alexandria, weight: 700, style: "normal" },
      ],
    },
  );
  const jpeg = await sharp(Buffer.from(await png.arrayBuffer())).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": "image/jpeg" } });
}
