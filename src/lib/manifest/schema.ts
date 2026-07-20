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

/** Registry payload for a component — repo-relative source paths the aronia CLI
 *  copies into a consumer's repo (`aronia/<style>/…`). See DESIGN.md, Entries 31–32. */
export interface ComponentFiles {
	/** Layer-2 stylesheet — the design language for this component (global, unscoped). */
	style: string;
	/** Layer-3 skins by framework — thin prop→data-attribute mappers over the CSS. A
	 *  skin may be one file or several (e.g. the toast store + its `<Toaster/>`). */
	skins: Partial<Record<'react' | 'svelte' | 'html', string | string[]>>;
}

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
	/** Registry: the base CSS class the style hooks hang off (e.g. "nb-btn"). */
	styleClass?: string;
	/** Registry: the data-attribute names that drive styling (e.g. ["variant","size"]). */
	dataAttrs?: readonly string[];
	/** Registry: the files the aronia CLI copies into a consumer's repo. Absent on
	 *  components not yet ported to the copy-into-repo registry. */
	files?: ComponentFiles;
	/** Registry: other component ids (same family) this one needs; the aronia CLI
	 *  installs them too (e.g. toast reuses alert). */
	registryDeps?: readonly string[];
}

export interface StyleSpec {
	id: string;
	name: string;
	/** The "prompt vocabulary" — how an agent should think about this style. */
	description: string;
	/** When this style is the right choice. */
	whenToUse: string;
	/** How to COMPOSE tastefully in this language — the grammar (grid, hierarchy,
	 *  colour discipline, whitespace) an agent needs to build a whole cohesive
	 *  page in the style, not just drop individual components on it. */
	principles?: readonly string[];
	/** Anti-patterns — the things that break the language (e.g. gradients/blur
	 *  for Swiss). The counterpart to `principles`. */
	avoid?: readonly string[];
	/** A hard usage constraint an agent MUST honour to get a correct result — e.g.
	 *  Glassmorphism needs a non-uniform backdrop or its frosted surfaces render
	 *  invisible. Omitted when the style has no such dependency (most don't). */
	requires?: string;
	/** Layer-1 token stylesheet (repo-relative) — the CSS custom properties every
	 *  component in this family depends on. The aronia CLI ships it once per style. */
	tokens?: string;
	/** Self-hosted font files (repo-relative woff2 + the OFL licence) this family's
	 *  tokens.css `@font-face`s from `./fonts/`. Unlike the CDN-`@import` families,
	 *  Risograph ships its typefaces so a consumer renders fully offline. The CLI
	 *  copies these into the consumer's `aronia/<style>/fonts/` alongside tokens.css.
	 *  Omitted by families that use a font CDN or a system stack. */
	fonts?: readonly string[];
	/** Page-level composition vocabulary — the values an agent needs to build a
	 *  whole PAGE (hero, sections, media), which live outside any component and so
	 *  aren't covered by tokens/props. Guidance, not CSS: an agent reads and applies
	 *  these when hand-authoring layout. Universal design hygiene (line-height by
	 *  role, measure caps, neutral image outlines) is delegated to the companion
	 *  skills in AGENTS.md, NOT restated here — this carries only what's aronia's:
	 *  per-style type/media identity, plus the shared structural ramp. Denormalized
	 *  onto every registry item by build-registry.ts, like styleGuidance. */
	composition?: CompositionSpec;
	components: ComponentSpec[];
}

/** One step of the display/heading ramp. */
export interface TypeStep {
	/** Fluid font-size as a clamp() pair (responsive out of the box). */
	size: string;
	/** Weight, referencing this family's weight token (e.g. "--swiss-font-weight-bold"). */
	weight: string;
}

/** Per-style image/photo treatment. The universal neutral 1px inset outline is
 *  delegated to the companion skill; only the per-style filter/edge/radius/shadow
 *  (and any deliberate override of that neutral default) live here. */
export interface MediaSpec {
	/** CSS `filter` — the style's signature (e.g. Swiss grayscale), or "none". */
	filter: string;
	/** `border-radius`, referencing the family's radius token. */
	radius: string;
	/** Edge treatment: rides the universal neutral outline, or a themed override. */
	edge: string;
	/** `box-shadow`, referencing a family shadow token, or "none". */
	shadow: string;
}

export interface CompositionSpec {
	/** Display + heading ramp ABOVE the component `size-title` token. Per style:
	 *  fluid sizes, weights from this family's scale. `h3` lands on the existing
	 *  `--<style>-size-title` so the ramp extends upward with no seam. */
	typeScale: {
		display: TypeStep;
		h1: TypeStep;
		h2: TypeStep;
		h3: TypeStep;
		/** Where this style deviates from universal defaults — tracking, case,
		 *  line-height feel (universal hygiene itself is delegated). */
		character: string;
	};
	/** Base spacing ramp — SHARED across styles (structural rhythm, not identity).
	 *  The conventional 4px scale with Tailwind-compatible keys (0.25rem multiples)
	 *  so a Tailwind-fluent agent maps directly. Snap all spacing to these steps. */
	spacing: Record<string, string>;
	/** Named reflow points — SHARED, adopting the conventional (Tailwind) set so an
	 *  agent maps to its prior instead of guessing. Reference values for hand-written
	 *  `@media` (custom properties can't be used in a media query), mobile-first
	 *  min-width. */
	breakpoints: Record<string, string>;
	/** Page frame — SHARED, aligned to the `xl` breakpoint. Applied as
	 *  `width: min(maxWidth, 100% - 2 * gutter); margin-inline: auto`. */
	container: { maxWidth: string; gutter: string };
	/** Per-style media treatment. */
	media: MediaSpec;
}

export interface Manifest {
	version: string;
	styles: StyleSpec[];
}
