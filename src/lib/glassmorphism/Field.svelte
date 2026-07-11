<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../styles/glassmorphism.css';
	import './css/field.css';

	// A form-field wrapper: a label (with optional required mark) above a control
	// (the children), and a help line or an error message below. A <label>, so
	// clicking the label focuses the wrapped control natively — for single text-style
	// controls (Input, Textarea, Select). When `error` is set it replaces help.
	type Props = {
		label?: string;
		help?: string;
		error?: string;
		required?: boolean;
		children?: Snippet;
	};

	let { label, help, error, required = false, children }: Props = $props();
</script>

<label class="glass-field" data-error={!!error}>
	{#if label}
		<span class="glass-field__label">
			{label}{#if required}<span class="glass-field__req"> *</span>{/if}
		</span>
	{/if}
	{@render children?.()}
	{#if error}
		<span class="glass-field__msg glass-field__msg--error">{error}</span>
	{:else if help}
		<span class="glass-field__msg">{help}</span>
	{/if}
</label>
