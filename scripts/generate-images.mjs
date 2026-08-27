/**
 * Image pipeline.
 *
 * For every entry in content/media.mjs this script produces a responsive set of
 * AVIF + WebP files (plus a JPEG fallback) and an inline LQIP, then writes the
 * manifest the app reads at build time.
 *
 * Source of each image, in order of preference:
 *   1. source/<slug>.{jpg,jpeg,png,webp,avif,tif}  — a real, licensed photograph
 *   2. a procedurally rendered "plate" (deterministic, seeded by the entry)
 *
 * The prototype ships without real photographs, so everything is a plate. The
 * moment a file lands in source/, the same responsive/format/LQIP treatment is
 * applied to it and nothing in the app needs to change.
 */
import { mkdir, readdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { media, palettes, aspects, ladders } from '../content/media.mjs';
import { renderScene, mulberry32 } from './scene.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'img');
const sourceDir = path.join(root, 'source');

sharp.cache(false);
sharp.concurrency(Math.max(1, Math.min(4, (await import('node:os')).cpus().length)));

/** Film grain as an overlay layer (128 = neutral). */
function grainLayer(w, h, seed) {
  const rnd = mulberry32(seed * 7 + 13);
  const buf = Buffer.allocUnsafe(w * h * 3);
  for (let i = 0; i < w * h; i++) {
    // box-muller-ish: sum of uniforms approximates gaussian, cheap and adequate
    const n = (rnd() + rnd() + rnd() - 1.5) * 13;
    const v = Math.max(0, Math.min(255, 128 + n));
    const o = i * 3;
    buf[o] = v; buf[o + 1] = v; buf[o + 2] = v;
  }
  return sharp(buf, { raw: { width: w, height: h, channels: 3 } }).png({ compressionLevel: 1 });
}

/** Vignette as a multiply layer (255 = neutral). */
function vignetteLayer(w, h, strength) {
  const buf = Buffer.allocUnsafe(w * h * 3);
  for (let y = 0; y < h; y++) {
    const dy = (y / (h - 1) - 0.5) * 2;
    for (let x = 0; x < w; x++) {
      const dx = (x / (w - 1) - 0.5) * 2;
      const r2 = (dx * dx + dy * dy) / 2;
      const v = Math.max(0, Math.min(255, 255 * (1 - strength * r2 * r2)));
      const o = (y * w + x) * 3;
      buf[o] = v; buf[o + 1] = v; buf[o + 2] = v;
    }
  }
  return sharp(buf, { raw: { width: w, height: h, channels: 3 } }).png({ compressionLevel: 1 });
}

async function buildMaster(entry, W, H) {
  const real = await findSource(entry.slug);
  if (real) {
    return sharp(real).rotate().resize(W, H, { fit: 'cover', position: 'attention' }).toColourspace('srgb');
  }

  // Render the scene at a workable resolution, then upsample: the slight
  // softening that buys us reads as shallow depth of field rather than blur.
  const long = 1100;
  const rw = W >= H ? long : Math.max(8, Math.round(long * (W / H)));
  const rh = W >= H ? Math.max(8, Math.round(long * (H / W))) : long;

  const raw = renderScene({ scene: entry.scene, seed: entry.seed ?? 1, palette: palettes[entry.palette] ?? palettes.ink }, rw, rh);
  const field = await sharp(raw, { raw: { width: rw, height: rh, channels: 3 } })
    .resize(W, H, { kernel: 'lanczos3' })
    .blur(Math.max(0.35, W / 1600))
    .png({ compressionLevel: 1 })
    .toBuffer();

  const [grain, vignette] = await Promise.all([
    grainLayer(W, H, entry.seed ?? 1).toBuffer(),
    vignetteLayer(W, H, palettes[entry.palette]?.mood === 'dark' ? 0.42 : 0.3).toBuffer(),
  ]);

  return sharp(field)
    .composite([
      { input: grain, blend: 'overlay' },
      { input: vignette, blend: 'multiply' },
    ])
    .linear(1.06, -7)           // gentle contrast
    .modulate({ saturation: 0.94 })
    .sharpen({ sigma: 0.6 });
}

async function findSource(slug) {
  if (!existsSync(sourceDir)) return null;
  const files = await readdir(sourceDir);
  const hit = files.find((f) => f.replace(/\.[^.]+$/, '') === slug);
  return hit ? path.join(sourceDir, hit) : null;
}

async function main() {
  const fresh = process.argv.includes('--clean');
  if (fresh && existsSync(outDir)) await rm(outDir, { recursive: true });
  await mkdir(outDir, { recursive: true });

  const manifest = [];
  const started = Date.now();

  for (const entry of media) {
    const ladder = ladders[entry.role] ?? ladders.grid;
    const ratio = aspects[entry.aspect] ?? 1;   // width / height
    const W = ladder.master;
    const H = Math.round(W / ratio);

    const master = await (await buildMaster(entry, W, H)).toBuffer();
    const widths = ladder.widths.filter((w) => w <= W);
    if (!widths.includes(W)) widths.push(W);

    const jpegAt = widths[Math.min(widths.length - 1, Math.max(0, widths.length - 2))];
    const files = { avif: {}, webp: {}, jpeg: {} };

    for (const w of widths) {
      const h = Math.round(w / ratio);
      const resized = sharp(master).resize(w, h, { kernel: 'lanczos3' });
      const base = `${entry.slug}-${w}`;
      await Promise.all([
        resized.clone().avif({ quality: 52, effort: 3, chromaSubsampling: '4:2:0' })
          .toFile(path.join(outDir, `${base}.avif`)).then(() => { files.avif[w] = `/img/${base}.avif`; }),
        resized.clone().webp({ quality: 74, effort: 4, smartSubsample: true })
          .toFile(path.join(outDir, `${base}.webp`)).then(() => { files.webp[w] = `/img/${base}.webp`; }),
      ]);
      if (w === jpegAt) {
        await resized.clone().jpeg({ quality: 78, mozjpeg: true, progressive: true })
          .toFile(path.join(outDir, `${base}.jpg`));
        files.jpeg[w] = `/img/${base}.jpg`;
      }
    }

    const lqipBuf = await sharp(master).resize(24, Math.max(1, Math.round(24 / ratio)))
      .blur(1.4).webp({ quality: 32, alphaQuality: 0 }).toBuffer();

    manifest.push({
      slug: entry.slug,
      role: entry.role,
      category: entry.category ?? null,
      title: entry.title ?? null,
      place: entry.place ?? null,
      year: entry.year ?? null,
      alt: entry.alt,
      width: W,
      height: H,
      ratio: Number(ratio.toFixed(6)),
      widths,
      jpegWidth: jpegAt,
      lqip: `data:image/webp;base64,${lqipBuf.toString('base64')}`,
      isPlaceholder: !(await findSource(entry.slug)),
    });

    process.stdout.write(`  · ${entry.slug.padEnd(20)} ${W}×${H}  ${widths.length} Breiten\n`);
  }

  await writeFile(
    path.join(root, 'src', 'data', 'media.generated.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), items: manifest }, null, 2) + '\n',
  );

  // Social sharing card, derived from the hero plate.
  const hero = manifest.find((m) => m.slug === 'hero-main');
  if (hero) {
    const og = await sharp(path.join(outDir, `${hero.slug}-1600.webp`))
      .resize(1200, 630, { fit: 'cover', position: 'centre' })
      .modulate({ brightness: 0.82 })
      .composite([{
        input: Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
          <text x="84" y="330" font-family="Instrument Serif, DejaVu Serif, serif" font-size="92" fill="#f4f1ec">Momente, die bleiben.</text>
          <text x="86" y="392" font-family="Inter Tight, DejaVu Sans, sans-serif" font-size="26" letter-spacing="6" fill="#cfc7bb">STUDIO CONFLUENTES — FOTOGRAFIE KOBLENZ</text>
          <rect x="84" y="236" width="72" height="3" fill="#c9a227"/>
        </svg>`),
        top: 0, left: 0,
      }])
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    await writeFile(path.join(root, 'public', 'og-image.jpg'), og);
  }

  console.log(`\n✓ ${manifest.length} Bilder in ${((Date.now() - started) / 1000).toFixed(1)}s`);
}

main().catch((err) => { console.error(err); process.exit(1); });
