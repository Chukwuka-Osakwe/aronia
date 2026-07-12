#!/usr/bin/env node
/*
 * Contrast audit — the CI gate for the WCAG AA text rule (DESIGN.md Entry 24).
 *
 * Enumerates the AA-critical text/background pairs across the docs chrome and both
 * component styles, and asserts each clears its threshold (4.5:1 normal text, 3:1
 * large). Translucent colours composite over an opaque base — white, the lightest
 * worst case, so passing there guarantees the ratio on any real backdrop. Exits
 * non-zero on any failure, so CI fails the moment a token drifts below AA.
 *
 * Maintenance: add a row when you introduce a new text colour. Values mirror the
 * token files (src/lib/styles/*.css) + docs.css — keep them in sync. color-mix()
 * tints (e.g. the glass Alert surfaces) aren't representable here and are omitted;
 * they're light tints under dark ink, comfortably clear of the bar.
 */
import { ratio } from './contrast.mjs';

// { label, fg, bg, base = white, large = false }
const CASES = [
	// --- Docs chrome ---
	{ label: 'docs: ink on panel', fg: '#111111', bg: '#ffffff' },
	{ label: 'docs: muted on panel', fg: '#6f6f68', bg: '#ffffff' },
	{ label: 'docs: muted on doc-bg', fg: '#6f6f68', bg: '#f4f4f0' },

	// --- Neo-Brutalism: text ---
	{ label: 'NB: ink on paper', fg: '#111111', bg: '#ffffff' },
	{ label: 'NB: ink on muted', fg: '#111111', bg: '#e9ecef' },
	{ label: 'NB: danger-ink on paper (field error)', fg: '#b91c1c', bg: '#ffffff' },
	{ label: 'NB: link-ink on paper (link/nav active)', fg: '#1971c2', bg: '#ffffff' },

	// --- Neo-Brutalism: ink label on solid fills (button/alert/badge) ---
	{ label: 'NB: ink on primary (yellow)', fg: '#111111', bg: '#ffe600' },
	{ label: 'NB: ink on secondary/info (cyan)', fg: '#111111', bg: '#4dabf7' },
	{ label: 'NB: ink on success (green)', fg: '#111111', bg: '#40c057' },
	{ label: 'NB: ink on warning (yellow)', fg: '#111111', bg: '#ffe600' },
	{ label: 'NB: ink on danger (red)', fg: '#111111', bg: '#ff5c5c' },
	{ label: 'NB: ink on accent (link hover highlight)', fg: '#111111', bg: '#ff5c8a' },

	// --- Glassmorphism: translucent, composited over white (worst case) ---
	{ label: 'glass: ink on white', fg: '#16162a', bg: '#ffffff' },
	{ label: 'glass: ink-soft on white (secondary text)', fg: 'rgba(22,22,42,0.62)', bg: '#ffffff' },
	{ label: 'glass: danger-ink on white (field error)', fg: '#b91c1c', bg: '#ffffff' },
	{ label: 'glass: link-ink on white (link/nav active)', fg: '#4f46e5', bg: '#ffffff' },
	{ label: 'glass: white label on primary fill', fg: 'white', bg: 'rgba(79,70,229,0.9)' },
	{ label: 'glass: white label on secondary fill', fg: 'white', bg: 'rgba(190,24,93,0.9)' },
	{ label: 'glass: white label on info fill', fg: 'white', bg: 'rgba(29,78,216,0.9)' },

	// --- Swiss: near-monochrome + one hazard-orange accent ---
	{ label: 'swiss: ink on paper', fg: '#141414', bg: '#ffffff' },
	{ label: 'swiss: ink-soft on paper (secondary text)', fg: '#666666', bg: '#ffffff' },
	{ label: 'swiss: ink on accent fill (primary button)', fg: '#141414', bg: '#f24405' },
	{ label: 'swiss: white on ink fill (secondary button)', fg: '#ffffff', bg: '#141414' },
	{ label: 'swiss: ink on muted fill (muted button)', fg: '#141414', bg: '#f4f4f4' },
	{ label: 'swiss: accent-text on paper (link/emphasis)', fg: '#c2350a', bg: '#ffffff' }
];

let failures = 0;
console.log('WCAG AA text-contrast audit\n');
for (const c of CASES) {
	const threshold = c.large ? 3 : 4.5;
	const r = ratio(c.fg, c.bg, c.base);
	const pass = r >= threshold;
	if (!pass) failures++;
	const tag = pass ? 'PASS' : 'FAIL';
	console.log(`  ${tag}  ${r.toFixed(2).padStart(5)}:1  (needs ${threshold})  ${c.label}`);
}

console.log(`\n${CASES.length - failures}/${CASES.length} pairs clear WCAG AA.`);
if (failures) {
	console.error(`\n✗ ${failures} pair(s) below AA — see DESIGN.md Entry 24 (the AA rule).`);
	process.exit(1);
}
console.log('✓ all clear.');
