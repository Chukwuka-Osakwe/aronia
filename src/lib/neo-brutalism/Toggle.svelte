<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { InputSize } from './options.js';
	import '../styles/neo-brutalism.css';

	// A11y: a real <button role="switch"> with aria-checked — keyboard-operable
	// and announced correctly, rather than a bare styled <div>.
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
	class="nb-toggle"
	data-size={size}
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

<style>
	.nb-toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.625rem;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		font-family: var(--nb-font);
		font-weight: var(--nb-font-weight);
		color: var(--nb-ink);
	}
	/* Size scale — track width/height + thumb are the only per-size values; the
	   thumb auto-centres (top/left calc) and its travel derives from track-w − track-h,
	   so a size is just three numbers plus the shared text scale. Smallest track is
	   24px tall to keep the switch's hit target within reach of WCAG 2.5.8. */
	.nb-toggle[data-size='sm'] {
		--_track-w: 44px;
		--_track-h: 24px;
		--_thumb: 16px;
		font-size: var(--nb-size-sm-text);
	}
	.nb-toggle[data-size='md'] {
		--_track-w: 52px;
		--_track-h: 28px;
		--_thumb: 20px;
		font-size: var(--nb-size-md-text);
	}
	.nb-toggle[data-size='lg'] {
		--_track-w: 64px;
		--_track-h: 34px;
		--_thumb: 26px;
		font-size: var(--nb-size-lg-text);
	}
	/* Disabled — dim as the inert cue, but keep the track's on/off colour: unlike
	   Button's decorative variants, the Toggle's colour IS its state, so collapsing
	   it to grey would hide whether it's on or off. */
	.nb-toggle:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	.nb-toggle:focus-visible,
	.nb-toggle[data-state='focus'] {
		outline: none;
	}

	.nb-toggle__track {
		position: relative;
		display: inline-block;
		width: var(--_track-w);
		height: var(--_track-h);
		background: var(--nb-muted);
		border: var(--nb-border);
		border-radius: var(--nb-radius);
		box-shadow: var(--nb-shadow);
		transition: background 120ms ease;
	}
	.nb-toggle[data-checked='true'] .nb-toggle__track {
		background: var(--nb-primary);
	}
	.nb-toggle:focus-visible .nb-toggle__track,
	.nb-toggle[data-state='focus'] .nb-toggle__track {
		box-shadow: var(--nb-shadow), 0 0 0 3px var(--nb-accent);
	}

	.nb-toggle__thumb {
		position: absolute;
		/* Even inset on all sides. The track is border-box (global reset), so --_track-h
		   INCLUDES its border; the thumb is positioned inside the border, so subtract
		   both border widths before centring — otherwise the thumb sits low by one
		   border width (3px here, very visible). The same corrected inset on left keeps
		   the travel (track-w − track-h) symmetric at both ends. */
		top: calc((var(--_track-h) - 2 * var(--nb-border-width) - var(--_thumb)) / 2);
		left: calc((var(--_track-h) - 2 * var(--nb-border-width) - var(--_thumb)) / 2);
		width: var(--_thumb);
		height: var(--_thumb);
		background: var(--nb-paper);
		border: 2px solid var(--nb-ink);
		border-radius: var(--nb-radius);
		transition: transform 120ms ease;
	}
	.nb-toggle[data-checked='true'] .nb-toggle__thumb {
		transform: translateX(calc(var(--_track-w) - var(--_track-h)));
	}
</style>
