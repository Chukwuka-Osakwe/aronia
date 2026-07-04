<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { CardVariant } from './options.js';
	import '../styles/neo-brutalism.css';

	type Props = {
		variant?: CardVariant;
		/** Optional header region, separated from the body by a hard rule. */
		header?: Snippet;
		/** Optional footer region, separated from the body by a hard rule. */
		footer?: Snippet;
		children?: Snippet;
	} & HTMLAttributes<HTMLDivElement>;

	let { variant = 'paper', header, footer, children, ...rest }: Props = $props();
</script>

<div class="nb-card" data-variant={variant} {...rest}>
	{#if header}<div class="nb-card__header">{@render header()}</div>{/if}
	{#if children}<div class="nb-card__body">{@render children()}</div>{/if}
	{#if footer}<div class="nb-card__footer">{@render footer()}</div>{/if}
</div>

<style>
	.nb-card {
		display: flex;
		flex-direction: column;
		background: var(--nb-paper);
		color: var(--nb-ink);
		border: var(--nb-border);
		border-radius: var(--nb-radius);
		box-shadow: var(--nb-shadow);
		font-family: var(--nb-font);
		overflow: hidden;
	}

	.nb-card[data-variant='primary'] {
		background: var(--nb-primary);
	}
	.nb-card[data-variant='secondary'] {
		background: var(--nb-secondary);
	}
	.nb-card[data-variant='muted'] {
		background: var(--nb-muted);
	}

	.nb-card__header,
	.nb-card__footer {
		padding: 0.875rem 1.25rem;
		font-weight: var(--nb-font-weight);
	}
	.nb-card__header {
		border-bottom: var(--nb-border);
	}
	.nb-card__footer {
		border-top: var(--nb-border);
	}
	.nb-card__body {
		padding: 1.25rem;
		font-weight: var(--nb-font-weight-regular);
		line-height: 1.45;
	}
</style>
