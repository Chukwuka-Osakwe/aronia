<script lang="ts">
	import type { InputSize, SpinnerSpeed } from './options.js';
	import '../styles/glassmorphism.css';

	// Indeterminate loading: a round ring with a faint frosted track and one indigo
	// arc, rotating. Round + soft — where NB is a hard square, glass is a circle.
	type Props = {
		size?: InputSize;
		/** Rotation speed. */
		speed?: SpinnerSpeed;
		/** Announced to assistive tech while loading. */
		label?: string;
	};
	let { size = 'md', speed = 'normal', label = 'Loading' }: Props = $props();
</script>

<span class="glass-spinner" data-size={size} data-speed={speed} role="status" aria-label={label}>
	<span class="glass-spinner__ring" aria-hidden="true"></span>
</span>

<style>
	.glass-spinner {
		display: inline-flex;
	}
	.glass-spinner__ring {
		box-sizing: border-box;
		border-radius: 50%;
		/* faint frosted track + one indigo arc that reads as the moving part.
		   Duration resolves public override → speed preset → default: a consumer can
		   set --glass-spinner-duration to ANY value at ANY specificity and it wins,
		   because it takes precedence in the var() chain rather than competing with
		   the preset rules. The `speed` prop just fills the private preset. */
		border: 3px solid color-mix(in srgb, var(--glass-ink) 15%, transparent);
		border-top-color: var(--glass-accent);
		animation: glass-spin var(--glass-spinner-duration, var(--_glass-spinner-speed, 0.9s)) linear
			infinite;
	}

	/* speed prop → private preset (public --glass-spinner-duration overrides it) */
	.glass-spinner[data-speed='slow'] {
		--_glass-spinner-speed: 1.6s;
	}
	.glass-spinner[data-speed='normal'] {
		--_glass-spinner-speed: 0.9s;
	}
	.glass-spinner[data-speed='fast'] {
		--_glass-spinner-speed: 0.5s;
	}

	/* size → ring dimensions + stroke */
	.glass-spinner[data-size='sm'] .glass-spinner__ring {
		width: 1.25rem;
		height: 1.25rem;
		border-width: 2.5px;
	}
	.glass-spinner[data-size='md'] .glass-spinner__ring {
		width: 1.75rem;
		height: 1.75rem;
		border-width: 3px;
	}
	.glass-spinner[data-size='lg'] .glass-spinner__ring {
		width: 2.5rem;
		height: 2.5rem;
		border-width: 4px;
	}

	@keyframes glass-spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Reduced-motion wins over the prop AND a consumer's --glass-spinner-duration —
	   set the longhand directly (accessibility takes priority over customisation). */
	@media (prefers-reduced-motion: reduce) {
		.glass-spinner .glass-spinner__ring {
			animation-duration: 2.4s;
		}
	}
</style>
