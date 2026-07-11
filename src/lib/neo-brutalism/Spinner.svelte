<script lang="ts">
	import type { InputSize, SpinnerSpeed } from './options.js';
	import '../styles/neo-brutalism.css';
	import './css/spinner.css';

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
