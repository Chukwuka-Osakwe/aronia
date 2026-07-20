<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import type { ButtonVariant, ButtonSize, ButtonShape } from './options.js';
	import '../styles/riso.css';
	// Layer 2 (the style) is a global stylesheet shared with the aronia registry —
	// plain-CSS imports are unscoped in Svelte, so the same file drives both.
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
	{#if icon}<span class="riso-btn__icon">{@render icon()}</span>{/if}
	{#if children}<span class="riso-btn__label">{@render children()}</span>{/if}
{/snippet}

{#if asLink}
	<a class="riso-btn" data-variant={variant} data-size={size} data-shape={shape} {href} {...rest}>
		{@render content()}
	</a>
{:else}
	<button
		class="riso-btn"
		data-variant={variant}
		data-size={size}
		data-shape={shape}
		{disabled}
		{...rest}
	>
		{@render content()}
	</button>
{/if}
