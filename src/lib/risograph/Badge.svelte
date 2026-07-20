<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { BadgeVariant, BadgeShape } from './options.js';
	import '../styles/riso.css';
	import './css/badge.css';

	type Props = {
		variant?: BadgeVariant;
		shape?: BadgeShape;
		children?: Snippet;
	} & HTMLAttributes<HTMLSpanElement>;

	let { variant = 'neutral', shape = 'square', children, ...rest }: Props = $props();
</script>

<span class="riso-badge" data-variant={variant} data-shape={shape} {...rest}>
	{#if children}{@render children()}{/if}
</span>
