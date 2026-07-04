<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { LinkVariant } from './options.js';
	import '../styles/neo-brutalism.css';

	// A link — the navigate counterpart to Button's act. Always an <a>. Two variants:
	// `inline` (a text link in prose) and `nav` (a compact sidebar/menu item that
	// knows its active state). `external` adds a new-tab + ↗ affordance.
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
	class="nb-link"
	data-variant={variant}
	data-active={active ? 'true' : undefined}
	aria-current={variant === 'nav' && active ? 'page' : undefined}
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	{...rest}
>
	{@render children?.()}{#if external}<span class="nb-link__ext" aria-hidden="true">↗</span>{/if}
</a>

<style>
	.nb-link {
		font-family: var(--nb-font);
		color: var(--nb-ink);
		cursor: pointer;
		/* A real native underline (skips descenders, wraps correctly), held invisible
		   at rest via a transparent colour so it can fade in on hover/active. */
		text-decoration: underline;
		text-decoration-color: transparent;
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
		transition:
			text-decoration-color 160ms ease,
			color 120ms ease;
	}
	.nb-link:focus-visible,
	.nb-link[data-state='focus'] {
		outline: 3px solid var(--nb-accent);
		outline-offset: 2px;
	}

	/* inline — coloured text at rest (the brand cyan is a fill, fails AA as text, so
	   links use the darker --nb-link-ink). Hover bolds it and fades the underline in. */
	.nb-link[data-variant='inline'] {
		color: var(--nb-link-ink);
		font-weight: var(--nb-font-weight-medium);
	}
	.nb-link[data-variant='inline']:hover,
	.nb-link[data-variant='inline'][data-state='hover'] {
		font-weight: var(--nb-font-weight-bold);
		text-decoration-color: currentColor;
	}

	/* nav — quiet ink at rest (no underline), so the coloured active item stands out.
	   Same hover as inline. Active is the "stuck hover", coloured: bold + --nb-link-ink
	   + a persistent underline, with aria-current for assistive tech. */
	.nb-link[data-variant='nav'] {
		display: inline-block;
		padding: 0.3rem 0.5rem;
		font-size: var(--nb-size-sm-text);
		font-weight: var(--nb-font-weight-medium);
	}
	.nb-link[data-variant='nav']:hover,
	.nb-link[data-variant='nav'][data-state='hover'] {
		font-weight: var(--nb-font-weight-bold);
		text-decoration-color: currentColor;
	}
	.nb-link[data-variant='nav'][data-active='true'] {
		color: var(--nb-link-ink);
		font-weight: var(--nb-font-weight-bold);
		text-decoration-color: currentColor;
	}

	.nb-link__ext {
		margin-left: 0.15em;
		font-size: 0.85em;
	}

	/* The underline fade is the motion; disable it (appears instantly) for reduced motion. */
	@media (prefers-reduced-motion: reduce) {
		.nb-link {
			transition: none;
		}
	}
</style>
