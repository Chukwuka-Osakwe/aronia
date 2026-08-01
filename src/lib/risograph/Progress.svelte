<script lang="ts">
	import type { InputSize } from './options.js';
	import '../styles/riso.css';
	import './css/progress.css';

	// Determinate progress: a fluoro-pink fill in a flat bordered paper track.
	// `value` is 0–100; the readout is set in the mono print-label voice.
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

<div class="riso-progress" data-size={size} data-show={showValue}>
	<div
		class="riso-progress__track"
		role="progressbar"
		aria-label={label}
		aria-valuenow={Math.round(pct)}
		aria-valuemin={0}
		aria-valuemax={100}
	>
		<div class="riso-progress__fill" style="width: {pct}%"></div>
	</div>
	<!-- Decorative: the progressbar role already conveys the number to AT. -->
	<span class="riso-progress__value" aria-hidden="true">{Math.round(pct)}%</span>
</div>
