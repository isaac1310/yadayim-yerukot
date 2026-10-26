// Builds the static site into dist/: Hebrew at /, English at /en/.
// No dependencies, so Netlify can run it directly. Netlify sets URL to the site's primary address.
import { readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';
import path from 'node:path';
import { renderPage } from '../src/page.mjs';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const siteUrl = process.env.SITE_URL || process.env.URL || '';

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, 'en'), { recursive: true });
await cp(path.join(root, 'public'), dist, { recursive: true });
await cp(path.join(root, 'src/styles.css'), path.join(dist, 'styles.css'));
await cp(path.join(root, 'src/main.js'), path.join(dist, 'main.js'));

for (const lang of ['he', 'en']) {
  const t = JSON.parse(await readFile(path.join(root, `src/i18n/${lang}.json`), 'utf8'));
  const out = lang === 'he' ? 'index.html' : 'en/index.html';
  await writeFile(path.join(dist, out), renderPage(t, lang, siteUrl));
}

const abs = (p) => (siteUrl ? siteUrl.replace(/\/$/, '') + p : p);
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${abs('/sitemap.xml')}\n` : ''}`);
if (siteUrl) {
  await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${['/', '/en/'].map((p) => `  <url><loc>${abs(p)}</loc><xhtml:link rel="alternate" hreflang="he" href="${abs('/')}"/><xhtml:link rel="alternate" hreflang="en" href="${abs('/en/')}"/></url>`).join('\n')}
</urlset>
`);
}
console.log(`Built dist/ (site URL: ${siteUrl || 'none, relative links'})`);
