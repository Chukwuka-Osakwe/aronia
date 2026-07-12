<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import '../styles/neo-brutalism.css';
	import './css/checkbox.css';

	// Accessible checkbox: a real but visually-hidden native <input type="checkbox">
	// drives state, keyboard, and actual form submission; a styled box beside it
	// renders the NB look — filled yellow with a hard black tick when checked.
	// `data-state` is pulled off rest so the docs can force the focus ring on the
	// styled box (the native input is where focus really lands).
	type Props = {
		checked?: boolean;
		disabled?: boolean;
		size?: InputSize;
		/** Optional visible label rendered after the box. */
		label?: string;
		// omit native `size` (a number on <input>) — we reuse the name for our scale
	} & Omit<HTMLInputAttributes, 'type' | 'size'>;

	let {
		checked = $bindable(false),
		disabled = false,
		size = 'md',
		label,
		'data-state': dataState,
		...rest
	}: Props = $props();
</script>

<label
	class="nb-checkbox"
	data-size={size}
	data-checked={checked}
	data-disabled={disabled}
	data-state={dataState}
>
	<input type="checkbox" class="nb-checkbox__input" bind:checked {disabled} {...rest} />
	<span class="nb-checkbox__box">
		<svg
			class="nb-checkbox__check"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<polyline points="20 6 9 17 4 12" />
		</svg>
	</span>
	{#if label}<span class="nb-checkbox__label">{label}</span>{/if}
</label>
