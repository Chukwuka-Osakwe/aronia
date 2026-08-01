<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import '../styles/riso.css';
	import './css/textarea.css';

	// The multiline sibling of Input: same Riso field language (paper ground, ink
	// hairline, 0px corners, accent focus ring with a blue border nudge, shared
	// size scale), a bindable value, and a `rows` height. `size` is our own scale
	// (not a native attribute).
	type Props = {
		value?: string;
		size?: InputSize;
		rows?: number;
	} & Omit<HTMLTextareaAttributes, 'size'>;

	let { value = $bindable(''), size = 'md', rows = 4, ...rest }: Props = $props();
</script>

<textarea class="riso-textarea" data-size={size} {rows} bind:value {...rest}></textarea>
