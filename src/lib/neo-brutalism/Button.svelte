<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import type { ButtonVariant, ButtonSize, ButtonShape } from './options.js';
	import '../styles/neo-brutalism.css';
	// Layer 2 (the style) is a global stylesheet shared with the aronia registry —
	// plain-CSS imports are unscoped in Svelte, so the same file drives both.
	import './css/button.css';

	// Polymorphic: pass `href` to render an <a>, otherwise a <button>.
	// Rest props are forwarded to whichever element we render.
	type Props = {
		variant?: ButtonVariant;
		size?: ButtonSize;
		shape?: ButtonShape;
		disabled?: boolean;
		href?: string;
		/** Optional leading icon (a snippet, so callers control the markup). */
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

<!--
	Data attributes (not dynamic class names) drive the styling so Svelte's
	scoped-CSS analysis keeps every selector — dynamic class strings can be
	pruned as "unused".
-->
{#snippet content()}
	{#if icon}<span class="nb-btn__icon">{@render icon()}</span>{/if}
	{#if children}<span class="nb-btn__label">{@render children()}</span>{/if}
{/snippet}

{#if asLink}
	<a class="nb-btn" data-variant={variant} data-size={size} data-shape={shape} {href} {...rest}>
		{@render content()}
	</a>
{:else}
	<button
		class="nb-btn"
		data-variant={variant}
		data-size={size}
		data-shape={shape}
		{disabled}
		{...rest}
	>
		{@render content()}
	</button>
{/if}
