<script module lang="ts">
	let uid = 0;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../styles/swiss.css';
	import './css/tabs.css';

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

	const base = `swiss-tabs-${uid++}`;
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

<div class="swiss-tabs">
	<div class="swiss-tabs__list" role="tablist" bind:this={list}>
		{#each visibleTabs as tab, i (tab)}
			<button
				type="button"
				role="tab"
				id={`${base}-tab-${i}`}
				class="swiss-tabs__tab"
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
		class="swiss-tabs__panel"
		role="tabpanel"
		id={`${base}-panel`}
		aria-labelledby={`${base}-tab-${visibleTabs.indexOf(value)}`}
	>
		{@render children?.(value)}
	</div>
</div>
