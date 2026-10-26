// Renders one language version of the page to a static HTML string.
import { readFileSync } from 'node:fs';

const photos = JSON.parse(readFileSync(new URL('./photos.json', import.meta.url)));

const PHONE = '053-334-5032';
const PHONE_TEL = '+972533345032';
const EMAIL = 'ghands.sam@gmail.com';
const WA = 'https://wa.me/972533345032';

// Gallery order: Apple Herzliya sits 6th so it doesn't repeat right under the hero.
const PROJECTS = [
  { key: 'checkpoint', cat: 'walls', files: ['checkpoint-facade-full', 'checkpoint-facade-closeup', 'checkpoint-rooftop-wall', 'checkpoint-entrance-wall'] },
  { key: 'office', cat: 'offices', files: ['office-01'] },
  { key: 'haifa', cat: 'walls', files: ['apple-haifa-lobby-wall'] },
  { key: 'restaurant', cat: 'outdoor', files: ['restaurant-01'] },
  { key: 'caesarea', cat: 'walls', files: ['caesarea-outdoor-wall'] },
  { key: 'herzliya', cat: 'walls', files: ['apple-herzliya-atrium-wall'] },
  { key: 'office', cat: 'offices', files: ['office-02'] },
  { key: 'restaurant', cat: 'outdoor', files: ['restaurant-02'] },
  { key: 'office', cat: 'offices', files: ['office-03'] },
  { key: 'office', cat: 'offices', files: ['office-04'] },
  { key: 'restaurant', cat: 'outdoor', files: ['restaurant-03'] },
  { key: 'office', cat: 'offices', files: ['office-05'] },
];
export const PAGE_SIZE = 6;

const ICONS = [
  'M5 19c0-8 6-14 14-14 0 8-6 14-14 14ZM5 19l7-7',
  'M6 4h12l3 5-9 11L3 9ZM3 9h18M9 4l3 16 3-16',
  'M3 17l6-6 4 4 8-8M15 7h6v6',
  'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6ZM8.5 12l2.5 2.5 4.5-5',
];
const SERVICE_VALUES = ['new-wall', 'maintenance', 'office-plants', 'other'];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');

function srcset(name) {
  return photos[name].widths.map((w) => `/photos/${name}-${w}.webp ${w}w`).join(', ');
}
function largest(name) {
  return `/photos/${name}-${photos[name].widths.at(-1)}.webp`;
}
function picture(name, alt, { sizes, cls = '', eager = false } = {}) {
  const { width, height } = photos[name];
  return `<picture><source type="image/webp" srcset="${srcset(name)}" sizes="${sizes}"><img src="/photos/${name}.jpg" alt="${esc(alt)}" width="${width}" height="${height}"${cls ? ` class="${cls}"` : ''}${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}></picture>`;
}

const LOGO_PATHS = (c) => `<path fill="${c[0]}" d="M375 391 C336 398 298 379 265 348 C237 322 224 291 221 252 L220 201 C220 188 228 185 234 196 C242 211 244 238 247 254 C251 278 266 296 292 306 C280 292 260 273 259 261 C258 251 265 246 273 252 L313 285 C350 303 371 338 375 391 Z"/><path fill="${c[1]}" d="M425 391 C464 398 502 379 535 348 C563 322 576 291 579 252 L580 201 C580 188 572 185 566 196 C558 211 556 238 553 254 C549 278 534 296 508 306 C520 292 540 273 541 261 C542 251 535 246 527 252 L487 285 C450 303 429 338 425 391 Z"/><path fill="${c[2]}" d="M375 232 C316 230 274 183 281 117 C340 130 385 169 375 232 Z"/><path fill="${c[3]}" d="M405 186 C368 144 392 93 444 61 C465 117 450 160 405 186 Z"/><path fill="${c[4]}" d="M424 257 C424 197 467 164 527 168 C523 223 488 262 424 257 Z"/><path d="M405 389 C385 353 387 314 396 272 C402 237 400 211 410 183 M396 279 C389 259 381 245 371 230 M392 321 C402 292 415 271 432 253" fill="none" stroke="${c[5]}" stroke-width="${c[6]}" stroke-linecap="round"/>`;
const LOGO_LIGHT = ['#285A38', '#79A93E', '#477C3E', '#83AC41', '#356831', '#477C3E', 14];
const LOGO_DARK = ['#C8A04A', '#E3C886', '#DCE8CF', '#A9C98F', '#F7F4EC', '#DCE8CF', 12];

const ICON_PHONE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>';
const ICON_MAIL = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>';
const WA_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z';
const waIcon = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${WA_PATH}"/></svg>`;

const sectionHead = (title, { lead = '', light = false, id = '' } = {}) => `<div class="sec-head" data-reveal>
      <span class="rule"></span>
      <h2${id ? ` id="${id}"` : ''}${light ? ' class="on-dark"' : ''}>${esc(title)}</h2>${lead ? `\n      <p class="lead">${esc(lead)}</p>` : ''}
    </div>`;

export function renderPage(t, lang, siteUrl) {
  const rtl = lang === 'he';
  const self = lang === 'he' ? '/' : '/en/';
  const other = lang === 'he' ? '/en/' : '/';
  const abs = (p) => (siteUrl ? siteUrl.replace(/\/$/, '') + p : p);
  const waFloat = `${WA}?text=${encodeURIComponent(t.waText)}`;
  const nav = [['#services', t.navServices], ['#projects', t.navProjects], ['#process', t.navProcess], ['#faq', t.navFaq], ['#contact', t.navContact]];
  const faqs = t.faqs.filter(([, a]) => !a.startsWith('[')); // unfilled placeholders stay hidden until real copy exists

  // Lightbox data: every photo, tagged with its project category.
  let photoIndex = 0;
  const tiles = PROJECTS.map((p, i) => {
    const cap = t.caps[p.key];
    const start = photoIndex;
    photoIndex += p.files.length;
    const n = p.files.length;
    return `<button type="button" class="tile" data-cat="${p.cat}" data-start="${start}" data-index="${i}" aria-label="${esc(`${t.enlarge}: ${cap}`)}">
        ${n > 1 ? `<span class="tile-badge">${n} ${esc(t.photos)}</span>` : ''}
        ${picture(p.files[0], cap, { sizes: '(min-width: 1000px) 400px, (min-width: 620px) 50vw, 100vw' })}
        <span class="tile-cap">${esc(cap)}</span>
      </button>`;
  }).join('\n      ');
  const lightboxData = PROJECTS.flatMap((p) => p.files.map((f) => ({ src: largest(f), cap: t.caps[p.key], cat: p.cat })));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: lang === 'he' ? 'ידיים ירוקות' : 'Green Hands',
    alternateName: lang === 'he' ? 'Green Hands' : 'ידיים ירוקות',
    description: t.description,
    telephone: PHONE_TEL,
    email: EMAIL,
    image: abs('/og-image.jpg'),
    ...(siteUrl ? { url: abs(self) } : {}),
  };

  return `<!doctype html>
<html lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.description)}">
<meta name="theme-color" content="#1E4D2B">
${siteUrl ? `<link rel="canonical" href="${abs(self)}">\n` : ''}<link rel="alternate" hreflang="he" href="${abs('/')}">
<link rel="alternate" hreflang="en" href="${abs('/en/')}">
<link rel="alternate" hreflang="x-default" href="${abs('/')}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.ogDescription)}">
<meta property="og:image" content="${abs('/og-image.jpg')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${rtl ? 'he_IL' : 'en_US'}">
<meta property="og:locale:alternate" content="${rtl ? 'en_US' : 'he_IL'}">
${siteUrl ? `<meta property="og:url" content="${abs(self)}">\n` : ''}<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800&display=swap" rel="stylesheet">
<link rel="preload" as="image" type="image/webp" imagesrcset="${srcset('apple-herzliya-atrium-wall')}" imagesizes="(min-width: 900px) 64vw, 100vw" fetchpriority="high">
<link rel="stylesheet" href="/styles.css">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
<a class="skip" href="#main">${esc(t.skip)}</a>

<header class="site-header">
  <div class="container header-row">
    <a href="#top" class="brand" aria-label="${esc(t.logoAria)}">
      <svg width="46" height="46" viewBox="200 25 400 400" aria-hidden="true">${LOGO_PATHS(LOGO_LIGHT)}</svg>
      <span class="wordmark"><span class="wm-he">ידיים ירוקות</span><span class="wm-en">GREEN HANDS</span></span>
    </a>
    <nav class="nav-desktop" aria-label="${esc(t.navAria)}">
      ${nav.map(([href, label]) => `<a href="${href}">${esc(label)}</a>`).join('\n      ')}
    </nav>
    <div class="header-actions">
      <a class="pill-btn lang" href="${other}" hreflang="${t.langSwitchLang}" lang="${t.langSwitchLang}" aria-label="${esc(t.langAria)}">${esc(t.langSwitch)}</a>
      <a class="circle-btn" href="tel:${PHONE_TEL}" aria-label="${esc(t.callAria)}">${ICON_PHONE}</a>
      <a class="cta-sm" href="#contact"><span class="cta-long">${esc(t.cta)}</span><span class="cta-short">${esc(t.ctaShort)}</span></a>
      <button type="button" class="circle-btn burger" aria-label="${esc(t.menuAria)}" aria-expanded="false" aria-controls="mobile-nav">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path class="burger-open" d="M4 7h16M4 12h16M4 17h16"/><path class="burger-close" d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
  </div>
  <nav id="mobile-nav" class="nav-mobile" aria-label="${esc(t.navAria)}" hidden>
    ${nav.map(([href, label]) => `<a href="${href}">${esc(label)}</a>`).join('\n    ')}
  </nav>
</header>

<main id="main">
<section id="top" class="hero">
  <div class="hero-media">
    ${picture('apple-herzliya-atrium-wall', t.heroAlt, { sizes: '(min-width: 900px) 64vw, 100vw', eager: true })}
    <div class="hero-fade"></div>
    <span class="hero-cap">${esc(t.heroCaption)}</span>
  </div>
  <div class="container hero-body">
    <div class="hero-text">
      <span class="eyebrow"><span class="eyebrow-rule"></span>Good Vibes, Better Business</span>
      <h1>${esc(t.heroTitle)}</h1>
      <p class="hero-sub">${esc(t.heroSub)}</p>
      <div class="hero-ctas">
        <a class="btn-primary" href="#contact">${esc(t.cta)}</a>
        <a class="wa-link" href="${WA}" target="_blank" rel="noopener">${waIcon(20)}${esc(t.waBtn)}</a>
      </div>
    </div>
  </div>
</section>

<section class="clients" aria-label="${esc(t.clientsTitle)}">
  <div class="container clients-row">
    <span class="clients-label">${esc(t.clientsTitle)}</span>
    <div class="clients-names">
      <span>${esc(t.client1)}</span><span class="dot" aria-hidden="true"></span><span>${esc(t.client2)}</span><span class="dot" aria-hidden="true"></span><span>${esc(t.client3)}</span>
    </div>
  </div>
</section>

<section class="container section intro">
  <div class="sec-head" data-reveal>
    <span class="rule"></span>
    <h2>${esc(t.introTitle)}</h2>
    <p class="body-lg">${esc(t.introBody)}</p>
  </div>
  <div class="benefits" data-reveal>
    ${t.benefits.map(([title, sub], i) => `<div class="benefit">
      <span class="benefit-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[i]}"/></svg></span>
      <div><b>${esc(title)}</b><span>${esc(sub)}</span></div>
    </div>`).join('\n    ')}
  </div>
</section>

<section id="services" class="band-sand">
  <div class="container section stack-48">
    ${sectionHead(t.servicesTitle, { lead: t.servicesLead })}
    <div class="services-grid" data-reveal>
      ${t.services.map(([title, body], i) => `<article class="service">
        <span class="num">${pad(i + 1)}</span>
        <h3>${esc(title)}</h3>
        <p>${esc(body)}</p>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>

<section id="projects" class="container section stack-32">
  <div class="sec-head" data-reveal>
    <span class="rule"></span>
    <h2>${esc(t.projectsTitle)}</h2>
    <div class="filters" role="group" aria-label="${esc(t.filterAria)}">
      ${['all', 'walls', 'offices', 'outdoor'].map((id) => `<button type="button" class="filter" data-filter="${id}" aria-pressed="${id === 'all'}">${esc(t.tabs[id])}</button>`).join('\n      ')}
    </div>
  </div>
  <div class="masonry">
      ${tiles}
  </div>
  <div class="more-row"><button type="button" class="btn-outline show-more" data-label="${esc(t.showMore)}"></button></div>
</section>

<section id="process" class="hairline-top">
  <div class="container section stack-48">
    ${sectionHead(t.processTitle)}
    <ol class="steps" data-reveal>
      ${t.steps.map(([title, body], i) => `<li>
        <span class="step-num">${pad(i + 1)}</span>
        <h3>${esc(title)}</h3>
        <p>${esc(body)}</p>
      </li>`).join('\n      ')}
    </ol>
  </div>
</section>

<section class="quote-band">
  ${picture('checkpoint-rooftop-wall', '', { sizes: '100vw', cls: 'quote-bg' })}
  <div class="quote-overlay"></div>
  <figure class="container quote-body" data-reveal>
    <span class="rule"></span>
    <blockquote>${esc(t.quote)}</blockquote>
  </figure>
</section>

<section id="faq" class="container section faq">
  ${sectionHead(t.faqTitle)}
  <div class="faq-list" data-reveal>
    ${faqs.map(([q, a], i) => `<div class="faq-item">
      <h3><button type="button" class="faq-q" aria-expanded="${i === 0}" aria-controls="faq-a-${i}" id="faq-q-${i}">
        <span>${esc(q)}</span>
        <span class="faq-icon"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M7 2v10M2 7h10"/></svg></span>
      </button></h3>
      <div class="faq-a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}"${i === 0 ? '' : ' hidden'}><p>${esc(a)}</p></div>
    </div>`).join('\n    ')}
  </div>
</section>

<section id="contact" class="band-forest">
  <div class="container section contact">
    <div class="sec-head" data-reveal>
      <span class="rule"></span>
      <h2 class="on-dark">${esc(t.contactTitle)}</h2>
      <div class="contact-rows">
        <a href="tel:${PHONE_TEL}"><span class="ring">${ICON_PHONE}</span><span dir="ltr">${PHONE}</span></a>
        <a href="${WA}" target="_blank" rel="noopener"><span class="ring">${waIcon(18)}</span>${esc(t.waLabel)}</a>
        <a href="mailto:${EMAIL}"><span class="ring">${ICON_MAIL}</span><span dir="ltr">${EMAIL}</span></a>
      </div>
    </div>

    <div class="form-card" data-reveal>
      <form name="quote" method="POST" action="${self}?sent=1#contact" data-netlify="true" netlify-honeypot="bot-field" class="quote-form" novalidate>
        <input type="hidden" name="form-name" value="quote">
        <input type="hidden" name="lang" value="${lang}">
        <p class="hp" aria-hidden="true"><label>Leave empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
        <label class="field">${esc(t.fName)}<input name="name" required autocomplete="name"></label>
        <label class="field"><span>${esc(t.fCompany)} <span class="opt">${esc(t.optional)}</span></span><input name="company" autocomplete="organization"></label>
        <label class="field">${esc(t.fPhone)}<input name="phone" type="tel" required autocomplete="tel" dir="auto" inputmode="tel" pattern="^\\+?[0-9][0-9\\s\\-]{7,14}$" title="${esc(t.phoneHint)}"></label>
        <label class="field"><span>${esc(t.fEmail)} <span class="opt">${esc(t.optional)}</span></span><input name="email" type="email" autocomplete="email" dir="auto"></label>
        <label class="field full">${esc(t.fService)}
          <select name="service">
            ${t.serviceOptions.map((label, i) => `<option value="${SERVICE_VALUES[i]}">${esc(label)}</option>`).join('\n            ')}
          </select>
        </label>
        <label class="field full"><span>${esc(t.fMessage)} <span class="opt">${esc(t.optional)}</span></span><textarea name="message" rows="4"></textarea></label>
        <p class="full next-step">${esc(t.nextStep)}</p>
        <p class="full form-error" role="alert" hidden>${esc(t.formError)}</p>
        <div class="full"><button type="submit" class="btn-primary submit" data-sending="${esc(t.sending)}">${esc(t.fSubmit)}</button></div>
      </form>
      <div class="form-success" role="status" hidden>
        <span class="check"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
        <h3 class="thanks" data-thanks="${esc(t.thanks)}">${esc(t.thanks)}!</h3>
        <p>${esc(t.sentBody)}</p>
        <button type="button" class="btn-outline again">${esc(t.sentAgain)}</button>
      </div>
    </div>
  </div>
</section>
</main>

<footer class="site-footer">
  <div class="container footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <div class="brand">
          <svg width="56" height="56" viewBox="200 25 400 400" aria-hidden="true">${LOGO_PATHS(LOGO_DARK)}</svg>
          <span class="wordmark"><span class="wm-he">ידיים ירוקות</span><span class="wm-en">GREEN HANDS</span></span>
        </div>
        <span class="tagline">${esc(t.tagline)}</span>
      </div>
      <div class="footer-contact">
        <a href="tel:${PHONE_TEL}"><span dir="ltr">${PHONE}</span></a>
        <a href="mailto:${EMAIL}"><span dir="ltr">${EMAIL}</span></a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>${esc(t.footerLine)}</span>
      <span>${esc(t.copyright)}</span>
    </div>
  </div>
</footer>

<a class="wa-float" href="${waFloat}" target="_blank" rel="noopener" aria-label="${esc(t.waTip)}">
  ${waIcon(28)}
  <span class="wa-tip" aria-hidden="true">${esc(t.waTip)}</span>
</a>

<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="" hidden>
  <button type="button" class="lb-btn lb-close" aria-label="${esc(t.close)}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
  <img class="lb-img" alt="">
  <div class="lb-controls">
    <button type="button" class="lb-btn lb-prev" aria-label="${esc(t.prev)}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${rtl ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'}"/></svg></button>
    <span class="lb-cap"></span>
    <button type="button" class="lb-btn lb-next" aria-label="${esc(t.next)}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${rtl ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}"/></svg></button>
  </div>
</div>

<script>window.GH = ${JSON.stringify({ photos: lightboxData, pageSize: PAGE_SIZE, rtl })};</script>
<script src="/main.js" defer></script>
</body>
</html>
`;
}
