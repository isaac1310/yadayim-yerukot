// One-off image pipeline: run `npm run images` after adding or changing photos.
// Outputs are committed, so the Netlify build itself needs no dependencies.
import sharp from 'sharp';
import { readdir, mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const srcDir = path.join(root, 'photos-src');
const outDir = path.join(root, 'public/photos');
const brandDir = path.join(root, 'public/brand');
const WIDTHS = [480, 960, 1600];

await mkdir(outDir, { recursive: true });
const manifest = {};

for (const file of (await readdir(srcDir)).filter((f) => f.endsWith('.jpg')).sort()) {
  const base = file.replace(/\.jpg$/, '');
  const img = sharp(path.join(srcDir, file)).rotate();
  const { width, height } = await img.metadata();
  const widths = WIDTHS.filter((w) => w < width).concat(width > WIDTHS.at(-1) ? [] : [width]);
  const unique = [...new Set(widths)].sort((a, b) => a - b);
  for (const w of unique) {
    await sharp(path.join(srcDir, file)).rotate().resize({ width: w }).webp({ quality: 78 }).toFile(path.join(outDir, `${base}-${w}.webp`));
  }
  const fallbackW = Math.min(width, 1200);
  await sharp(path.join(srcDir, file)).rotate().resize({ width: fallbackW }).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(outDir, `${base}.jpg`));
  manifest[base] = { width, height, widths: unique };
  console.log(`${file}: ${width}x${height} -> ${unique.join(', ')}`);
}
await writeFile(path.join(root, 'src/photos.json'), JSON.stringify(manifest, null, 2) + '\n');

// Favicons
const fav = await readFile(path.join(brandDir, 'favicon.svg'));
await sharp(fav, { density: 400 }).resize(180, 180).png().toFile(path.join(root, 'public/apple-touch-icon.png'));
await sharp(fav, { density: 400 }).resize(32, 32).png().toFile(path.join(root, 'public/favicon-32.png'));

// Open Graph image: hero photo + logo tile
const icon = await sharp(await readFile(path.join(brandDir, 'icon-dark.svg')), { density: 300 }).resize(150, 150).png().toBuffer();
const tile = await sharp({ create: { width: 190, height: 190, channels: 4, background: '#1E4D2B' } })
  .composite([{ input: icon, gravity: 'center' }]).png().toBuffer();
await sharp(path.join(srcDir, 'apple-herzliya-atrium-wall.jpg'))
  .resize(1200, 630, { fit: 'cover', position: 'top' })
  .composite([{ input: tile, top: 40, left: 970 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(root, 'public/og-image.jpg'));
console.log('favicons + og-image done');
