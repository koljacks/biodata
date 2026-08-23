#!/usr/bin/env node
/**
 * Biodata Maker — language landing page generator
 * ===============================================
 * The business case for this project is search traffic on queries like
 * "marriage biodata format in Marathi". A single-page app cannot rank for
 * twelve of those. This writes one real page per language, each with its
 * own title, description, structured data and unique written guidance,
 * booting the app with that language preselected.
 *
 * No dependencies. Node 18+.   node build.js
 */
const fs = require('fs');
const path = require('path');

const BASE = (process.env.SITE_URL || 'https://koljacks.github.io/biodata').replace(/\/+$/, '');
const SRC = process.env.SRC || 'index.html';
const SITE = 'Biodata Maker';

const html = fs.readFileSync(SRC, 'utf8');
const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/* Each entry carries genuinely different copy. Twelve pages of the same
   paragraph with a word swapped is duplicate content, and Google treats it
   as such — the whole point is that these read differently. */
const LANGS = [
  { code:'hi', name:'Hindi', native:'हिन्दी', region:'North India',
    speakers:'over 500 million',
    note:'Hindi biodatas are usually shared as a printed page or a WhatsApp image, and most families expect the horoscope details — gotra, rashi, nakshatra and manglik status — on the same sheet rather than separately.',
    tip:'Write names with the honorific families use: Shri and Smt. for parents. It reads as respectful and is noticed when it is missing.' },
  { code:'mr', name:'Marathi', native:'मराठी', region:'Maharashtra',
    speakers:'around 83 million',
    note:'A Marathi biodata often opens with ॥ श्री गणेशाय नमः ॥ and, in many families, includes both kuldaivat and gotra. Deshastha, Kokanastha and CKP families each have their own conventions about how much detail to give.',
    tip:'Mention your native place (मूळ गाव) even if you have lived in Mumbai or Pune all your life — it is one of the first things elders look for.' },
  { code:'ta', name:'Tamil', native:'தமிழ்', region:'Tamil Nadu',
    speakers:'about 79 million',
    note:'Tamil families place particular weight on horoscope matching, so exact time and place of birth matter more here than in most formats. Nakshatra and rasi are often the first two lines read.',
    tip:'If a jathagam is being sent separately, still put the birth time on the biodata — it saves a follow-up message.' },
  { code:'te', name:'Telugu', native:'తెలుగు', region:'Andhra Pradesh and Telangana',
    speakers:'roughly 83 million',
    note:'Telugu biodatas commonly include gotram and the family deity, and it is normal to name both the maternal and paternal side when describing the family.',
    tip:'Kuja dosham status is usually expected. Saying "no" plainly is better than leaving it blank, which reads as evasive.' },
  { code:'gu', name:'Gujarati', native:'ગુજરાતી', region:'Gujarat',
    speakers:'about 56 million',
    note:'Gujarati families often circulate biodatas within community groups and samaj networks, so a clean, legible layout that survives being forwarded as an image matters more than elaborate decoration.',
    tip:'Business families frequently describe the family occupation rather than a job title. Both are fine — say which it is.' },
  { code:'bn', name:'Bengali', native:'বাংলা', region:'West Bengal and Bangladesh',
    speakers:'over 230 million',
    note:'Bengali biodatas tend to be less horoscope-heavy than southern formats and give more room to education and profession. Many families skip caste details entirely.',
    tip:'If horoscope details are not relevant to your family, use the international style here — it removes those fields cleanly rather than leaving gaps.' },
  { code:'kn', name:'Kannada', native:'ಕನ್ನಡ', region:'Karnataka',
    speakers:'around 44 million',
    note:'Kannada biodatas usually carry gotra and nakshatra, and many families include the kula devaru. Layout is typically plain and factual.',
    tip:'Bengaluru-based candidates should still list their native district — it helps families place the family, which matters more than the current city.' },
  { code:'ml', name:'Malayalam', native:'മലയാളം', region:'Kerala',
    speakers:'about 35 million',
    note:'Malayalam biodatas often note the star (nakshatram) prominently, and for Christian families the parish and denomination usually appear in place of caste details.',
    tip:'Many Kerala families work abroad. If that applies, put the work country in the work location field — it changes how the match is considered.' },
  { code:'pa', name:'Punjabi', native:'ਪੰਜਾਬੀ', region:'Punjab',
    speakers:'roughly 33 million',
    note:'Punjabi biodatas commonly open with ੴ, list the gotra, and give the family village or pind alongside the current city.',
    tip:'Height is asked about early and often. Putting it near the top saves several messages.' },
  { code:'or', name:'Odia', native:'ଓଡ଼ିଆ', region:'Odisha',
    speakers:'about 35 million',
    note:'Odia biodatas usually include gotra and rashi and give a full account of the family — parents, siblings and native place — before career details.',
    tip:'Give your father\'s occupation even if he has retired. Families read it as background, not current income.' },
  { code:'ur', name:'Urdu', native:'اردو', region:'across India and Pakistan',
    speakers:'over 70 million',
    note:'Urdu biodatas read right to left and typically open with بِسْمِ اللهِ. Caste and horoscope fields are usually not used; family background, education and profession carry the weight instead.',
    tip:'Use the international style to remove the horoscope fields, then add any details your family expects using the custom field option.' },
  { code:'en', name:'English', native:'English', region:'across India and the diaspora',
    speakers:'the widest circulation',
    note:'An English biodata travels furthest — it can be sent to relatives anywhere and read by every generation. Many families make one English version and one in the mother tongue.',
    tip:'Keep it to a single page. English biodatas have a habit of drifting into CV territory, which is the most common mistake in this format.' },
];

function page(l) {
  const title = `Marriage Biodata Format in ${l.name} — free maker with photo`;
  const desc = `Make a marriage biodata in ${l.name} (${l.native}) free. Printable A4 with photo, ready in minutes. Nothing is uploaded — it all runs in your browser.`;
  const url = `${BASE}/${l.code}/`;

  const faq = [
    [`How do I make a marriage biodata in ${l.name}?`,
     `Choose ${l.native} above, fill in your details, pick a design and download it as an image or a printable PDF. It takes a few minutes and costs nothing.`],
    [`Is this ${l.name} biodata maker free?`,
     `Yes — every language and design is free, with no watermark and no account. Nothing is charged at any point.`],
    [`Can I add a photo?`,
     `Yes. Your photo is processed on your own device and is never uploaded, so nobody else can see it.`],
    [`Can I print it?`,
     `Yes. The PDF is A4 sized, so any home printer or print shop can handle it without resizing.`],
  ];

  const schema = [
    { '@context':'https://schema.org', '@type':'WebApplication',
      name:`Marriage Biodata Maker — ${l.name}`, url, applicationCategory:'BusinessApplication',
      operatingSystem:'Any (web browser)', inLanguage:l.code,
      offers:{ '@type':'Offer', price:'0', priceCurrency:'INR' }, isAccessibleForFree:true },
    { '@context':'https://schema.org', '@type':'FAQPage',
      mainEntity: faq.map(([q,a]) => ({ '@type':'Question', name:q,
        acceptedAnswer:{ '@type':'Answer', text:a } })) },
    { '@context':'https://schema.org', '@type':'HowTo',
      name:`How to make a marriage biodata in ${l.name}`,
      step:[
        { '@type':'HowToStep', name:'Choose the language', text:`Select ${l.native} so every label appears in ${l.name}.` },
        { '@type':'HowToStep', name:'Fill in your details', text:'Work through personal, horoscope, education, family and contact details. Blank fields are left out.' },
        { '@type':'HowToStep', name:'Add a photo and pick a design', text:'Upload a clear photo and choose one of six layouts.' },
        { '@type':'HowToStep', name:'Download', text:'Save it as an image for WhatsApp, or as an A4 PDF for printing.' },
      ] },
  ];

  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  out = out.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(desc)}">`);
  out = out.replace('<html lang="en">', `<html lang="${l.code}">`);

  const head = `
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary">
${LANGS.map(x => `<link rel="alternate" hreflang="${x.code}" href="${BASE}/${x.code}/">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${BASE}/">
${schema.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}
<script>window.__LANG__ = ${JSON.stringify(l.code)};</script>
</head>`;
  out = out.replace('</head>', head);

  /* Swap the hero headline for one matching the search intent. These target
     id hooks rather than the text itself — the previous version matched on
     wording and silently failed the moment the copy changed, leaving every
     language page with the generic English headline. */
  const h1 = `<h1 id="heroH1">Marriage biodata format<br>in <em>${esc(l.native)}</em></h1>`;
  const before = out;
  out = out.replace(/<h1 id="heroH1">[\s\S]*?<\/h1>/, h1);
  if (out === before) throw new Error('hero h1 hook not found — check index.html');

  const p = `<p id="heroP">Make a printable marriage biodata in ${esc(l.name)} with your photo — free, no signup, and nothing you type ever leaves your phone. Spoken by ${esc(l.speakers)}, ${esc(l.name)} is widely used for biodatas ${esc(l.region)}.</p>`;
  const before2 = out;
  out = out.replace(/<p id="heroP">[\s\S]*?<\/p>/, p);
  if (out === before2) throw new Error('hero p hook not found — check index.html');

  /* unique written guidance per language, placed in the crawlable copy */
  /* Language pages live one level down, so the footer's "./about/" links
     would resolve to /hi/about/ and 404. Point them at the root copies. */
  out = out.replace(/href="\.\/(about|privacy|terms|contact)\//g, `href="${BASE}/$1/`);

  const extra = `
  <h2>Biodata conventions in ${esc(l.name)}</h2>
  <p>${esc(l.note)}</p>
  <h3>One thing worth getting right</h3>
  <p>${esc(l.tip)}</p>
  <h3>Common questions</h3>
  <div class="faq">
    ${faq.map(([q,a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n    ')}
  </div>
  <h3>Other languages</h3>
  <p>${LANGS.filter(x => x.code !== l.code)
      .map(x => `<a href="${BASE}/${x.code}/">Biodata in ${esc(x.name)}</a>`).join(' · ')}</p>
`;
  out = out.replace('<h2>Why a browser-based tool</h2>', extra + '\n  <h2>Why a browser-based tool</h2>');

  return out;
}

/* ── trust pages ────────────────────────────────────────────────────────
   A site that asks for a family's full details, birth times and a phone
   number needs to say plainly what happens to them. These also matter if
   ads or payments are ever added.
   ──────────────────────────────────────────────────────────────────── */
const CONTACT = process.env.CONTACT_EMAIL || 'you@example.com';

function trustPage(slug, title, desc, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(title)} — ${SITE}</title>
<meta name="description" content="${esc(desc)}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="${BASE}/${slug}/">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%233D1B2E'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Karla:wght@400;600&display=swap" rel="stylesheet">
<style>
:root{--paper:#FBF6F2;--card:#fff;--ink:#2B1520;--muted:#6E5A63;--line:#E7DBD2;--plum:#3D1B2E;--gold:#B0842C}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font-family:Karla,system-ui,sans-serif;font-size:16px;line-height:1.7}
.w{max-width:720px;margin:0 auto;padding:34px 20px 70px}
.card{background:var(--card);border-radius:16px;padding:34px;box-shadow:0 1px 2px rgba(43,21,32,.05),0 10px 30px -18px rgba(43,21,32,.35)}
h1{font-family:Fraunces,serif;font-size:clamp(27px,5vw,38px);color:var(--plum);margin:0 0 8px}
h2{font-family:Fraunces,serif;font-size:19px;color:var(--plum);margin:30px 0 8px}
p,li{color:var(--muted)} a{color:var(--plum)} ul{padding-left:20px}
.back{display:inline-block;margin-bottom:20px;color:var(--muted);text-decoration:none;font-size:14px}
.upd{font-size:13px;color:var(--muted);margin-top:30px;padding-top:15px;border-top:1px solid var(--line)}
</style>
</head>
<body><div class="w">
<a class="back" href="${BASE}/">← ${SITE}</a>
<div class="card"><h1>${esc(title)}</h1>
${body}
<p class="upd">Last updated ${new Date().toISOString().slice(0,10)}.</p>
</div></div></body></html>`;
}

const TRUST = [
  ['about','About','What this biodata maker is and why it is free.',`
    <p>${SITE} makes printable marriage biodatas in twelve Indian languages, free, with no account and no watermark.</p>
    <h2>Why it exists</h2>
    <p>A marriage biodata is a small document with a large job. Most people making one are working from a Word template a cousin sent, or paying a print shop a few hundred rupees for a layout they cannot edit afterwards. Neither is a good experience, and neither handles Marathi, Tamil or Urdu well.</p>
    <h2>Why it is free</h2>
    <p>Because it costs almost nothing to run. The whole thing works inside your browser — there is no server processing your details, so there is no bill that has to be passed on to you.</p>
    <h2>Who made it</h2>
    <p>One person, as a side project. Suggestions and corrections are genuinely welcome, particularly on the language label sets: <a href="mailto:${CONTACT}">${CONTACT}</a>.</p>`],

  ['privacy','Privacy policy','How your details and photo are handled. Short version: they never leave your device.',`
    <p>This is specific rather than vague, because a biodata contains unusually sensitive information.</p>
    <h2>What you enter</h2>
    <p>Your name, birth details, family details, photograph and phone number are processed entirely inside your own browser. They are never uploaded, never transmitted, and never seen by any server. There is no database here for them to be stored in.</p>
    <h2>Your photograph</h2>
    <p>The photo you add is read by your own device, resized by your own device, and drawn into the biodata by your own device. It does not travel anywhere.</p>
    <h2>Saved drafts</h2>
    <p>So that you do not lose work, your draft is saved to your browser's local storage — a private area on your own device. Clearing your browser data removes it. Anyone with access to your unlocked device could open the page and see the draft, so use the Clear button on a shared computer.</p>
    <h2>Analytics and cookies</h2>
    ${process.env.ADS === '1'
      ? `<p>No analytics scripts of this site's own. This site does carry advertising, and the ad network sets its own cookies and may use them to choose which adverts you see. Nothing you type into the biodata is shared with it — the advert code cannot read the form or your photograph.</p>
    <p>You can opt out of personalised advertising at <a href="https://myadcenter.google.com/">Google's My Ad Center</a>, or block third-party cookies in your browser. The tool works exactly the same either way.</p>`
      : `<p>No analytics scripts. No tracking cookies. No advertising.</p>`}
    <h2>Third parties</h2>
    <p>Fonts load from Google Fonts, and the download feature loads two open-source libraries from public CDNs when you press the button. These see your IP address, as with any website loading external files. None of your biodata content is shared with them.</p>
    <h2>Questions</h2>
    <p>Email <a href="mailto:${CONTACT}">${CONTACT}</a>.</p>`],

  ['terms','Terms of use','The terms under which this free tool is provided.',`
    <p>Short and in plain language.</p>
    <h2>Free and as-is</h2>
    <p>This tool is free and comes with no warranty. It may contain errors and may change or be withdrawn at any time.</p>
    <h2>Check what you produce</h2>
    <p>Read your biodata before sending it. You are responsible for the accuracy of what it says — particularly names, dates and contact numbers.</p>
    <h2>Pictures you add</h2>
    <p>Only upload photographs or artwork you own or have permission to use. Images found through a web search are usually the property of the photographer or artist, and using them can infringe their rights. The decorative motifs built into this tool are original artwork and free for you to use.</p>
    <h2>Keep your own copy</h2>
    <p>Drafts live only in your browser. Download your finished biodata and keep it somewhere safe — nothing can be recovered for you.</p>
    <h2>Sensible use</h2>
    <p>A biodata carries your full name, photograph, birth details and a phone number. Send it to people you have chosen, not to open groups. Do not use this tool to create documents that impersonate somebody else.</p>
    <h2>Liability</h2>
    <p>To the fullest extent permitted by law, no liability is accepted for any loss arising from use of this site.</p>`],

  ['contact','Contact','Get in touch about the biodata maker.',`
    <p>This is maintained by one person and every email is read.</p>
    <h2>Email</h2>
    <p><a href="mailto:${CONTACT}">${CONTACT}</a></p>
    <h2>Corrections to a language</h2>
    <p>The label sets in twelve languages were written carefully, but I am not a native speaker of all of them. If a label is wrong, awkward, or not what your community actually uses, please tell me the language, the label, and what it should say. These get fixed quickly.</p>
    <h2>Reporting a problem</h2>
    <p>Tell me which browser and device you are using and what you were doing. Please do not email your biodata or your photograph — describe the problem instead.</p>
    <h2>Requests</h2>
    <p>Suggestions for designs, fields or languages are welcome.</p>`],
];

for (const [slug, title, desc, body] of TRUST) {
  fs.mkdirSync(slug, { recursive: true });
  fs.writeFileSync(path.join(slug, 'index.html'), trustPage(slug, title, desc, body));
}
console.log(`Wrote ${TRUST.length} trust pages`);

fs.writeFileSync('404.html', trustPage('404', 'Page not found',
  'That page does not exist.',
  `<p>That address does not exist here.</p><p><a href="${BASE}/">Make a marriage biodata →</a></p>`));

/* ── PWA: manifest, icons and a service worker ──────────────────────────
   "Add to Home Screen" gives an icon that opens full screen with no browser
   bar — indistinguishable from an app for this purpose, at no cost, with no
   store review and no yearly fee. A biodata is a once-in-a-lifetime
   document; nobody installs a 30 MB app to make one.

   The icons are written here as real PNGs, encoded with Node's built-in
   zlib, so there is no image library to install and nothing to maintain.
   ──────────────────────────────────────────────────────────────────── */
const zlib = require('zlib');

function png(size, draw) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;                       // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = draw(x, y, size);
      const i = y * (size * 4 + 1) + 1 + x * 4;
      raw[i] = r; raw[i + 1] = g; raw[i + 2] = b; raw[i + 3] = a;
    }
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body) >>> 0);
    return Buffer.concat([len, body, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6;                            // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return c ^ -1;
}

/* a marigold diamond on deep pine — the site mark, drawn in pixels */
function icon(x, y, size) {
  const c = size / 2, u = size / 100;
  const dx = Math.abs(x - c), dy = Math.abs(y - c);
  const inDiamond = (dx + dy) < 30 * u;
  const inRing = Math.abs((dx + dy) - 39 * u) < 3 * u;
  if (inDiamond || inRing) return [208, 138, 30, 255];   // #D08A1E
  return [18, 58, 52, 255];                              // #123A34
}
fs.writeFileSync('icon-192.png', png(192, icon));
fs.writeFileSync('icon-512.png', png(512, icon));
fs.writeFileSync('apple-touch-icon.png', png(180, icon));
console.log('Wrote 3 app icons');

fs.writeFileSync('manifest.json', JSON.stringify({
  name: SITE + ' — marriage biodata in your own language',
  short_name: SITE,
  description: 'Make a printable marriage biodata in twelve Indian languages. Free, and nothing leaves your device.',
  start_url: './',
  scope: './',
  display: 'standalone',
  orientation: 'portrait',
  background_color: '#F6F7F3',
  theme_color: '#F6F7F3',
  lang: 'en',
  categories: ['productivity', 'lifestyle'],
  icons: [
    { src: './icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: './icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: './icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2));

/* Cache-first for the shell so the tool opens with no signal at all.
   Bump CACHE when index.html changes, or people keep the old one. */
fs.writeFileSync('sw.js', `/* generated by build.js — do not edit */
const CACHE = 'biodata-${Date.now().toString(36)}';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res && res.status === 200) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
`);
console.log('Wrote manifest.json and sw.js');

let n = 0;
for (const l of LANGS) {
  fs.mkdirSync(l.code, { recursive: true });
  fs.writeFileSync(path.join(l.code, 'index.html'), page(l));
  n++;
}

const today = new Date().toISOString().slice(0, 10);
const urls = [{ loc: `${BASE}/`, pri: '1.0' },
  ...LANGS.map(l => ({ loc: `${BASE}/${l.code}/`, pri: '0.9' })),
  ...TRUST.map(([slug]) => ({ loc: `${BASE}/${slug}/`, pri: '0.3' }))];
fs.writeFileSync('sitemap.xml',
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.pri}</priority>
  </url>`).join('\n')}
</urlset>
`);
fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`);

console.log(`Wrote ${n} language pages`);
console.log(`Wrote sitemap.xml (${urls.length} URLs) and robots.txt`);
console.log(`Base URL: ${BASE}`);
