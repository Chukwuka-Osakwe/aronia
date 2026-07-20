// Risograph — manifest (StyleSpec). PREVIEW slice: Button/Link/Card/Badge.
// enum `values` imported from ./options.ts (single source of truth); prose fields
// (description/whenToUse/principles/avoid) are the agent-facing guidance.
import type { StyleSpec } from '../manifest/schema.js';
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
		'Warm, handcrafted print energy — the risograph aesthetic. Layered semi-transparent spot inks that overprint into secondary hues, visible grain, deliberate misregistration offsets, and matte ink on a warm paper ground (never pure white). Bold and non-corporate; the identity lives in ink, paper and texture, not in borders and shadows.',
	whenToUse:
		'Products that want personality and a human, made-by-hand feel — indie brands, zines, editorial/culture sites, playful marketing. When standing out from the generic AI-default look matters more than corporate polish.',
	principles: [
		'Limit the palette to a warm paper ground plus 2–4 spot inks; let overlaps multiply into secondary hues rather than adding more colours.',
		'Make texture load-bearing: grain and halftone belong on surfaces, not as a garnish — they carry the identity.',
		'Signal depth with a COLOURED misregistration offset (a second ink pass), never a neutral or blurred drop shadow.',
		'Ground everything on warm paper — never pure white; keep ink a warm near-black.',
		'Embrace deliberate imperfection: 1–4px misalignment, chalky matte fills, print-culture marks.'
	],
	avoid: [
		'Blurred or black drop shadows, glows, and smooth gradients (use offset ink layers and halftone instead).',
		'Pure-white backgrounds or clinical, perfectly-smooth surfaces.',
		'More than ~4 colours, or reading as neo-brutalism — the difference is ink, paper and grain, not structure.',
		'Fluorescent inks as body text (they fail contrast); reserve them for large graphic accents.'
	],
	tokens: 'src/lib/styles/riso.css',
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
