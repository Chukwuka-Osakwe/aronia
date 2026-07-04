<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import '../styles/glassmorphism.css';

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

<style>
	.glass-checkbox {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.625rem;
		cursor: pointer;
		font-family: var(--glass-font);
		font-weight: var(--glass-font-weight);
		color: var(--glass-ink);
	}
	/* Size scale — box + tick dimensions per step, on the shared text scale. */
	.glass-checkbox[data-size='sm'] {
		--_box: 20px;
		--_tick: 13px;
		font-size: var(--glass-size-sm-text);
	}
	.glass-checkbox[data-size='md'] {
		--_box: 24px;
		--_tick: 16px;
		font-size: var(--glass-size-md-text);
	}
	.glass-checkbox[data-size='lg'] {
		--_box: 28px;
		--_tick: 19px;
		font-size: var(--glass-size-lg-text);
	}
	.glass-checkbox[data-disabled='true'] {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Native input kept present & focusable (NOT display:none) but visually hidden. */
	.glass-checkbox__input {
		position: absolute;
		top: 0;
		left: 0;
		width: 1px;
		height: 1px;
		margin: 0;
		opacity: 0;
	}

	.glass-checkbox__box {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: var(--_box);
		height: var(--_box);
		background: var(--glass-surface-strong);
		-webkit-backdrop-filter: blur(var(--glass-blur));
		backdrop-filter: blur(var(--glass-blur));
		border: var(--glass-border);
		border-radius: 7px;
		box-shadow: var(--glass-shadow-sm), var(--glass-highlight);
		transition: background-color 160ms ease;
	}
	.glass-checkbox[data-checked='true'] .glass-checkbox__box {
		background: var(--glass-primary);
		border-color: transparent;
	}

	.glass-checkbox__input:focus-visible + .glass-checkbox__box,
	.glass-checkbox[data-state='focus'] .glass-checkbox__box {
		box-shadow:
			var(--glass-shadow-sm),
			0 0 0 4px color-mix(in srgb, var(--glass-accent) 28%, transparent);
	}

	/* Tick: white on the indigo fill (≈5:1, well over the 3:1 non-text bar). */
	.glass-checkbox__check {
		width: var(--_tick);
		height: var(--_tick);
		color: #fff;
		opacity: 0;
	}
	.glass-checkbox[data-checked='true'] .glass-checkbox__check {
		opacity: 1;
	}
</style>
