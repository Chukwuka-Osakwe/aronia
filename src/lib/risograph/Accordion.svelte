<script module lang="ts">
	// Stable group name per instance, for native single-open grouping.
	let uid = 0;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../styles/riso.css';
	import './css/accordion.css';

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

	const group = `riso-accordion-${uid++}`;
	const visible = $derived(items.filter(Boolean));
</script>

<div class="riso-accordion">
	{#each visible as item (item)}
		<details class="riso-accordion__item" name={exclusive ? group : undefined}>
			<summary class="riso-accordion__summary">
				<span>{item}</span>
				<svg
					class="riso-accordion__chevron"
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
			<div class="riso-accordion__panel">{@render children?.(item)}</div>
		</details>
	{/each}
</div>
