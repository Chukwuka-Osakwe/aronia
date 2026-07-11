<script lang="ts">
	import type { InputSize } from './options.js';
	import '../styles/neo-brutalism.css';
	import './css/progress.css';

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
