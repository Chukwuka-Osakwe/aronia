<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { CardVariant } from './options.js';
	import '../styles/riso.css';
	import './css/card.css';

	type Props = {
		variant?: CardVariant;
		header?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	} & HTMLAttributes<HTMLDivElement>;

	let { variant = 'paper', header, footer, children, ...rest }: Props = $props();
</script>

<div class="riso-card" data-variant={variant} {...rest}>
	{#if header}<div class="riso-card__header">{@render header()}</div>{/if}
	{#if children}<div class="riso-card__body">{@render children()}</div>{/if}
	{#if footer}<div class="riso-card__footer">{@render footer()}</div>{/if}
</div>
