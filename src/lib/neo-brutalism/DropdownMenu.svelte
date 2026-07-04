<script module lang="ts">
	let uid = 0;
</script>

<script lang="ts">
	import type { InputSize } from './options.js';
	import '../styles/neo-brutalism.css';

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

	const menuId = `nb-menu-${uid++}`;
	const anchorName = `--${menuId}`;
	const visible = $derived(items.filter(Boolean));

	let menuEl = $state<HTMLDivElement>();
	let open = $state(false);

	function menuItems(): HTMLButtonElement[] {
		return [...(menuEl?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])];
	}

	function onToggle(e: ToggleEvent) {
		open = e.newState === 'open';
		if (open) menuItems()[0]?.focus(); // move focus into the menu on open
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

<div class="nb-dropdown" data-size={size}>
	<button
		type="button"
		class="nb-dropdown__trigger"
		popovertarget={menuId}
		aria-haspopup="menu"
		aria-expanded={open}
		style="anchor-name: {anchorName}"
	>
		{label}
		<svg
			class="nb-dropdown__chevron"
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
		class="nb-dropdown__menu"
		role="menu"
		tabindex="-1"
		style="position-anchor: {anchorName}"
		ontoggle={onToggle}
		onkeydown={onKeydown}
	>
		{#each visible as item (item)}
			<button type="button" role="menuitem" class="nb-dropdown__item" onclick={() => menuEl?.hidePopover()}>
				{item}
			</button>
		{/each}
	</div>
</div>

<style>
	.nb-dropdown {
		display: inline-flex;
	}
	.nb-dropdown__trigger {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--nb-font);
		font-weight: var(--nb-font-weight);
		background: var(--nb-primary);
		color: var(--nb-ink);
		border: var(--nb-border);
		box-shadow: var(--nb-shadow);
		cursor: pointer;
		transition: var(--nb-transition);
		/* font/padding set per size below */
	}
	.nb-dropdown[data-size='sm'] .nb-dropdown__trigger {
		font-size: var(--nb-size-sm-text);
		padding: var(--nb-size-sm-pad);
	}
	.nb-dropdown[data-size='md'] .nb-dropdown__trigger {
		font-size: var(--nb-size-md-text);
		padding: var(--nb-size-md-pad);
	}
	.nb-dropdown[data-size='lg'] .nb-dropdown__trigger {
		font-size: var(--nb-size-lg-text);
		padding: var(--nb-size-lg-pad);
	}
	.nb-dropdown__trigger:active {
		transform: translate(var(--nb-shove-press), var(--nb-shove-press));
		box-shadow: 0 0 0 0 var(--nb-shadow-color);
	}
	.nb-dropdown__chevron {
		width: 1em;
		height: 1em;
		transition: transform 150ms ease;
	}
	.nb-dropdown__chevron[data-open='true'] {
		transform: rotate(180deg);
	}

	.nb-dropdown__menu {
		/* Reset the popover UA default (centred, margin auto) and place it against
		   the trigger with anchor positioning. */
		margin: 0;
		inset: auto;
		top: calc(anchor(bottom) + 0.4rem);
		left: anchor(left);
		min-width: anchor-size(width);
		position-try-fallbacks: flip-block;

		padding: 0;
		background: var(--nb-paper);
		border: var(--nb-border);
		box-shadow: var(--nb-shadow-lg);
		flex-direction: column;
	}
	.nb-dropdown__menu:popover-open {
		display: flex;
	}
	.nb-dropdown__item {
		text-align: left;
		white-space: nowrap;
		background: transparent;
		border: none;
		font-family: var(--nb-font);
		font-weight: var(--nb-font-weight-regular);
		color: var(--nb-ink);
		cursor: pointer;
		/* items sit one step below the trigger so the menu reads as secondary */
	}
	.nb-dropdown[data-size='sm'] .nb-dropdown__item {
		font-size: var(--nb-size-xs-text);
		padding: 0.4rem 0.8rem;
	}
	.nb-dropdown[data-size='md'] .nb-dropdown__item {
		font-size: var(--nb-size-sm-text);
		padding: 0.55rem 1rem;
	}
	.nb-dropdown[data-size='lg'] .nb-dropdown__item {
		font-size: var(--nb-size-md-text);
		padding: 0.7rem 1.2rem;
	}
	.nb-dropdown__item:hover,
	.nb-dropdown__item:focus-visible {
		outline: none;
		background: var(--nb-primary);
	}
	@media (prefers-reduced-motion: reduce) {
		.nb-dropdown__chevron {
			transition: none;
		}
	}
</style>
