/**
 * Renders the social preview cards (public/og/*.png, 1200×630) and the favicon PNGs
 * from public/favicon.svg, using headless Chrome via Playwright.
 *
 *   npm run og
 *
 * Needs Playwright available (`npm i -D playwright` or a global install; set PLAYWRIGHT_PATH
 * to its module path if it isn't resolvable). Page copy comes from src/data/seo.ts.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { DEFAULT_META, SEO_PROJECTS, SITE_URL } from "../../src/data/seo.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? "playwright");

const dataUrl = (file, type) => `data:${type};base64,${fs.readFileSync(path.join(root, file)).toString("base64")}`;
const font = (file) => dataUrl(`public/fonts/${file}`, "font/woff2");

// Each project's signature accent (HSL triplet) straight from the project data.
const projectsSource = fs.readFileSync(path.join(root, "src/data/projects.ts"), "utf8");
function accentFor(slug) {
  const block = projectsSource.slice(projectsSource.indexOf(`slug: "${slug}"`));
  return block.match(/accent: "([^"]+)"/)?.[1] ?? "212 100% 48%";
}

const baseCss = `
  @font-face { font-family: "Instrument Sans"; font-weight: 400 700; src: url(${font("instrument-sans-normal-400-700.woff2")}) format("woff2"); }
  @font-face { font-family: "Geist Mono"; font-weight: 400 600; src: url(${font("geist-mono-normal-400-600.woff2")}) format("woff2"); }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #fafaf9; color: #080503; font-family: "Instrument Sans", sans-serif; overflow: hidden; }
  .card { position: relative; width: 1200px; height: 630px; padding: 72px 80px; display: flex; gap: 48px; align-items: center; }
  .copy { flex: 1 1 0; min-width: 0; }
  .eyebrow { font: 500 15px/1 "Geist Mono", monospace; letter-spacing: 0.25em; text-transform: uppercase; color: #6b635e; }
  .name { margin-top: 28px; font-size: 88px; font-weight: 500; line-height: 0.95; letter-spacing: -0.04em; }
  .line { margin-top: 22px; font-size: 34px; font-weight: 500; line-height: 1.15; letter-spacing: -0.02em; }
  .muted { color: #968d86; }
  .summary { margin-top: 22px; font-size: 24px; line-height: 1.4; color: #4f4945; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .foot { position: absolute; left: 80px; bottom: 48px; font: 500 15px/1 "Geist Mono", monospace; letter-spacing: 0.08em; color: #6b635e; display: flex; align-items: center; gap: 10px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: #0070f3; }
`;

function defaultCard() {
  return `<div class="card">
    <div class="copy">
      <p class="eyebrow">Designer &amp; Engineer — Port Harcourt</p>
      <p class="name">Justice Nweke</p>
      <p class="line">From Figma to production.<br/><span class="muted">No handoff.</span></p>
    </div>
    <img src="${dataUrl("public/hero-poster.webp", "image/webp")}" style="width:430px;height:430px;flex:none;margin-right:-10px" />
    <p class="foot"><span class="dot"></span>${new URL(SITE_URL).host}</p>
  </div>`;
}

function projectCard(p) {
  const accent = accentFor(p.slug);
  return `<div class="card">
    <div class="copy" style="flex-basis:420px;flex-grow:0">
      <p class="eyebrow">Case study</p>
      <p class="name" style="font-size:96px">${p.title}</p>
      <p class="summary">${p.summary}</p>
    </div>
    <div style="flex:1;padding:3px;border-radius:28px;background:linear-gradient(135deg,hsl(${accent} / .55),hsl(${accent} / .1) 45%,hsl(${accent} / .1) 55%,hsl(${accent} / .55));box-shadow:0 40px 80px -36px rgba(0,0,0,.4)">
      <div style="border-radius:25px;background:#fafaf9;padding:10px">
        <img src="${dataUrl(p.cover, "image/webp")}" style="display:block;width:100%;aspect-ratio:4/3;object-fit:cover;object-position:top;border-radius:18px" />
      </div>
    </div>
    <p class="foot"><span class="dot"></span>Justice Nweke — Designer &amp; Engineer</p>
  </div>`;
}

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL ?? "chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
fs.mkdirSync(path.join(root, "public/og"), { recursive: true });

async function shoot(html, out) {
  await page.setContent(`<!doctype html><html><head><style>${baseCss}</style></head><body>${html}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(root, out) });
  console.log("wrote", out);
}

await shoot(defaultCard(), DEFAULT_META.image.replace(/^\//, "public/"));
for (const p of SEO_PROJECTS) await shoot(projectCard(p), `public/og/${p.slug}.png`);

// Favicon PNGs rendered from the SVG monogram.
const svg = fs.readFileSync(path.join(root, "public/favicon.svg"), "utf8");
for (const [size, out, squared] of [
  [32, "public/favicon-32.png", false],
  [180, "public/apple-touch-icon.png", true], // iOS applies its own rounding
  [192, "public/icon-192.png", false],
  [512, "public/icon-512.png", false],
]) {
  const art = squared ? svg.replace('rx="15"', 'rx="0"') : svg;
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${art.replace("<svg ", `<svg width="${size}" height="${size}" `)}</body></html>`);
  await page.screenshot({ path: path.join(root, out), omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  console.log("wrote", out);
}

await browser.close();
