<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import type { ButtonVariant, ButtonSize, ButtonShape } from './options.js';
	import '../styles/glassmorphism.css';

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

<style>
	.glass-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5em;
		font-family: var(--glass-font);
		font-weight: var(--glass-font-weight);
		line-height: 1;
		text-decoration: none;
		color: var(--glass-ink);
		background: var(--glass-surface);
		-webkit-backdrop-filter: blur(var(--glass-blur));
		backdrop-filter: blur(var(--glass-blur));
		border: var(--glass-border);
		border-radius: var(--glass-radius);
		box-shadow: var(--glass-shadow-sm), var(--glass-highlight);
		cursor: pointer;
		transition: var(--glass-transition);
		white-space: nowrap;
		user-select: none;
	}

	/* The glass "float": lift + deepen the shadow on hover, settle on press.
	   Each state mirrored by a [data-state] selector so the docs can force it. */
	.glass-btn:hover,
	.glass-btn[data-state='hover'] {
		background: var(--glass-surface-strong);
		transform: translateY(-1px);
		box-shadow: var(--glass-shadow), var(--glass-highlight);
	}
	.glass-btn:active,
	.glass-btn[data-state='active'] {
		transform: translateY(0);
		box-shadow: var(--glass-shadow-sm), var(--glass-highlight);
	}
	.glass-btn:focus-visible,
	.glass-btn[data-state='focus'] {
		outline: 2px solid var(--glass-accent);
		outline-offset: 2px;
	}

	/* variants */
	.glass-btn[data-variant='primary'] {
		background: var(--glass-primary);
		color: var(--glass-primary-ink);
		border-color: rgba(255, 255, 255, 0.3);
	}
	.glass-btn[data-variant='primary']:hover,
	.glass-btn[data-variant='primary'][data-state='hover'] {
		background: rgb(79, 70, 229);
	}
	.glass-btn[data-variant='secondary'] {
		background: var(--glass-secondary);
		color: #fff;
		border-color: rgba(255, 255, 255, 0.3);
	}
	.glass-btn[data-variant='muted'] {
		background: rgba(255, 255, 255, 0.3);
	}
	.glass-btn[data-variant='ghost'] {
		background: transparent;
		-webkit-backdrop-filter: none;
		backdrop-filter: none;
		box-shadow: none;
		border-color: transparent;
	}
	.glass-btn[data-variant='ghost']:hover,
	.glass-btn[data-variant='ghost'][data-state='hover'] {
		background: var(--glass-surface);
		transform: none;
		box-shadow: none;
	}
	/* quiet — bare text button (nav items): no fill, border, or shadow. */
	.glass-btn[data-variant='quiet'] {
		background: transparent;
		-webkit-backdrop-filter: none;
		backdrop-filter: none;
		border: none;
		box-shadow: none;
	}
	.glass-btn[data-variant='quiet']:hover,
	.glass-btn[data-variant='quiet'][data-state='hover'] {
		background: var(--glass-surface);
		transform: none;
		box-shadow: none;
	}

	/* sizes */
	.glass-btn[data-size='xs'] {
		font-size: var(--glass-size-xs-text);
		padding: var(--glass-size-xs-pad);
	}
	.glass-btn[data-size='sm'] {
		font-size: var(--glass-size-sm-text);
		padding: var(--glass-size-sm-pad);
	}
	.glass-btn[data-size='md'] {
		font-size: var(--glass-size-md-text);
		padding: var(--glass-size-md-pad);
	}
	.glass-btn[data-size='lg'] {
		font-size: var(--glass-size-lg-text);
		padding: var(--glass-size-lg-pad);
	}

	/* shape */
	.glass-btn[data-shape='pill'] {
		border-radius: var(--glass-radius-pill);
	}

	/* disabled — inert, faded, no lift. */
	.glass-btn:disabled,
	.glass-btn[aria-disabled='true'] {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
		box-shadow: var(--glass-shadow-sm);
	}

	.glass-btn__icon {
		display: inline-flex;
		align-items: center;
	}

	@media (prefers-reduced-motion: reduce) {
		.glass-btn {
			transition: background-color 160ms ease;
		}
		.glass-btn:hover,
		.glass-btn:active {
			transform: none;
		}
	}
</style>
