<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import { getFieldContext } from './field-context.js';
	import '../styles/neo-brutalism.css';
	import './css/textarea.css';

	// The multiline sibling of Input: same NB field language (border, hard shadow,
	// accent focus ring, shared size scale), a bindable value, and a `rows` height.
	// `size` is our own scale (not a native textarea attribute), so nothing to rename.
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
	class="nb-textarea"
	data-size={size ?? field?.size ?? 'md'}
	aria-invalid={field?.invalid || undefined}
	aria-describedby={field?.describedById}
	{rows}
	bind:value
	{...rest}
></textarea>
