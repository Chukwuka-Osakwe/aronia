<script lang="ts">
	import type { InputSize, SpinnerSpeed } from './options.js';
	import '../styles/neo-brutalism.css';

	// Indeterminate loading: a thick square ring, rotating. Square (radius 0) and
	// hard-edged — a brutalist take on the classic spinner.
	type Props = {
		size?: InputSize;
		/** Rotation speed. */
		speed?: SpinnerSpeed;
		/** Announced to assistive tech while loading. */
		label?: string;
	};
	let { size = 'md', speed = 'normal', label = 'Loading' }: Props = $props();
</script>

<span class="nb-spinner" data-size={size} data-speed={speed} role="status" aria-label={label}>
	<span class="nb-spinner__box" aria-hidden="true"></span>
</span>

<style>
	.nb-spinner {
		display: inline-flex;
	}
	.nb-spinner__box {
		box-sizing: border-box;
		border: var(--nb-border);
		/* Solid single colour — a rotating square reads as spinning on its own, so no
		   accent edge is needed. Duration resolves public override → speed preset →
		   default: a consumer can set --nb-spinner-duration to ANY value at ANY
		   specificity (inline, a class, :root) and it wins, because it takes
		   precedence in the var() chain rather than competing with the preset rules.
		   The `speed` prop just fills the private preset. */
		animation: nb-spin var(--nb-spinner-duration, var(--_nb-spinner-speed, 0.9s)) linear infinite;
	}

	/* speed prop → private preset duration (public --nb-spinner-duration overrides) */
	.nb-spinner[data-speed='slow'] {
		--_nb-spinner-speed: 1.6s;
	}
	.nb-spinner[data-speed='normal'] {
		--_nb-spinner-speed: 0.9s;
	}
	.nb-spinner[data-speed='fast'] {
		--_nb-spinner-speed: 0.5s;
	}

	/* size → box dimensions */
	.nb-spinner[data-size='sm'] .nb-spinner__box {
		width: 1.25rem;
		height: 1.25rem;
	}
	.nb-spinner[data-size='md'] .nb-spinner__box {
		width: 1.75rem;
		height: 1.75rem;
	}
	.nb-spinner[data-size='lg'] .nb-spinner__box {
		width: 2.5rem;
		height: 2.5rem;
	}

	@keyframes nb-spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Reduced-motion wins over the prop AND a consumer's --nb-spinner-duration —
	   set the longhand directly (accessibility takes priority over customisation). */
	@media (prefers-reduced-motion: reduce) {
		.nb-spinner .nb-spinner__box {
			animation-duration: 2.4s;
		}
	}
</style>
