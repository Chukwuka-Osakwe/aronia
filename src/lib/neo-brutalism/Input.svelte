<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import '../styles/neo-brutalism.css';

	// `size` is renamed off the native input attribute (which is a number) so we
	// can use it for our own scale. `value` is bindable for two-way form state.
	type Props = {
		value?: string;
		size?: InputSize;
	} & Omit<HTMLInputAttributes, 'size'>;

	let { value = $bindable(''), size = 'md', ...rest }: Props = $props();
</script>

<input class="nb-input" data-size={size} bind:value {...rest} />

<style>
	.nb-input {
		font-family: var(--nb-font);
		font-weight: var(--nb-font-weight-medium);
		color: var(--nb-ink);
		background: var(--nb-paper);
		border: var(--nb-border);
		border-radius: var(--nb-radius);
		box-shadow: var(--nb-shadow);
		transition: var(--nb-transition);
	}
	.nb-input::placeholder {
		color: var(--nb-ink);
		opacity: 0.4;
	}

	/* Focus keeps the text still (no shove) but pops an accent-coloured shadow.
	   Mirrored by `[data-state='focus']` so the docs can force it for display. */
	.nb-input:focus,
	.nb-input[data-state='focus'] {
		outline: none;
		box-shadow: var(--nb-shadow), 0 0 0 3px var(--nb-accent);
	}

	/* Disabled — intentional inert field: greyed background (Input has no colour
	   variants to collapse), keeps the border + shadow, not interactive. */
	.nb-input:disabled {
		background: var(--nb-muted);
		opacity: 0.6;
		cursor: not-allowed;
	}

	.nb-input[data-size='sm'] {
		font-size: var(--nb-size-sm-text);
		padding: var(--nb-size-sm-pad);
	}
	.nb-input[data-size='md'] {
		font-size: var(--nb-size-md-text);
		padding: var(--nb-size-md-pad);
	}
	.nb-input[data-size='lg'] {
		font-size: var(--nb-size-lg-text);
		padding: var(--nb-size-lg-pad);
	}
</style>
