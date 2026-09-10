// Shared structural layout vocabulary — the parts of a style's `composition`
// that are the SAME across every family (spacing, breakpoints, container). These
// are structural rhythm, not style identity, so they're single-sourced here and
// spread into each style's `composition` (which keeps only its per-style typeScale
// + media). The values still land identically on every registry item, so an agent
// reading one style's guidance gets a self-contained set — no cross-referencing.
//
// These are reference values: breakpoints can't be used in a media query, and the
// container is applied by hand. The spacing ramp IS also materialized as CSS custom
// properties (`--<style>-space-1..24`, identical values in every family's token
// sheet) so components can `var()` it instead of free-handing literals — but the
// scale itself is the same to follow whether you reach for the token or the number.
import type { CompositionSpec } from './schema.js';

export const SHARED_LAYOUT: Pick<CompositionSpec, 'spacing' | 'breakpoints' | 'container'> = {
	// Conventional 4px base scale, Tailwind-compatible keys (each = 0.25rem × key).
	// Full 4px granularity through the component-internal range (1–6), then wide jumps
	// for layout so big gaps stay consistent. Snap to these.
	spacing: {
		'1': '0.25rem', // 4
		'2': '0.5rem', // 8
		'3': '0.75rem', // 12
		'4': '1rem', // 16
		'5': '1.25rem', // 20
		'6': '1.5rem', // 24
		'8': '2rem', // 32
		'12': '3rem', // 48
		'16': '4rem', // 64
		'24': '6rem' // 96
	},
	// Adopts the conventional (Tailwind) breakpoints so an agent maps to its prior
	// instead of guessing 900 vs 860 vs 768. mobile-first min-width. `md` is the
	// workhorse (single ↔ multi-column); `sm` phone type/padding; `lg`/`xl` wide.
	breakpoints: {
		sm: '640px',
		md: '768px',
		lg: '1024px',
		xl: '1280px'
	},
	// Page frame, aligned to the `xl` breakpoint. Applied as
	// `width: min(1280px, 100% - 2 * gutter); margin-inline: auto`. Gutter is fluid
	// from space-4 (16) to space-8 (32).
	container: {
		maxWidth: '1280px',
		gutter: 'clamp(1rem, 4vw, 2rem)'
	}
};
