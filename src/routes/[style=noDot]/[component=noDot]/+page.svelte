<script lang="ts">
	import { manifest, type ComponentSpec } from '$lib/index.js';
	import { registry, triggerActions } from '../../registry.js';
	import Preview from '../../Preview.svelte';
	import Controls from '../../Controls.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Non-null: the load function already 404'd on unknown ids.
	const style = $derived(manifest.styles.find((s) => s.id === data.styleId)!);
	const spec = $derived(style.components.find((c) => c.id === data.componentId)!);
	const Comp = $derived(registry[data.styleId][data.componentId]);

	// For wrapper components (e.g. Field): if the children snippet names a `sample`
	// component, resolve the live component so Preview can render a real control inside.
	const childSnippet = $derived(spec.snippets?.find((s) => s.name === 'children'));
	const SampleChild = $derived(
		childSnippet?.sample ? registry[data.styleId][childSnippet.sample] : undefined
	);

	// The style's own Button drives overlay triggers (Modal) — same real-component
	// specimen approach as the nav, and it matches the generated <Button> snippet.
	const StyleButton = $derived(registry[data.styleId]?.button);

	// Imperative components (Toast) fire an action from the stage trigger instead of
	// toggling an `open` prop; Preview calls this with the current panel values.
	const fireAction = $derived(triggerActions[data.styleId]?.[data.componentId]);

	// Shared control state, owned here and passed to both panes. `values` holds
	// prop values; `slots` holds snippet state (editable `children` text + boolean
	// toggles for icon/header/footer). Both are re-seeded whenever the component
	// changes (effect keeps `spec` inside a closure, which is what Svelte wants).
	function initValues(s: ComponentSpec): Record<string, unknown> {
		const v: Record<string, unknown> = {};
		for (const p of s.props)
			v[p.name] = p.default ?? (p.type === 'boolean' ? false : p.type === 'array' ? [] : '');
		return v;
	}
	// Status components (Alert, Toast) track their variant with the sample copy — a
	// "saved" message makes no sense on an error box. The effect below re-seeds it
	// when the variant changes.
	const STATUS_MESSAGES: Record<string, string> = {
		info: "Heads up — here's something worth noting.",
		success: 'Your changes have been saved.',
		warning: "Careful — this action can't be undone.",
		error: 'Something went wrong. Please try again.'
	};
	// Short variant-appropriate headings for Alert. A playground affordance only —
	// the manifest keeps `title` optional (no default), so the documented API stays
	// honest; this just makes the titled layout (and its icon/title registration)
	// visible by default, since a title-less alert can't show it.
	const STATUS_TITLES: Record<string, string> = {
		info: 'Heads up',
		success: 'Success',
		warning: 'Careful',
		error: 'Something went wrong'
	};

	function defaultChildren(s: ComponentSpec): string {
		if (s.id === 'card') return 'Card body content.';
		if (s.id === 'badge') return 'Badge';
		if (s.id === 'modal') return 'This is a modal dialog. Press Esc, click the backdrop, or the × to close.';
		if (s.id === 'alert' || s.id === 'toast') return STATUS_MESSAGES.info;
		return s.name; // e.g. "Button"
	}
	function initSlots(s: ComponentSpec): Record<string, unknown> {
		const slots: Record<string, unknown> = {};
		for (const sn of s.snippets ?? []) {
			slots[sn.name] = sn.name === 'children' ? defaultChildren(s) : false;
		}
		return slots;
	}
	let values = $state<Record<string, any>>({});
	let slots = $state<Record<string, any>>({});
	// Interaction state forced from the panel (undefined = live/default).
	let forced = $state<string | undefined>(undefined);
	$effect(() => {
		values = initValues(spec);
		slots = initSlots(spec);
		forced = undefined;
	});

	// Keep the status sample message in step with its variant (Alert, Toast).
	// Re-seeds on every variant change (a demo affordance — switching variant
	// refreshes the copy).
	$effect(() => {
		if (spec.id !== 'alert' && spec.id !== 'toast') return;
		slots.children = STATUS_MESSAGES[values.variant] ?? STATUS_MESSAGES.info;
		// Alert only — Toast is fired imperatively and has no title prop. Re-seed the
		// title alongside the message on variant change. The guard reads `spec` (not
		// `values.title`) on purpose: reading `values.title` here would subscribe this
		// effect to the field, so every keystroke — including clearing it — would
		// retrigger and clobber the edit. Keyed off the variant only, the field stays
		// freely editable between variant switches, just like the message.
		if (spec.id === 'alert') values.title = STATUS_TITLES[values.variant] ?? STATUS_TITLES.info;
	});
</script>

<div class="workbench">
	<div class="workbench__main" data-style={style.id}>
		<header data-style={style.id}>
			<h1>{spec.name}</h1>
			<p class="desc">{spec.description}</p>
		</header>

		{#key spec.id}
			<Preview
				{spec}
				styleId={style.id}
				{Comp}
				{values}
				{slots}
				{forced}
				{SampleChild}
				{StyleButton}
				{fireAction}
			/>
		{/key}
	</div>

	<aside class="workbench__side scroll-shadows">
		<section>
			<!-- Surfaces the active library on the playground as a crumb: e.g. SWISS / PROPS.
			     The library name reads in ink; PROPS takes the brand accent to stand out. -->
			<h2>{style.name} <span class="crumb-sep">/</span> <span class="crumb-props">Props</span></h2>
			{#key spec.id}
				<Controls {spec} {values} {slots} {forced} onForce={(s) => (forced = s)} />
			{/key}
		</section>
	</aside>
</div>

<style>
	/* Fills the (full-bleed) content pane exactly. The middle is fixed; only the
	   right rail scrolls. Header lives in the middle column so the crumb and the
	   "Props & state" heading share a top line. */
	.workbench {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 340px;
		height: 100%;
	}
	.workbench__main {
		/* Flex column so the stage flex-grows and the details card anchors to the
		   bottom of the (non-scrolling) pane. overflow-y stays auto as a safety
		   valve: if a viewport is ever too short the pane scrolls instead of
		   clipping. Scrollbars are hidden globally, so no visible bar appears. */
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
		overflow-y: auto;
		padding: var(--doc-gap-pane) 2.5rem 0 var(--doc-gap-pane);
	}
	/* MIDDLE-PANE CHROME, PER LIBRARY. The rule: each style owns its whole middle
	   pane — the pane backdrop AND the details-card chrome — by remapping the
	   neutral `--doc-card-*` contract (consumed in Preview.svelte) to its own
	   tokens. Add one block per new style and the card follows automatically; no
	   style is the privileged default. */
	.workbench__main[data-style='neo-brutalism'] {
		--doc-card-border: 1px solid var(--doc-ink);
		--doc-card-shadow: none;
		--doc-card-radius: 0;
	}
	/* On the glass gradient the muted grey description drops below WCAG AA (1.9–3.8:1
	   across the gradient); dark ink clears it everywhere (6.5–13:1). */
	.workbench__main[data-style='glassmorphism'] .desc {
		color: var(--glass-ink);
	}
	.workbench__main[data-style='glassmorphism'] {
		/* Frosted card chrome... */
		--doc-card-bg: var(--glass-surface-strong);
		--doc-card-ink: var(--glass-ink);
		--doc-card-muted: var(--glass-ink-soft);
		--doc-card-border: var(--glass-border);
		--doc-card-shadow: var(--glass-shadow);
		--doc-card-radius: var(--glass-radius);
		--doc-card-filter: blur(var(--glass-blur));
		--doc-card-hover: var(--glass-surface);
		/* ...over a vivid gradient the whole pane fills (glass is near-invisible on a
		   flat pane — the blur needs something to frost). */
		background:
			radial-gradient(120% 120% at 0% 0%, #a78bfa 0%, transparent 55%),
			radial-gradient(120% 120% at 100% 0%, #f0abfc 0%, transparent 55%),
			radial-gradient(140% 140% at 50% 120%, #7dd3fc 0%, transparent 55%),
			linear-gradient(135deg, #c4b5fd, #bae6fd);
	}
	/* Swiss: flat, hairline-bordered card chrome — no shadow, crisp 2px corners,
	   matching the family's own restraint. */
	.workbench__main[data-style='swiss'] {
		--doc-card-border: 1px solid var(--doc-line);
		--doc-card-shadow: none;
		--doc-card-radius: 2px;
	}
	/* Riso: the whole pane is warm paper with a multiply-blended grain tooth, and
	   the details card wears the family's blocky ink chrome + coloured offset — so
	   the specimens sit on print stock, not the default white. */
	.workbench__main[data-style='risograph'] {
		--doc-card-bg: var(--riso-paper);
		--doc-card-ink: var(--riso-ink);
		--doc-card-muted: var(--riso-ink-soft);
		--doc-card-border: 1.5px solid var(--riso-ink);
		--doc-card-shadow: none;
		--doc-card-radius: 0;
		--doc-card-hover: var(--riso-muted);
		background:
			var(--riso-grain),
			var(--riso-paper);
		background-size: 120px 120px, auto;
		background-blend-mode: multiply, normal;
	}
	.workbench__main[data-style='risograph'] .desc {
		color: var(--riso-ink-soft);
	}
	.workbench__side {
		border-left: 1px solid var(--doc-ink);
		/* Background comes from the global `.scroll-shadows` utility (panel + the
		   dynamic edge shadows); kept out of this scoped rule so it doesn't out-
		   specificity the utility and cancel the shadows. This rail is wider and
		   airier than the nav, so its edge shadow needs more weight to read. */
		--scroll-shadow-color: rgb(17 17 17 / 0.3);
		--scroll-shadow-size: 26px;
		overflow-y: auto;
		min-height: 0;
		/* No top padding: the sticky heading owns the top spacing (as its own
		   padding-top) so its opaque band reaches the very top when pinned. */
		padding: 0 2rem var(--doc-gap-pane);
	}
	.workbench__side section {
		margin-bottom: var(--doc-gap-section);
	}
	.workbench__side section:last-child {
		margin-bottom: 0;
	}

	header {
		margin-bottom: 2rem;
		text-align: center;
	}
	h1 {
		font-size: var(--doc-h1);
		font-weight: 800;
		letter-spacing: -0.02em;
		line-height: 1.05;
		margin: 0;
	}
	/* The heading is a type specimen: it adopts the current style's display font,
	   surfaced via the page's style id → that style's own font token (no drift, no
	   duplicated stacks). The description stays in the neutral chrome font. Add one
	   rule here per new style. */
	header[data-style='neo-brutalism'] h1 {
		font-family: var(--nb-font);
	}
	header[data-style='glassmorphism'] h1 {
		font-family: var(--glass-font);
	}
	header[data-style='swiss'] h1 {
		font-family: var(--swiss-font);
	}
	header[data-style='risograph'] h1 {
		font-family: var(--riso-font);
	}
	.desc {
		font-size: 1rem; /* 16px */
		font-weight: 500;
		max-width: 60ch;
		line-height: 1.55;
		color: var(--doc-muted);
		margin: 0.75rem auto 0;
	}

	h2 {
		font-size: 1rem; /* 16px */
		text-transform: uppercase;
		letter-spacing: var(--doc-tracking-label);
		font-weight: 500;
		text-align: center;
		border-bottom: 1px solid var(--doc-ink);
		/* The heading owns the rail's top spacing via its own padding-top (the rail
		   has none), so its opaque band runs from the very top down to the rule.
		   padding-top also keeps "PROPS" aligned with the middle column's crumb;
		   negative side margins bleed the rule out to the rail edges. */
		padding: var(--doc-gap-pane) 2rem 0.5rem;
		margin: 0 -2rem 1.1rem;
		/* Pin to the top of the scrolling rail so controls flow underneath it. */
		position: sticky;
		top: 0;
		z-index: 10;
		background: var(--doc-panel, #fff);
	}
	/* Crumb separator between the library name and PROPS — muted so the library
	   reads as the surfaced context and the slash stays quiet. */
	h2 .crumb-sep {
		color: var(--doc-muted);
		font-weight: 400;
	}
	/* PROPS takes the aronia brand accent so the active section stands out. */
	h2 .crumb-props {
		color: var(--doc-accent);
	}

	@media (max-width: 900px) {
		.workbench {
			grid-template-columns: 1fr;
			height: auto;
		}
		.workbench__main {
			overflow: visible;
			padding: 0 0 2rem;
		}
		.workbench__side {
			border-left: none;
			border-top: 1px solid var(--doc-ink);
			overflow: visible;
			min-height: 0;
			padding: 2rem 0 0;
		}
	}
</style>
