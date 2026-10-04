#!/usr/bin/env node
/*
 * OG-image capture — renders the branded social-share card to static/og.png (1200×630,
 * the Open Graph standard). Referenced by the og:image / twitter:image meta tags.
 *
 * Self-contained: unlike capture-hero.mjs (which drives the dev server), this sets its own
 * HTML, so `node scripts/capture-og.mjs` works with no server running. Brand faces load
 * from Google Fonts; everything else is the aronia palette inlined below.
 *
 * Usage:   node scripts/capture-og.mjs      (or: npm run capture:og)
 * Requires: playwright (devDep).
 */
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'static/og.png');

// The hand-drawn marker loop from the landing wordmark (src/routes/+page.svelte).
const RING = `M64 14 C24 16 8 44 20 68 C32 92 92 96 128 90 C170 83 196 60 188 36 C181 15 132 6 78 12 C58 14 44 18 36 26`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Gluten:wght@400..800&family=SUSE:wght@400..700&display=swap" rel="stylesheet" />
<style>
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; }
  body {
    background: radial-gradient(120% 140% at 12% 0%, #1a0f14 0%, #090507 55%);
    color: #eadbb8;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    gap: 34px; padding: 0 96px; text-align: center;
    font-family: 'SUSE', system-ui, sans-serif;
  }
  .wordmark {
    position: relative; display: inline-block;
    font-family: 'Gluten', cursive; font-weight: 700; font-size: 128px;
    line-height: 1; letter-spacing: -0.01em; color: #3fb6ad;
  }
  .ring {
    position: absolute; top: -0.3em; left: -0.55em;
    width: calc(100% + 1.1em); height: calc(100% + 0.5em); overflow: visible;
  }
  .ring path { fill: none; stroke: #3fb6ad; stroke-width: 4; stroke-linecap: round; }
  h1 {
    font-family: 'Gluten', cursive; font-weight: 700; font-size: 82px;
    line-height: 1.04; letter-spacing: -0.02em; color: #eadbb8; max-width: 16ch;
  }
  p {
    font-size: 36px; font-weight: 400; line-height: 1.3;
    color: color-mix(in oklab, #eadbb8 68%, #090507);
  }
</style></head>
<body>
  <span class="wordmark">aronia
    <svg class="ring" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="${RING}" vector-effect="non-scaling-stroke" />
    </svg>
  </span>
  <h1>Reject the default AI look.</h1>
  <p>An agent-friendly design language.</p>
</body></html>`;

const browser = await chromium.launch();
try {
	const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
	await page.setContent(html, { waitUntil: 'networkidle' });
	await page.evaluate(() => document.fonts.ready);
	await page.waitForTimeout(300); // let web fonts paint
	await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: 1200, height: 630 } });
	console.log(`✓ og.png (1200×630) → ${path.relative(ROOT, OUT)}`);
} finally {
	await browser.close();
}
