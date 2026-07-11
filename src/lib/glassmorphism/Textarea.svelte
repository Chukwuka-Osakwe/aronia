<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import '../styles/glassmorphism.css';
	import './css/textarea.css';

	// Multiline sibling of Input: same frosted field language, a bindable value, and
	// a `rows` height. `size` is our own scale (not a native attribute).
	type Props = {
		value?: string;
		size?: InputSize;
		rows?: number;
	} & Omit<HTMLTextareaAttributes, 'size'>;

	let { value = $bindable(''), size = 'md', rows = 4, ...rest }: Props = $props();
</script>

<textarea class="glass-textarea" data-size={size} {rows} bind:value {...rest}></textarea>
