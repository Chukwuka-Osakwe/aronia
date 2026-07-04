<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { LinkVariant } from './options.js';
	import '../styles/glassmorphism.css';

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

<style>
	.glass-link {
		font-family: var(--glass-font);
		color: var(--glass-ink);
		cursor: pointer;
		/* A real native underline (skips descenders, wraps correctly), held invisible
		   at rest via a transparent colour so it can fade in on hover/active. */
		text-decoration: underline;
		text-decoration-color: transparent;
		text-decoration-thickness: 1.5px;
		text-underline-offset: 3px;
		transition:
			text-decoration-color 200ms ease,
			color 140ms ease;
	}
	.glass-link:focus-visible,
	.glass-link[data-state='focus'] {
		outline: none;
		border-radius: var(--glass-radius-sm);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--glass-accent) 45%, transparent);
	}

	/* inline — indigo text at rest (--glass-link-ink, AA-safe, unlike the lighter
	   non-text accent). Hover bolds it and fades the underline in. */
	.glass-link[data-variant='inline'] {
		color: var(--glass-link-ink);
		font-weight: var(--glass-font-weight-medium);
	}
	.glass-link[data-variant='inline']:hover,
	.glass-link[data-variant='inline'][data-state='hover'] {
		font-weight: var(--glass-font-weight-bold);
		text-decoration-color: currentColor;
	}

	/* nav — quiet ink at rest, so the coloured active item stands out. Same hover as
	   inline. Active is the "stuck hover", coloured: bold + indigo + a persistent
	   underline, with aria-current for assistive tech. */
	.glass-link[data-variant='nav'] {
		display: inline-block;
		padding: 0.3rem 0.55rem;
		font-size: var(--glass-size-sm-text);
		font-weight: var(--glass-font-weight-medium);
		border-radius: var(--glass-radius-sm);
	}
	.glass-link[data-variant='nav']:hover,
	.glass-link[data-variant='nav'][data-state='hover'] {
		font-weight: var(--glass-font-weight-bold);
		text-decoration-color: currentColor;
	}
	.glass-link[data-variant='nav'][data-active='true'] {
		color: var(--glass-link-ink);
		font-weight: var(--glass-font-weight-bold);
		text-decoration-color: currentColor;
	}

	.glass-link__ext {
		margin-left: 0.15em;
		font-size: 0.85em;
	}

	/* The underline fade is the motion; disable it (appears instantly) for reduced motion. */
	@media (prefers-reduced-motion: reduce) {
		.glass-link {
			transition: none;
		}
	}
</style>
