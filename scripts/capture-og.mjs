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
    /* The footer's "new sweep 1" rust sweep, 1:1 with src/routes/+page.svelte (.site-footer):
       saturated rust peak lower-right fading to a deeper rust tail (footer-peek inlined). */
    background: radial-gradient(
      ellipse 145% 155% at 82% 128% in oklab,
      oklab(65.9% 0.136 0.114) 0%,
      oklab(47.3% 0.098 0.082) 20.21%,
      oklab(48% 0.105 0.088) 35.39%,
      oklab(34.6% 0.102 0.057) 53.7%,
      oklab(28.1% 0.086 0.048) 72%,
      oklab(32% 0.079 0.043) 100%
    );
    color: #eadbb8;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    gap: 28px; padding: 0 96px; text-align: center;
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
  p {
    font-size: 44px; font-weight: 400; line-height: 1.3;
    letter-spacing: 0.01em; color: #eadbb8;
  }
</style></head>
<body>
  <span class="wordmark">aronia
    <svg class="ring" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="${RING}" vector-effect="non-scaling-stroke" />
    </svg>
  </span>
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
