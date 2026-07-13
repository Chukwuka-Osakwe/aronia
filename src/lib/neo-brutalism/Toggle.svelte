<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { InputSize, ToggleShape } from './options.js';
	import '../styles/neo-brutalism.css';
	import './css/toggle.css';

	// A11y: a real <button role="switch"> with aria-checked — keyboard-operable
	// and announced correctly, rather than a bare styled <div>.
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
	class="nb-toggle"
	data-size={size}
	data-shape={shape}
	aria-checked={checked}
	data-checked={checked}
	{disabled}
	onclick={() => (checked = !checked)}
>
	<span class="nb-toggle__track">
		<span class="nb-toggle__thumb"></span>
	</span>
	{#if label}<span class="nb-toggle__label">{label}</span>{/if}
</button>
