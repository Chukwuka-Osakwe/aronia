// Swiss / International Typographic Style — manifest (StyleSpec).
// enum `values` imported from ./options.ts (single source of truth); prose
// fields (description/whenToUse/principles/avoid) are the agent-facing guidance.
import type { StyleSpec } from '../manifest/schema.js';
import { SHARED_LAYOUT } from '../manifest/composition-base.js';
import {
	BUTTON_VARIANTS,
	BUTTON_SIZES,
	BUTTON_SHAPES,
	LINK_VARIANTS,
	INPUT_SIZES,
	INPUT_SHAPES,
	FIELD_SHAPES,
	CHECKBOX_SHAPES,
	TOGGLE_SHAPES,
	DROPDOWN_SHAPES,
	CARD_VARIANTS,
	CARD_FOOTER_ALIGNS,
	BADGE_VARIANTS,
	BADGE_SHAPES,
	ALERT_VARIANTS,
	SPINNER_SPEEDS,
	SKELETON_SHAPES
} from './options.js';

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
		'Separate elements with hairline 1px borders and keep surfaces flat — reserve shadow for true overlays (modal, menu) only.',
		'Dark mode is the same near-monochrome discipline turned inside-out — off-black stock, off-white ink, opt-in via a data-theme flag, never a second aesthetic. Off-black not pure black, off-white not pure white: the same rule both ways — near-pure contrast vibrates and reads as the generic "charcoal SaaS" drama Swiss exists to escape. Nothing else changes its logic — hierarchy still rides type weight, the single hazard-orange stays the one reserved accent (its dark ink label holds on the orange in both themes). Elevation leans HARDER on the hairline: a dark shadow is near-invisible on a dark ground, so the light 1px border does the separating. State stays colour-only, but a hover RAISES the fill↔label contrast — lift a dark-labelled fill toward the ink anchor, deepen a light-labelled one — so it never drifts to a white halo or sinks into the stock.'
	],
	// Anti-patterns — the things that break the language.
	avoid: [
		'Gradients, glows, blur, or decorative drop shadows.',
		'More than one accent colour, or using the accent for large fills and backgrounds.',
		'Ornamentation, overly rounded "friendly" shapes, or skeuomorphic depth.',
		'Centred body text or justified columns.',
		'A bespoke second dark theme — a twin token set or a separate dark stylesheet. Dark is the same tokens re-valued through the ink/paper anchors; a component needing hand-written dark CSS is a smell. And pure-black stock or pure-white ink — the never-pure rule in both directions.'
	],
	tokens: 'src/lib/styles/swiss.css',
	// How to swap the face while keeping Swiss's character — a lens, not a shortlist.
	fontGuidance: {
		dependsOn:
			'A neutral grotesque sans: low stroke contrast, even uniform strokes, a generous x-height and NO personality quirks — the objectivity is the whole point. Hierarchy rides weight, not colour, so it needs a distinct, usable medium (500), semibold (600) and bold (700). The shipped Helvetica system stack embodies this.',
		breaksOn:
			'Anything with character or warmth — humanist quirks, a geometric voice, condensed or display faces, high stroke contrast — or a face without a true medium/bold, which flattens the weight-driven hierarchy the whole family leans on.',
		examples:
			'Inter, Helvetica Now, Neue Haas Grotesk, Söhne, Univers, Basel Grotesk — and plenty of other neutral grotesques in this vein.',
		watch:
			'Swiss ships as a SYSTEM stack with no font loader — swapping to a custom face means ADDING an @font-face/webfont loader you don’t currently have (keep a real system fallback so layout doesn’t jump on load). Confirm the face gives distinct 500/600/700; the --swiss-font-weight-* ladder assumes all three read apart.'
	},
	// Page-level composition — per-style type + media identity; structural ramp is
	// shared (SHARED_LAYOUT). Universal hygiene is delegated (see AGENTS.md).
	composition: {
		typeScale: {
			display: { size: 'clamp(2.5rem, 6vw, 4.5rem)', weight: '--swiss-font-weight-bold' },
			h1: { size: 'clamp(2rem, 4vw, 3rem)', weight: '--swiss-font-weight-bold' },
			h2: { size: 'clamp(1.6rem, 3vw, 2.25rem)', weight: '--swiss-font-weight-bold' },
			h3: { size: '1.375rem', weight: '--swiss-font-weight-semibold' }, // = --swiss-size-title
			character:
				'Tight tracking on large headings (down to -0.02em on display); flush-left, ragged-right; hierarchy from weight, never colour.'
		},
		...SHARED_LAYOUT,
		media: {
			filter: 'grayscale(1) contrast(1.04)',
			radius: '--swiss-radius',
			edge: 'Rides the universal neutral inset outline — no themed override; or borderless for full-bleed editorial.',
			shadow: 'none'
		}
	},
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
		},
		{
			id: 'input',
			name: 'Input',
			import: 'swiss.Input',
			description:
				'A single-line text field: flat paper, a hairline ink border, crisp 2px corners, and the shared accent focus ring. Bindable value.',
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
			states: ['focus'],
			styleClass: 'swiss-input',
			dataAttrs: ['size', 'shape'],
			files: {
				style: 'src/lib/swiss/css/input.css',
				skins: {
					react: ['registry/swiss/input/Input.tsx', 'registry/swiss/field/field-context.ts'],
					svelte: ['src/lib/swiss/Input.svelte', 'src/lib/swiss/field-context.ts'],
					html: 'registry/swiss/input/input.html'
				}
			}
		},
		{
			id: 'textarea',
			name: 'Textarea',
			import: 'swiss.Textarea',
			description:
				'A multiline text field — the same Swiss field styling as Input, with a resizable height.',
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
			states: ['focus'],
			styleClass: 'swiss-textarea',
			dataAttrs: ['size'],
			files: {
				style: 'src/lib/swiss/css/textarea.css',
				skins: {
					react: ['registry/swiss/textarea/Textarea.tsx', 'registry/swiss/field/field-context.ts'],
					svelte: ['src/lib/swiss/Textarea.svelte', 'src/lib/swiss/field-context.ts'],
					html: 'registry/swiss/textarea/textarea.html'
				}
			}
		},
		{
			id: 'field',
			name: 'Field',
			import: 'swiss.Field',
			description:
				'A form-field wrapper: a semibold label (with optional required mark) above a control, and a quiet help line or error message below. Wrap a single text-style control (Input, Textarea, Select).',
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
					name: 'size',
					description: 'Size of the wrapped control — pushed down to it (Input/Textarea/Select).',
					type: 'enum',
					values: INPUT_SIZES,
					default: 'md'
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
			],
			styleClass: 'swiss-field',
			dataAttrs: ['shape', 'size'],
			files: {
				style: 'src/lib/swiss/css/field.css',
				skins: {
					react: ['registry/swiss/field/Field.tsx', 'registry/swiss/field/field-context.ts'],
					svelte: ['src/lib/swiss/Field.svelte', 'src/lib/swiss/field-context.ts'],
					html: 'registry/swiss/field/field.html'
				}
			}
		},
		{
			id: 'checkbox',
			name: 'Checkbox',
			import: 'swiss.Checkbox',
			description:
				'An accessible checkbox — a native <input type="checkbox"> restyled as a flat hairline box that fills with ink and a white tick when checked (monochrome, keeping the accent reserved). Bindable checked state.',
			props: [
				{
					name: 'size',
					description: 'Overall size of the checkbox.',
					type: 'enum',
					values: INPUT_SIZES,
					default: 'md'
				},
				{
					name: 'shape',
					description: 'Corner style of the box — square, or fully round (a circle).',
					type: 'enum',
					values: CHECKBOX_SHAPES,
					default: 'square'
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
			states: ['focus'],
			styleClass: 'swiss-checkbox',
			dataAttrs: ['size', 'checked', 'disabled', 'shape'],
			files: {
				style: 'src/lib/swiss/css/checkbox.css',
				skins: {
					react: 'registry/swiss/checkbox/Checkbox.tsx',
					svelte: 'src/lib/swiss/Checkbox.svelte',
					html: 'registry/swiss/checkbox/checkbox.html'
				}
			}
		},
		{
			id: 'radio-group',
			name: 'RadioGroup',
			import: 'swiss.RadioGroup',
			description:
				'A single-select group of native <input type="radio">. Each option shows a circular ring that fills with an ink inner disc when selected (monochrome, the counterpart to Checkbox).',
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
			states: ['focus'],
			styleClass: 'swiss-radio',
			dataAttrs: ['checked', 'disabled'],
			files: {
				style: 'src/lib/swiss/css/radio-group.css',
				skins: {
					react: 'registry/swiss/radio-group/RadioGroup.tsx',
					svelte: 'src/lib/swiss/RadioGroup.svelte',
					html: 'registry/swiss/radio-group/radio-group.html'
				}
			}
		},
		{
			id: 'select',
			name: 'Select',
			import: 'swiss.Select',
			description:
				'A native <select> restyled to the Swiss field language with a custom chevron. Single-select from a list of options, with the same size scale as Input.',
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
			states: ['focus'],
			styleClass: 'swiss-select',
			dataAttrs: ['size', 'disabled'],
			files: {
				style: 'src/lib/swiss/css/select.css',
				skins: {
					react: ['registry/swiss/select/Select.tsx', 'registry/swiss/field/field-context.ts'],
					svelte: ['src/lib/swiss/Select.svelte', 'src/lib/swiss/field-context.ts'],
					html: 'registry/swiss/select/select.html'
				}
			}
		},
		{
			id: 'toggle',
			name: 'Toggle',
			import: 'swiss.Toggle',
			description:
				'An accessible on/off switch (button role="switch") with a bindable checked state and a sliding thumb. The track fills hazard-orange when on — the one accent moment in the forms family.',
			props: [
				{
					name: 'size',
					description: 'Overall size of the switch.',
					type: 'enum',
					values: INPUT_SIZES,
					default: 'md'
				},
				{
					name: 'shape',
					description: 'Track/thumb style — square, or a pill track with a round thumb.',
					type: 'enum',
					values: TOGGLE_SHAPES,
					default: 'square'
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
			states: ['focus'],
			styleClass: 'swiss-toggle',
			dataAttrs: ['size', 'checked', 'shape'],
			files: {
				style: 'src/lib/swiss/css/toggle.css',
				skins: {
					react: 'registry/swiss/toggle/Toggle.tsx',
					svelte: 'src/lib/swiss/Toggle.svelte',
					html: 'registry/swiss/toggle/toggle.html'
				}
			}
		},
		{
			id: 'card',
			name: 'Card',
			import: 'swiss.Card',
			description:
				'A flat bordered container with crisp 2px corners and optional header/footer regions divided by a hairline rule.',
			props: [
				{
					name: 'variant',
					description:
						'Surface style — paper (default), a muted grey section, or a bold inverted ink panel.',
					type: 'enum',
					values: CARD_VARIANTS,
					default: 'paper'
				},
				{
					name: 'footerAlign',
					description: 'How footer actions are arranged along the row.',
					type: 'enum',
					values: CARD_FOOTER_ALIGNS,
					default: 'end'
				}
			],
			snippets: [
				{ name: 'children', description: 'The content shown inside the card.' },
				{ name: 'header', description: 'Optional header region, divided by a hairline rule.' },
				{ name: 'footer', description: 'Optional footer region, divided by a hairline rule.' }
			],
			styleClass: 'swiss-card',
			dataAttrs: ['variant', 'footer-align'],
			files: {
				style: 'src/lib/swiss/css/card.css',
				skins: {
					react: 'registry/swiss/card/Card.tsx',
					svelte: 'src/lib/swiss/Card.svelte',
					html: 'registry/swiss/card/card.html'
				}
			}
		},
		{
			id: 'alert',
			name: 'Alert',
			import: 'swiss.Alert',
			description:
				'A restrained inline status message: a paper box with a 2px coloured border and icon, and ink text (severity is signalled by the mark, not a full colour flood). Severity sets the aria role (error/warning announce assertively, info/success politely).',
			props: [
				{
					name: 'variant',
					description: 'The status level, which sets the bar/icon colour and the icon.',
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
			snippets: [{ name: 'children', description: 'The alert message.' }],
			styleClass: 'swiss-alert',
			dataAttrs: ['variant', 'size'],
			files: {
				style: 'src/lib/swiss/css/alert.css',
				skins: {
					react: 'registry/swiss/alert/Alert.tsx',
					svelte: 'src/lib/swiss/Alert.svelte',
					html: 'registry/swiss/alert/alert.html'
				}
			}
		},
		{
			id: 'badge',
			name: 'Badge',
			import: 'swiss.Badge',
			description: 'A small, uppercase, letter-spaced inline label — the Swiss caption.',
			props: [
				{
					name: 'variant',
					description:
						'Emphasis — neutral (outline, default), solid (ink fill), muted (grey), or accent.',
					type: 'enum',
					values: BADGE_VARIANTS,
					default: 'neutral'
				},
				{
					name: 'shape',
					description: 'Corner style — square, or a fully rounded pill.',
					type: 'enum',
					values: BADGE_SHAPES,
					default: 'square'
				}
			],
			snippets: [{ name: 'children', description: 'The text shown on the badge.' }],
			styleClass: 'swiss-badge',
			dataAttrs: ['variant', 'shape'],
			files: {
				style: 'src/lib/swiss/css/badge.css',
				skins: {
					react: 'registry/swiss/badge/Badge.tsx',
					svelte: 'src/lib/swiss/Badge.svelte',
					html: 'registry/swiss/badge/badge.html'
				}
			}
		},
		{
			id: 'modal',
			name: 'Modal',
			import: 'swiss.Modal',
			description:
				'A dialog built on the native <dialog> element: top-layer rendering, a real focus trap, Esc-to-close, and a flat dim backdrop. A true overlay, so it carries the reserved soft shadow off the flat page. Controlled via a bindable open state.',
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
				{ name: 'header', description: 'The title region, divided by a hairline rule.' },
				{ name: 'children', description: 'The modal body content.' },
				{ name: 'footer', description: 'The actions region, divided by a hairline rule.' }
			],
			styleClass: 'swiss-modal',
			dataAttrs: ['has-header'],
			files: {
				style: 'src/lib/swiss/css/modal.css',
				skins: {
					react: 'registry/swiss/modal/Modal.tsx',
					svelte: 'src/lib/swiss/Modal.svelte',
					html: 'registry/swiss/modal/modal.html'
				}
			}
		},
		{
			id: 'dropdown-menu',
			name: 'Dropdown Menu',
			import: 'swiss.DropdownMenu',
			description:
				'An anchored menu on the native `popover` attribute (top-layer, light-dismiss, Esc) + CSS Anchor Positioning (tracks the trigger, flips up when cramped) — no JS positioning library. The menu is a true overlay, carrying the reserved soft shadow. Adds role=menu semantics and arrow-key navigation.',
			props: [
				{
					name: 'size',
					description: 'Overall size of the trigger and menu.',
					type: 'enum',
					values: INPUT_SIZES,
					default: 'md'
				},
				{
					name: 'shape',
					description: 'Corner style of the trigger — square, or a fully rounded pill.',
					type: 'enum',
					values: DROPDOWN_SHAPES,
					default: 'square'
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
			],
			styleClass: 'swiss-dropdown',
			dataAttrs: ['size', 'shape'],
			files: {
				style: 'src/lib/swiss/css/dropdown-menu.css',
				skins: {
					react: 'registry/swiss/dropdown-menu/DropdownMenu.tsx',
					svelte: 'src/lib/swiss/DropdownMenu.svelte',
					html: 'registry/swiss/dropdown-menu/dropdown-menu.html'
				}
			}
		},
		{
			id: 'spinner',
			name: 'Spinner',
			import: 'swiss.Spinner',
			description:
				'Indeterminate loading: a circular ring with one ink arc, rotating — the restrained minimalist spinner (monochrome, so the accent stays reserved). role="status" with an accessible label.',
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
			],
			styleClass: 'swiss-spinner',
			dataAttrs: ['size', 'speed'],
			files: {
				style: 'src/lib/swiss/css/spinner.css',
				skins: {
					react: 'registry/swiss/spinner/Spinner.tsx',
					svelte: 'src/lib/swiss/Spinner.svelte',
					html: 'registry/swiss/spinner/spinner.html'
				}
			}
		},
		{
			id: 'progress',
			name: 'Progress',
			import: 'swiss.Progress',
			description:
				'Determinate progress: an accent fill in a flat bordered track. role="progressbar" with aria-valuenow. `value` is 0–100.',
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
			],
			styleClass: 'swiss-progress',
			dataAttrs: ['size', 'show'],
			files: {
				style: 'src/lib/swiss/css/progress.css',
				skins: {
					react: 'registry/swiss/progress/Progress.tsx',
					svelte: 'src/lib/swiss/Progress.svelte',
					html: 'registry/swiss/progress/progress.html'
				}
			}
		},
		{
			id: 'skeleton',
			name: 'Skeleton',
			import: 'swiss.Skeleton',
			description:
				'A loading placeholder that pulses while content loads. `text` renders N lines (last one short); `rect`/`circle` are single blocks sized by width/height. Flat muted fill, opacity pulse (no shimmer). Decorative — role="status", aria-label="Loading".',
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
			],
			styleClass: 'swiss-skeleton',
			files: {
				style: 'src/lib/swiss/css/skeleton.css',
				skins: {
					react: 'registry/swiss/skeleton/Skeleton.tsx',
					svelte: 'src/lib/swiss/Skeleton.svelte',
					html: 'registry/swiss/skeleton/skeleton.html'
				}
			}
		},
		{
			id: 'tabs',
			name: 'Tabs',
			import: 'swiss.Tabs',
			description:
				'A single-select tab set using the WAI-ARIA roving-tabindex pattern (Arrow/Home/End move focus and selection). The active tab is a monochrome ink fill. The panel content is a snippet that receives the active tab label.',
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
			],
			styleClass: 'swiss-tabs',
			dataAttrs: ['active'],
			files: {
				style: 'src/lib/swiss/css/tabs.css',
				skins: {
					react: 'registry/swiss/tabs/Tabs.tsx',
					svelte: 'src/lib/swiss/Tabs.svelte',
					html: 'registry/swiss/tabs/tabs.html'
				}
			}
		},
		{
			id: 'accordion',
			name: 'Accordion',
			import: 'swiss.Accordion',
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
			],
			styleClass: 'swiss-accordion',
			files: {
				style: 'src/lib/swiss/css/accordion.css',
				skins: {
					react: 'registry/swiss/accordion/Accordion.tsx',
					svelte: 'src/lib/swiss/Accordion.svelte',
					html: 'registry/swiss/accordion/accordion.html'
				}
			}
		},
		{
			id: 'toast',
			name: 'Toast',
			// Imperative, not a rendered element: call the function; a single
			// <Toaster /> mounted at the app root shows the stack.
			import: 'swiss.toast',
			description:
				'A transient notification fired imperatively — call toast(message) (or toast.success/error/…) and a <Toaster /> mounted once at the app root shows it, top-right, auto-dismissing. Each toast reuses the Alert skin.',
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
			snippets: [{ name: 'children', description: 'The toast message (the first argument).' }],
			styleClass: 'swiss-toaster',
			registryDeps: ['alert'],
			files: {
				style: 'src/lib/swiss/css/toast.css',
				skins: {
					react: ['registry/swiss/toast/toast.ts', 'registry/swiss/toast/Toaster.tsx'],
					svelte: ['src/lib/swiss/toast.svelte.ts', 'src/lib/swiss/Toaster.svelte'],
					html: 'registry/swiss/toast/toast.html'
				}
			}
		}
	]
};
