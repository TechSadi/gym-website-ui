// One-off: converts the heavy source photos in Assets/ into responsive WebP files.
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const SRC = "Assets";
const OUT = "src/assets/img";

const jobs = [
  { file: "hero-section.png", name: "hero", widths: [960, 1920] },
  { file: "gym-interior-1.png", name: "gallery-1", widths: [800, 1600] },
  { file: "gym-interior-2.jpg", name: "gallery-2", widths: [800, 1600] },
  { file: "interior-design-3.jpg", name: "gallery-3", widths: [800, 1600] },
  { file: "interior-design-4.jpg", name: "gallery-4", widths: [800, 1600] },
  { file: "gym-interior-5.jpg", name: "gallery-5", widths: [800, 1600] },
  { file: "gym-interior-6.jpg", name: "gallery-6", widths: [800, 1600] },
  { file: "schedule-section.png", name: "schedule", widths: [800, 1600] },
  { file: "about-us-section.png", name: "about", widths: [700, 1400] },
];

await mkdir(OUT, { recursive: true });

for (const job of jobs) {
  const input = path.join(SRC, job.file);
  const meta = await sharp(input).metadata();
  for (const w of job.widths) {
    const out = path.join(OUT, `${job.name}-${w}.webp`);
    await sharp(input)
      .resize({ width: Math.min(w, meta.width), withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(out);
    const { size } = await stat(out);
    console.log(`${job.file} (${meta.width}x${meta.height}) -> ${out} ${(size / 1024).toFixed(0)}KB`);
  }
}

// Logo: square WebP for the UI, PNG favicon and OG image from the hero.
await sharp(path.join(SRC, "logo.jpeg")).resize(160, 160).webp({ quality: 90 }).toFile(path.join(OUT, "logo.webp"));
await sharp(path.join(SRC, "logo.jpeg")).resize(64, 64).png().toFile("public/favicon.png");
await sharp(path.join(SRC, "logo.jpeg")).resize(180, 180).png().toFile("public/apple-touch-icon.png");
await sharp(path.join(SRC, "hero-section.png"))
  .resize(1200, 630, { fit: "cover", position: "right" })
  .jpeg({ quality: 80 })
  .toFile("public/og-image.jpg");
console.log("logo, favicon and og-image done");
