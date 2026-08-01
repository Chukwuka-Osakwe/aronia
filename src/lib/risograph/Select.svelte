<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import '../styles/riso.css';
	import './css/select.css';

	// A native <select> restyled to the Riso field language (paper ground, ink
	// hairline, 0px corners, accent focus ring, shared size scale) with the native
	// arrow stripped (appearance: none) and a custom chevron overlaid. Native under
	// the hood, so keyboard, typeahead, and form submission all work for free.
	// `options` reuses the same string-list model as RadioGroup; `size` is our own
	// scale (renamed off the native `size` attribute). `data-state` is pulled off
	// rest so the docs can force the focus state.
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
		size = 'md',
		placeholder,
		disabled = false,
		'data-state': dataState,
		...rest
	}: Props = $props();

	// Stable derived list so the <option>s aren't rebuilt on every render (a fresh
	// array each pass makes the select re-sync its value, which can feel laggy).
	const visibleOptions = $derived(options.filter(Boolean));
</script>

<div class="riso-select" data-state={dataState} data-disabled={disabled}>
	<select class="riso-select__field" data-size={size} bind:value {disabled} {...rest}>
		{#if placeholder}
			<option value="" disabled>{placeholder}</option>
		{/if}
		{#each visibleOptions as opt (opt)}
			<option value={opt}>{opt}</option>
		{/each}
	</select>
	<svg
		class="riso-select__chevron"
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
