/**
 * Responsive image pipeline.
 *   npm run images -- <folder with the source photos>
 * Reads scripts/images.map.json ({ slot: { file, crop? } }) and writes
 *   public/img/<slot>-<width>.webp, public/img/og.jpg and src/lib/images.json
 * (sizes + a tiny blurred placeholder), which components/ui/Img.tsx consumes.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const srcDir = path.resolve(process.argv[2] || "images");
const outDir = path.join(root, "public/img");
const map = JSON.parse(await fs.readFile(path.join(root, "scripts/images.map.json"), "utf8"));

const TARGETS = [480, 960, 1600];

const load = ({ file, crop }) => {
  const img = sharp(path.join(srcDir, file));
  return crop ? img.extract(crop) : img;
};

await fs.mkdir(outDir, { recursive: true });
for (const f of await fs.readdir(outDir)) if (/\.(webp|jpg)$/.test(f)) await fs.unlink(path.join(outDir, f));

const manifest = {};
for (const [slot, spec] of Object.entries(map)) {
  const { data, info } = await load(spec).png().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const widths = [...new Set(TARGETS.map((t) => Math.min(t, w)))];
  for (const width of widths) {
    await sharp(data)
      .resize({ width })
      .webp({ quality: 78, effort: 6, smartSubsample: true })
      .toFile(path.join(outDir, `${slot}-${width}.webp`));
  }
  const blur = await sharp(data).resize(24).blur(1.2).webp({ quality: 40 }).toBuffer();
  manifest[slot] = { w, h, widths, blur: `data:image/webp;base64,${blur.toString("base64")}` };
  console.log(`${slot.padEnd(9)} ${w}×${h} → ${widths.join(", ")}`);
}

await sharp(await load(map.hero).png().toBuffer())
  .resize(1200, 630, { fit: "cover" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(outDir, "og.jpg"));

await fs.writeFile(path.join(root, "src/lib/images.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log("✓ src/lib/images.json");
