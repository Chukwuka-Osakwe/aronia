<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { LinkVariant } from './options.js';
	import '../styles/glassmorphism.css';
	import './css/link.css';

	// A link — the navigate counterpart to Button. Always an <a>. `inline` (a text
	// link in prose) and `nav` (a compact, active-aware sidebar/menu item).
	// `external` adds a new-tab + ↗ affordance.
	//
	// Interaction language (both variants): coloured text at rest, then hover steps up
	// the weight and fades a native underline in.
	type Props = {
		variant?: LinkVariant;
		/** For `nav`: marks the current page (weight + colour + persistent underline + aria-current). */
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
	class="glass-link"
	data-variant={variant}
	data-active={active ? 'true' : undefined}
	aria-current={variant === 'nav' && active ? 'page' : undefined}
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	{...rest}
>
	{@render children?.()}{#if external}<span class="glass-link__ext" aria-hidden="true">↗</span>{/if}
</a>
