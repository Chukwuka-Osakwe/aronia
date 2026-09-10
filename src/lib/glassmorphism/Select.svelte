<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import { getFieldContext } from './field-context.js';
	import '../styles/glassmorphism.css';
	import './css/select.css';

	// A native <select> restyled to the frosted field language (appearance: none +
	// a custom chevron). Native under the hood, so keyboard, typeahead, and form
	// submission work for free. `options` is a string list; `size` is our own scale.
	type Props = {
		value?: string;
		options?: string[];
		size?: InputSize;
		placeholder?: string;
		disabled?: boolean;
	} & Omit<HTMLSelectAttributes, 'size'>;

	let {
		value = $bindable(''),
		options = [],
		size,
		placeholder,
		disabled = false,
		'data-state': dataState,
		...rest
	}: Props = $props();

	// Inside a Field: inherit its size (unless one is set here) and wire the error
	// a11y onto the native <select> — same context contract as Input. Standalone →
	// own default, no aria.
	const field = getFieldContext();

	const visibleOptions = $derived(options.filter(Boolean));
</script>

<div class="glass-select" data-state={dataState} data-disabled={disabled}>
	<select
		class="glass-select__field"
		data-size={size ?? field?.size ?? 'md'}
		aria-invalid={field?.invalid || undefined}
		aria-describedby={field?.describedById}
		bind:value
		{disabled}
		{...rest}
	>
		{#if placeholder}
			<option value="" disabled>{placeholder}</option>
		{/if}
		{#each visibleOptions as opt (opt)}
			<option value={opt}>{opt}</option>
		{/each}
	</select>
	<svg
		class="glass-select__chevron"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="3"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<polyline points="6 9 12 15 18 9" />
	</svg>
</div>
