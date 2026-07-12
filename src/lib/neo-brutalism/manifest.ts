// Neo-Brutalism family manifest.
//
// Enum `values` are imported from ./options.ts (the single source of truth) so
// they can never disagree with the components' actual prop types. The prose
// fields (descriptions, whenToUse) are hand-authored — that's the part that
// makes the manifest useful as agent context. See DESIGN.md, Entry 4.
//
// PROP ORDER CONVENTION: props are listed by functional hierarchy, not
// alphabetically —
//   appearance → binding/behavior → state → escape hatch
// e.g. variant/size/shape first, then href/value/checked, then disabled.
// (Appearance leads because it's what people tune first in the playground.)
// The manifest array order is the order shown in the docs. See DESIGN.md, Entry 8.

import type { StyleSpec } from '../manifest/schema.js';
import {
	BUTTON_VARIANTS,
	BUTTON_SIZES,
	BUTTON_SHAPES,
	LINK_VARIANTS,
	CARD_VARIANTS,
	BADGE_VARIANTS,
	INPUT_SIZES,
	INPUT_SHAPES,
	FIELD_SHAPES,
	ALERT_VARIANTS,
	SPINNER_SPEEDS,
	SKELETON_SHAPES
} from './options.js';

export const neoBrutalism: StyleSpec = {
	id: 'neo-brutalism',
	name: 'Neo-Brutalism',
	description:
		'Thick black borders, hard offset shadows (no blur), flat saturated colour, chunky heavy type (Archivo), and a tactile "shove" on press where the element presses into its own shadow.',
	whenToUse:
		'Bold, playful, high-contrast interfaces that want to feel raw, confident, and unmistakably digital.',
	principles: [
		'Lead with oversized, heavy type — typography is the primary visual driver.',
		'Outline elements in thick black borders; keep corners square.',
		'Give interactive/raised elements a hard offset shadow (no blur, solid colour); flat containers rely on the border alone.',
		'Use bold, clashing, high-contrast fills — flat saturated colour, pure black and white; do not be timid.',
		'Make interaction tactile and obvious — elements "shove" into their shadow on press, with big, unmistakable hover and focus states.'
	],
	avoid: [
		'Soft or blurred shadows, gradients, or glassy translucency.',
		'Muted, low-contrast, or pastel-timid palettes.',
		'Polished "corporate minimal" restraint, or heavily rounded corners.',
		'Thin, subtle borders — keep them thick and black.'
	],
	tokens: 'src/lib/styles/neo-brutalism.css',
	components: [
		{
			id: 'button',
			name: 'Button',
			import: 'neoBrutalism.Button',
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
					description: 'Corner style — square, or a fully rounded pill.',
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
			states: ['hover', 'active', 'focus'],
			styleClass: 'nb-btn',
			dataAttrs: ['variant', 'size', 'shape'],
			files: {
				style: 'src/lib/neo-brutalism/css/button.css',
				skins: {
					react: 'registry/neo-brutalism/button/Button.tsx',
					svelte: 'src/lib/neo-brutalism/Button.svelte',
					html: 'registry/neo-brutalism/button/button.html'
				}
			}
		},
		{
			id: 'link',
			name: 'Link',
			import: 'neoBrutalism.Link',
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
			states: ['hover', 'focus'],
			styleClass: 'nb-link',
			dataAttrs: ['variant', 'active'],
			files: {
				style: 'src/lib/neo-brutalism/css/link.css',
				skins: {
					react: 'registry/neo-brutalism/link/Link.tsx',
					svelte: 'src/lib/neo-brutalism/Link.svelte',
					html: 'registry/neo-brutalism/link/link.html'
				}
			}
		},
		{
			id: 'card',
			name: 'Card',
			import: 'neoBrutalism.Card',
			description: 'A bordered container with a large hard shadow and optional header/footer regions.',
			props: [
				{
					name: 'variant',
					description: 'Background colour style of the card.',
					type: 'enum',
					values: CARD_VARIANTS,
					default: 'paper'
				}
			],
			snippets: [
				{ name: 'children', description: 'The content shown inside the card.' },
				{ name: 'header', description: 'Optional header region, divided by a hard rule.' },
				{ name: 'footer', description: 'Optional footer region, divided by a hard rule.' }
			],
			styleClass: 'nb-card',
			dataAttrs: ['variant'],
			files: {
				style: 'src/lib/neo-brutalism/css/card.css',
				skins: {
					react: 'registry/neo-brutalism/card/Card.tsx',
					svelte: 'src/lib/neo-brutalism/Card.svelte',
					html: 'registry/neo-brutalism/card/card.html'
				}
			}
		},
		{
			id: 'badge',
			name: 'Badge',
			import: 'neoBrutalism.Badge',
			description: 'A small, uppercase inline label with a hard shadow.',
			props: [
				{
					name: 'variant',
					description: 'Colour style of the badge.',
					type: 'enum',
					values: BADGE_VARIANTS,
					default: 'primary'
				}
			],
			snippets: [{ name: 'children', description: 'The text shown on the badge.' }],
			styleClass: 'nb-badge',
			dataAttrs: ['variant'],
			files: {
				style: 'src/lib/neo-brutalism/css/badge.css',
				skins: {
					react: 'registry/neo-brutalism/badge/Badge.tsx',
					svelte: 'src/lib/neo-brutalism/Badge.svelte',
					html: 'registry/neo-brutalism/badge/badge.html'
				}
			}
		},
		{
			id: 'input',
			name: 'Input',
			import: 'neoBrutalism.Input',
			description: 'A single-line text field with a bindable value and an accent focus ring.',
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
			styleClass: 'nb-input',
			dataAttrs: ['size', 'shape'],
			files: {
				style: 'src/lib/neo-brutalism/css/input.css',
				skins: {
					react: 'registry/neo-brutalism/input/Input.tsx',
					svelte: 'src/lib/neo-brutalism/Input.svelte',
					html: 'registry/neo-brutalism/input/input.html'
				}
			}
		},
		{
			id: 'textarea',
			name: 'Textarea',
			import: 'neoBrutalism.Textarea',
			description:
				'A multiline text field — the same NB field styling as Input, with a resizable height.',
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
			styleClass: 'nb-textarea',
			dataAttrs: ['size'],
			files: {
				style: 'src/lib/neo-brutalism/css/textarea.css',
				skins: {
					react: 'registry/neo-brutalism/textarea/Textarea.tsx',
					svelte: 'src/lib/neo-brutalism/Textarea.svelte',
					html: 'registry/neo-brutalism/textarea/textarea.html'
				}
			}
		},
		{
			id: 'toggle',
			name: 'Toggle',
			import: 'neoBrutalism.Toggle',
			description:
				'An accessible on/off switch (button role="switch") with a bindable checked state and a sliding square thumb.',
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
			states: ['focus'],
			styleClass: 'nb-toggle',
			dataAttrs: ['size', 'checked'],
			files: {
				style: 'src/lib/neo-brutalism/css/toggle.css',
				skins: {
					react: 'registry/neo-brutalism/toggle/Toggle.tsx',
					svelte: 'src/lib/neo-brutalism/Toggle.svelte',
					html: 'registry/neo-brutalism/toggle/toggle.html'
				}
			}
		},
		{
			id: 'checkbox',
			name: 'Checkbox',
			import: 'neoBrutalism.Checkbox',
			description:
				'An accessible checkbox — a native <input type="checkbox"> restyled as a hard-bordered box that fills yellow with a black tick when checked. Bindable checked state.',
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
			states: ['focus'],
			styleClass: 'nb-checkbox',
			dataAttrs: ['size', 'checked', 'disabled'],
			files: {
				style: 'src/lib/neo-brutalism/css/checkbox.css',
				skins: {
					react: 'registry/neo-brutalism/checkbox/Checkbox.tsx',
					svelte: 'src/lib/neo-brutalism/Checkbox.svelte',
					html: 'registry/neo-brutalism/checkbox/checkbox.html'
				}
			}
		},
		{
			id: 'radio-group',
			name: 'RadioGroup',
			import: 'neoBrutalism.RadioGroup',
			description:
				'A single-select group of options built on native <input type="radio">. Each option shows a hard square dot that fills yellow with a black inner square when selected.',
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
			styleClass: 'nb-radio',
			dataAttrs: ['checked', 'disabled'],
			files: {
				style: 'src/lib/neo-brutalism/css/radio-group.css',
				skins: {
					react: 'registry/neo-brutalism/radio-group/RadioGroup.tsx',
					svelte: 'src/lib/neo-brutalism/RadioGroup.svelte',
					html: 'registry/neo-brutalism/radio-group/radio-group.html'
				}
			}
		},
		{
			id: 'select',
			name: 'Select',
			import: 'neoBrutalism.Select',
			description:
				'A native <select> restyled to the NB field language with a custom chevron. Single-select from a list of options, with the same size scale as Input.',
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
			styleClass: 'nb-select',
			dataAttrs: ['size', 'disabled'],
			files: {
				style: 'src/lib/neo-brutalism/css/select.css',
				skins: {
					react: 'registry/neo-brutalism/select/Select.tsx',
					svelte: 'src/lib/neo-brutalism/Select.svelte',
					html: 'registry/neo-brutalism/select/select.html'
				}
			}
		},
		{
			id: 'field',
			name: 'Field',
			import: 'neoBrutalism.Field',
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
			],
			styleClass: 'nb-field',
			dataAttrs: ['error', 'shape'],
			files: {
				style: 'src/lib/neo-brutalism/css/field.css',
				skins: {
					react: 'registry/neo-brutalism/field/Field.tsx',
					svelte: 'src/lib/neo-brutalism/Field.svelte',
					html: 'registry/neo-brutalism/field/field.html'
				}
			}
		},
		{
			id: 'modal',
			name: 'Modal',
			import: 'neoBrutalism.Modal',
			description:
				'A dialog built on the native <dialog> element: top-layer rendering, a real focus trap, Esc-to-close, and a backdrop, all skinned NB. Controlled via a bindable open state.',
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
				{ name: 'header', description: 'The title region, divided by a hard rule.' },
				{ name: 'children', description: 'The modal body content.' },
				{ name: 'footer', description: 'The actions region, divided by a hard rule.' }
			],
			styleClass: 'nb-modal',
			dataAttrs: ['has-header'],
			files: {
				style: 'src/lib/neo-brutalism/css/modal.css',
				skins: {
					react: 'registry/neo-brutalism/modal/Modal.tsx',
					svelte: 'src/lib/neo-brutalism/Modal.svelte',
					html: 'registry/neo-brutalism/modal/modal.html'
				}
			}
		},
		{
			id: 'alert',
			name: 'Alert',
			import: 'neoBrutalism.Alert',
			description:
				'An inline status message in a bold full-colour box with a per-variant icon. Severity sets the aria role (error/warning announce assertively, info/success politely).',
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
			snippets: [{ name: 'children', description: 'The alert message.' }],
			styleClass: 'nb-alert',
			dataAttrs: ['variant', 'size'],
			files: {
				style: 'src/lib/neo-brutalism/css/alert.css',
				skins: {
					react: 'registry/neo-brutalism/alert/Alert.tsx',
					svelte: 'src/lib/neo-brutalism/Alert.svelte',
					html: 'registry/neo-brutalism/alert/alert.html'
				}
			}
		},
		{
			id: 'tabs',
			name: 'Tabs',
			import: 'neoBrutalism.Tabs',
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
			],
			styleClass: 'nb-tabs',
			dataAttrs: ['active'],
			files: {
				style: 'src/lib/neo-brutalism/css/tabs.css',
				skins: {
					react: 'registry/neo-brutalism/tabs/Tabs.tsx',
					svelte: 'src/lib/neo-brutalism/Tabs.svelte',
					html: 'registry/neo-brutalism/tabs/tabs.html'
				}
			}
		},
		{
			id: 'accordion',
			name: 'Accordion',
			import: 'neoBrutalism.Accordion',
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
			styleClass: 'nb-accordion',
			files: {
				style: 'src/lib/neo-brutalism/css/accordion.css',
				skins: {
					react: 'registry/neo-brutalism/accordion/Accordion.tsx',
					svelte: 'src/lib/neo-brutalism/Accordion.svelte',
					html: 'registry/neo-brutalism/accordion/accordion.html'
				}
			}
		},
		{
			id: 'dropdown-menu',
			name: 'Dropdown Menu',
			import: 'neoBrutalism.DropdownMenu',
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
			],
			styleClass: 'nb-dropdown',
			dataAttrs: ['size'],
			files: {
				style: 'src/lib/neo-brutalism/css/dropdown-menu.css',
				skins: {
					react: 'registry/neo-brutalism/dropdown-menu/DropdownMenu.tsx',
					svelte: 'src/lib/neo-brutalism/DropdownMenu.svelte',
					html: 'registry/neo-brutalism/dropdown-menu/dropdown-menu.html'
				}
			}
		},
		{
			id: 'spinner',
			name: 'Spinner',
			import: 'neoBrutalism.Spinner',
			description:
				'Indeterminate loading: a thick square ring with one accent edge, rotating. Square and hard-edged — a brutalist take on the classic spinner. role="status" with an accessible label.',
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
			styleClass: 'nb-spinner',
			dataAttrs: ['size', 'speed'],
			files: {
				style: 'src/lib/neo-brutalism/css/spinner.css',
				skins: {
					react: 'registry/neo-brutalism/spinner/Spinner.tsx',
					svelte: 'src/lib/neo-brutalism/Spinner.svelte',
					html: 'registry/neo-brutalism/spinner/spinner.html'
				}
			}
		},
		{
			id: 'progress',
			name: 'Progress',
			import: 'neoBrutalism.Progress',
			description:
				'Determinate progress: a hard-edged fill in a bordered track. role="progressbar" with aria-valuenow. `value` is 0–100.',
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
			styleClass: 'nb-progress',
			dataAttrs: ['size', 'show'],
			files: {
				style: 'src/lib/neo-brutalism/css/progress.css',
				skins: {
					react: 'registry/neo-brutalism/progress/Progress.tsx',
					svelte: 'src/lib/neo-brutalism/Progress.svelte',
					html: 'registry/neo-brutalism/progress/progress.html'
				}
			}
		},
		{
			id: 'skeleton',
			name: 'Skeleton',
			import: 'neoBrutalism.Skeleton',
			description:
				'A loading placeholder that pulses while content loads. `text` renders N lines (last one short); `rect`/`circle` are single blocks sized by width/height. Decorative — role="status", aria-label="Loading".',
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
			styleClass: 'nb-skeleton',
			files: {
				style: 'src/lib/neo-brutalism/css/skeleton.css',
				skins: {
					react: 'registry/neo-brutalism/skeleton/Skeleton.tsx',
					svelte: 'src/lib/neo-brutalism/Skeleton.svelte',
					html: 'registry/neo-brutalism/skeleton/skeleton.html'
				}
			}
		},
		{
			id: 'toast',
			name: 'Toast',
			// Imperative, not a rendered element: call the function; a single
			// <Toaster /> mounted at the app root shows the stack.
			import: 'neoBrutalism.toast',
			description:
				'A transient notification fired imperatively — call toast(message) (or toast.success/error/…) and a <Toaster /> mounted once at the app root shows it, bottom-right, auto-dismissing. Each toast reuses the Alert skin.',
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
			styleClass: 'nb-toaster',
			registryDeps: ['alert'],
			files: {
				style: 'src/lib/neo-brutalism/css/toast.css',
				skins: {
					react: [
						'registry/neo-brutalism/toast/toast.ts',
						'registry/neo-brutalism/toast/Toaster.tsx'
					],
					svelte: ['src/lib/neo-brutalism/toast.svelte.ts', 'src/lib/neo-brutalism/Toaster.svelte'],
					html: 'registry/neo-brutalism/toast/toast.html'
				}
			}
		}
	]
};
