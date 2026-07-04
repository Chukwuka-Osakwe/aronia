<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import '../styles/neo-brutalism.css';

	// A native <select> restyled to the NB field language (border, hard shadow,
	// accent focus ring, shared size scale) with the native arrow stripped
	// (appearance: none) and a custom chevron overlaid. Native under the hood, so
	// keyboard, typeahead, and form submission all work for free. `options` reuses
	// the same string-list model as RadioGroup; `size` is our own scale (renamed off
	// the native `size` attribute). `data-state` is pulled off rest for the docs.
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

<div class="nb-select" data-state={dataState} data-disabled={disabled}>
	<select class="nb-select__field" data-size={size} bind:value {disabled} {...rest}>
		{#if placeholder}
			<option value="" disabled>{placeholder}</option>
		{/if}
		{#each visibleOptions as opt (opt)}
			<option value={opt}>{opt}</option>
		{/each}
	</select>
	<svg
		class="nb-select__chevron"
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

<style>
	.nb-select {
		position: relative;
		display: inline-block;
		min-width: 16rem;
	}
	.nb-select[data-disabled='true'] {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.nb-select__field {
		appearance: none;
		-webkit-appearance: none;
		width: 100%;
		font-family: var(--nb-font);
		font-weight: var(--nb-font-weight-medium);
		color: var(--nb-ink);
		background: var(--nb-paper);
		border: var(--nb-border);
		border-radius: var(--nb-radius);
		box-shadow: var(--nb-shadow);
		cursor: pointer;
		transition: var(--nb-transition);
	}
	.nb-select__field:disabled {
		background: var(--nb-muted);
		cursor: not-allowed;
	}

	/* Focus keeps the box still and pops the accent shadow, like Input. */
	.nb-select__field:focus,
	.nb-select[data-state='focus'] .nb-select__field {
		outline: none;
		box-shadow: var(--nb-shadow), 0 0 0 3px var(--nb-accent);
	}

	/* Shared control size scale for text + padding; a trailing rule (same
	   specificity, later source order) reserves room for the chevron on the right. */
	.nb-select__field[data-size='sm'] {
		font-size: var(--nb-size-sm-text);
		padding: var(--nb-size-sm-pad);
	}
	.nb-select__field[data-size='md'] {
		font-size: var(--nb-size-md-text);
		padding: var(--nb-size-md-pad);
	}
	.nb-select__field[data-size='lg'] {
		font-size: var(--nb-size-lg-text);
		padding: var(--nb-size-lg-pad);
	}
	.nb-select__field[data-size] {
		padding-right: 2.75rem;
	}

	.nb-select__chevron {
		position: absolute;
		top: 50%;
		right: 0.9rem;
		transform: translateY(-50%);
		width: 18px;
		height: 18px;
		color: var(--nb-ink);
		pointer-events: none;
	}
</style>
