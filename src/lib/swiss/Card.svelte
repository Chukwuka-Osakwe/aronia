<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { CardVariant } from './options.js';
	import '../styles/swiss.css';
	import './css/card.css';

	type Props = {
		variant?: CardVariant;
		/** Optional header region, separated from the body by a hairline rule. */
		header?: Snippet;
		/** Optional footer region, separated from the body by a hairline rule. */
		footer?: Snippet;
		children?: Snippet;
	} & HTMLAttributes<HTMLDivElement>;

	let { variant = 'paper', header, footer, children, ...rest }: Props = $props();
</script>

<div class="swiss-card" data-variant={variant} {...rest}>
	{#if header}<div class="swiss-card__header">{@render header()}</div>{/if}
	{#if children}<div class="swiss-card__body">{@render children()}</div>{/if}
	{#if footer}<div class="swiss-card__footer">{@render footer()}</div>{/if}
</div>
