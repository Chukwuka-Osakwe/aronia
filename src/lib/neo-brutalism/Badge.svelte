<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { BadgeVariant } from './options.js';
	import '../styles/neo-brutalism.css';

	type Props = {
		variant?: BadgeVariant;
		children?: Snippet;
	} & HTMLAttributes<HTMLSpanElement>;

	let { variant = 'primary', children, ...rest }: Props = $props();
</script>

<span class="nb-badge" data-variant={variant} {...rest}>
	{#if children}{@render children()}{/if}
</span>

<style>
	.nb-badge {
		display: inline-flex;
		align-items: center;
		font-family: var(--nb-font);
		font-weight: var(--nb-font-weight);
		font-size: var(--nb-size-xs-text);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		line-height: 1;
		padding: 0.3rem 0.5rem;
		color: var(--nb-ink);
		background: var(--nb-paper);
		border: 2px solid var(--nb-ink);
		border-radius: var(--nb-radius);
		box-shadow: var(--nb-shadow);
		white-space: nowrap;
	}

	.nb-badge[data-variant='primary'] {
		background: var(--nb-primary);
	}
	.nb-badge[data-variant='secondary'] {
		background: var(--nb-secondary);
	}
	.nb-badge[data-variant='muted'] {
		background: var(--nb-muted);
	}
	.nb-badge[data-variant='accent'] {
		background: var(--nb-accent);
	}
</style>
