#!/usr/bin/env node
/*
 * WCAG 2.2 text-contrast checker — both a CLI and a library (imported by
 * contrast-audit.mjs).
 *
 * Contrast is background-dependent, and translucent colours only resolve once
 * composited. This tool does both: it alpha-composites a translucent background
 * over an opaque BASE (default white — the lightest worst case, so passing there
 * guarantees the ratio on any lighter-or-equal backdrop), then composites a
 * translucent foreground over that, then computes the ratio.
 *
 * Usage:
 *   node scripts/contrast.mjs "<fg>" "<bg>" [base] [flags]
 *
 * Examples:
 *   node scripts/contrast.mjs "#16162a" "rgba(255,255,255,.65)"      # frosted surface over white
 *   node scripts/contrast.mjs "white"   "rgba(79,70,229,.9)"         # white label on a glass fill
 *   node scripts/contrast.mjs "#6f6f68" "#f4f4f0" --aaa              # docs muted grey, AAA bar
 *   node scripts/contrast.mjs "white"   "rgba(190,24,93,.9)" "#000"  # over a black base instead
 *
 * Colours:  #rgb  #rrggbb  #rrggbbaa  rgb(r,g,b)  rgba(r,g,b,a)  white  black  transparent
 * Flags:    --large  (large text: ≥24px, or ≥18.66px bold)   --aaa  (AAA instead of AA)
 * Exit:     0 if it passes the chosen threshold, 1 if it fails (CI-friendly).
 */

import { fileURLToPath } from 'node:url';

export function parseColor(input) {
	let s = String(input).trim().toLowerCase();
	if (s === 'transparent') return [0, 0, 0, 0];
	if (s === 'white') return [255, 255, 255, 1];
	if (s === 'black') return [0, 0, 0, 1];

	if (s[0] === '#') {
		let h = s.slice(1);
		if (h.length === 3 || h.length === 4) h = h.split('').map((c) => c + c).join('');
		if (h.length !== 6 && h.length !== 8) throw new Error(`bad hex: ${input}`);
		const n = (i) => parseInt(h.slice(i, i + 2), 16);
		return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1];
	}

	const m = s.match(/^rgba?\(([^)]+)\)$/);
	if (m) {
		const parts = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
		if (parts.length < 3 || parts.some(Number.isNaN)) throw new Error(`bad rgb: ${input}`);
		const [r, g, b, a = 1] = parts;
		return [r, g, b, a];
	}
	throw new Error(`unrecognised colour: ${input}`);
}

// Composite a (possibly translucent) colour over an opaque background.
export const over = ([r, g, b, a], [br, bg, bb]) => [
	r * a + br * (1 - a),
	g * a + bg * (1 - a),
	b * a + bb * (1 - a)
];

const channel = (c) => {
	const s = c / 255;
	return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
export const luminance = ([r, g, b]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
export const contrast = (a, b) => {
	const [l1, l2] = [luminance(a), luminance(b)];
	return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

// Resolve a (possibly translucent) fg over a (possibly translucent) bg over an
// opaque base, and return the WCAG contrast ratio. The reusable entry point.
export function ratio(fg, bg, base = '#ffffff') {
	const baseRgb = parseColor(base).slice(0, 3);
	const bgResolved = over(parseColor(bg), baseRgb);
	const fgResolved = over(parseColor(fg), bgResolved);
	return contrast(fgResolved, bgResolved);
}

// --- CLI (only when run directly, not when imported) ---
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
	const args = process.argv.slice(2);
	const flags = new Set(args.filter((a) => a.startsWith('--')));
	const [fgArg, bgArg, baseArg] = args.filter((a) => !a.startsWith('--'));

	if (!fgArg || !bgArg) {
		console.error('usage: node scripts/contrast.mjs "<fg>" "<bg>" [base] [--large] [--aaa]');
		process.exit(2);
	}

	const large = flags.has('--large');
	const aaa = flags.has('--aaa');
	const threshold = aaa ? (large ? 4.5 : 7) : large ? 3 : 4.5;

	const r = ratio(fgArg, bgArg, baseArg ?? '#ffffff');
	const level = aaa ? 'AAA' : 'AA';
	const kind = large ? 'large' : 'normal';
	const pass = r >= threshold;

	console.log(
		`${r.toFixed(2)}:1  ${pass ? 'PASS' : 'FAIL'}  (${level} ${kind} text needs ${threshold}:1)`
	);
	process.exit(pass ? 0 : 1);
}
