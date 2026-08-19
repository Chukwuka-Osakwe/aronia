<script module lang="ts">
	export type Framework = 'react' | 'svelte' | 'html';
	export const FRAMEWORKS: { id: Framework; label: string }[] = [
		{ id: 'react', label: 'React' },
		{ id: 'svelte', label: 'Svelte' },
		{ id: 'html', label: 'HTML' }
	];
</script>

<script lang="ts">
	// A copy button that's a small framework dropdown: click to reveal React /
	// Svelte / HTML, and copy that framework's text. `getText(fw)` returns whatever
	// should land on the clipboard for the chosen framework — an install command
	// (home) or generated usage code (playground). Styled from `--doc-*` tokens so
	// it reads as docs chrome; `variant="card"` picks up the middle-pane card tokens.
	let {
		getText,
		label = 'Copy',
		variant = 'plain',
		placement = 'down'
	}: {
		getText: (fw: Framework) => string;
		label?: string;
		variant?: 'plain' | 'card';
		/** Open the menu below the button (default) or above it (near a page edge). */
		placement?: 'down' | 'up';
	} = $props();

	let open = $state(false);
	let root = $state<HTMLElement>();
	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	async function choose(fw: Framework) {
		try {
			await navigator.clipboard.writeText(getText(fw));
			copied = true;
			clearTimeout(timer);
			timer = setTimeout(() => (copied = false), 1500);
		} catch {
			/* clipboard unavailable — no-op */
		}
		open = false;
	}

	// Light-dismiss: close on outside click or Esc while open.
	$effect(() => {
		if (!open) return;
		const onDown = (e: PointerEvent) => {
			if (root && !root.contains(e.target as Node)) open = false;
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') open = false;
		};
		document.addEventListener('pointerdown', onDown, true);
		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('pointerdown', onDown, true);
			document.removeEventListener('keydown', onKey);
		};
	});
</script>

<div class="copymenu" bind:this={root} data-variant={variant}>
	<button
		type="button"
		class="copymenu__btn"
		aria-haspopup="menu"
		aria-expanded={open}
		onclick={() => (open = !open)}
	>
		{copied ? 'Copied' : label}
		<svg
			class="copymenu__caret"
			data-open={open}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<polyline points="6 9 12 15 18 9" />
		</svg>
	</button>
	{#if open}
		<div class="copymenu__list" role="menu" data-placement={placement}>
			{#each FRAMEWORKS as fw (fw.id)}
				<button
					type="button"
					role="menuitem"
					class="copymenu__item"
					onclick={() => choose(fw.id)}
				>
					{fw.label}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.copymenu {
		position: relative;
		display: inline-flex;
	}
	.copymenu__btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-family: var(--doc-font);
		font-size: var(--doc-xs);
		text-transform: uppercase;
		letter-spacing: var(--doc-tracking-label);
		border: 1px solid var(--doc-ink);
		background: transparent;
		color: var(--doc-ink);
		padding: 0.35rem 0.7rem;
		cursor: pointer;
	}
	.copymenu__btn:hover {
		background: var(--doc-ink);
		color: var(--doc-panel);
	}
	.copymenu__caret {
		width: 12px;
		height: 12px;
		transition: transform 150ms ease;
	}
	.copymenu__caret[data-open='true'] {
		transform: rotate(180deg);
	}

	/* Menu — anchored to the button's right edge; opens down (default) or up. */
	.copymenu__list {
		position: absolute;
		right: 0;
		z-index: 20;
		display: flex;
		flex-direction: column;
		min-width: 100%;
		background: var(--doc-panel);
		border: 1px solid var(--doc-ink);
		box-shadow: 0 6px 20px rgba(17, 17, 17, 0.12);
	}
	.copymenu__list[data-placement='down'] {
		top: calc(100% + 0.3rem);
	}
	.copymenu__list[data-placement='up'] {
		bottom: calc(100% + 0.3rem);
	}
	.copymenu__item {
		text-align: left;
		white-space: nowrap;
		font-family: var(--doc-font);
		font-size: var(--doc-xs);
		background: transparent;
		border: none;
		color: var(--doc-ink);
		padding: 0.45rem 0.85rem;
		cursor: pointer;
	}
	.copymenu__item:hover,
	.copymenu__item:focus-visible {
		outline: none;
		background: color-mix(in srgb, var(--doc-ink) 10%, transparent);
	}

	/* Card variant — reads the middle-pane card tokens so it matches a library's
	   own remapped chrome (see Preview.svelte's card contract). */
	.copymenu[data-variant='card'] .copymenu__btn {
		font-size: 0.875rem;
		text-transform: none;
		letter-spacing: normal;
		font-weight: 500;
		border: var(--doc-card-border, 1px solid var(--doc-line));
		border-radius: var(--doc-card-radius, 10px);
		color: var(--doc-card-ink, var(--doc-ink));
	}
	.copymenu[data-variant='card'] .copymenu__btn:hover {
		background: var(--doc-card-hover, var(--doc-bg));
		color: var(--doc-card-ink, var(--doc-ink));
	}
	.copymenu[data-variant='card'] .copymenu__list {
		background: var(--doc-card-bg, var(--doc-panel));
		border: var(--doc-card-border, 1px solid var(--doc-line));
		border-radius: var(--doc-card-radius, 10px);
		overflow: hidden;
	}
	.copymenu[data-variant='card'] .copymenu__item {
		font-size: 0.875rem;
		color: var(--doc-card-ink, var(--doc-ink));
	}
	/* Match the library's own DropdownMenu item hover (the riso stage maps
	   --doc-card-hover to --riso-muted). The base item hover is a fixed --doc-ink
	   tint that doesn't flip — barely visible and wrong-toned on the dark stage. */
	.copymenu[data-variant='card'] .copymenu__item:hover,
	.copymenu[data-variant='card'] .copymenu__item:focus-visible {
		background: var(--doc-card-hover, var(--doc-bg));
	}
</style>
