<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { InputSize, InputShape } from './options.js';
	import '../styles/swiss.css';
	// Layer 2 (the style) is a global stylesheet shared with the aronia registry —
	// plain-CSS imports are unscoped in Svelte, so the same file drives both.
	import './css/input.css';

	// `size` is renamed off the native input attribute (which is a number) so we
	// can use it for our own scale. `value` is bindable for two-way form state.
	type Props = {
		value?: string;
		size?: InputSize;
		shape?: InputShape;
	} & Omit<HTMLInputAttributes, 'size'>;

	let { value = $bindable(''), size = 'md', shape = 'square', ...rest }: Props = $props();
</script>

<input class="swiss-input" data-size={size} data-shape={shape} bind:value {...rest} />
