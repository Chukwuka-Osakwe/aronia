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
	BADGE_SHAPES,
	INPUT_SIZES,
	INPUT_SHAPES,
	FIELD_SHAPES,
	CHECKBOX_SHAPES,
	TOGGLE_SHAPES,
	DROPDOWN_SHAPES,
	ALERT_VARIANTS,
	SPINNER_SPEEDS,
	SKELETON_SHAPES
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
			],
			styleClass: 'riso-btn',
			dataAttrs: ['variant', 'size', 'shape'],
			files: {
				style: 'src/lib/risograph/css/button.css',
				skins: {
					react: 'registry/risograph/button/Button.tsx',
					svelte: 'src/lib/risograph/Button.svelte',
					html: 'registry/risograph/button/button.html'
				}
			}
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
			snippets: [{ name: 'children', description: 'Link text.' }],
			styleClass: 'riso-link',
			dataAttrs: ['variant', 'active'],
			files: {
				style: 'src/lib/risograph/css/link.css',
				skins: {
					react: 'registry/risograph/link/Link.tsx',
					svelte: 'src/lib/risograph/Link.svelte',
					html: 'registry/risograph/link/link.html'
				}
			}
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
			],
			styleClass: 'riso-card',
			dataAttrs: ['variant'],
			files: {
				style: 'src/lib/risograph/css/card.css',
				skins: {
					react: 'registry/risograph/card/Card.tsx',
					svelte: 'src/lib/risograph/Card.svelte',
					html: 'registry/risograph/card/card.html'
				}
			}
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
			snippets: [{ name: 'children', description: 'Badge label.' }],
			styleClass: 'riso-badge',
			dataAttrs: ['variant', 'shape'],
			files: {
				style: 'src/lib/risograph/css/badge.css',
				skins: {
					react: 'registry/risograph/badge/Badge.tsx',
					svelte: 'src/lib/risograph/Badge.svelte',
					html: 'registry/risograph/badge/badge.html'
				}
			}
		},
		{
			id: 'input',
			name: 'Input',
			import: 'risograph.Input',
			description:
				'A single-line text field: warm paper ground, a plum-indigo ink hairline, hard 0px corners, and the shared fluoro accent focus ring (with a colour-only blue border nudge). Bindable value.',
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
			styleClass: 'riso-input',
			dataAttrs: ['size', 'shape'],
			files: {
				style: 'src/lib/risograph/css/input.css',
				skins: {
					react: 'registry/risograph/input/Input.tsx',
					svelte: 'src/lib/risograph/Input.svelte',
					html: 'registry/risograph/input/input.html'
				}
			}
		},
		{
			id: 'textarea',
			name: 'Textarea',
			import: 'risograph.Textarea',
			description:
				'A multiline text field — the same Riso field styling as Input, with a resizable height.',
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
			styleClass: 'riso-textarea',
			dataAttrs: ['size'],
			files: {
				style: 'src/lib/risograph/css/textarea.css',
				skins: {
					react: 'registry/risograph/textarea/Textarea.tsx',
					svelte: 'src/lib/risograph/Textarea.svelte',
					html: 'registry/risograph/textarea/textarea.html'
				}
			}
		},
		{
			id: 'field',
			name: 'Field',
			import: 'risograph.Field',
			description:
				'A form-field wrapper: an uppercase Space Mono print-label (with optional required mark) above a control, and a quiet help line or spot-red error message below. Wrap a single text-style control (Input, Textarea, Select).',
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
			],
			styleClass: 'riso-field',
			dataAttrs: ['error', 'shape'],
			files: {
				style: 'src/lib/risograph/css/field.css',
				skins: {
					react: 'registry/risograph/field/Field.tsx',
					svelte: 'src/lib/risograph/Field.svelte',
					html: 'registry/risograph/field/field.html'
				}
			}
		},
		{
			id: 'checkbox',
			name: 'Checkbox',
			import: 'risograph.Checkbox',
			description:
				'An accessible checkbox — a native <input type="checkbox"> restyled as a hairline box that fills with plum-indigo printed ink (faint grain tooth) and a paper-tone tick when checked (monochrome, keeping the fluoro accent reserved). Bindable checked state.',
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
			styleClass: 'riso-checkbox',
			dataAttrs: ['size', 'checked', 'disabled', 'shape'],
			files: {
				style: 'src/lib/risograph/css/checkbox.css',
				skins: {
					react: 'registry/risograph/checkbox/Checkbox.tsx',
					svelte: 'src/lib/risograph/Checkbox.svelte',
					html: 'registry/risograph/checkbox/checkbox.html'
				}
			}
		},
		{
			id: 'radio-group',
			name: 'RadioGroup',
			import: 'risograph.RadioGroup',
			description:
				'A single-select group of native <input type="radio">. Each option shows a circular ring that fills with a plum-indigo ink inner disc when selected (monochrome, the counterpart to Checkbox).',
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
			styleClass: 'riso-radio',
			dataAttrs: ['checked', 'disabled'],
			files: {
				style: 'src/lib/risograph/css/radio-group.css',
				skins: {
					react: 'registry/risograph/radio-group/RadioGroup.tsx',
					svelte: 'src/lib/risograph/RadioGroup.svelte',
					html: 'registry/risograph/radio-group/radio-group.html'
				}
			}
		},
		{
			id: 'select',
			name: 'Select',
			import: 'risograph.Select',
			description:
				'A native <select> restyled to the Riso field language with a custom ink chevron. Single-select from a list of options, with the same size scale as Input.',
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
			styleClass: 'riso-select',
			dataAttrs: ['size', 'disabled'],
			files: {
				style: 'src/lib/risograph/css/select.css',
				skins: {
					react: 'registry/risograph/select/Select.tsx',
					svelte: 'src/lib/risograph/Select.svelte',
					html: 'registry/risograph/select/select.html'
				}
			}
		},
		{
			id: 'toggle',
			name: 'Toggle',
			import: 'risograph.Toggle',
			description:
				'An accessible on/off switch (button role="switch") with a bindable checked state and a sliding thumb. The track fills fluoro pink when on — the one accent moment in the forms family.',
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
			styleClass: 'riso-toggle',
			dataAttrs: ['size', 'checked', 'shape'],
			files: {
				style: 'src/lib/risograph/css/toggle.css',
				skins: {
					react: 'registry/risograph/toggle/Toggle.tsx',
					svelte: 'src/lib/risograph/Toggle.svelte',
					html: 'registry/risograph/toggle/toggle.html'
				}
			}
		},
		{
			id: 'alert',
			name: 'Alert',
			import: 'risograph.Alert',
			description:
				'An inline status message as a printed spot-ink WASH: the status colour tints the paper under a faint grain, with a thin status-ink hairline; the icon and title print in the status ink, the body stays plum ink. Severity sets the aria role (error/warning announce assertively, info/success politely).',
			props: [
				{
					name: 'variant',
					description: 'The status level, which sets the wash/hairline/icon colour and the icon.',
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
			styleClass: 'riso-alert',
			dataAttrs: ['variant', 'size'],
			files: {
				style: 'src/lib/risograph/css/alert.css',
				skins: {
					react: 'registry/risograph/alert/Alert.tsx',
					svelte: 'src/lib/risograph/Alert.svelte',
					html: 'registry/risograph/alert/alert.html'
				}
			}
		},
		{
			id: 'spinner',
			name: 'Spinner',
			import: 'risograph.Spinner',
			description:
				'Indeterminate loading: a circular ring with one spot-blue arc, rotating — the workhorse process-blue ink pass (the fluoro accent stays reserved). role="status" with an accessible label.',
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
			styleClass: 'riso-spinner',
			dataAttrs: ['size', 'speed'],
			files: {
				style: 'src/lib/risograph/css/spinner.css',
				skins: {
					react: 'registry/risograph/spinner/Spinner.tsx',
					svelte: 'src/lib/risograph/Spinner.svelte',
					html: 'registry/risograph/spinner/spinner.html'
				}
			}
		},
		{
			id: 'progress',
			name: 'Progress',
			import: 'risograph.Progress',
			description:
				'Determinate progress: a fluoro-pink fill in a flat bordered paper track (a metric earns the accent). role="progressbar" with aria-valuenow. `value` is 0–100; the readout is set in the mono print-label voice.',
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
			styleClass: 'riso-progress',
			dataAttrs: ['size', 'show'],
			files: {
				style: 'src/lib/risograph/css/progress.css',
				skins: {
					react: 'registry/risograph/progress/Progress.tsx',
					svelte: 'src/lib/risograph/Progress.svelte',
					html: 'registry/risograph/progress/progress.html'
				}
			}
		},
		{
			id: 'skeleton',
			name: 'Skeleton',
			import: 'risograph.Skeleton',
			description:
				'A loading placeholder that pulses while content loads. `text` renders N lines (last one short); `rect`/`circle` are single blocks sized by width/height. Flat warm deeper-paper fill, opacity pulse (colour-only — no shimmer). Decorative — role="status", aria-label="Loading".',
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
			styleClass: 'riso-skeleton',
			files: {
				style: 'src/lib/risograph/css/skeleton.css',
				skins: {
					react: 'registry/risograph/skeleton/Skeleton.tsx',
					svelte: 'src/lib/risograph/Skeleton.svelte',
					html: 'registry/risograph/skeleton/skeleton.html'
				}
			}
		},
		{
			id: 'tabs',
			name: 'Tabs',
			import: 'risograph.Tabs',
			description:
				'A single-select tab set using the WAI-ARIA roving-tabindex pattern (Arrow/Home/End move focus and selection). Tabs are printed labels — bare type at rest, a borderless plum-ink printed field when active (no outlined boxes). The panel content is a snippet that receives the active tab label.',
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
			styleClass: 'riso-tabs',
			dataAttrs: ['active'],
			files: {
				style: 'src/lib/risograph/css/tabs.css',
				skins: {
					react: 'registry/risograph/tabs/Tabs.tsx',
					svelte: 'src/lib/risograph/Tabs.svelte',
					html: 'registry/risograph/tabs/tabs.html'
				}
			}
		},
		{
			id: 'accordion',
			name: 'Accordion',
			import: 'risograph.Accordion',
			description:
				'Stacked disclosure built on native <details>/<summary> (open/close, keyboard, and a11y for free) — a printed paper stack with the faint grain tooth and collapsing ink hairlines. In exclusive mode the native `name` attribute keeps only one section open at a time. The panel body is a snippet that receives the section label.',
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
			styleClass: 'riso-accordion',
			files: {
				style: 'src/lib/risograph/css/accordion.css',
				skins: {
					react: 'registry/risograph/accordion/Accordion.tsx',
					svelte: 'src/lib/risograph/Accordion.svelte',
					html: 'registry/risograph/accordion/accordion.html'
				}
			}
		},
		{
			id: 'modal',
			name: 'Modal',
			import: 'risograph.Modal',
			description:
				'A dialog built on the native <dialog> element: top-layer rendering, a real focus trap, Esc-to-close, and a flat plum-ink backdrop dim. Zero elevation even here — separation comes from the dim and the printed spot-blue masthead header, never a shadow. Controlled via a bindable open state.',
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
				{ name: 'header', description: 'The title region — the printed spot-blue masthead band.' },
				{ name: 'children', description: 'The modal body content.' },
				{ name: 'footer', description: 'The actions region, ruled by an ink hairline.' }
			],
			styleClass: 'riso-modal',
			dataAttrs: ['has-header'],
			files: {
				style: 'src/lib/risograph/css/modal.css',
				skins: {
					react: 'registry/risograph/modal/Modal.tsx',
					svelte: 'src/lib/risograph/Modal.svelte',
					html: 'registry/risograph/modal/modal.html'
				}
			}
		},
		{
			id: 'dropdown-menu',
			name: 'Dropdown Menu',
			import: 'risograph.DropdownMenu',
			description:
				'An anchored menu on the native `popover` attribute (top-layer, light-dismiss, Esc) + CSS Anchor Positioning (tracks the trigger, flips up when cramped) — no JS positioning library. The menu is the zero-elevation overlay: no shadow — a printed paper panel whose ink hairline and grain do the separating. Adds role=menu semantics and arrow-key navigation.',
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
			styleClass: 'riso-dropdown',
			dataAttrs: ['size', 'shape'],
			files: {
				style: 'src/lib/risograph/css/dropdown-menu.css',
				skins: {
					react: 'registry/risograph/dropdown-menu/DropdownMenu.tsx',
					svelte: 'src/lib/risograph/DropdownMenu.svelte',
					html: 'registry/risograph/dropdown-menu/dropdown-menu.html'
				}
			}
		},
		{
			id: 'toast',
			name: 'Toast',
			// Imperative, not a rendered element: call the function; a single
			// <Toaster /> mounted at the app root shows the stack.
			import: 'risograph.toast',
			description:
				'A transient notification fired imperatively — call toast(message) (or toast.success/error/…) and a <Toaster /> mounted once at the app root shows it, top-right, auto-dismissing. Each toast reuses the Alert skin (the printed spot-ink wash) and PRINTS into place — an opacity-only entry, no slide, no shadow.',
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
			styleClass: 'riso-toaster',
			registryDeps: ['alert'],
			files: {
				style: 'src/lib/risograph/css/toast.css',
				skins: {
					react: ['registry/risograph/toast/toast.ts', 'registry/risograph/toast/Toaster.tsx'],
					svelte: ['src/lib/risograph/toast.svelte.ts', 'src/lib/risograph/Toaster.svelte'],
					html: 'registry/risograph/toast/toast.html'
				}
			}
		}
	]
};
