<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import type { ButtonVariant, ButtonSize, ButtonShape } from './options.js';
	import '../styles/neo-brutalism.css';

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

<style>
	.nb-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5em;
		font-family: var(--nb-font);
		font-weight: var(--nb-font-weight);
		line-height: 1;
		text-decoration: none;
		color: var(--nb-ink);
		background: var(--nb-paper);
		border: var(--nb-border);
		border-radius: var(--nb-radius);
		box-shadow: var(--nb-shadow);
		cursor: pointer;
		transition: var(--nb-transition);
		white-space: nowrap;
		user-select: none;
	}

	/* The signature "shove": press into the shadow on hover, flatten on active.
	   Each interaction state is mirrored by a `[data-state]` selector so the docs
	   can force it for display (see the states strip). */
	.nb-btn:hover,
	.nb-btn[data-state='hover'] {
		transform: translate(var(--nb-shove), var(--nb-shove));
		box-shadow: var(--nb-shadow-hover);
	}
	.nb-btn:active,
	.nb-btn[data-state='active'] {
		transform: translate(var(--nb-shove-press), var(--nb-shove-press));
		box-shadow: 0 0 0 0 var(--nb-shadow-color);
	}
	.nb-btn:focus-visible,
	.nb-btn[data-state='focus'] {
		outline: 3px solid var(--nb-accent);
		outline-offset: 3px;
	}

	/* variants */
	.nb-btn[data-variant='primary'] {
		background: var(--nb-primary);
	}
	.nb-btn[data-variant='secondary'] {
		background: var(--nb-secondary);
	}
	.nb-btn[data-variant='muted'] {
		background: var(--nb-muted);
	}
	.nb-btn[data-variant='ghost'] {
		background: transparent;
		box-shadow: none;
	}
	.nb-btn[data-variant='ghost']:hover,
	.nb-btn[data-variant='ghost'][data-state='hover'] {
		background: var(--nb-muted);
		transform: none;
		box-shadow: none;
	}
	.nb-btn[data-variant='ghost']:active,
	.nb-btn[data-variant='ghost'][data-state='active'] {
		transform: none;
	}

	/* quiet — like ghost but ALSO borderless: a bare text button for low-emphasis
	   spots (e.g. nav items). Transparent, no shadow, no shove; a muted fill on hover. */
	.nb-btn[data-variant='quiet'] {
		background: transparent;
		border: none;
		box-shadow: none;
	}
	.nb-btn[data-variant='quiet']:hover,
	.nb-btn[data-variant='quiet'][data-state='hover'] {
		background: var(--nb-muted);
		transform: none;
		box-shadow: none;
	}
	.nb-btn[data-variant='quiet']:active,
	.nb-btn[data-variant='quiet'][data-state='active'] {
		transform: none;
	}

	/* sizes (heights ~28–44px to echo Dimsum's XS–LG scale) */
	.nb-btn[data-size='xs'] {
		font-size: var(--nb-size-xs-text);
		padding: var(--nb-size-xs-pad);
	}
	.nb-btn[data-size='sm'] {
		font-size: var(--nb-size-sm-text);
		padding: var(--nb-size-sm-pad);
	}
	.nb-btn[data-size='md'] {
		font-size: var(--nb-size-md-text);
		padding: var(--nb-size-md-pad);
	}
	.nb-btn[data-size='lg'] {
		font-size: var(--nb-size-lg-text);
		padding: var(--nb-size-lg-pad);
	}

	/* shape */
	.nb-btn[data-shape='pill'] {
		border-radius: var(--nb-radius-pill);
	}

	/* disabled — deliberate uniform inert state: every variant collapses to the
	   same flat grey (rather than a washed-out version of its own colour), keeps
	   the border + resting shadow, no shove, not interactive. The slight opacity
	   is the "off" cue that separates it from the interactive `muted` variant. */
	.nb-btn:disabled,
	.nb-btn[aria-disabled='true'] {
		background: var(--nb-muted);
		color: var(--nb-ink);
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
		box-shadow: var(--nb-shadow);
	}

	.nb-btn__icon {
		display: inline-flex;
		align-items: center;
	}
</style>
