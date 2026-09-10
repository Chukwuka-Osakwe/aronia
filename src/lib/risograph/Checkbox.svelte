<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { InputSize, CheckboxShape } from './options.js';
	import '../styles/riso.css';
	import './css/checkbox.css';

	// Accessible checkbox: a real but visually-hidden native <input type="checkbox">
	// drives state, keyboard, and actual form submission; a styled box beside it
	// renders the Riso look — a plum-indigo printed ink field with a paper-tone tick
	// when checked. `data-state` is pulled off rest so the docs can force the focus
	// ring on the styled box (the native input is where focus really lands).
	type Props = {
		checked?: boolean;
		disabled?: boolean;
		size?: InputSize;
		shape?: CheckboxShape;
		/** Optional visible label rendered after the box. */
		label?: string;
		// omit native `size` (a number on <input>) — we reuse the name for our scale
	} & Omit<HTMLInputAttributes, 'type' | 'size'>;

	let {
		checked = $bindable(false),
		disabled = false,
		size = 'md',
		shape = 'square',
		label,
		'data-state': dataState,
		...rest
	}: Props = $props();
</script>

<label
	class="riso-checkbox"
	data-size={size}
	data-shape={shape}
	data-checked={checked}
	data-disabled={disabled}
	data-state={dataState}
>
	<input type="checkbox" class="riso-checkbox__input" bind:checked {disabled} {...rest} />
	<span class="riso-checkbox__box">
		<svg
			class="riso-checkbox__check"
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
	{#if label}<span class="riso-checkbox__label">{label}</span>{/if}
</label>
