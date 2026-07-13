<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import '../styles/swiss.css';
	import './css/textarea.css';

	// The multiline sibling of Input: same Swiss field language (hairline border,
	// 2px corners, accent focus ring, shared size scale), a bindable value, and a
	// `rows` height. `size` is our own scale (not a native attribute).
	type Props = {
		value?: string;
		size?: InputSize;
		rows?: number;
	} & Omit<HTMLTextareaAttributes, 'size'>;

	let { value = $bindable(''), size = 'md', rows = 4, ...rest }: Props = $props();
</script>

<textarea class="swiss-textarea" data-size={size} {rows} bind:value {...rest}></textarea>
