<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { BadgeVariant } from './options.js';
	import '../styles/swiss.css';
	import './css/badge.css';

	type Props = {
		variant?: BadgeVariant;
		children?: Snippet;
	} & HTMLAttributes<HTMLSpanElement>;

	let { variant = 'neutral', children, ...rest }: Props = $props();
</script>

<span class="swiss-badge" data-variant={variant} {...rest}>
	{#if children}{@render children()}{/if}
</span>
