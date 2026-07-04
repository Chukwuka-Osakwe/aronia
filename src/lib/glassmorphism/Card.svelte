<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { CardVariant } from './options.js';
	import '../styles/glassmorphism.css';

	type Props = {
		variant?: CardVariant;
		/** Optional header region, divided from the body by a faint rule. */
		header?: Snippet;
		/** Optional footer region, divided from the body by a faint rule. */
		footer?: Snippet;
		children?: Snippet;
	} & HTMLAttributes<HTMLDivElement>;

	let { variant = 'surface', header, footer, children, ...rest }: Props = $props();
</script>

<div class="glass-card" data-variant={variant} {...rest}>
	{#if header}<div class="glass-card__header">{@render header()}</div>{/if}
	{#if children}<div class="glass-card__body">{@render children()}</div>{/if}
	{#if footer}<div class="glass-card__footer">{@render footer()}</div>{/if}
</div>

<style>
	.glass-card {
		display: flex;
		flex-direction: column;
		background: var(--glass-surface);
		-webkit-backdrop-filter: blur(var(--glass-blur));
		backdrop-filter: blur(var(--glass-blur));
		color: var(--glass-ink);
		border: var(--glass-border);
		border-radius: var(--glass-radius);
		box-shadow: var(--glass-shadow), var(--glass-highlight);
		font-family: var(--glass-font);
		overflow: hidden;
	}

	.glass-card[data-variant='strong'] {
		background: var(--glass-surface-strong);
	}
	.glass-card[data-variant='primary'] {
		background: var(--glass-primary);
		color: var(--glass-primary-ink);
	}
	.glass-card[data-variant='secondary'] {
		background: var(--glass-secondary);
		color: #fff;
	}

	.glass-card__header,
	.glass-card__footer {
		padding: 0.875rem 1.25rem;
		font-weight: var(--glass-font-weight);
	}
	.glass-card__header {
		border-bottom: var(--glass-divider);
	}
	.glass-card__footer {
		border-top: var(--glass-divider);
	}
	.glass-card__body {
		padding: 1.25rem;
		font-weight: var(--glass-font-weight-regular);
		line-height: 1.5;
	}
</style>
