<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../styles/neo-brutalism.css';

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

<style>
	.nb-field {
		display: inline-flex;
		flex-direction: column;
		gap: 0.5rem;
		font-family: var(--nb-font);
		color: var(--nb-ink);
	}
	.nb-field__label {
		font-size: var(--nb-size-sm-text); /* 14px */
		font-weight: var(--nb-font-weight-semibold);
	}
	.nb-field__req {
		color: var(--nb-danger-ink);
	}
	/* Help is subordinated by SIZE + weight, not opacity — a dimmed help line drops
	   below WCAG AA. (Full ink at 12px/500 vs the 14px/700 label reads as secondary.) */
	.nb-field__msg {
		font-size: var(--nb-size-xs-text); /* 12px */
		font-weight: var(--nb-font-weight-regular);
	}
	.nb-field__msg--error {
		color: var(--nb-danger-ink);
		font-weight: var(--nb-font-weight-semibold);
	}
</style>
