<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { LinkVariant } from './options.js';
	import '../styles/riso.css';
	import './css/link.css';

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
	class="riso-link"
	data-variant={variant}
	data-active={active ? 'true' : undefined}
	aria-current={variant === 'nav' && active ? 'page' : undefined}
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	{...rest}
>
	{@render children?.()}{#if external}<span class="riso-link__ext" aria-hidden="true">↗</span>{/if}
</a>
