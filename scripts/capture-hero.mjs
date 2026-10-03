#!/usr/bin/env node
/*
 * Hero-slide capture — bakes the landing hero marquee's 8 look×device slides to flat
 * 2× WebPs (src/routes/landing/+page.svelte consumes them as <img>s).
 *
 * Why baked images: the slides are real aronia-component mockups, but animating them
 * live hits compositing glitches when zoomed + looped (esp. glass backdrop-filter across
 * the seam). Flat pixels have none of that, and the capture source IS the real components
 * (the dev-only /landing/capture sheet), so it stays an honest "built with aronia" proof.
 *
 * Pipeline: Playwright drives Chromium at deviceScaleFactor 2 → screenshots each tile
 * (clipped to its exact border-box) → cwebp -q 80 → static/landing/hero/<name>.webp.
 *
 * Usage:
 *   npm run dev                 # the capture route is dev-only
 *   node scripts/capture-hero.mjs            # all 8 slides
 *   node scripts/capture-hero.mjs glass spindle   # just these
 *   BASE=http://localhost:5174 node scripts/capture-hero.mjs   # non-default dev port
 *
 * Requires: playwright (devDep) + cwebp on PATH (brew install webp).
 */
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEST = path.join(ROOT, 'static/landing/hero');
const BASE = process.env.BASE || 'http://localhost:5173';

// [data-style] on the capture tile  ->  output WebP name. The element's own box sizes
// the shot (square mobile 600, desktop 780, tablet 900 — all ×600), so no sizes here.
const TILES = {
	riso: 'risograph',
	neo: 'neo-brutalism',
	glass: 'glassmorphism',
	swiss: 'swiss',
	spindle: 'spindle',
	drop: 'drop',
	halo: 'halo',
	depart: 'depart'
};

const want = process.argv.slice(2);
const names = want.length ? want : Object.keys(TILES);
const unknown = names.filter((n) => !(n in TILES));
if (unknown.length) {
	console.error(`Unknown slide(s): ${unknown.join(', ')}\nKnown: ${Object.keys(TILES).join(', ')}`);
	process.exit(1);
}

const tmp = mkdtempSync(path.join(tmpdir(), 'hero-capture-'));
const browser = await chromium.launch();
try {
	const page = await browser.newPage({ deviceScaleFactor: 2 }); // retina -> 2× assets
	await page.goto(`${BASE}/landing/capture`, { waitUntil: 'networkidle' });
	await page.evaluate(() => document.fonts.ready);
	await page.waitForTimeout(400); // let grain / gradients / backdrop-filter settle

	for (const name of names) {
		const el = page.locator(`.cap-tile[data-style="${TILES[name]}"]`);
		await el.scrollIntoViewIfNeeded();
		const png = path.join(tmp, `${name}.png`);
		await el.screenshot({ path: png });
		const out = path.join(DEST, `${name}.webp`);
		execFileSync('cwebp', ['-q', '80', png, '-o', out], { stdio: 'ignore' });
		const box = await el.boundingBox();
		console.log(`✓ ${name}.webp  (${box.width * 2}×${box.height * 2})`);
	}
} finally {
	await browser.close();
	rmSync(tmp, { recursive: true, force: true });
}
console.log(`\nDone → ${path.relative(ROOT, DEST)}/`);
