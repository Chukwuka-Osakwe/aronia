<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import '../styles/glassmorphism.css';
	import './css/checkbox.css';

	// Accessible checkbox: a real but visually-hidden native <input type="checkbox">
	// drives state, keyboard, and form submission; a styled box beside it renders the
	// glass look — a frosted box that fills indigo with a white tick when checked.
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
	class="glass-checkbox"
	data-size={size}
	data-checked={checked}
	data-disabled={disabled}
	data-state={dataState}
>
	<input type="checkbox" class="glass-checkbox__input" bind:checked {disabled} {...rest} />
	<span class="glass-checkbox__box">
		<svg
			class="glass-checkbox__check"
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
	{#if label}<span class="glass-checkbox__label">{label}</span>{/if}
</label>
