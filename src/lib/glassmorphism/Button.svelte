<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import type { ButtonVariant, ButtonSize, ButtonShape } from './options.js';
	import '../styles/glassmorphism.css';
	import './css/button.css';

	// Polymorphic: pass `href` to render an <a>, otherwise a <button>.
	type Props = {
		variant?: ButtonVariant;
		size?: ButtonSize;
		shape?: ButtonShape;
		disabled?: boolean;
		href?: string;
		icon?: Snippet;
		children?: Snippet;
	} & Omit<HTMLButtonAttributes & HTMLAnchorAttributes, 'href'>;

	let {
		variant = 'primary',
		size = 'md',
		shape = 'square',
		disabled = false,
		href,
		icon,
		children,
		...rest
	}: Props = $props();

	const asLink = $derived(href !== undefined && !disabled);
</script>

{#snippet content()}
	{#if icon}<span class="glass-btn__icon">{@render icon()}</span>{/if}
	{#if children}<span class="glass-btn__label">{@render children()}</span>{/if}
{/snippet}

{#if asLink}
	<a class="glass-btn" data-variant={variant} data-size={size} data-shape={shape} {href} {...rest}>
		{@render content()}
	</a>
{:else}
	<button
		class="glass-btn"
		data-variant={variant}
		data-size={size}
		data-shape={shape}
		{disabled}
		{...rest}
	>
		{@render content()}
	</button>
{/if}
