<script lang="ts">
	import type { InputSize, SpinnerSpeed } from './options.js';
	import '../styles/glassmorphism.css';
	import './css/spinner.css';

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
