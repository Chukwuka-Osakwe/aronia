<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import { getFieldContext } from './field-context.js';
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

	let { value = $bindable(''), size, rows = 4, ...rest }: Props = $props();

	// Inside a Field: inherit its size (unless one is set here) and wire the error
	// a11y — same context contract as Input. Standalone → own default, no aria.
	const field = getFieldContext();
</script>

<textarea
	class="riso-textarea"
	data-size={size ?? field?.size ?? 'md'}
	aria-invalid={field?.invalid || undefined}
	aria-describedby={field?.describedById}
	{rows}
	bind:value
	{...rest}
></textarea>
