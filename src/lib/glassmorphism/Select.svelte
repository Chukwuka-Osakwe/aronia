<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import '../styles/glassmorphism.css';

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
		size = 'md',
		placeholder,
		disabled = false,
		'data-state': dataState,
		...rest
	}: Props = $props();

	const visibleOptions = $derived(options.filter(Boolean));
</script>

<div class="glass-select" data-state={dataState} data-disabled={disabled}>
	<select class="glass-select__field" data-size={size} bind:value {disabled} {...rest}>
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

<style>
	.glass-select {
		position: relative;
		display: inline-block;
		min-width: 16rem;
	}
	.glass-select[data-disabled='true'] {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.glass-select__field {
		appearance: none;
		-webkit-appearance: none;
		width: 100%;
		font-family: var(--glass-font);
		font-weight: var(--glass-font-weight-medium);
		color: var(--glass-ink);
		background: var(--glass-surface);
		-webkit-backdrop-filter: blur(var(--glass-blur));
		backdrop-filter: blur(var(--glass-blur));
		border: var(--glass-border);
		border-radius: var(--glass-radius-sm);
		box-shadow: var(--glass-shadow-sm), var(--glass-highlight);
		cursor: pointer;
		transition:
			box-shadow 160ms ease,
			border-color 160ms ease,
			background-color 160ms ease;
	}
	.glass-select__field:disabled {
		cursor: not-allowed;
	}

	.glass-select__field:focus,
	.glass-select[data-state='focus'] .glass-select__field {
		outline: none;
		background: var(--glass-surface-strong);
		border-color: var(--glass-accent);
		box-shadow:
			var(--glass-shadow-sm),
			0 0 0 4px color-mix(in srgb, var(--glass-accent) 28%, transparent);
	}

	.glass-select__field[data-size='sm'] {
		font-size: var(--glass-size-sm-text);
		padding: var(--glass-size-sm-pad);
	}
	.glass-select__field[data-size='md'] {
		font-size: var(--glass-size-md-text);
		padding: var(--glass-size-md-pad);
	}
	.glass-select__field[data-size='lg'] {
		font-size: var(--glass-size-lg-text);
		padding: var(--glass-size-lg-pad);
	}
	/* reserve room for the chevron */
	.glass-select__field[data-size] {
		padding-right: 2.75rem;
	}

	.glass-select__chevron {
		position: absolute;
		top: 50%;
		right: 0.9rem;
		transform: translateY(-50%);
		width: 18px;
		height: 18px;
		color: var(--glass-ink);
		pointer-events: none;
	}
</style>
