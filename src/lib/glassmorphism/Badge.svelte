<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { BadgeVariant } from './options.js';
	import '../styles/glassmorphism.css';

	type Props = {
		variant?: BadgeVariant;
		children?: Snippet;
	} & HTMLAttributes<HTMLSpanElement>;

	let { variant = 'primary', children, ...rest }: Props = $props();
</script>

<span class="glass-badge" data-variant={variant} {...rest}>
	{#if children}{@render children()}{/if}
</span>

<style>
	.glass-badge {
		display: inline-flex;
		align-items: center;
		font-family: var(--glass-font);
		font-weight: var(--glass-font-weight);
		font-size: var(--glass-size-xs-text);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		line-height: 1;
		padding: 0.3rem 0.65rem;
		color: #fff;
		background: var(--glass-primary);
		-webkit-backdrop-filter: blur(var(--glass-blur));
		backdrop-filter: blur(var(--glass-blur));
		border: var(--glass-border);
		/* pill — glass badges read as soft chips, not hard tags */
		border-radius: var(--glass-radius-pill);
		box-shadow: var(--glass-shadow-sm), var(--glass-highlight);
		white-space: nowrap;
	}

	.glass-badge[data-variant='primary'] {
		background: var(--glass-primary);
	}
	.glass-badge[data-variant='secondary'] {
		background: var(--glass-secondary);
	}
	.glass-badge[data-variant='accent'] {
		background: var(--glass-info);
	}
	.glass-badge[data-variant='muted'] {
		background: var(--glass-surface-strong);
		color: var(--glass-ink);
	}
</style>
