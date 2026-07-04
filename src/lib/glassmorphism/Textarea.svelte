<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import '../styles/glassmorphism.css';

	// Multiline sibling of Input: same frosted field language, a bindable value, and
	// a `rows` height. `size` is our own scale (not a native attribute).
	type Props = {
		value?: string;
		size?: InputSize;
		rows?: number;
	} & Omit<HTMLTextareaAttributes, 'size'>;

	let { value = $bindable(''), size = 'md', rows = 4, ...rest }: Props = $props();
</script>

<textarea class="glass-textarea" data-size={size} {rows} bind:value {...rest}></textarea>

<style>
	.glass-textarea {
		display: block;
		width: 100%;
		font-family: var(--glass-font);
		font-weight: var(--glass-font-weight-medium);
		line-height: 1.5;
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
		/* vertical only: horizontal resize would fight the frosted box */
		resize: vertical;
	}
	.glass-textarea::placeholder {
		color: var(--glass-ink-soft);
	}

	.glass-textarea:focus,
	.glass-textarea[data-state='focus'] {
		outline: none;
		background: var(--glass-surface-strong);
		border-color: var(--glass-accent);
		box-shadow:
			var(--glass-shadow-sm),
			0 0 0 4px color-mix(in srgb, var(--glass-accent) 28%, transparent);
	}

	.glass-textarea:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.glass-textarea[data-size='sm'] {
		font-size: var(--glass-size-sm-text);
		padding: var(--glass-size-sm-pad);
	}
	.glass-textarea[data-size='md'] {
		font-size: var(--glass-size-md-text);
		padding: var(--glass-size-md-pad);
	}
	.glass-textarea[data-size='lg'] {
		font-size: var(--glass-size-lg-text);
		padding: var(--glass-size-lg-pad);
	}
</style>
