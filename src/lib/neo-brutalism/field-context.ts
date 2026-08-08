// Neo-brutalism — Field ↔ control context (shared by Field + Input/Textarea/Select).
//
// Field wraps its control through a snippet, so it can't reach the child to set
// aria attributes or push its size down. Instead it PUBLISHES this context; the
// wrapped control reads it and wires its OWN `aria-invalid` + `aria-describedby`
// and inherits the field size. A control rendered on its own (no Field) gets
// `undefined` and falls back to its standalone defaults.
import { getContext, setContext } from 'svelte';

// Size scale mirrored from options.ts, inlined so this helper stays
// self-contained when copied alongside a single control.
export type FieldSize = 'sm' | 'md' | 'lg';

// Read through getters on the Field side so the control tracks Field's reactive
// props (error toggling on/off, size changes) across the component boundary.
export type FieldContext = {
	readonly invalid: boolean;
	readonly describedById: string | undefined;
	readonly size: FieldSize | undefined;
};

const KEY = Symbol('nb-field');

export function setFieldContext(ctx: FieldContext): void {
	setContext(KEY, ctx);
}

export function getFieldContext(): FieldContext | undefined {
	return getContext(KEY);
}
