<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { BadgeVariant, BadgeShape } from './options.js';
	import '../styles/glassmorphism.css';
	import './css/badge.css';

	type Props = {
		variant?: BadgeVariant;
		shape?: BadgeShape;
		children?: Snippet;
	} & HTMLAttributes<HTMLSpanElement>;

	let { variant = 'primary', shape = 'pill', children, ...rest }: Props = $props();
</script>

<span class="glass-badge" data-variant={variant} data-shape={shape} {...rest}>
	{#if children}{@render children()}{/if}
</span>
