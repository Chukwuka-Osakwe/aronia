<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { AlertVariant, InputSize } from './options.js';
	import '../styles/neo-brutalism.css';
	import './css/alert.css';

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
