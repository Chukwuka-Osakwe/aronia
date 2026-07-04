<script lang="ts">
	import type { Component } from 'svelte';
	import type { ComponentSpec } from '$lib/index.js';

	// Middle pane, Dimsum-style: the component on its own in a showcase stage (with
	// its forced interaction states alongside it), then a details card below with
	// the import path, the live-generated code, and a Copy button.
	// Prop state (`values`) and snippet state (`slots`) are owned by the page and
	// shared with Controls, so this only reads them.
	let {
		spec,
		styleId,
		Comp,
		values,
		slots,
		forced,
		SampleChild,
		sampleName,
		StyleButton,
		fireAction
	}: {
		spec: ComponentSpec;
		/** The current style id — drives the stage's per-style backdrop. */
		styleId: string;
		Comp: Component<any>;
		values: Record<string, any>;
		slots: Record<string, any>;
		/** Interaction state forced from the panel (undefined = live/default). */
		forced?: string;
		/** For wrapper components: a live control to render as the children slot. */
		SampleChild?: Component<any>;
		/** The sample control's display name, for the generated code. */
		sampleName?: string;
		/** The current style's Button, used as the trigger for overlay components. */
		StyleButton?: Component<any>;
		/** Imperative components (Toast): the stage trigger runs this instead of
		 *  toggling `open`, and no inline instance is rendered. */
		fireAction?: (a: { message?: string; variant?: string; duration?: number }) => void;
	} = $props();

	// Fire an imperative component (Toast) with the current panel state.
	const runAction = () =>
		fireAction?.({ ...values, message: slots.children as string | undefined });

	const snippetNames = $derived(new Set(spec.snippets?.map((s) => s.name) ?? []));
	const has = (name: string, on = true) => snippetNames.has(name) && (!on || slots[name]);

	// Tabs/Accordion pass an argument to their children snippet (the active tab /
	// section), so the docs render generated per-item content, not an editable field.
	const parameterizedChild = $derived(
		spec.snippets?.some((s) => s.name === 'children' && s.parameterized) ?? false
	);

	// Local open-state for triggered-overlay components (Modal, …): the stage's
	// trigger button opens it, and onClose keeps it in sync — so the overlay owns
	// its state here instead of fighting the one-way panel values.
	let overlayOpen = $state(false);
	const closeOverlay = () => (overlayOpen = false);

	// Drop empty/optional prop values so we don't pass e.g. href="". Exception:
	// bindable props (Input `value`) keep their empty string — filtering them out
	// makes the component flip between uncontrolled and controlled, which left a
	// set `value` failing to render over a placeholder.
	const keepEmpty = $derived(new Set(spec.props.filter((p) => p.bindable).map((p) => p.name)));
	const liveProps = $derived(
		Object.fromEntries(
			Object.entries(values).filter(([k, v]) => v !== undefined && (v !== '' || keepEmpty.has(k)))
		)
	);

	// Copy-paste code reflecting non-default props + active snippets.
	const code = $derived.by(() => {
		// Imperative components print the call, not an element.
		if (fireAction) {
			const v = String(values.variant ?? 'info');
			const msg = String(slots.children || 'Your changes were saved.').replace(/'/g, "\\'");
			const call = v === 'info' ? `toast('${msg}')` : `toast.${v}('${msg}')`;
			return `import { toast } from '$lib';\n\n${call};`;
		}

		const attrs = spec.props
			.map((p) => {
				// A triggered overlay's open-state is shown as `bind:open`, added below.
				if (spec.trigger && p.name === 'open') return '';
				const v = values[p.name];
				// Arrays render as a JS expression attr and show even at default (the
				// options ARE the usage), filtering transient empties from the editor.
				if (p.type === 'array') {
					const arr = (Array.isArray(v) ? v : []).filter(Boolean);
					return arr.length ? `${p.name}={[${arr.map((s) => `'${s}'`).join(', ')}]}` : '';
				}
				if (v === undefined || v === '' || v === p.default) return '';
				// A `default: true` boolean turned off must render `prop={false}`, not vanish.
				if (p.type === 'boolean') return v ? p.name : p.default === true ? `${p.name}={false}` : '';
				return `${p.name}="${v}"`;
			})
			.filter(Boolean);
		if (spec.trigger) attrs.unshift('bind:open');
		const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';

		const inner: string[] = [];
		if (has('header')) inner.push('{#snippet header()}Header{/snippet}');
		if (has('icon')) inner.push('{#snippet icon()}★{/snippet}');
		if (parameterizedChild) {
			// Parameterised panel snippet (Tabs → active tab, Accordion → section).
			inner.push('{#snippet children(active)}The "{active}" panel.{/snippet}');
		} else if (snippetNames.has('children')) {
			// A wrapper's child is a live sample component; a leaf's is editable text.
			if (sampleName) inner.push(`<${sampleName} placeholder="Type here…" />`);
			else if (slots.children) inner.push(slots.children);
		}
		if (has('footer'))
			inner.push(
				'{#snippet footer()}<Button variant="ghost">Cancel</Button> <Button>Confirm</Button>{/snippet}'
			);

		let tag: string;
		if (inner.length === 0) tag = `<${spec.name}${attrStr} />`;
		// Inline single TEXT children; a component child prints multiline for clarity.
		else if (
			inner.length === 1 &&
			snippetNames.has('children') &&
			slots.children &&
			!sampleName &&
			!parameterizedChild
		) {
			tag = `<${spec.name}${attrStr}>${slots.children}</${spec.name}>`;
		} else tag = `<${spec.name}${attrStr}>\n  ${inner.join('\n  ')}\n</${spec.name}>`;

		// Triggered overlays copy with the open-state wiring a consumer actually needs.
		if (spec.trigger) {
			return `<Button onclick={() => (open = true)}>${spec.trigger}</Button>\n\n${tag}`;
		}
		return tag;
	});

	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout>;
	async function copyCode() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			clearTimeout(copyTimer);
			copyTimer = setTimeout(() => (copied = false), 1500);
		} catch {
			/* clipboard unavailable — no-op */
		}
	}
</script>

{#snippet sampleIcon()}★{/snippet}
{#snippet sampleHeader()}Header{/snippet}
<!-- Footers are an actions region — demo real buttons so the right-aligned layout
     reads as intentional. Falls back to text for styles without a Button. -->
{#snippet sampleFooter()}
	{#if StyleButton}
		<StyleButton variant="ghost" onclick={closeOverlay}>Cancel</StyleButton>
		<StyleButton onclick={closeOverlay}>Confirm</StyleButton>
	{:else}
		Footer
	{/if}
{/snippet}

<!-- Children slot, parameterised: components that pass an argument (Tabs → the
     active tab) get the `active` branch; a wrapper (Field) gets its sample control;
     everything else renders the editable children text. -->
{#snippet childrenSlot(active: string | undefined)}
	{#if active !== undefined}
		The "{active}" panel.
	{:else if SampleChild}
		<SampleChild placeholder="Type here…" />
	{:else}
		{slots.children}
	{/if}
{/snippet}

<!-- One reusable component instance; `forced` optionally pins an interaction state. -->
{#snippet instance(forced: string | undefined)}
	<Comp
		{...liveProps}
		icon={has('icon') ? sampleIcon : undefined}
		header={has('header') ? sampleHeader : undefined}
		footer={has('footer') ? sampleFooter : undefined}
		children={snippetNames.has('children') ? childrenSlot : undefined}
		data-state={forced}
		open={spec.trigger ? overlayOpen : undefined}
		onClose={spec.trigger ? closeOverlay : undefined}
	/>
{/snippet}

<!-- The component on its own; the interaction state is forced from the panel.
     Triggered overlays (Modal) show an "Open" button; their (closed) instance
     still renders so showModal() has an element to promote to the top layer. -->
<div class="stage" data-style={styleId}>
	<div class="stage__main">
		{#if spec.trigger}
			{@const onTrigger = fireAction ? runAction : () => (overlayOpen = true)}
			{#if StyleButton}
				<StyleButton onclick={onTrigger}>{spec.trigger}</StyleButton>
			{:else}
				<button class="overlay-trigger" type="button" onclick={onTrigger}>
					{spec.trigger}
				</button>
			{/if}
		{/if}
		<!-- Imperative components (Toast) have no inline instance — the app-root
		     <Toaster /> renders their output; only the trigger lives here. -->
		{#if !fireAction}
			{@render instance(forced)}
		{/if}
	</div>
</div>

<!-- Details card: import + live code + copy. -->
<div class="details">
	<div class="details__head">
		<span class="details__label">import</span>
		<code class="details__import">{spec.import}</code>
		<button class="copy" type="button" onclick={copyCode}>
			{#if copied}
				<svg
					class="copy__icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<polyline points="20 6 9 17 4 12" />
				</svg>
				Copied!
			{:else}
				<svg
					class="copy__icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
					<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
				</svg>
				Copy code
			{/if}
		</button>
	</div>
	<pre class="details__code"><code>{code}</code></pre>
</div>

<style>
	/* Showcase stage — the component on its own, unframed (no box), with forced
	   states alongside. Only the details card below is a box. */
	.stage {
		/* Grows to fill the space above the bottom-anchored card; the component is
		   centered in whatever room is left. */
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1.5rem;
	}
	/* The glass gradient backdrop now fills the whole middle column (see
	   +page.svelte, .workbench__main[data-style]); the stage stays transparent and
	   lets it show through. */
	.stage__main {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	/* Trigger for overlay components (Modal, …) — a plain docs-chrome button. */
	.overlay-trigger {
		font: inherit;
		font-size: var(--doc-sm);
		font-weight: 600;
		padding: 0.6rem 1.1rem;
		background: var(--doc-panel);
		color: var(--doc-ink);
		border: 2px solid var(--doc-ink);
		box-shadow: 3px 3px 0 0 var(--doc-ink);
		cursor: pointer;
		transition: transform 60ms ease;
	}
	.overlay-trigger:hover {
		background: var(--doc-bg);
	}
	.overlay-trigger:active {
		transform: translate(1px, 1px);
		box-shadow: 2px 2px 0 0 var(--doc-ink);
	}

	/* Details card — import, generated code, copy button. Its appearance is the
	   MIDDLE-PANE CHROME CONTRACT: every property reads a `--doc-card-*` token that
	   the active library remaps in its own `data-style` scope (see +page.svelte,
	   .workbench__main[data-style]). The fallbacks below are a NEUTRAL, style-
	   agnostic card — so a library that defines nothing looks neutral, never like
	   some other style. That's the rule: a library owns its whole middle pane. */
	.details {
		/* Anchored to the bottom (stage flex-grows above it). This is the sole
		   control for how far the card sits from the viewport bottom. */
		margin-bottom: 2rem; /* 32px */
		background: var(--doc-card-bg, var(--doc-panel));
		color: var(--doc-card-ink, var(--doc-ink));
		border: var(--doc-card-border, 1px solid var(--doc-line));
		border-radius: var(--doc-card-radius, 10px);
		box-shadow: var(--doc-card-shadow, 0 6px 24px rgba(17, 17, 17, 0.08));
		-webkit-backdrop-filter: var(--doc-card-filter, none);
		backdrop-filter: var(--doc-card-filter, none);
		overflow: hidden;
	}
	.details__head {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1.25rem 1.5rem 0.5rem;
	}
	.details__label {
		font-size: var(--doc-xs); /* 12px */
		text-transform: uppercase;
		letter-spacing: var(--doc-tracking-label);
		font-weight: 500;
		color: var(--doc-card-muted, var(--doc-muted));
	}
	.details__import {
		font-family: var(--doc-code);
		font-size: 0.875rem; /* 14px */
		color: var(--doc-card-ink, var(--doc-ink));
	}
	.details__code {
		margin: 0;
		padding: 1.75rem 1.5rem 2.25rem;
		/* transparent so the card's own (possibly translucent) surface shows through */
		background: transparent;
		color: var(--doc-card-ink, var(--doc-ink));
		font-family: var(--doc-code);
		font-size: 0.875rem; /* 14px */
		line-height: 1.6;
		text-align: center;
		overflow-x: auto;
	}
	.copy {
		margin-left: auto;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font: inherit;
		font-size: 0.875rem; /* 14px */
		font-weight: 500;
		padding: 0.4rem 0.85rem;
		background: transparent;
		color: var(--doc-card-ink, var(--doc-ink));
		border: var(--doc-card-border, 1px solid var(--doc-line));
		border-radius: var(--doc-card-radius, 10px);
		cursor: pointer;
		transition: transform 60ms ease;
	}
	.copy__icon {
		width: 14px;
		height: 14px;
	}
	.copy:hover {
		background: var(--doc-card-hover, var(--doc-bg));
	}
	.copy:active {
		transform: translate(1px, 1px);
	}
</style>
