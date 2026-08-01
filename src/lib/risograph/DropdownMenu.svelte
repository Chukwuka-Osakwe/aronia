<script module lang="ts">
	let uid = 0;
</script>

<script lang="ts">
	import type { InputSize } from './options.js';
	import '../styles/riso.css';
	import './css/dropdown-menu.css';

	// Anchored menu built on two modern platform primitives instead of a JS
	// positioning lib:
	//   • the native `popover` attribute → top-layer render (no clipping / z-index),
	//     light-dismiss (click-outside), and Esc, all for free;
	//   • CSS Anchor Positioning → the menu tracks the trigger and flips up when
	//     there's no room below (`position-try-fallbacks: flip-block`).
	// We add the menu semantics (role=menu/menuitem) + arrow-key roving on top.
	type Props = {
		size?: InputSize;
		label?: string;
		items?: string[];
	};
	let { size = 'md', label = 'Menu', items = [] }: Props = $props();

	const menuId = `riso-menu-${uid++}`;
	const anchorName = `--${menuId}`;
	const visible = $derived(items.filter(Boolean));

	let menuEl = $state<HTMLDivElement>();
	let open = $state(false);

	function menuItems(): HTMLButtonElement[] {
		return [...(menuEl?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])];
	}

	function onToggle(e: ToggleEvent) {
		open = e.newState === 'open';
		// preventScroll: the menu is a top-layer popover; without it, .focus()
		// scrolls the nearest scrollable ancestor (the document, when the menu
		// overflows the viewport) to reveal the item — which shoves a fixed-height
		// page layout and reads as a jitter. We never need to scroll to a top-layer
		// element, so suppress it.
		if (open) menuItems()[0]?.focus({ preventScroll: true }); // move focus into the menu on open
	}

	function onKeydown(e: KeyboardEvent) {
		const buttons = menuItems();
		if (!buttons.length) return;
		const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			buttons[(i + 1) % buttons.length]?.focus();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			buttons[(i - 1 + buttons.length) % buttons.length]?.focus();
		} else if (e.key === 'Home') {
			e.preventDefault();
			buttons[0]?.focus();
		} else if (e.key === 'End') {
			e.preventDefault();
			buttons[buttons.length - 1]?.focus();
		}
	}
</script>

<div class="riso-dropdown" data-size={size}>
	<button
		type="button"
		class="riso-dropdown__trigger"
		popovertarget={menuId}
		aria-haspopup="menu"
		aria-expanded={open}
		style="anchor-name: {anchorName}"
	>
		{label}
		<svg
			class="riso-dropdown__chevron"
			data-open={open}
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
	</button>

	<div
		bind:this={menuEl}
		id={menuId}
		popover
		class="riso-dropdown__menu"
		role="menu"
		tabindex="-1"
		style="position-anchor: {anchorName}"
		ontoggle={onToggle}
		onkeydown={onKeydown}
	>
		{#each visible as item (item)}
			<button type="button" role="menuitem" class="riso-dropdown__item" onclick={() => menuEl?.hidePopover()}>
				{item}
			</button>
		{/each}
	</div>
</div>
