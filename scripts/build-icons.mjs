/**
 * App icons from the brand favicon.
 *   npm run icons
 * Writes public/brand/{icon-192,icon-512,icon-maskable-512,apple-touch-icon}.png
 * for the web app manifest and iOS home screens.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const dir = path.join(root, "public/brand");
const favicon = await fs.readFile(path.join(dir, "trimio-favicon.svg"), "utf8");

const MARK = '<g transform="translate(7.7 13.6) scale(.612)">';
if (!favicon.includes('rx="30"') || !favicon.includes(MARK)) throw new Error("trimio-favicon.svg changed shape; update build-icons.mjs");

// Full-bleed square: iOS and Android apply their own corner mask.
const square = favicon.replace('rx="30"', 'rx="0"');
// Maskable icons must keep the mark inside the central 80% safe zone.
const maskable = square.replace(MARK, `<g transform="translate(64 64) scale(.74) translate(-64 -64)">${MARK}`).replace(/<\/svg>\s*$/, "</g></svg>");

const out = [
  ["icon-192.png", favicon, 192],
  ["icon-512.png", favicon, 512],
  ["icon-maskable-512.png", maskable, 512],
  ["apple-touch-icon.png", square, 180],
];
for (const [file, svg, size] of out) {
  await sharp(Buffer.from(svg), { density: (72 * size) / 128 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(path.join(dir, file));
  console.log(`✓ public/brand/${file}`);
}
