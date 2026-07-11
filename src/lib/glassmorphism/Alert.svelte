<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { AlertVariant, InputSize } from './options.js';
	import '../styles/glassmorphism.css';
	import './css/alert.css';

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
