<script lang="ts">
	import type { Component } from 'svelte';
	import type { ComponentSpec } from '$lib/index.js';
	import CopyMenu, { type Framework } from './CopyMenu.svelte';

	// Middle pane, Dimsum-style: the component on its own in a showcase stage (with
	// its forced interaction states alongside it), then a details card below with
	// the "add to your repo" command and a framework Copy dropdown. The playground
	// PREVIEWS; how-to-get-it is the same `npx aronia add` command as the home CTA
	// (no hand-copied per-framework source — framework is a --framework flag).
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

	// Text controls fill their container (width:100%), but the showcase stage
	// centers each demo as a shrink-to-fit flex item — so with nothing to fill,
	// the control collapses to its ~20ch intrinsic width and long values clip.
	// Give these demos a form-like width to fill; other components stay shrink-
	// wrapped and centred as before. Select is excluded: it sizes to its content
	// (with its own min-width floor), so it neither collapses nor needs filling.
	const WIDTH_FILLING_CONTROLS = new Set(['field', 'input', 'textarea']);
	const isFormControl = $derived(WIDTH_FILLING_CONTROLS.has(spec.id));

	// How to add this component to a repo — the same install command as the home
	// CTA; the framework is a --framework flag (react is the CLI default, implicit).
	const addCmd = $derived(`npx aronia add ${spec.id} --style ${styleId}`);
	const addCmdFor = (fw: Framework) => `${addCmd}${fw === 'react' ? '' : ` --framework ${fw}`}`;

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
	<div class="stage__main" class:stage__main--field={isFormControl}>
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

<!-- Details card: the "add to your repo" command + a framework Copy dropdown. -->
<div class="details">
	<div class="details__head">
		<span class="details__label">add</span>
		<code class="details__import">{addCmd}</code>
		<CopyMenu label="Copy" getText={addCmdFor} variant="card" placement="up" />
	</div>
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
	/* Form-control demos need a definite width to fill — otherwise the control's
	   ~20ch intrinsic width wins in this centering flex context and long values
	   clip. A form-like max keeps them readable without spanning the whole pane. */
	.stage__main--field {
		width: min(100%, 20rem);
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
	}
	.details__head {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
	}
	.details__label {
		font-size: var(--doc-xs); /* 12px */
		text-transform: uppercase;
		letter-spacing: var(--doc-tracking-label);
		font-weight: 500;
		color: var(--doc-card-muted, var(--doc-muted));
	}
	.details__import {
		flex: 1 1 auto;
		min-width: 0;
		font-family: var(--doc-code);
		font-size: 0.875rem; /* 14px */
		color: var(--doc-card-ink, var(--doc-ink));
		white-space: nowrap;
		overflow-x: auto;
	}
</style>
