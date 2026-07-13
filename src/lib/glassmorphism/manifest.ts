// Glassmorphism family manifest. Same conventions as the Neo-Brutalism manifest:
// enum `values` imported from ./options.ts (single source of truth); prose fields
// hand-authored. Prop order: appearance → binding/behavior → state. See DESIGN.md.

import type { StyleSpec } from '../manifest/schema.js';
import { SHARED_LAYOUT } from '../manifest/composition-base.js';
import {
	BUTTON_VARIANTS,
	BUTTON_SIZES,
	BUTTON_SHAPES,
	LINK_VARIANTS,
	SKELETON_SHAPES,
	CARD_VARIANTS,
	BADGE_VARIANTS,
	INPUT_SIZES,
	INPUT_SHAPES,
	FIELD_SHAPES,
	ALERT_VARIANTS,
	SPINNER_SPEEDS
} from './options.js';

export const glassmorphism: StyleSpec = {
	id: 'glassmorphism',
	name: 'Glassmorphism',
	description:
		'Frosted translucent surfaces over a backdrop blur, soft hairline borders (a light rim highlight), diffuse low-opacity shadows for depth, and generous rounded corners — light, airy, and layered. Elements float on hover rather than pressing.',
	whenToUse:
		'Modern, elegant, depth-layered interfaces — overlays, dashboards, and hero sections set over vivid gradient or photographic backdrops, where the frosted blur can shine.',
	principles: [
		'Layer translucent, frosted surfaces over a blurred background so context shows through.',
		'Always place glass over a non-uniform backdrop (gradient, image, or overlapping content) — see `requires`.',
		'Edge each surface with a subtle light rim / hairline border to suggest the thickness of glass.',
		'Keep depth soft — diffuse low-opacity shadows and generous rounded corners; elements float on hover rather than pressing.',
		'Use glass sparingly on key surfaces (cards, modals, nav), not the whole layout; keep text on a strong-enough tint to clear WCAG AA.'
	],
	avoid: [
		'Frosted glass on a flat, single-colour background (it degrades to a plain card).',
		'Low-contrast text over busy blur.',
		'Hard offset shadows, thick opaque borders, or flat brutalist fills.',
		'Over-using the effect everywhere — it loses impact and hurts readability and performance.'
	],
	requires:
		'a non-uniform backdrop — a gradient, image, or content it overlaps. Frosted surfaces refract what is behind them, so on a flat, solid fill (white or any single colour) the blur and translucency are invisible and glass degrades to a plain soft-shadowed card. The vivid `primary`/`secondary` colour fills still read on a flat fill; the frosted `surface`/`ghost`/`quiet` treatments do not.',
	tokens: 'src/lib/styles/glassmorphism.css',
	// Page-level composition — per-style type + media identity; structural ramp is
	// shared (SHARED_LAYOUT). Universal hygiene is delegated (see AGENTS.md).
	composition: {
		typeScale: {
			display: { size: 'clamp(2.5rem, 6vw, 4.5rem)', weight: '--glass-font-weight-bold' },
			h1: { size: 'clamp(2rem, 4vw, 3rem)', weight: '--glass-font-weight-bold' },
			h2: { size: 'clamp(1.5rem, 3vw, 2rem)', weight: '--glass-font-weight-semibold' },
			h3: { size: '1.25rem', weight: '--glass-font-weight-semibold' }, // = --glass-size-title
			character: 'Softest and airiest; looser heading line-heights, lightest weights of the three.'
		},
		...SHARED_LAYOUT,
		media: {
			filter: 'none',
			radius: '--glass-radius',
			edge: 'Soft themed override: --glass-border + --glass-highlight (the frosted rim).',
			shadow: '--glass-shadow'
		}
	},
	components: [
		{
			id: 'button',
			name: 'Button',
			import: 'glassmorphism.Button',
			styleClass: 'glass-btn',
			dataAttrs: ['variant', 'size', 'shape'],
			files: {
				style: 'src/lib/glassmorphism/css/button.css',
				skins: {
					react: 'registry/glassmorphism/button/Button.tsx',
					svelte: 'src/lib/glassmorphism/Button.svelte',
					html: 'registry/glassmorphism/button/button.html'
				}
			},
			description: 'Primary action. Renders as a <button>, or an <a> when given an href.',
			props: [
				{
					name: 'variant',
					description: 'Visual emphasis. `primary`/`secondary` are vivid translucent fills; `ghost`/`quiet` are bare.',
					type: 'enum',
					values: BUTTON_VARIANTS,
					default: 'primary'
				},
				{
					name: 'size',
					description: 'Overall size on the shared control scale.',
					type: 'enum',
					values: BUTTON_SIZES,
					default: 'md'
				},
				{
					name: 'shape',
					description: 'Corner treatment — rounded (`square`) or fully round (`pill`).',
					type: 'enum',
					values: BUTTON_SHAPES,
					default: 'square'
				},
				{
					name: 'disabled',
					description: 'Non-interactive, faded state.',
					type: 'boolean',
					default: false
				},
				{
					name: 'href',
					description: 'If set, renders as a link (<a>) instead of a <button>.',
					type: 'string',
					required: false,
					placeholder: '/path'
				}
			],
			snippets: [
				{ name: 'children', description: 'The button label.' },
				{ name: 'icon', description: 'Optional leading icon.' }
			],
			states: ['hover', 'active', 'focus']
		},
		{
			id: 'link',
			name: 'Link',
			import: 'glassmorphism.Link',
			styleClass: 'glass-link',
			dataAttrs: ['variant', 'active'],
			files: {
				style: 'src/lib/glassmorphism/css/link.css',
				skins: {
					react: 'registry/glassmorphism/link/Link.tsx',
					svelte: 'src/lib/glassmorphism/Link.svelte',
					html: 'registry/glassmorphism/link/link.html'
				}
			},
			description:
				"Navigation — the counterpart to Button's action. Always renders an <a>. Use `inline` inside prose and `nav` for sidebar/menu items.",
			props: [
				{
					name: 'variant',
					description:
						'inline = a text link in prose; nav = a compact, active-aware menu/sidebar item.',
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
					description:
						'Opens in a new tab — adds a ↗ affordance and rel="noopener noreferrer".',
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
			states: ['hover', 'focus']
		},
		{
			id: 'card',
			name: 'Card',
			import: 'glassmorphism.Card',
			styleClass: 'glass-card',
			dataAttrs: ['variant'],
			files: {
				style: 'src/lib/glassmorphism/css/card.css',
				skins: {
					react: 'registry/glassmorphism/card/Card.tsx',
					svelte: 'src/lib/glassmorphism/Card.svelte',
					html: 'registry/glassmorphism/card/card.html'
				}
			},
			description:
				'A frosted translucent surface with optional header and footer regions, divided by faint rules.',
			props: [
				{
					name: 'variant',
					description: 'Surface treatment — frosted (`surface`/`strong`) or a vivid translucent fill (`primary`/`secondary`).',
					type: 'enum',
					values: CARD_VARIANTS,
					default: 'surface'
				}
			],
			snippets: [
				{ name: 'header', description: 'Optional header region.' },
				{ name: 'children', description: 'The card body.' },
				{ name: 'footer', description: 'Optional footer region.' }
			]
		},
		{
			id: 'badge',
			name: 'Badge',
			import: 'glassmorphism.Badge',
			styleClass: 'glass-badge',
			dataAttrs: ['variant'],
			files: {
				style: 'src/lib/glassmorphism/css/badge.css',
				skins: {
					react: 'registry/glassmorphism/badge/Badge.tsx',
					svelte: 'src/lib/glassmorphism/Badge.svelte',
					html: 'registry/glassmorphism/badge/badge.html'
				}
			},
			description: 'A small, uppercase inline pill — a translucent tinted chip.',
			props: [
				{
					name: 'variant',
					description: 'Colour fill of the badge.',
					type: 'enum',
					values: BADGE_VARIANTS,
					default: 'primary'
				}
			],
			snippets: [{ name: 'children', description: 'The text shown on the badge.' }]
		},
		{
			id: 'input',
			name: 'Input',
			import: 'glassmorphism.Input',
			styleClass: 'glass-input',
			dataAttrs: ['size', 'shape'],
			files: {
				style: 'src/lib/glassmorphism/css/input.css',
				skins: {
					react: 'registry/glassmorphism/input/Input.tsx',
					svelte: 'src/lib/glassmorphism/Input.svelte',
					html: 'registry/glassmorphism/input/input.html'
				}
			},
			description:
				'A single-line text field — a frosted surface with a bindable value and a soft accent glow on focus.',
			props: [
				{
					name: 'size',
					description: 'Overall size of the field.',
					type: 'enum',
					values: INPUT_SIZES,
					default: 'md'
				},
				{
					name: 'shape',
					description: 'Corner style — square, or a fully rounded pill.',
					type: 'enum',
					values: INPUT_SHAPES,
					default: 'square'
				},
				{
					name: 'value',
					description: 'The current text value (two-way bindable).',
					type: 'string',
					bindable: true,
					default: ''
				},
				{
					name: 'placeholder',
					description: 'Hint text shown while the field is empty.',
					type: 'string',
					required: false
				},
				{
					name: 'disabled',
					description: 'Prevents interaction and dims the field.',
					type: 'boolean',
					default: false
				}
			],
			states: ['focus']
		},
		{
			id: 'alert',
			name: 'Alert',
			import: 'glassmorphism.Alert',
			styleClass: 'glass-alert',
			dataAttrs: ['variant', 'size'],
			files: {
				style: 'src/lib/glassmorphism/css/alert.css',
				skins: {
					react: 'registry/glassmorphism/alert/Alert.tsx',
					svelte: 'src/lib/glassmorphism/Alert.svelte',
					html: 'registry/glassmorphism/alert/alert.html'
				}
			},
			description:
				'An inline status message — a light frosted tint of the status colour, with the saturated colour on the icon + rim. Severity sets the aria role (error/warning announce assertively, info/success politely).',
			props: [
				{
					name: 'variant',
					description: 'The status level, which sets the colour and icon.',
					type: 'enum',
					values: ALERT_VARIANTS,
					default: 'info'
				},
				{
					name: 'size',
					description: 'Overall size of the alert.',
					type: 'enum',
					values: INPUT_SIZES,
					default: 'md'
				},
				{
					name: 'title',
					description: 'Optional bold heading above the message.',
					type: 'string',
					required: false
				}
			],
			snippets: [{ name: 'children', description: 'The alert message.' }]
		},
		{
			id: 'textarea',
			name: 'Textarea',
			import: 'glassmorphism.Textarea',
			styleClass: 'glass-textarea',
			dataAttrs: ['size'],
			files: {
				style: 'src/lib/glassmorphism/css/textarea.css',
				skins: {
					react: 'registry/glassmorphism/textarea/Textarea.tsx',
					svelte: 'src/lib/glassmorphism/Textarea.svelte',
					html: 'registry/glassmorphism/textarea/textarea.html'
				}
			},
			description:
				'A multiline text field — the same frosted field styling as Input, with a resizable height.',
			props: [
				{
					name: 'size',
					description: 'Overall size of the field.',
					type: 'enum',
					values: INPUT_SIZES,
					default: 'md'
				},
				{
					name: 'value',
					description: 'The current text value (two-way bindable).',
					type: 'string',
					bindable: true,
					default: ''
				},
				{
					name: 'placeholder',
					description: 'Hint text shown while the field is empty.',
					type: 'string',
					required: false
				},
				{
					name: 'rows',
					description: 'Visible height of the field, in text rows.',
					type: 'number',
					default: 4
				},
				{
					name: 'disabled',
					description: 'Prevents interaction and dims the field.',
					type: 'boolean',
					default: false
				}
			],
			states: ['focus']
		},
		{
			id: 'toggle',
			name: 'Toggle',
			import: 'glassmorphism.Toggle',
			styleClass: 'glass-toggle',
			dataAttrs: ['size', 'checked'],
			files: {
				style: 'src/lib/glassmorphism/css/toggle.css',
				skins: {
					react: 'registry/glassmorphism/toggle/Toggle.tsx',
					svelte: 'src/lib/glassmorphism/Toggle.svelte',
					html: 'registry/glassmorphism/toggle/toggle.html'
				}
			},
			description:
				'An accessible on/off switch (button role="switch") with a bindable checked state and a sliding round thumb; the track fills indigo when on.',
			props: [
				{
					name: 'size',
					description: 'Overall size of the switch.',
					type: 'enum',
					values: INPUT_SIZES,
					default: 'md'
				},
				{
					name: 'checked',
					description: 'Whether the switch is on (two-way bindable).',
					type: 'boolean',
					bindable: true,
					default: false
				},
				{
					name: 'label',
					description: 'Optional text shown beside the switch.',
					type: 'string',
					required: false
				},
				{
					name: 'disabled',
					description: 'Prevents interaction and dims the switch.',
					type: 'boolean',
					default: false
				}
			],
			states: ['focus']
		},
		{
			id: 'checkbox',
			name: 'Checkbox',
			import: 'glassmorphism.Checkbox',
			styleClass: 'glass-checkbox',
			dataAttrs: ['size', 'checked', 'disabled'],
			files: {
				style: 'src/lib/glassmorphism/css/checkbox.css',
				skins: {
					react: 'registry/glassmorphism/checkbox/Checkbox.tsx',
					svelte: 'src/lib/glassmorphism/Checkbox.svelte',
					html: 'registry/glassmorphism/checkbox/checkbox.html'
				}
			},
			description:
				'An accessible checkbox — a native <input type="checkbox"> restyled as a frosted box that fills indigo with a white tick when checked. Bindable checked state.',
			props: [
				{
					name: 'size',
					description: 'Overall size of the checkbox.',
					type: 'enum',
					values: INPUT_SIZES,
					default: 'md'
				},
				{
					name: 'checked',
					description: 'Whether the box is ticked (two-way bindable).',
					type: 'boolean',
					bindable: true,
					default: false
				},
				{
					name: 'label',
					description: 'Optional text shown beside the box.',
					type: 'string',
					required: false
				},
				{
					name: 'disabled',
					description: 'Prevents interaction and dims the checkbox.',
					type: 'boolean',
					default: false
				}
			],
			states: ['focus']
		},
		{
			id: 'select',
			name: 'Select',
			import: 'glassmorphism.Select',
			styleClass: 'glass-select',
			dataAttrs: ['size', 'disabled'],
			files: {
				style: 'src/lib/glassmorphism/css/select.css',
				skins: {
					react: 'registry/glassmorphism/select/Select.tsx',
					svelte: 'src/lib/glassmorphism/Select.svelte',
					html: 'registry/glassmorphism/select/select.html'
				}
			},
			description:
				'A native <select> restyled to the frosted field language with a custom chevron. Single-select from a list of options, with the same size scale as Input.',
			props: [
				{
					name: 'options',
					description: 'The list of choices (each string is both the label and the value).',
					type: 'array',
					default: ['Free', 'Pro', 'Team']
				},
				{
					name: 'value',
					description: 'The selected option (two-way bindable).',
					type: 'string',
					bindable: true,
					default: 'Free'
				},
				{
					name: 'size',
					description: 'Overall size of the field.',
					type: 'enum',
					values: INPUT_SIZES,
					default: 'md'
				},
				{
					name: 'placeholder',
					description: 'Optional leading hint option shown when no value is selected.',
					type: 'string',
					required: false
				},
				{
					name: 'disabled',
					description: 'Prevents interaction and dims the field.',
					type: 'boolean',
					default: false
				}
			],
			states: ['focus']
		},
		{
			id: 'field',
			name: 'Field',
			import: 'glassmorphism.Field',
			styleClass: 'glass-field',
			dataAttrs: ['error', 'shape'],
			files: {
				style: 'src/lib/glassmorphism/css/field.css',
				skins: {
					react: 'registry/glassmorphism/field/Field.tsx',
					svelte: 'src/lib/glassmorphism/Field.svelte',
					html: 'registry/glassmorphism/field/field.html'
				}
			},
			description:
				'A form-field wrapper: a label (with optional required mark) above a control, and a help line or error message below. Wrap a single text-style control (Input, Textarea, Select).',
			props: [
				{
					name: 'label',
					description: 'The field label shown above the control.',
					type: 'string',
					default: 'Email'
				},
				{
					name: 'help',
					description: 'Hint text shown below the control (hidden when error is set).',
					type: 'string',
					placeholder: "We'll never share it.",
					required: false
				},
				{
					name: 'error',
					description: 'Error message shown below the control; replaces help and flags the field.',
					type: 'string',
					required: false
				},
				{
					name: 'required',
					description: 'Shows a required mark after the label.',
					type: 'boolean',
					default: false
				},
				{
					name: 'shape',
					description: 'Corner style of the wrapped control — square, or a fully rounded pill.',
					type: 'enum',
					values: FIELD_SHAPES,
					default: 'square'
				}
			],
			snippets: [
				{
					name: 'children',
					description: 'The form control the field wraps.',
					sample: 'input'
				}
			]
		},
		{
			id: 'modal',
			name: 'Modal',
			import: 'glassmorphism.Modal',
			styleClass: 'glass-modal',
			dataAttrs: ['has-header'],
			files: {
				style: 'src/lib/glassmorphism/css/modal.css',
				skins: {
					react: 'registry/glassmorphism/modal/Modal.tsx',
					svelte: 'src/lib/glassmorphism/Modal.svelte',
					html: 'registry/glassmorphism/modal/modal.html'
				}
			},
			description:
				'A dialog built on the native <dialog> element: top-layer rendering, a real focus trap, Esc-to-close, and a blurred backdrop, all skinned as frosted glass. Controlled via a bindable open state.',
			trigger: 'Open Modal',
			props: [
				{
					name: 'open',
					description: 'Whether the modal is shown (two-way bindable).',
					type: 'boolean',
					bindable: true,
					default: false
				},
				{
					name: 'dismissible',
					description: 'Whether Esc and backdrop-clicks dismiss the modal.',
					type: 'boolean',
					default: true
				}
			],
			snippets: [
				{ name: 'header', description: 'The title region, divided by a faint rule.' },
				{ name: 'children', description: 'The modal body content.' },
				{ name: 'footer', description: 'The actions region, divided by a faint rule.' }
			]
		},
		{
			id: 'tabs',
			name: 'Tabs',
			import: 'glassmorphism.Tabs',
			styleClass: 'glass-tabs',
			dataAttrs: ['active'],
			files: {
				style: 'src/lib/glassmorphism/css/tabs.css',
				skins: {
					react: 'registry/glassmorphism/tabs/Tabs.tsx',
					svelte: 'src/lib/glassmorphism/Tabs.svelte',
					html: 'registry/glassmorphism/tabs/tabs.html'
				}
			},
			description:
				'A single-select tab set using the WAI-ARIA roving-tabindex pattern (Arrow/Home/End move focus and selection). The panel content is a snippet that receives the active tab label.',
			props: [
				{
					name: 'tabs',
					description: 'The tab labels.',
					type: 'array',
					default: ['Overview', 'Pricing', 'Reviews']
				},
				{
					name: 'value',
					description: 'The active tab (two-way bindable).',
					type: 'string',
					bindable: true,
					default: 'Overview'
				}
			],
			snippets: [
				{
					name: 'children',
					description: 'The active panel content; receives the active tab label.',
					parameterized: true
				}
			]
		},
		{
			id: 'accordion',
			name: 'Accordion',
			import: 'glassmorphism.Accordion',
			styleClass: 'glass-accordion',
			files: {
				style: 'src/lib/glassmorphism/css/accordion.css',
				skins: {
					react: 'registry/glassmorphism/accordion/Accordion.tsx',
					svelte: 'src/lib/glassmorphism/Accordion.svelte',
					html: 'registry/glassmorphism/accordion/accordion.html'
				}
			},
			description:
				'Stacked disclosure built on native <details>/<summary> (open/close, keyboard, and a11y for free). In exclusive mode the native `name` attribute keeps only one section open at a time. The panel body is a snippet that receives the section label.',
			props: [
				{
					name: 'items',
					description: 'The section labels.',
					type: 'array',
					default: ['Getting started', 'Billing', 'FAQ']
				},
				{
					name: 'exclusive',
					description: 'Only one section open at a time (native single-open grouping).',
					type: 'boolean',
					default: true
				}
			],
			snippets: [
				{
					name: 'children',
					description: 'The panel content for a section; receives the section label.',
					parameterized: true
				}
			]
		},
		{
			id: 'spinner',
			name: 'Spinner',
			import: 'glassmorphism.Spinner',
			styleClass: 'glass-spinner',
			dataAttrs: ['size', 'speed'],
			files: {
				style: 'src/lib/glassmorphism/css/spinner.css',
				skins: {
					react: 'registry/glassmorphism/spinner/Spinner.tsx',
					svelte: 'src/lib/glassmorphism/Spinner.svelte',
					html: 'registry/glassmorphism/spinner/spinner.html'
				}
			},
			description:
				'Indeterminate loading: a round frosted ring with one indigo arc, rotating. role="status" with an accessible label.',
			props: [
				{
					name: 'size',
					description: 'Overall size of the spinner.',
					type: 'enum',
					values: INPUT_SIZES,
					default: 'md'
				},
				{
					name: 'speed',
					description: 'Rotation speed.',
					type: 'enum',
					values: SPINNER_SPEEDS,
					default: 'normal'
				},
				{
					name: 'label',
					description: 'Accessible label announced while loading.',
					type: 'string',
					default: 'Loading'
				}
			]
		},
		{
			id: 'progress',
			name: 'Progress',
			import: 'glassmorphism.Progress',
			styleClass: 'glass-progress',
			dataAttrs: ['size', 'show'],
			files: {
				style: 'src/lib/glassmorphism/css/progress.css',
				skins: {
					react: 'registry/glassmorphism/progress/Progress.tsx',
					svelte: 'src/lib/glassmorphism/Progress.svelte',
					html: 'registry/glassmorphism/progress/progress.html'
				}
			},
			description:
				'Determinate progress: an indigo fill in a pill-shaped frosted track. role="progressbar" with aria-valuenow. `value` is 0–100.',
			props: [
				{
					name: 'value',
					description: 'Completion percentage (0–100).',
					type: 'number',
					default: 60
				},
				{
					name: 'size',
					description: 'Track thickness.',
					type: 'enum',
					values: INPUT_SIZES,
					default: 'md'
				},
				{
					name: 'showValue',
					description: 'Show the rounded percentage after the bar.',
					type: 'boolean',
					default: false
				}
			]
		},
		{
			id: 'skeleton',
			name: 'Skeleton',
			import: 'glassmorphism.Skeleton',
			styleClass: 'glass-skeleton',
			files: {
				style: 'src/lib/glassmorphism/css/skeleton.css',
				skins: {
					react: 'registry/glassmorphism/skeleton/Skeleton.tsx',
					svelte: 'src/lib/glassmorphism/Skeleton.svelte',
					html: 'registry/glassmorphism/skeleton/skeleton.html'
				}
			},
			description:
				'A loading placeholder — a frosted surface with a highlight that sweeps across (shimmer) while content loads. `text` renders N lines (last one short); `rect`/`circle` are single blocks sized by width/height. Decorative — role="status", aria-label="Loading".',
			props: [
				{
					name: 'shape',
					description: 'text = stacked lines; rect = a block; circle = a round blob.',
					type: 'enum',
					values: SKELETON_SHAPES,
					default: 'text'
				},
				{
					name: 'lines',
					description: 'How many lines to render (text shape only).',
					type: 'number',
					default: 5
				},
				{
					name: 'width',
					description: 'CSS width (e.g. 100%, 20rem); the diameter for circle.',
					type: 'string',
					required: false,
					placeholder: 'e.g. 100%, 20rem'
				},
				{
					name: 'height',
					description: 'CSS height (rect shape only).',
					type: 'string',
					required: false,
					placeholder: 'e.g. 8rem'
				}
			]
		},
		{
			id: 'radio-group',
			name: 'RadioGroup',
			import: 'glassmorphism.RadioGroup',
			styleClass: 'glass-radio',
			dataAttrs: ['checked', 'disabled'],
			files: {
				style: 'src/lib/glassmorphism/css/radio-group.css',
				skins: {
					react: 'registry/glassmorphism/radio-group/RadioGroup.tsx',
					svelte: 'src/lib/glassmorphism/RadioGroup.svelte',
					html: 'registry/glassmorphism/radio-group/radio-group.html'
				}
			},
			description:
				'A single-select group of options built on native <input type="radio">. Each option shows a round frosted dot that fills indigo with a white inner dot when selected.',
			props: [
				{
					name: 'options',
					description: 'The list of choices (each string is both the label and the value).',
					type: 'array',
					default: ['Free', 'Pro', 'Team']
				},
				{
					name: 'value',
					description: 'The selected option (two-way bindable).',
					type: 'string',
					bindable: true,
					default: 'Free'
				},
				{
					name: 'disabled',
					description: 'Prevents interaction and dims the group.',
					type: 'boolean',
					default: false
				},
				{
					name: 'name',
					description: 'Shared form field name for the group; auto-generated if omitted.',
					type: 'string',
					required: false
				}
			],
			states: ['focus']
		},
		{
			id: 'dropdown-menu',
			name: 'Dropdown Menu',
			import: 'glassmorphism.DropdownMenu',
			styleClass: 'glass-dropdown',
			dataAttrs: ['size'],
			files: {
				style: 'src/lib/glassmorphism/css/dropdown-menu.css',
				skins: {
					react: 'registry/glassmorphism/dropdown-menu/DropdownMenu.tsx',
					svelte: 'src/lib/glassmorphism/DropdownMenu.svelte',
					html: 'registry/glassmorphism/dropdown-menu/dropdown-menu.html'
				}
			},
			description:
				'An anchored menu on the native `popover` attribute (top-layer, light-dismiss, Esc) + CSS Anchor Positioning (tracks the trigger, flips up when cramped) — no JS positioning library. Adds role=menu semantics and arrow-key navigation.',
			props: [
				{
					name: 'size',
					description: 'Overall size of the trigger and menu.',
					type: 'enum',
					values: INPUT_SIZES,
					default: 'md'
				},
				{
					name: 'label',
					description: 'The trigger button text.',
					type: 'string',
					default: 'Menu'
				},
				{
					name: 'items',
					description: 'The menu item labels.',
					type: 'array',
					default: ['Edit', 'Duplicate', 'Delete']
				}
			]
		},
		{
			id: 'toast',
			name: 'Toast',
			// Imperative, not a rendered element: call the function; a single
			// <Toaster /> mounted at the app root shows the stack.
			import: 'glassmorphism.toast',
			styleClass: 'glass-toaster',
			registryDeps: ['alert'],
			files: {
				style: 'src/lib/glassmorphism/css/toast.css',
				skins: {
					react: [
						'registry/glassmorphism/toast/toast.ts',
						'registry/glassmorphism/toast/Toaster.tsx'
					],
					svelte: [
						'src/lib/glassmorphism/toast.svelte.ts',
						'src/lib/glassmorphism/Toaster.svelte'
					],
					html: 'registry/glassmorphism/toast/toast.html'
				}
			},
			description:
				'A transient notification fired imperatively — call toast(message) (or toast.success/error/…) and a <Toaster /> mounted once at the app root shows it, top-right, auto-dismissing. Each toast reuses the frosted Alert skin.',
			trigger: 'Show toast',
			props: [
				{
					name: 'variant',
					description: 'The status level, which sets the colour and icon.',
					type: 'enum',
					values: ALERT_VARIANTS,
					default: 'info'
				},
				{
					name: 'duration',
					description: 'Auto-dismiss delay in milliseconds (0 = sticky, no auto-dismiss).',
					type: 'number',
					default: 2500
				}
			],
			snippets: [{ name: 'children', description: 'The toast message (the first argument).' }]
		}
	]
};
