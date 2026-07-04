<script module lang="ts">
	let uid = 0;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../styles/glassmorphism.css';

	// A single-select tab set with the WAI-ARIA roving-tabindex pattern: only the
	// active tab is in the tab order, and Arrow/Home/End move both focus and
	// selection. `tabs` is a plain label list; the panel content is a snippet that
	// receives the active label so the consumer renders per-tab content.
	type Props = {
		tabs?: string[];
		value?: string;
		children?: Snippet<[string]>;
	};

	let { tabs = [], value = $bindable(''), children }: Props = $props();

	const base = `glass-tabs-${uid++}`;
	const visibleTabs = $derived(tabs.filter(Boolean));

	// Keep a valid active tab (default to the first).
	$effect(() => {
		if (visibleTabs.length && !visibleTabs.includes(value)) value = visibleTabs[0];
	});

	let list = $state<HTMLDivElement>();

	function onKeydown(e: KeyboardEvent, i: number) {
		const n = visibleTabs.length;
		let next = i;
		if (e.key === 'ArrowRight') next = (i + 1) % n;
		else if (e.key === 'ArrowLeft') next = (i - 1 + n) % n;
		else if (e.key === 'Home') next = 0;
		else if (e.key === 'End') next = n - 1;
		else return;
		e.preventDefault();
		value = visibleTabs[next];
		list?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
	}
</script>

<div class="glass-tabs">
	<div class="glass-tabs__list" role="tablist" bind:this={list}>
		{#each visibleTabs as tab, i (tab)}
			<button
				type="button"
				role="tab"
				id={`${base}-tab-${i}`}
				class="glass-tabs__tab"
				data-active={value === tab}
				aria-selected={value === tab}
				aria-controls={`${base}-panel`}
				tabindex={value === tab ? 0 : -1}
				onclick={() => (value = tab)}
				onkeydown={(e) => onKeydown(e, i)}
			>
				{tab}
			</button>
		{/each}
	</div>
	<div
		class="glass-tabs__panel"
		role="tabpanel"
		id={`${base}-panel`}
		aria-labelledby={`${base}-tab-${visibleTabs.indexOf(value)}`}
	>
		{@render children?.(value)}
	</div>
</div>

<style>
	/* Shrink-wrap to the tab row; the panel fills that width (below) so its right
	   edge lines up with the last tab. */
	.glass-tabs {
		width: fit-content;
		max-width: 100%;
	}
	.glass-tabs__list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}
	.glass-tabs__tab {
		font-family: var(--glass-font);
		font-weight: var(--glass-font-weight);
		font-size: var(--glass-size-md-text);
		padding: 0.5rem 1rem;
		background: var(--glass-surface);
		-webkit-backdrop-filter: blur(var(--glass-blur));
		backdrop-filter: blur(var(--glass-blur));
		color: var(--glass-ink);
		border: var(--glass-border);
		border-radius: var(--glass-radius-sm);
		box-shadow: var(--glass-shadow-sm), var(--glass-highlight);
		cursor: pointer;
		transition:
			background-color 160ms ease,
			box-shadow 160ms ease;
	}
	.glass-tabs__tab:hover {
		background: var(--glass-surface-strong);
	}
	/* Active tab fills indigo with white text (AA-tuned, 5.1:1). */
	.glass-tabs__tab[data-active='true'] {
		background: var(--glass-primary);
		color: var(--glass-primary-ink);
		border-color: transparent;
	}
	.glass-tabs__tab:focus-visible {
		outline: none;
		box-shadow:
			var(--glass-shadow-sm),
			0 0 0 4px color-mix(in srgb, var(--glass-accent) 28%, transparent);
	}

	.glass-tabs__panel {
		/* width:0 + min-width:100% => the panel never widens the set (so the tab row
		   defines the width) but always fills it, keeping its right edge flush with
		   the last tab. */
		width: 0;
		min-width: 100%;
		background: var(--glass-surface);
		-webkit-backdrop-filter: blur(var(--glass-blur));
		backdrop-filter: blur(var(--glass-blur));
		border: var(--glass-border);
		border-radius: var(--glass-radius);
		box-shadow: var(--glass-shadow), var(--glass-highlight);
		padding: 1.5rem;
		font-family: var(--glass-font);
		font-weight: var(--glass-font-weight-regular);
		line-height: 1.5;
		color: var(--glass-ink);
		min-height: 4rem;
	}
</style>
