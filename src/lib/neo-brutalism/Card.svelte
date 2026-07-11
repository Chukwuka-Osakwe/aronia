<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { CardVariant } from './options.js';
	import '../styles/neo-brutalism.css';
	import './css/card.css';

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
