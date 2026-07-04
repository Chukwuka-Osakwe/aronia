<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import '../styles/glassmorphism.css';

	// `size` is renamed off the native input attribute (a number) so we can use it
	// for our own scale. `value` is bindable for two-way form state.
	type Props = {
		value?: string;
		size?: InputSize;
	} & Omit<HTMLInputAttributes, 'size'>;

	let { value = $bindable(''), size = 'md', ...rest }: Props = $props();
</script>

<input class="glass-input" data-size={size} bind:value {...rest} />

<style>
	.glass-input {
		font-family: var(--glass-font);
		font-weight: var(--glass-font-weight-medium);
		color: var(--glass-ink);
		background: var(--glass-surface);
		-webkit-backdrop-filter: blur(var(--glass-blur));
		backdrop-filter: blur(var(--glass-blur));
		border: var(--glass-border);
		border-radius: var(--glass-radius-sm);
		box-shadow: var(--glass-shadow-sm), var(--glass-highlight);
		transition:
			box-shadow 160ms ease,
			border-color 160ms ease,
			background-color 160ms ease;
	}
	.glass-input::placeholder {
		color: var(--glass-ink-soft);
	}

	/* Focus: the border picks up the accent and a soft glow blooms (no hard ring —
	   glass diffuses). Mirrored by `[data-state='focus']` for the docs states strip. */
	.glass-input:focus,
	.glass-input[data-state='focus'] {
		outline: none;
		background: var(--glass-surface-strong);
		border-color: var(--glass-accent);
		box-shadow:
			var(--glass-shadow-sm),
			0 0 0 4px color-mix(in srgb, var(--glass-accent) 28%, transparent);
	}

	.glass-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.glass-input[data-size='sm'] {
		font-size: var(--glass-size-sm-text);
		padding: var(--glass-size-sm-pad);
	}
	.glass-input[data-size='md'] {
		font-size: var(--glass-size-md-text);
		padding: var(--glass-size-md-pad);
	}
	.glass-input[data-size='lg'] {
		font-size: var(--glass-size-lg-text);
		padding: var(--glass-size-lg-pad);
	}
</style>
