<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { CardVariant } from './options.js';
	import '../styles/glassmorphism.css';
	import './css/card.css';

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
