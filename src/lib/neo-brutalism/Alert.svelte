<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { AlertVariant, InputSize } from './options.js';
	import '../styles/neo-brutalism.css';

	// Inline status message: a bold full-colour NB box with a per-variant icon.
	// Severity picks the aria role — error/warning announce assertively (`alert`),
	// info/success politely (`status`). `size` sets a base font-size that the icon
	// and title scale off (via em), on the shared 14/16/18 text scale.
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

<div class="nb-alert" data-variant={variant} data-size={size} {role}>
	<span class="nb-alert__icon">
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
	<div class="nb-alert__content">
		{#if title}<p class="nb-alert__title">{title}</p>{/if}
		<div class="nb-alert__message">{@render children?.()}</div>
	</div>
</div>

<style>
	.nb-alert {
		display: flex;
		align-items: flex-start;
		border: var(--nb-border);
		border-radius: var(--nb-radius);
		box-shadow: var(--nb-shadow);
		font-family: var(--nb-font);
		color: var(--nb-ink);
		/* base font-size (per size) drives the icon + title via em */
		font-size: var(--nb-size-md-text);
	}
	/* size scale — one font-size + padding/gap per step; icon & title follow via em */
	.nb-alert[data-size='sm'] {
		font-size: var(--nb-size-sm-text);
		gap: 0.625rem;
		padding: 0.75rem 1rem;
	}
	.nb-alert[data-size='md'] {
		font-size: var(--nb-size-md-text);
		gap: 0.75rem;
		padding: 1rem 1.25rem;
	}
	.nb-alert[data-size='lg'] {
		font-size: var(--nb-size-lg-text);
		gap: 0.875rem;
		padding: 1.25rem 1.5rem;
	}
	.nb-alert[data-variant='info'] {
		background: var(--nb-info);
	}
	.nb-alert[data-variant='success'] {
		background: var(--nb-success);
	}
	.nb-alert[data-variant='warning'] {
		background: var(--nb-warning);
	}
	.nb-alert[data-variant='error'] {
		background: var(--nb-danger);
	}

	.nb-alert__icon {
		flex: none;
		width: 1.5em;
		height: 1.5em;
		/* nudge to align with the first line of text */
		margin-top: 0.1em;
	}
	.nb-alert__icon svg {
		width: 100%;
		height: 100%;
	}

	.nb-alert__title {
		margin: 0 0 0.25rem;
		font-size: 1.05em;
		font-weight: var(--nb-font-weight);
	}
	.nb-alert__message {
		font-weight: var(--nb-font-weight-regular);
		font-size: 1em;
		line-height: 1.4;
	}
</style>
