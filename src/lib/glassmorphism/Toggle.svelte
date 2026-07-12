<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import '../styles/glassmorphism.css';
	import './css/toggle.css';

	// A11y: a real <button role="switch"> with aria-checked — keyboard-operable and
	// announced correctly. The on/off STATE is carried by the track colour (frosted
	// vs indigo, a clear ≥3:1 shift) plus thumb position, not by a subtle edge.
	type Props = {
		checked?: boolean;
		disabled?: boolean;
		size?: InputSize;
		/** Optional visible label rendered after the switch. */
		label?: string;
	} & Omit<HTMLButtonAttributes, 'type'>;

	let {
		checked = $bindable(false),
		disabled = false,
		size = 'md',
		label,
		...rest
	}: Props = $props();
</script>

<button
	{...rest}
	type="button"
	role="switch"
	class="glass-toggle"
	data-size={size}
	aria-checked={checked}
	data-checked={checked}
	{disabled}
	onclick={() => (checked = !checked)}
>
	<span class="glass-toggle__track">
		<span class="glass-toggle__thumb"></span>
	</span>
	{#if label}<span class="glass-toggle__label">{label}</span>{/if}
</button>
