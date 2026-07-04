<script module lang="ts">
	// Stable group name per instance, for native single-open grouping.
	let uid = 0;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../styles/glassmorphism.css';

	// Stacked disclosure built on native <details>/<summary>: open/close, keyboard,
	// and a11y come for free. `exclusive` uses the native `name` attribute so only
	// one section is open at a time — no JS state needed. The panel body is a
	// snippet that receives the section label (same pattern as Tabs).
	type Props = {
		items?: string[];
		/** Only one section open at a time (native `name` grouping). */
		exclusive?: boolean;
		children?: Snippet<[string]>;
	};
	let { items = [], exclusive = true, children }: Props = $props();

	const group = `glass-accordion-${uid++}`;
	const visible = $derived(items.filter(Boolean));
</script>

<div class="glass-accordion">
	{#each visible as item (item)}
		<details class="glass-accordion__item" name={exclusive ? group : undefined}>
			<summary class="glass-accordion__summary">
				<span>{item}</span>
				<svg
					class="glass-accordion__chevron"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<polyline points="6 9 12 15 18 9" />
				</svg>
			</summary>
			<div class="glass-accordion__panel">{@render children?.(item)}</div>
		</details>
	{/each}
</div>

<style>
	/* One frosted panel; the items are transparent and divided by faint rules. */
	.glass-accordion {
		width: 28rem;
		max-width: 100%;
		font-family: var(--glass-font);
		color: var(--glass-ink);
		background: var(--glass-surface);
		-webkit-backdrop-filter: blur(var(--glass-blur));
		backdrop-filter: blur(var(--glass-blur));
		border: var(--glass-border);
		border-radius: var(--glass-radius);
		box-shadow: var(--glass-shadow), var(--glass-highlight);
		overflow: hidden;
		/* lets ::details-content below animate block-size to/from `auto` */
		interpolate-size: allow-keywords;
	}
	.glass-accordion__item + .glass-accordion__item {
		border-top: var(--glass-divider);
	}
	.glass-accordion__summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.875rem 1.1rem;
		cursor: pointer;
		font-weight: var(--glass-font-weight);
		user-select: none;
		list-style: none; /* drop the default disclosure triangle */
		transition: background-color 140ms ease;
	}
	.glass-accordion__summary::-webkit-details-marker {
		display: none;
	}
	.glass-accordion__summary:hover {
		background: var(--glass-surface-strong);
	}
	.glass-accordion__summary:focus-visible {
		outline: none;
		box-shadow: inset 0 0 0 3px color-mix(in srgb, var(--glass-accent) 55%, transparent);
	}
	.glass-accordion__chevron {
		flex: none;
		width: 1.1em;
		height: 1.1em;
		transition: transform 260ms ease;
	}
	.glass-accordion__item[open] .glass-accordion__chevron {
		transform: rotate(180deg);
	}

	/* Animate the native open/close. ::details-content is the collapsible box;
	   interpolate-size (above) lets its block-size ease to/from auto, and
	   allow-discrete keeps the content rendered through the collapse. Progressive
	   enhancement — browsers without ::details-content simply snap as before. */
	.glass-accordion__item::details-content {
		block-size: 0;
		overflow: clip;
		transition-property: block-size, content-visibility;
		transition-duration: 260ms;
		transition-timing-function: ease;
		transition-behavior: allow-discrete;
	}
	.glass-accordion__item[open]::details-content {
		block-size: auto;
	}

	.glass-accordion__panel {
		padding: 1rem 1.1rem;
		border-top: var(--glass-divider);
		font-weight: var(--glass-font-weight-regular);
		line-height: 1.5;
	}
	@media (prefers-reduced-motion: reduce) {
		.glass-accordion__chevron,
		.glass-accordion__item::details-content {
			transition: none;
		}
	}
</style>
