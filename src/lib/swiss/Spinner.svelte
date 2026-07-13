<script lang="ts">
	import type { InputSize, SpinnerSpeed } from './options.js';
	import '../styles/swiss.css';
	import './css/spinner.css';

	// Indeterminate loading: a circular ring with one ink arc, rotating — the
	// restrained minimalist spinner (monochrome, keeping the accent reserved).
	type Props = {
		size?: InputSize;
		/** Rotation speed. */
		speed?: SpinnerSpeed;
		/** Announced to assistive tech while loading. */
		label?: string;
	};
	let { size = 'md', speed = 'normal', label = 'Loading' }: Props = $props();
</script>

<span class="swiss-spinner" data-size={size} data-speed={speed} role="status" aria-label={label}>
	<span class="swiss-spinner__box" aria-hidden="true"></span>
</span>
