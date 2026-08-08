<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { FieldShape, InputSize } from './options.js';
	import { setFieldContext } from './field-context.js';
	import '../styles/riso.css';
	import './css/field.css';

	// A form-field wrapper: a mono print-label (with optional required mark) above a
	// control (the children), and a help line or an error message below. Implemented
	// as a <label> so clicking the label text focuses the wrapped control natively —
	// intended for single text-style controls (Input, Textarea, Select). Checkbox
	// and RadioGroup carry their own labels, so they don't need Field.
	//
	// Field can't reach the control through the snippet, so it PUBLISHES context
	// (invalid + the message id + size) which the control reads to wire its own
	// aria-invalid / aria-describedby and inherit the field size. When `error` is
	// set it replaces the help line, switches the message to the error treatment,
	// and — via that context — flags the control (danger border + aria-invalid).
	type Props = {
		label?: string;
		help?: string;
		error?: string;
		required?: boolean;
		size?: InputSize;
		shape?: FieldShape;
		children?: Snippet;
	};

	let {
		label,
		help,
		error,
		required = false,
		size = 'md',
		shape = 'square',
		children
	}: Props = $props();

	// SSR-stable ids so the wrapped control can point aria-describedby at whichever
	// line is showing, and a screen reader announces the error (role="alert").
	const uid = $props.id();
	const errorId = `${uid}-error`;
	const helpId = `${uid}-help`;
	const describedBy = $derived(error ? errorId : help ? helpId : undefined);

	setFieldContext({
		get invalid() {
			return !!error;
		},
		get describedById() {
			return describedBy;
		},
		get size() {
			return size;
		}
	});
</script>

<label class="riso-field" data-shape={shape} data-size={size}>
	{#if label}
		<span class="riso-field__label">
			{label}{#if required}<span class="riso-field__req"> *</span>{/if}
		</span>
	{/if}
	{@render children?.()}
	{#if error}
		<span id={errorId} class="riso-field__msg riso-field__msg--error" role="alert">{error}</span>
	{:else if help}
		<span id={helpId} class="riso-field__msg">{help}</span>
	{/if}
</label>
