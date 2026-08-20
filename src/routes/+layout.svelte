<script lang="ts">
	import './docs.css';
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import { manifest } from '$lib/index.js';
	import { registry } from './registry.js';
	import { labStyles } from './labs.js';

	let { children } = $props();

	// Component pages use a full-height, non-scrolling content pane (only their
	// right rail scrolls). Other pages scroll the content pane normally.
	const fullBleed = $derived($page.route.id === '/[style=noDot]/[component=noDot]');

	// The sidebar is scoped to ONE style ("library") at a time: the active route's
	// style is expanded (its components listed); every other style collapses to a
	// single title that links into it. So a glass route shows glass components, not
	// NB's — while other styles stay one click away. Undefined on non-style routes
	// (home/guide), where every style stays collapsed as a compact index.
	const activeStyle = $derived($page.params.style);
	// The active library object (for the footer's "about" link) — undefined off a
	// style route, where the link is hidden.
	const activeLib = $derived(
		activeStyle ? manifest.styles.find((s) => s.id === activeStyle) : undefined
	);
	// Show the lab link only in dev, and only when this style actually has a local lab.
	const hasLab = $derived(dev && !!activeStyle && labStyles.has(activeStyle));

	// Dark-mode roll-out: a dev-only playground toggle so we can eyeball each
	// family's dark tokens. Only families that carry dark `light-dark()` pairs get
	// the switch; it flips `data-theme` on the content pane (see the CSS below),
	// which cascades `color-scheme` + `light-dark()` resolution into the rendered
	// components. NOT shipped to consumers — purely a tuning affordance.
	const darkStyles = new Set(['risograph', 'swiss']);
	const hasDark = $derived(dev && !!activeStyle && darkStyles.has(activeStyle));
	let theme = $state<'light' | 'dark'>('light');
	// Honour `?theme=dark|light` on load so a headless screenshot (which can't click
	// the toggle) can force a mode. Nav links don't carry the param, so switching
	// components after a manual toggle won't reset it.
	$effect(() => {
		const t = $page.url.searchParams.get('theme');
		if (t === 'dark' || t === 'light') theme = t;
	});

	// Toast host: mount the ACTIVE style's Toaster at the app root so fired toasts
	// overlay the page. Each style owns its own store + host; only one style is in
	// view at a time, so we mount that one (none on the home/guide routes).
	const ActiveToaster = $derived(activeStyle ? registry[activeStyle]?.toast : undefined);
</script>

<div class="shell">
	<aside class="sidebar">
		<a class="brand" href="/">
			aronia<span>agent-friendly visual library</span>
		</a>

		<!-- Scrolling middle: every style group lives here. New component items flow
		     in and scroll under the pinned brand; the meta-links below stay put. -->
		<div class="nav-scroll scroll-shadows">
			{#each manifest.styles as style (style.id)}
				{@const isActive = style.id === activeStyle}
				{#if isActive}
					<!-- The active library: its header + full component list. On a style
					     route this is the ONLY library shown — no other headers. Nav lists
					     components alphabetically; the manifest keeps its curated order. -->
					{@const sortedComponents = [...style.components].sort((a, b) => a.name.localeCompare(b.name))}
					<nav class="group group--active">
						<ul>
							{#each sortedComponents as c (c.id)}
								{@const href = `/${style.id}/${c.id}`}
								{@const active = $page.url.pathname === href}
								{@const StyleLink = registry[style.id]?.['link']}
								<li>
									{#if StyleLink}
										<!-- The whole nav is this style's own Link (nav variant) — a real
										     component render, so the nav can't drift from the style. Links
										     (not buttons) are the right primitive for navigation, and they're
										     more compact. Active item = weight + colour + aria-current. -->
										<StyleLink {href} variant="nav" {active}>{c.name}</StyleLink>
									{:else}
										<a {href} class:active>{c.name}</a>
									{/if}
								</li>
							{/each}
						</ul>
					</nav>
				{:else if !activeStyle}
					<!-- No active library (home / guide): each style shows just its header
					     as an index link into that library. -->
					{@const enterHref = `/${style.id}/${style.components[0].id}`}
					<nav class="group">
						<a class="group__title group__title--switch" data-style={style.id} href={enterHref}>
							{style.name}
						</a>
					</nav>
				{/if}
			{/each}
		</div>

		<div class="sidebar__footer">
			<hr class="divider" />
			{#if activeLib}
				<a
					class="meta-link"
					href="/{activeLib.id}"
					class:active={$page.url.pathname === `/${activeLib.id}`}>about {activeLib.name}</a
				>
			{/if}
			<a class="meta-link" href="/guide" class:active={$page.url.pathname === '/guide'}>how to use</a>
			<a class="meta-link" href="/manifest.json">manifest.json ↗</a>
			{#if hasLab}
				<a class="meta-link" href="/lab/{activeStyle}">lab ↗</a>
			{/if}
			{#if hasDark}
				<button
					type="button"
					class="meta-link theme-toggle"
					aria-pressed={theme === 'dark'}
					onclick={() => (theme = theme === 'dark' ? 'light' : 'dark')}
				>
					theme: {theme}
				</button>
			{/if}
		</div>
	</aside>

	<main
		class="content"
		class:full-bleed={fullBleed}
		data-theme={hasDark ? theme : undefined}
	>
		{@render children()}
	</main>
</div>

{#if ActiveToaster}<ActiveToaster />{/if}

<style>
	/* Base + tokens + hidden scrollbars live in docs.css. */

	/* Viewport-locked shell: the window never scrolls; each region (sidebar,
	   content) manages its own overflow. */
	.shell {
		display: grid;
		grid-template-columns: 240px 1fr;
		height: 100vh;
		overflow: hidden;
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		border-right: 1px solid var(--doc-ink);
		padding: 1.75rem 1.25rem;
		height: 100%;
		/* The sidebar itself never scrolls; only its middle region does. */
		overflow: hidden;
		background: var(--doc-panel);
	}
	/* Brand pinned to the top, meta-links pinned to the bottom; the nav-scroll
	   between them takes the slack and scrolls when the item list is tall. */
	.brand,
	.sidebar__footer {
		flex: none;
	}
	.nav-scroll {
		flex: 1 1 auto;
		min-height: 0; /* allow it to shrink below content height so it can scroll */
		overflow-y: auto;
	}

	/* A lowercase "aronia" wordmark over an uppercase micro-label tagline, above a
	   full-bleed 1px rule spanning the sidebar (negative side margins counteract the
	   sidebar's 1.25rem padding; padding keeps the text off the edges). */
	.brand {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
		text-align: center;
		font-size: 1.15rem; /* the wordmark */
		font-weight: 700;
		letter-spacing: -0.01em; /* lowercase wants a touch tighter, not label tracking */
		line-height: 1.1;
		text-decoration: none;
		color: var(--doc-accent); /* the wordmark carries the aronia brand accent */
		border-bottom: 1px solid var(--doc-ink);
		padding: 0 1.25rem 1.25rem;
		margin: 0 -1.25rem 1.5rem;
	}
	.brand span {
		font-size: var(--doc-label); /* 11px */
		font-weight: 700;
		color: var(--doc-muted);
	}

	.group {
		margin-bottom: 1.5rem;
	}
	.group__title {
		font-size: 0.875rem; /* 14px */
		text-transform: uppercase;
		letter-spacing: var(--doc-tracking-label);
		font-weight: 500;
		color: var(--doc-muted);
		text-align: center;
		margin: 0 0 1.5rem; /* 24px — matches the 24px gap above the title */
	}
	/* Subtle type specimen: the style's label wears its own display font (same
	   pattern as the component-page h1). Add one rule here per new style. */
	.group__title[data-style='neo-brutalism'] {
		font-family: var(--nb-font);
	}
	.group__title[data-style='glassmorphism'] {
		font-family: var(--glass-font);
	}
	.group__title[data-style='risograph'] {
		font-family: var(--riso-font);
	}
	/* Collapsed libraries: the title is a bare switch-link — no list follows, so it
	   loses the gap and gains a hover cue. */
	.group:not(.group--active) {
		margin-bottom: 0.85rem;
	}
	.group__title--switch {
		display: block;
		margin-bottom: 0;
		text-decoration: none;
		transition: color 120ms ease;
	}
	.group__title--switch:hover {
		color: var(--doc-ink);
	}
	.group ul {
		list-style: none;
		/* Shrink the list to the widest item, then centre that block in the sidebar —
		   so items are left-aligned to a shared edge while the group stays centred. */
		width: max-content;
		max-width: 100%; /* never overflow the sidebar */
		margin: 0 auto;
		padding: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start; /* items left-aligned within the block */
		gap: 0.15rem; /* tight: links are compact, so the full list fits without scrolling */
	}
	.group li a {
		/* Fallback only (every style registers a Link, so this rarely renders):
		   content-width so a hover fill hugs the label rather than the whole sidebar. */
		display: inline-block;
		padding: 0.35rem 0.5rem;
		text-decoration: none;
		color: var(--doc-ink);
		font-size: var(--doc-sm);
		font-weight: 600;
		border: 2px solid transparent;
	}
	.group li a:hover {
		background: var(--doc-bg);
	}
	.group li a.active {
		background: var(--doc-accent);
		color: var(--doc-panel); /* light text — the brand accent is a dark purple */
		border: 2px solid var(--doc-ink);
		box-shadow: 3px 3px 0 0 var(--doc-ink);
	}
	/* The sidebar nav is chrome, so drive its states from doc tokens and let all
	   three libraries behave identically, regardless of each style's own Link
	   colours (e.g. neo's nav otherwise leaps to link-blue on hover). Rest = muted,
	   hover = full ink, selected = the aronia brand accent + the component's own
	   underline. :global, as these are child-component links; the shared
	   data-variant='nav' / aria-current hooks are style-agnostic. Source order
	   matters: the selected rule comes last so it wins over rest at equal
	   specificity, and hover excludes the selected item so it stays branded. */
	.group--active :global(a[data-variant='nav']) {
		color: var(--doc-muted);
	}
	.group--active :global(a[data-variant='nav']:not([aria-current='page']):hover) {
		color: var(--doc-ink);
	}
	.group--active :global(a[aria-current='page']) {
		color: var(--doc-accent);
	}

	.divider {
		border: none;
		border-top: 1.5px solid var(--doc-line);
		/* Full-bleed: counteract the sidebar's 1.25rem horizontal padding so the
		   rule spans the whole container, like the brand + PROPS rules. */
		margin: 1.5rem -1.25rem;
	}
	.meta-link {
		display: block;
		padding: 0.35rem 0.5rem;
		text-align: center;
		text-decoration: none;
		color: var(--doc-muted);
		font-size: 0.875rem; /* 14px — match the nav links + group title above */
		font-weight: 600;
		/* House convention: meta-links are lowercase. Presentational (not in the
		   markup) so the manifest's proper-cased name ("Neo-Brutalism") stays in the
		   DOM for screen readers, while the label reads "about neo-brutalism". */
		text-transform: lowercase;
	}
	.meta-link:hover {
		color: var(--doc-ink);
		background: var(--doc-bg);
	}
	.meta-link.active {
		color: var(--doc-ink);
	}
	/* Dev-only dark-mode toggle: a <button> wearing the meta-link look, so reset
	   native button chrome. When engaged it reads in full ink (like an active link)
	   so the current mode is legible at a glance. */
	.theme-toggle {
		width: 100%;
		border: none;
		background: none;
		cursor: pointer;
		font: inherit;
		font-size: 0.875rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.theme-toggle[aria-pressed='true'] {
		color: var(--doc-ink);
	}

	.content {
		height: 100%;
		overflow-y: auto;
		padding: 3rem 3rem 6rem;
	}
	/* Component pages own their full-height layout and internal scrolling. */
	.content.full-bleed {
		padding: 0;
		overflow: hidden;
	}

	@media (max-width: 900px) {
		/* Fall back to normal document flow / window scrolling on small screens. */
		.shell {
			grid-template-columns: 1fr;
			height: auto;
			overflow: visible;
		}
		.sidebar {
			height: auto;
			border-right: none;
			border-bottom: 1px solid var(--doc-ink);
		}
		.content,
		.content.full-bleed {
			height: auto;
			overflow: visible;
			padding: 2rem;
		}
	}
</style>
