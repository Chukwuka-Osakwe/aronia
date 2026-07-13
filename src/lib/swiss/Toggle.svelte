<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { InputSize, ToggleShape } from './options.js';
	import '../styles/swiss.css';
	import './css/toggle.css';

	// A11y: a real <button role="switch"> with aria-checked — keyboard-operable
	// and announced correctly, rather than a bare styled <div>. The track fills
	// hazard-orange when on (the one accent moment in the forms family).
	type Props = {
		checked?: boolean;
		disabled?: boolean;
		size?: InputSize;
		shape?: ToggleShape;
		/** Optional visible label rendered after the switch. */
		label?: string;
	} & Omit<HTMLButtonAttributes, 'type'>;

	let {
		checked = $bindable(false),
		disabled = false,
		size = 'md',
		shape = 'square',
		label,
		...rest
	}: Props = $props();
</script>

<button
	{...rest}
	type="button"
	role="switch"
	class="swiss-toggle"
	data-size={size}
	data-shape={shape}
	aria-checked={checked}
	data-checked={checked}
	{disabled}
	onclick={() => (checked = !checked)}
>
	<span class="swiss-toggle__track">
		<span class="swiss-toggle__thumb"></span>
	</span>
	{#if label}<span class="swiss-toggle__label">{label}</span>{/if}
</button>
