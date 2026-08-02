<script module lang="ts">
	let uid = 0;
</script>

<script lang="ts">
	import type { InputSize, DropdownShape } from './options.js';
	import '../styles/glassmorphism.css';
	import './css/dropdown-menu.css';

	// Anchored menu built on two modern platform primitives instead of a JS lib:
	//   • the native `popover` attribute → top-layer render, light-dismiss, Esc;
	//   • CSS Anchor Positioning → tracks the trigger, flips up when cramped.
	// We add role=menu/menuitem semantics + arrow-key roving on top.
	type Props = {
		size?: InputSize;
		shape?: DropdownShape;
		label?: string;
		items?: string[];
	};
	let { size = 'md', shape = 'square', label = 'Menu', items = [] }: Props = $props();

	const menuId = `glass-menu-${uid++}`;
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
		if (open) menuItems()[0]?.focus({ preventScroll: true });
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

<div class="glass-dropdown" data-size={size} data-shape={shape}>
	<button
		type="button"
		class="glass-dropdown__trigger"
		popovertarget={menuId}
		aria-haspopup="menu"
		aria-expanded={open}
		style="anchor-name: {anchorName}"
	>
		{label}
		<svg
			class="glass-dropdown__chevron"
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
		class="glass-dropdown__menu"
		role="menu"
		tabindex="-1"
		style="position-anchor: {anchorName}"
		ontoggle={onToggle}
		onkeydown={onKeydown}
	>
		{#each visible as item (item)}
			<button
				type="button"
				role="menuitem"
				class="glass-dropdown__item"
				onclick={() => menuEl?.hidePopover()}
			>
				{item}
			</button>
		{/each}
	</div>
</div>
