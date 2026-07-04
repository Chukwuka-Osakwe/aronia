<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { AlertVariant, InputSize } from './options.js';
	import '../styles/glassmorphism.css';

	// Inline status message. Where NB uses a bold full-colour box, glass uses a
	// LIGHT frosted TINT of the status colour (soft, translucent) with the saturated
	// colour reserved for the icon + rim — the honest glass idiom. Severity picks the
	// aria role: error/warning announce assertively (`alert`), info/success politely
	// (`status`). `size` sets a base font-size the icon + title scale off (via em).
	type Props = {
		variant?: AlertVariant;
		size?: InputSize;
		/** Optional bold heading above the message. */
		title?: string;
		children?: Snippet;
	};

	let { variant = 'info', size = 'md', title, children }: Props = $props();

	const role = $derived(variant === 'error' || variant === 'warning' ? 'alert' : 'status');
</script>

<div class="glass-alert" data-variant={variant} data-size={size} {role}>
	<span class="glass-alert__icon">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			{#if variant === 'success'}
				<circle cx="12" cy="12" r="10" />
				<polyline points="8 12 11 15 16 9" />
			{:else if variant === 'warning'}
				<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
				<line x1="12" y1="9" x2="12" y2="13" />
				<line x1="12" y1="17" x2="12.01" y2="17" />
			{:else if variant === 'error'}
				<circle cx="12" cy="12" r="10" />
				<line x1="15" y1="9" x2="9" y2="15" />
				<line x1="9" y1="9" x2="15" y2="15" />
			{:else}
				<circle cx="12" cy="12" r="10" />
				<line x1="12" y1="16" x2="12" y2="12" />
				<line x1="12" y1="8" x2="12.01" y2="8" />
			{/if}
		</svg>
	</span>
	<div class="glass-alert__content">
		{#if title}<p class="glass-alert__title">{title}</p>{/if}
		<div class="glass-alert__message">{@render children?.()}</div>
	</div>
</div>

<style>
	.glass-alert {
		display: flex;
		align-items: flex-start;
		/* light frosted tint of the status colour; saturated colour goes to the rim */
		background: color-mix(in srgb, var(--_alert-color) 24%, transparent);
		-webkit-backdrop-filter: blur(var(--glass-blur));
		backdrop-filter: blur(var(--glass-blur));
		border: 1px solid color-mix(in srgb, var(--_alert-color) 55%, transparent);
		border-radius: var(--glass-radius);
		box-shadow: var(--glass-shadow-sm), var(--glass-highlight);
		font-family: var(--glass-font);
		color: var(--glass-ink);
		/* base font-size (per size) drives the icon + title via em */
		font-size: var(--glass-size-md-text);
	}

	/* Per-variant status colour — one token the fill, rim, and icon all derive from. */
	.glass-alert[data-variant='info'] {
		--_alert-color: var(--glass-info);
	}
	.glass-alert[data-variant='success'] {
		--_alert-color: var(--glass-success);
	}
	.glass-alert[data-variant='warning'] {
		--_alert-color: var(--glass-warning);
	}
	.glass-alert[data-variant='error'] {
		--_alert-color: var(--glass-danger);
	}

	/* size scale — one font-size + padding/gap per step; icon & title follow via em */
	.glass-alert[data-size='sm'] {
		font-size: var(--glass-size-sm-text);
		gap: 0.625rem;
		padding: 0.75rem 1rem;
	}
	.glass-alert[data-size='md'] {
		font-size: var(--glass-size-md-text);
		gap: 0.75rem;
		padding: 1rem 1.25rem;
	}
	.glass-alert[data-size='lg'] {
		font-size: var(--glass-size-lg-text);
		gap: 0.875rem;
		padding: 1.25rem 1.5rem;
	}

	.glass-alert__icon {
		flex: none;
		width: 1.5em;
		height: 1.5em;
		/* nudge to align with the first line of text */
		margin-top: 0.1em;
		color: var(--_alert-color);
	}
	.glass-alert__icon svg {
		width: 100%;
		height: 100%;
	}

	.glass-alert__title {
		margin: 0 0 0.25rem;
		font-size: 1.05em;
		font-weight: var(--glass-font-weight);
	}
	.glass-alert__message {
		font-weight: var(--glass-font-weight-regular);
		font-size: 1em;
		line-height: 1.4;
	}
</style>
