// Manifest schema — the machine-readable catalogue of styles, components, and
// props that an AI agent (or the docs site) consumes as the single source of
// truth. See DESIGN.md, Entry 4.

export type PropType = 'enum' | 'string' | 'boolean' | 'number' | 'array';

export interface PropSpec {
	name: string;
	/** Brief human description — shown in the docs beneath the prop name. */
	description: string;
	type: PropType;
	/** For `enum` props: the exact set of legal values (imported from options.ts). */
	values?: readonly string[];
	/** `array` props default to a string list (e.g. RadioGroup/Select `options`). */
	default?: string | number | boolean | readonly string[];
	required?: boolean;
	/** Docs-only hint text for a free-text input that has no default (e.g. href). */
	placeholder?: string;
	/** True for two-way-bindable props (e.g. Input `value`, Toggle `checked`). */
	bindable?: boolean;
}

export interface SnippetSpec {
	name: string;
	description: string;
	/** If set, the docs render a live instance of this component id as the sample
	 *  slot content (instead of editable text) — for wrapper components like Field
	 *  whose child is a real control, not text. */
	sample?: string;
	/** The snippet receives an argument (Tabs → active tab, Accordion → section),
	 *  so the docs render generated content per item instead of an editable field. */
	parameterized?: boolean;
}

/** Interaction states a component can be forced into for the docs' states strip.
 * Components mirror the matching pseudo-class with a `[data-state='…']` selector. */
export type StateName = 'hover' | 'active' | 'focus';

export interface ComponentSpec {
	id: string;
	name: string;
	/** How to reference it in code, e.g. "neoBrutalism.Button". */
	import: string;
	description: string;
	props: PropSpec[];
	snippets?: SnippetSpec[];
	/** Interaction states to showcase (forced via `data-state`). */
	states?: readonly StateName[];
	/** Triggered-overlay components (Modal, Drawer, …): the label for a button the
	 *  docs render to open it. Preview owns the open-state and wires `open`+`onClose`
	 *  rather than rendering the component inline. */
	trigger?: string;
}

export interface StyleSpec {
	id: string;
	name: string;
	/** The "prompt vocabulary" — how an agent should think about this style. */
	description: string;
	/** When this style is the right choice. */
	whenToUse: string;
	/** A hard usage constraint an agent MUST honour to get a correct result — e.g.
	 *  Glassmorphism needs a non-uniform backdrop or its frosted surfaces render
	 *  invisible. Omitted when the style has no such dependency (most don't). */
	requires?: string;
	components: ComponentSpec[];
}

export interface Manifest {
	version: string;
	styles: StyleSpec[];
}
