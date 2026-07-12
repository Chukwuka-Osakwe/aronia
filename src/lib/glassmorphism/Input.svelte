<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import '../styles/glassmorphism.css';
	import './css/input.css';

	// `size` is renamed off the native input attribute (a number) so we can use it
	// for our own scale. `value` is bindable for two-way form state.
	type Props = {
		value?: string;
		size?: InputSize;
	} & Omit<HTMLInputAttributes, 'size'>;

	let { value = $bindable(''), size = 'md', ...rest }: Props = $props();
</script>

<input class="glass-input" data-size={size} bind:value {...rest} />
