<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../styles/neo-brutalism.css';
	import './css/field.css';

	// A form-field wrapper: a label (with optional required mark) above a control
	// (the children), and a help line or an error message below. Implemented as a
	// <label> so clicking the label text focuses the wrapped control natively —
	// intended for single text-style controls (Input, Textarea, Select). Checkbox
	// and RadioGroup carry their own labels, so they don't need Field. When `error`
	// is set it replaces the help line and switches to the error treatment.
	type Props = {
		label?: string;
		help?: string;
		error?: string;
		required?: boolean;
		children?: Snippet;
	};

	let { label, help, error, required = false, children }: Props = $props();
</script>

<label class="nb-field" data-error={!!error}>
	{#if label}
		<span class="nb-field__label">
			{label}{#if required}<span class="nb-field__req"> *</span>{/if}
		</span>
	{/if}
	{@render children?.()}
	{#if error}
		<span class="nb-field__msg nb-field__msg--error">{error}</span>
	{:else if help}
		<span class="nb-field__msg">{help}</span>
	{/if}
</label>
