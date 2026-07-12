// Swiss / International Typographic Style — manifest (StyleSpec).
// enum `values` imported from ./options.ts (single source of truth); prose
// fields (description/whenToUse/principles/avoid) are the agent-facing guidance.
import type { StyleSpec } from '../manifest/schema.js';
import { BUTTON_VARIANTS, BUTTON_SIZES, BUTTON_SHAPES, LINK_VARIANTS } from './options.js';

export const swiss: StyleSpec = {
	id: 'swiss',
	name: 'Swiss',
	description:
		'Clean, objective, grid-driven minimalism — the International Typographic (Swiss) Style. Near-monochrome ink on white, hairline 1px borders, crisp 2px corners, flat surfaces, and a single hazard-orange accent used sparingly. Hierarchy comes from type weight and generous whitespace, not decoration.',
	whenToUse:
		'Professional, content-first, trustworthy interfaces — dashboards, docs, forms, and marketing that should feel precise and understated. The restrained, safe default for anyone put off by louder styles.',
	// How to COMPOSE tastefully in this language — the grammar an agent needs to
	// build a whole cohesive page, not just drop widgets. Ships in the manifest.
	principles: [
		'Anchor everything to a grid: align edges, keep consistent columns and gutters.',
		'Build hierarchy with type weight and size, not colour or decoration.',
		'Limit the palette to ink, paper, and greys plus the single hazard-orange accent — reserve the accent for one primary action or emphasis per view.',
		'Let whitespace do the work; leave generous, deliberate empty space instead of filling every region.',
		'Set text flush-left, ragged-right; keep line lengths readable.',
		'Separate elements with hairline 1px borders and keep surfaces flat — reserve shadow for true overlays (modal, menu) only.'
	],
	// Anti-patterns — the things that break the language.
	avoid: [
		'Gradients, glows, blur, or decorative drop shadows.',
		'More than one accent colour, or using the accent for large fills and backgrounds.',
		'Ornamentation, overly rounded "friendly" shapes, or skeuomorphic depth.',
		'Centred body text or justified columns.'
	],
	tokens: 'src/lib/styles/swiss.css',
	components: [
		{
			id: 'button',
			name: 'Button',
			import: 'swiss.Button',
			description: 'Primary action. Renders as a <button>, or an <a> when given an href.',
			props: [
				{
					name: 'variant',
					description: 'Visual style and emphasis of the button.',
					type: 'enum',
					values: BUTTON_VARIANTS,
					default: 'primary'
				},
				{
					name: 'size',
					description: 'Overall size of the button.',
					type: 'enum',
					values: BUTTON_SIZES,
					default: 'md'
				},
				{
					name: 'shape',
					description: 'Corner style — crisp, or a fully rounded pill.',
					type: 'enum',
					values: BUTTON_SHAPES,
					default: 'square'
				},
				{
					name: 'href',
					description: 'Renders the button as a link; its presence switches the element to an <a>.',
					type: 'string',
					required: false,
					placeholder: 'enter a link'
				},
				{
					name: 'disabled',
					description: 'Prevents interaction and dims the button.',
					type: 'boolean',
					default: false
				}
			],
			snippets: [
				{ name: 'children', description: 'The text shown on the button.' },
				{ name: 'icon', description: 'Optional leading icon.' }
			],
			states: ['hover', 'focus'],
			styleClass: 'swiss-btn',
			dataAttrs: ['variant', 'size', 'shape'],
			files: {
				style: 'src/lib/swiss/css/button.css',
				skins: {
					react: 'registry/swiss/button/Button.tsx',
					svelte: 'src/lib/swiss/Button.svelte',
					html: 'registry/swiss/button/button.html'
				}
			}
		},
		{
			id: 'link',
			name: 'Link',
			import: 'swiss.Link',
			description:
				"Navigation — the counterpart to Button's action. Always renders an <a>. Use `inline` inside prose and `nav` for sidebar/menu items.",
			props: [
				{
					name: 'variant',
					description:
						'inline = an underlined text link in prose; nav = a compact, active-aware menu/sidebar item.',
					type: 'enum',
					values: LINK_VARIANTS,
					default: 'inline'
				},
				{
					name: 'active',
					description:
						'For nav links: marks the current page (steps up weight + colour, and sets aria-current="page").',
					type: 'boolean',
					default: false
				},
				{
					name: 'external',
					description: 'Opens in a new tab — adds a ↗ affordance and rel="noopener noreferrer".',
					type: 'boolean',
					default: false
				},
				{
					name: 'href',
					description: 'The destination URL.',
					type: 'string',
					required: false,
					placeholder: 'enter a link'
				}
			],
			snippets: [{ name: 'children', description: 'The link text.' }],
			states: ['hover', 'focus'],
			styleClass: 'swiss-link',
			dataAttrs: ['variant', 'active'],
			files: {
				style: 'src/lib/swiss/css/link.css',
				skins: {
					react: 'registry/swiss/link/Link.tsx',
					svelte: 'src/lib/swiss/Link.svelte',
					html: 'registry/swiss/link/link.html'
				}
			}
		}
	]
};
