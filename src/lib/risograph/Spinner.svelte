<script lang="ts">
	import type { InputSize, SpinnerSpeed } from './options.js';
	import '../styles/riso.css';
	import './css/spinner.css';

	// Indeterminate loading: a circular ring with one spot-blue arc, rotating —
	// the workhorse process-blue ink, keeping the fluoro accent reserved.
	type Props = {
		size?: InputSize;
		/** Rotation speed. */
		speed?: SpinnerSpeed;
		/** Announced to assistive tech while loading. */
		label?: string;
	};
	let { size = 'md', speed = 'normal', label = 'Loading' }: Props = $props();
</script>

<span class="riso-spinner" data-size={size} data-speed={speed} role="status" aria-label={label}>
	<span class="riso-spinner__box" aria-hidden="true"></span>
</span>
