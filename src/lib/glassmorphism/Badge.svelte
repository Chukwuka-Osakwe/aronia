<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { BadgeVariant } from './options.js';
	import '../styles/glassmorphism.css';
	import './css/badge.css';

	type Props = {
		variant?: BadgeVariant;
		children?: Snippet;
	} & HTMLAttributes<HTMLSpanElement>;

	let { variant = 'primary', children, ...rest }: Props = $props();
</script>

<span class="glass-badge" data-variant={variant} {...rest}>
	{#if children}{@render children()}{/if}
</span>
