// Risograph — manifest (StyleSpec). PREVIEW slice: Button/Link/Card/Badge.
// enum `values` imported from ./options.ts (single source of truth); prose fields
// (description/whenToUse/principles/avoid) are the agent-facing guidance.
import type { StyleSpec } from '../manifest/schema.js';
import { SHARED_LAYOUT } from '../manifest/composition-base.js';
import {
	BUTTON_VARIANTS,
	BUTTON_SIZES,
	BUTTON_SHAPES,
	LINK_VARIANTS,
	CARD_VARIANTS,
	BADGE_VARIANTS,
	BADGE_SHAPES
} from './options.js';

export const risograph: StyleSpec = {
	id: 'risograph',
	name: 'Risograph',
	description:
		'Warm, handcrafted print energy — the risograph aesthetic. Spot inks that OVERPRINT (multiply) into secondary hues, visible paper grain, and matte plum-indigo ink on a warm paper ground (never pure white, never true black). Depth comes from ink mixing, not elevation — no shadows, no offsets, no transforms. Bold and non-corporate; the identity lives entirely in ink, paper and texture, shipped as a broad expression range rather than one fixed look.',
	whenToUse:
		'Products that want personality and a human, made-by-hand feel — indie brands, zines, editorial/culture sites, playful marketing. When standing out from the generic AI-default look matters more than corporate polish.',
	principles: [
		'Limit the palette to the warm paper ground plus 2–4 spot inks; let overlaps OVERPRINT (multiply) into secondary hues — pink+blue → violet — rather than reaching for more colours.',
		'Make texture load-bearing: grain lives ON every surface and carries the identity — it is the family, not a garnish. A halftone dot-screen is NOT a surface fill (behind text it reads as noise) — it earns its place only as a decorative, density-graded dot-FIELD motif in whitespace (hero art, accents, corners).',
		'Signal depth by INK MIXING, never elevation: filled controls are borderless printed colour fields whose fill deepens toward its complementary ink on hover. No offset layer, no drop shadow, no lift.',
		'Ground everything on warm paper — never pure white — and keep ink a deep plum-indigo, never true black; those tinted near-blacks are what separate riso from neo.',
		'Move by COLOUR only: state rides the overprint/colour transition with ZERO transforms (no translate or scale on hover or press). Ink settles by mixing, it never shoves.',
		'Default RESTRAINED, opt into loud: ship a measured palette + subtle grain, then use the texture-expression range to dial up per context — quiet body surfaces, louder heroes. Two dials are per-SURFACE: the GROUND (warm/cool paper, kraft, a tinted spot-ink wash) and the grain INTENSITY (flat → subtle tooth → heavy grain). Beyond surfaces, two opt-in GRAPHIC treatments — never component chrome: a density-graded halftone dot-FIELD as a decorative motif in open space (a masked dot pattern that fades dense→sparse — hero art, accents, corners), and a ~2px misregistration offset on large display type and marks (a TWO-INK split reads most "printed"; keep it RESTRAINED by default — pair a vivid spot ink with a muted, desaturated partner (blue + a muted plum is the reference for that restraint, not a fixed recipe) — and save two vivid inks for a loud statement).',
		'Set headings in Space Grotesk; reserve uppercase Space Mono (with positive tracking) for eyebrows, labels and captions — the print-label voice. Hierarchy may ride spot-ink colour as well as size.'
	],
	avoid: [
		'Blurred or black drop shadows, glows, and any elevation or hover/press transform — depth comes from overprint and grain, motion from colour.',
		'Pure-white backgrounds and true-black ink; clinical, perfectly-smooth flats with no paper tooth.',
		'Reading as neo-brutalism: no hard black frame, no offset-shadow, no "shove" — riso and neo share a flat, square structure, so the whole difference must live in ink, paper and grain.',
		'Smooth gradients — use grain on surfaces, or a graded halftone dot-field in open space, instead of a blurred colour fade.',
		'More than ~4 colours, or introducing a new hue where an overprint of two inks would do.',
		'Fluoro pink as body text (it fails contrast) — reserve it for large graphic accents and the primary action; use the darkened accent tone for links.',
		'Structural misregistration on components — the ~2px offset look is an opt-in treatment on large display type and graphic marks only, never component chrome or interaction.'
	],
	tokens: 'src/lib/styles/riso.css',
	fonts: [
		'src/lib/styles/fonts/space-grotesk-variable.woff2',
		'src/lib/styles/fonts/space-mono-400.woff2',
		'src/lib/styles/fonts/space-mono-700.woff2',
		'src/lib/styles/fonts/OFL.txt'
	],
	composition: {
		typeScale: {
			display: { size: 'clamp(2.75rem, 7vw, 5rem)', weight: '--riso-font-weight-bold' },
			h1: { size: 'clamp(2.125rem, 4.5vw, 3.25rem)', weight: '--riso-font-weight-bold' },
			h2: { size: 'clamp(1.625rem, 3vw, 2.25rem)', weight: '--riso-font-weight-semibold' },
			h3: { size: '1.375rem', weight: '--riso-font-weight-semibold' }, // = --riso-size-title
			character:
				'Space Grotesk for headings — geometric but warm, chunky without neo’s extremes; tight-ish display tracking (~-0.01em), never an ultra-condensed crush. Reserve Space Mono UPPERCASE with positive tracking (~0.08em) for eyebrows, labels and captions — the print voice. Hierarchy can ride SPOT-INK COLOUR as well as size/weight (unlike the monochrome families); keep body ink plum-indigo on paper.'
		},
		...SHARED_LAYOUT,
		media: {
			filter: 'contrast(1.05) saturate(1.08)', // a light "printed" push; go full duotone (feColorMatrix) for hero art
			radius: '--riso-radius',
			edge:
				'Imagery sits FLAT on the paper — no elevation. Rides the universal neutral inset outline, or drops it for full-bleed; a 1.5px plum-indigo ink hairline is the themed option. Treat photos as bold DUOTONE (luminance mapped to paper + one spot ink via an SVG feColorMatrix/feComponentTransfer filter) rather than full colour, to stay in the print language.',
			shadow: 'none'
		}
	},
	components: [
		{
			id: 'button',
			name: 'Button',
			import: 'risograph.Button',
			description: 'Primary action. Renders as a <button>, or an <a> when given an href.',
			states: ['hover', 'active', 'focus'],
			props: [
				{
					name: 'variant',
					description: 'Visual emphasis.',
					type: 'enum',
					values: BUTTON_VARIANTS,
					default: 'primary'
				},
				{
					name: 'size',
					description: 'Control size.',
					type: 'enum',
					values: BUTTON_SIZES,
					default: 'md'
				},
				{
					name: 'shape',
					description: 'Corner shape.',
					type: 'enum',
					values: BUTTON_SHAPES,
					default: 'square'
				},
				{ name: 'disabled', description: 'Inert, non-interactive state.', type: 'boolean', default: false },
				{
					name: 'href',
					description: 'When set, renders as a link (<a>).',
					type: 'string',
					placeholder: 'https://…'
				}
			],
			snippets: [
				{ name: 'children', description: 'Button label.' },
				{ name: 'icon', description: 'Optional leading icon.' }
			]
		},
		{
			id: 'link',
			name: 'Link',
			import: 'risograph.Link',
			description: 'A text or nav link. Always an <a>.',
			states: ['hover', 'focus'],
			props: [
				{
					name: 'variant',
					description: 'inline (in prose) or nav (sidebar/menu item).',
					type: 'enum',
					values: LINK_VARIANTS,
					default: 'inline'
				},
				{ name: 'active', description: 'For nav: marks the current page.', type: 'boolean', default: false },
				{ name: 'external', description: 'Opens in a new tab with an ↗ affordance.', type: 'boolean', default: false },
				{ name: 'href', description: 'Destination URL.', type: 'string', placeholder: 'https://…' }
			],
			snippets: [{ name: 'children', description: 'Link text.' }]
		},
		{
			id: 'card',
			name: 'Card',
			import: 'risograph.Card',
			description: 'A print panel with grain, optional header and footer regions.',
			props: [
				{
					name: 'variant',
					description: 'Surface treatment.',
					type: 'enum',
					values: CARD_VARIANTS,
					default: 'paper'
				}
			],
			snippets: [
				{ name: 'header', description: 'Optional header region.' },
				{ name: 'children', description: 'Card body content.' },
				{ name: 'footer', description: 'Optional footer region.' }
			]
		},
		{
			id: 'badge',
			name: 'Badge',
			import: 'risograph.Badge',
			description: 'A small uppercase mono print label.',
			props: [
				{
					name: 'variant',
					description: 'Emphasis.',
					type: 'enum',
					values: BADGE_VARIANTS,
					default: 'neutral'
				},
				{
					name: 'shape',
					description: 'Corner shape.',
					type: 'enum',
					values: BADGE_SHAPES,
					default: 'square'
				}
			],
			snippets: [{ name: 'children', description: 'Badge label.' }]
		}
	]
};
