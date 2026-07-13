<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { LinkVariant } from './options.js';
	import '../styles/swiss.css';
	import './css/link.css';

	// A link — the navigate counterpart to Button's act. Always an <a>. Two variants:
	// `inline` (a text link in prose) and `nav` (a compact sidebar/menu item that
	// knows its active state). `external` adds a new-tab + ↗ affordance.
	type Props = {
		variant?: LinkVariant;
		/** For `nav`: marks the current page (colour + underline + aria-current). */
		active?: boolean;
		external?: boolean;
		href?: string;
		children?: Snippet;
	} & Omit<HTMLAnchorAttributes, 'href'>;

	let {
		variant = 'inline',
		active = false,
		external = false,
		href,
		children,
		...rest
	}: Props = $props();
</script>

<a
	class="swiss-link"
	data-variant={variant}
	data-active={active ? 'true' : undefined}
	aria-current={variant === 'nav' && active ? 'page' : undefined}
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	{...rest}
>
	{@render children?.()}{#if external}<span class="swiss-link__ext" aria-hidden="true">↗</span>{/if}
</a>
