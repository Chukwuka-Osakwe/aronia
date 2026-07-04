<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import '../styles/neo-brutalism.css';

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

<style>
	.nb-checkbox {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.625rem;
		cursor: pointer;
		font-family: var(--nb-font);
		font-weight: var(--nb-font-weight);
		color: var(--nb-ink);
	}
	/* Size scale — box + tick dimensions per step, on the shared text scale. */
	.nb-checkbox[data-size='sm'] {
		--_box: 20px;
		--_tick: 13px;
		font-size: var(--nb-size-sm-text);
	}
	.nb-checkbox[data-size='md'] {
		--_box: 24px;
		--_tick: 16px;
		font-size: var(--nb-size-md-text);
	}
	.nb-checkbox[data-size='lg'] {
		--_box: 28px;
		--_tick: 19px;
		font-size: var(--nb-size-lg-text);
	}
	/* Disabled — dim the whole control (matches Toggle's inert cue). */
	.nb-checkbox[data-disabled='true'] {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Native input kept present & focusable (NOT display:none) but visually hidden;
	   the styled box mirrors its state. */
	.nb-checkbox__input {
		position: absolute;
		top: 0;
		left: 0;
		width: 1px;
		height: 1px;
		margin: 0;
		opacity: 0;
	}

	.nb-checkbox__box {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: var(--_box);
		height: var(--_box);
		background: var(--nb-paper);
		border: var(--nb-border);
		border-radius: var(--nb-radius);
		box-shadow: var(--nb-shadow);
		transition: background 120ms ease;
	}
	.nb-checkbox[data-checked='true'] .nb-checkbox__box {
		background: var(--nb-primary);
	}

	/* Focus ring on the box — real keyboard focus, or docs-forced via data-state. */
	.nb-checkbox__input:focus-visible + .nb-checkbox__box,
	.nb-checkbox[data-state='focus'] .nb-checkbox__box {
		box-shadow: var(--nb-shadow), 0 0 0 3px var(--nb-accent);
	}

	/* The tick: hidden until checked, hard black on the yellow fill. */
	.nb-checkbox__check {
		width: var(--_tick);
		height: var(--_tick);
		color: var(--nb-ink);
		opacity: 0;
	}
	.nb-checkbox[data-checked='true'] .nb-checkbox__check {
		opacity: 1;
	}
</style>
