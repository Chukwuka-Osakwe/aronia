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
	{ label: 'swiss: accent-text on paper (link/emphasis)', fg: '#c2350a', bg: '#ffffff' },
	{ label: 'swiss: danger-ink on paper (field required/error/alert)', fg: '#cf222e', bg: '#ffffff' },
	{ label: 'swiss: info-ink on paper (alert bar/icon)', fg: '#175cd3', bg: '#ffffff' },
	{ label: 'swiss: success-ink on paper (alert bar/icon)', fg: '#157f3c', bg: '#ffffff' },
	{ label: 'swiss: warning-ink on paper (alert bar/icon)', fg: '#8a5a00', bg: '#ffffff' },

	// --- Risograph: warm paper ground, plum-indigo ink, spot inks, one fluoro accent ---
	// Surfaces sit on the warm paper #f5f0e8 (NOT white) — the honest, slightly-worse
	// case for dark-on-light. Bright spot inks back light text only where dark enough
	// (--riso-blue-fill, not the raw spot blue #0078bf); the fluoro pink takes dark ink.
	{ label: 'riso: ink on paper', fg: '#241f31', bg: '#f5f0e8' },
	{ label: 'riso: ink-soft on paper (secondary text)', fg: '#595466', bg: '#f5f0e8' },
	{ label: 'riso: on-ink on ink fill (solid badge/card)', fg: '#f5f0e8', bg: '#241f31' },
	{ label: 'riso: ink on muted fill (muted button)', fg: '#241f31', bg: '#ece5d8' },
	{ label: 'riso: accent-ink on fluoro fill (primary button/accent badge)', fg: '#1a1a1a', bg: '#ff48b0' },
	// The overprint hover DARKENS the fluoro fill, eating the dark label's margin —
	// so the primary uses the gentler --riso-overprint-accent (16%). This pins that:
	// #d650b2 = color-mix(srgb, #ff48b0 84%, #0078bf). At the full 22% it drops below AA.
	{ label: 'riso: accent-ink on primary hover (16% overprint→blue)', fg: '#1a1a1a', bg: '#d650b2' },
	{ label: 'riso: on-ink on blue-fill (secondary button/card masthead)', fg: '#f5f0e8', bg: '#0069a8' },
	{ label: 'riso: accent-text on paper (link/emphasis)', fg: '#c31877', bg: '#f5f0e8' },
	{ label: 'riso: danger-ink on paper (field error/alert)', fg: '#af1d2b', bg: '#f5f0e8' },
	{ label: 'riso: info-ink on paper (alert/link)', fg: '#005c9a', bg: '#f5f0e8' },
	{ label: 'riso: success-ink on paper (alert)', fg: '#10672e', bg: '#f5f0e8' },
	{ label: 'riso: warning-ink on paper (alert)', fg: '#805400', bg: '#f5f0e8' },
	// The Alert washes the paper with 8% of the VIVID status ink (alert.css
	// `color-mix(in srgb, var(--_c) 8%, paper)`) and prints the darkened -ink tone
	// on that wash (title + icon + hairline). The -ink tones are tuned to ~5.5:1
	// HERE (the wash is the honest worse case; user-eyeballed darker than the bare
	// AA pass). Wash grounds pinned so a future tint bump can't silently break AA:
	//   #e1e6e5 = 8% #0078bf, #e3e7da = 8% #1a7f37,
	//   #f5ead6 = 8% #f2a005, #f5e3dd = 8% #f15060 — all over #f5f0e8.
	{ label: 'riso: info-ink on info wash (alert title/icon)', fg: '#005c9a', bg: '#e1e6e5' },
	{ label: 'riso: success-ink on success wash (alert title/icon)', fg: '#10672e', bg: '#e3e7da' },
	{ label: 'riso: warning-ink on warning wash (alert title/icon)', fg: '#805400', bg: '#f5ead6' },
	{ label: 'riso: danger-ink on danger wash (alert title/icon)', fg: '#af1d2b', bg: '#f5e3dd' },

	// --- Risograph: DARK theme ([data-theme='dark']) — the palette turns inside-out,
	// so pairs are re-audited on the plum-indigo STOCK #241f31 (never pure black).
	// Constant spot-ink surfaces (accent-ink on the fluoro #ff48b0; paper-tone on the
	// blue-fill #0069a8) don't flip — they're already covered by the light rows above.
	// Values mirror the dark half of each light-dark() token in styles/riso.css.
	{ label: 'riso-dark: ink on stock (body text)', fg: '#f5f0e8', bg: '#241f31' },
	{ label: 'riso-dark: ink-soft on stock (secondary text)', fg: '#a79fb2', bg: '#241f31' },
	// The reflected ink FILLS invert to paper (#f5f0e8) carrying plum (#241f31) mark/
	// text — solid badge, ink card, checked box/radio, active tab.
	{ label: 'riso-dark: on-ink on re-inverted ink fill', fg: '#241f31', bg: '#f5f0e8' },
	{ label: 'riso-dark: ink on muted fill (muted button rest)', fg: '#f5f0e8', bg: '#342e44' },
	// Overprint flips ADDITIVE (button.css). Hovers pinned so a lift/deepen tweak can't
	// silently break AA:  #fd70bd = mix(#ff48b0, #f5f0e8 24%) — primary lifts toward paper;
	//   #625d6b = mix(#342e44, #f5f0e8 24%) — muted lifts; #09578b = mix(#0069a8, #241f31 24%)
	//   — secondary DEEPENS toward stock (light label, low headroom, lifting fails AA).
	{ label: 'riso-dark: accent-ink on primary hover (additive lift)', fg: '#1a1a1a', bg: '#fd70bd' },
	{ label: 'riso-dark: on-spot on secondary hover (deepen→stock)', fg: '#f5f0e8', bg: '#09578b' },
	{ label: 'riso-dark: ink on muted hover (lift)', fg: '#f5f0e8', bg: '#625d6b' },
	// Inline link: accent-text lightens on dark; hover lifts toward paper.
	//   #fd96cb = mix(#ff7ac2, #f5f0e8 24%).
	{ label: 'riso-dark: accent-text on stock (link/emphasis rest)', fg: '#ff7ac2', bg: '#241f31' },
	{ label: 'riso-dark: accent-text on stock hover (lift)', fg: '#fd96cb', bg: '#241f31' },
	{ label: 'riso-dark: danger-ink on stock (field error)', fg: '#ff8a8a', bg: '#241f31' },
	// Alert wash on dark = 8% vivid status ink over the STOCK, printed with the
	// LIGHTENED -ink tone (title/icon). Washes pinned:
	//   #21263c = 8% #0078bf, #232731 = 8% #1a7f37, #34292d = 8% #f2a005,
	//   #342335 = 8% #f15060 — all over #241f31.
	{ label: 'riso-dark: info-ink on info wash', fg: '#7cc0f5', bg: '#21263c' },
	{ label: 'riso-dark: success-ink on success wash', fg: '#6fce8c', bg: '#232731' },
	{ label: 'riso-dark: warning-ink on warning wash', fg: '#f2b84d', bg: '#34292d' },
	{ label: 'riso-dark: danger-ink on danger wash', fg: '#ff8a8a', bg: '#342335' }
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
