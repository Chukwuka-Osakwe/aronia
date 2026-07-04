<script lang="ts">
	import type { InputSize } from './options.js';
	import '../styles/neo-brutalism.css';

	// Determinate progress: a hard-edged fill in a bordered track. `value` is 0–100.
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

<div class="nb-progress" data-size={size} data-show={showValue}>
	<div
		class="nb-progress__track"
		role="progressbar"
		aria-label={label}
		aria-valuenow={Math.round(pct)}
		aria-valuemin={0}
		aria-valuemax={100}
	>
		<div class="nb-progress__fill" style="width: {pct}%"></div>
	</div>
	<!-- Decorative: the progressbar role already conveys the number to AT. -->
	<span class="nb-progress__value" aria-hidden="true">{Math.round(pct)}%</span>
</div>

<style>
	.nb-progress {
		display: inline-flex;
		align-items: center;
		max-width: 100%;
		font-family: var(--nb-font);
		color: var(--nb-ink);
	}
	.nb-progress__track {
		/* Fixed width so showValue never shrinks the bar; definite (not 100%) so it
		   renders in the shrink-to-fit stage. */
		flex: none;
		width: 22rem;
		max-width: 100%;
		border: var(--nb-border);
		background: var(--nb-paper);
		box-shadow: var(--nb-shadow);
		overflow: hidden;
	}
	.nb-progress__fill {
		height: 100%;
		background: var(--nb-accent);
		transition: width 200ms ease;
	}
	.nb-progress[data-size='sm'] .nb-progress__track {
		height: 0.75rem;
	}
	.nb-progress[data-size='md'] .nb-progress__track {
		height: 1.1rem;
	}
	.nb-progress[data-size='lg'] .nb-progress__track {
		height: 1.5rem;
	}

	/* The value's slot animates its WIDTH (definite lengths → reliably animatable),
	   so the whole inline-flex grows/shrinks and the centred bar eases into its new
	   position instead of jumping. easeInOutBack gives the anticipation + overshoot;
	   the number clip-reveals as the slot opens and fades over the same beat. Its
	   width is fixed (fits "100%") so the readout doesn't jiggle as digits change. */
	.nb-progress__value {
		flex: none;
		width: 0;
		padding-left: 0;
		overflow: hidden;
		white-space: nowrap;
		opacity: 0;
		font-weight: var(--nb-font-weight);
		/* tabular figures so digits keep a constant width (9%→10%→100%) — no jiggle. */
		font-variant-numeric: tabular-nums;
		transition:
			width 280ms cubic-bezier(0.68, -0.55, 0.265, 1.55),
			padding-left 280ms cubic-bezier(0.68, -0.55, 0.265, 1.55),
			opacity 220ms ease;
	}
	.nb-progress[data-show='true'] .nb-progress__value {
		width: 3.6em;
		padding-left: 0.6em;
		opacity: 1;
	}
	.nb-progress[data-size='sm'] .nb-progress__value {
		font-size: var(--nb-size-sm-text);
	}
	.nb-progress[data-size='md'] .nb-progress__value {
		font-size: var(--nb-size-md-text);
	}
	.nb-progress[data-size='lg'] .nb-progress__value {
		font-size: var(--nb-size-lg-text);
	}

	@media (prefers-reduced-motion: reduce) {
		.nb-progress__value,
		.nb-progress__fill {
			transition: none;
		}
	}
</style>
