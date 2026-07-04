<script lang="ts">
	import type { InputSize } from './options.js';
	import '../styles/glassmorphism.css';

	// Determinate progress: an indigo fill in a pill-shaped frosted track. `value` is 0–100.
	type Props = {
		value?: number;
		size?: InputSize;
		/** Show the rounded percentage after the bar. */
		showValue?: boolean;
		label?: string;
	};
	let { value = 60, size = 'md', showValue = false, label = 'Progress' }: Props = $props();
	const pct = $derived(Math.max(0, Math.min(100, value)));
</script>

<div class="glass-progress" data-size={size} data-show={showValue}>
	<div
		class="glass-progress__track"
		role="progressbar"
		aria-label={label}
		aria-valuenow={Math.round(pct)}
		aria-valuemin={0}
		aria-valuemax={100}
	>
		<div class="glass-progress__fill" style="width: {pct}%"></div>
	</div>
	<!-- Decorative: the progressbar role already conveys the number to AT. -->
	<span class="glass-progress__value" aria-hidden="true">{Math.round(pct)}%</span>
</div>

<style>
	.glass-progress {
		display: inline-flex;
		align-items: center;
		max-width: 100%;
		font-family: var(--glass-font);
		color: var(--glass-ink);
	}
	.glass-progress__track {
		/* Fixed width so showValue never shrinks the bar; definite (not 100%) so it
		   renders in the shrink-to-fit stage. */
		flex: none;
		width: 22rem;
		max-width: 100%;
		border: var(--glass-border);
		background: var(--glass-surface-strong);
		-webkit-backdrop-filter: blur(var(--glass-blur));
		backdrop-filter: blur(var(--glass-blur));
		box-shadow: var(--glass-shadow-sm), var(--glass-highlight);
		border-radius: var(--glass-radius-pill);
		overflow: hidden;
	}
	.glass-progress__fill {
		height: 100%;
		background: var(--glass-primary);
		border-radius: var(--glass-radius-pill);
		transition: width 200ms ease;
	}
	.glass-progress[data-size='sm'] .glass-progress__track {
		height: 0.75rem;
	}
	.glass-progress[data-size='md'] .glass-progress__track {
		height: 1.1rem;
	}
	.glass-progress[data-size='lg'] .glass-progress__track {
		height: 1.5rem;
	}

	/* The value's slot animates its WIDTH (definite lengths → reliably animatable),
	   so the whole inline-flex grows/shrinks and the readout eases in instead of
	   jumping. easeInOutBack for anticipation + overshoot; tabular figures so digits
	   keep a constant width (9%→10%→100%) — no jiggle. */
	.glass-progress__value {
		flex: none;
		width: 0;
		padding-left: 0;
		overflow: hidden;
		white-space: nowrap;
		opacity: 0;
		font-weight: var(--glass-font-weight);
		font-variant-numeric: tabular-nums;
		transition:
			width 280ms cubic-bezier(0.68, -0.55, 0.265, 1.55),
			padding-left 280ms cubic-bezier(0.68, -0.55, 0.265, 1.55),
			opacity 220ms ease;
	}
	.glass-progress[data-show='true'] .glass-progress__value {
		width: 3.6em;
		padding-left: 0.6em;
		opacity: 1;
	}
	.glass-progress[data-size='sm'] .glass-progress__value {
		font-size: var(--glass-size-sm-text);
	}
	.glass-progress[data-size='md'] .glass-progress__value {
		font-size: var(--glass-size-md-text);
	}
	.glass-progress[data-size='lg'] .glass-progress__value {
		font-size: var(--glass-size-lg-text);
	}

	@media (prefers-reduced-motion: reduce) {
		.glass-progress__value,
		.glass-progress__fill {
			transition: none;
		}
	}
</style>
