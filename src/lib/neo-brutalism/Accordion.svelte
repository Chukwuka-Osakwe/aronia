<script module lang="ts">
	// Stable group name per instance, for native single-open grouping.
	let uid = 0;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../styles/neo-brutalism.css';

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

	const group = `nb-accordion-${uid++}`;
	const visible = $derived(items.filter(Boolean));
</script>

<div class="nb-accordion">
	{#each visible as item (item)}
		<details class="nb-accordion__item" name={exclusive ? group : undefined}>
			<summary class="nb-accordion__summary">
				<span>{item}</span>
				<svg
					class="nb-accordion__chevron"
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
			<div class="nb-accordion__panel">{@render children?.(item)}</div>
		</details>
	{/each}
</div>

<style>
	.nb-accordion {
		width: 28rem;
		max-width: 100%;
		font-family: var(--nb-font);
		color: var(--nb-ink);
		/* lets ::details-content below animate block-size to/from `auto` */
		interpolate-size: allow-keywords;
	}
	.nb-accordion__item {
		border: var(--nb-border);
	}
	/* Collapse the shared border between stacked items into one line. */
	.nb-accordion__item + .nb-accordion__item {
		border-top: none;
	}
	.nb-accordion__summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.75rem 1rem;
		cursor: pointer;
		font-weight: var(--nb-font-weight);
		user-select: none;
		list-style: none; /* drop the default disclosure triangle */
	}
	.nb-accordion__summary::-webkit-details-marker {
		display: none;
	}
	.nb-accordion__summary:hover {
		background: var(--nb-muted);
	}
	.nb-accordion__summary:focus-visible {
		outline: none;
		box-shadow: inset 0 0 0 3px var(--nb-accent);
	}
	.nb-accordion__chevron {
		flex: none;
		width: 1.1em;
		height: 1.1em;
		transition: transform 260ms ease;
	}
	.nb-accordion__item[open] .nb-accordion__chevron {
		transform: rotate(180deg);
	}

	/* Animate the native open/close. ::details-content is the collapsible box;
	   interpolate-size (above) lets its block-size ease to/from auto, and
	   allow-discrete keeps the content rendered through the collapse. Progressive
	   enhancement — browsers without ::details-content simply snap as before. */
	.nb-accordion__item::details-content {
		block-size: 0;
		overflow: clip;
		transition-property: block-size, content-visibility;
		transition-duration: 260ms;
		transition-timing-function: ease;
		transition-behavior: allow-discrete;
	}
	.nb-accordion__item[open]::details-content {
		block-size: auto;
	}

	.nb-accordion__panel {
		padding: 1rem;
		border-top: var(--nb-border);
		font-weight: var(--nb-font-weight-regular);
		line-height: 1.5;
	}
	@media (prefers-reduced-motion: reduce) {
		.nb-accordion__chevron,
		.nb-accordion__item::details-content {
			transition: none;
		}
	}
</style>
