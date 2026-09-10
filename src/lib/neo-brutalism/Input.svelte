<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { InputSize, InputShape } from './options.js';
	import { getFieldContext } from './field-context.js';
	import '../styles/neo-brutalism.css';
	import './css/input.css';

	// `size` is renamed off the native input attribute (which is a number) so we
	// can use it for our own scale. `value` is bindable for two-way form state.
	type Props = {
		value?: string;
		size?: InputSize;
		shape?: InputShape;
	} & Omit<HTMLInputAttributes, 'size'>;

	let { value = $bindable(''), size, shape = 'square', ...rest }: Props = $props();

	// Inside a Field: inherit its size (unless one is set here) and wire the error
	// a11y it can't reach us to set — aria-invalid drives the danger border (CSS),
	// aria-describedby links the message. Standalone → own default, no aria.
	const field = getFieldContext();
</script>

<input
	class="nb-input"
	data-size={size ?? field?.size ?? 'md'}
	data-shape={shape}
	aria-invalid={field?.invalid || undefined}
	aria-describedby={field?.describedById}
	bind:value
	{...rest}
/>
