<script lang="ts">
	import type { ComponentSpec } from '$lib/index.js';
	import Switch from './Switch.svelte';

	// The right rail: interactive controls. Display order interleaves snippets
	// around props —  children → props → other snippets (icon/header/footer) —
	// so the primary content leads and optional content trails. (The manifest
	// still keeps props/snippets as separate typed arrays; this is docs-only.)
	// Each control stacks as name → description → artifact (input / toggle /
	// options). `children` is an editable text field; other snippets are booleans
	// toggling sample content. Writes to the shared `values`/`slots` $state
	// proxies so Preview updates live.
	let {
		spec,
		values,
		slots,
		forced,
		onForce
	}: {
		spec: ComponentSpec;
		values: Record<string, any>;
		slots: Record<string, any>;
		/** Currently-forced interaction state (undefined = default/live). */
		forced?: string;
		onForce?: (state: string | undefined) => void;
	} = $props();

	type SnippetSpec = NonNullable<ComponentSpec['snippets']>[number];
	const childrenSnip = $derived((spec.snippets ?? []).find((s) => s.name === 'children'));
	const extraSnips = $derived((spec.snippets ?? []).filter((s) => s.name !== 'children'));

	// These are control-panel inputs, not a form — they must never autofill (Chrome
	// happily fills the string control whose value is e.g. "Email", corrupting the
	// live prop). `autocomplete="off"` is not enough: Chrome ignores it for profile
	// data. The reliable defence is to keep the field readonly until first focus —
	// Chrome skips readonly fields at fill time. Done imperatively so a re-render
	// (value/placeholder update) can't re-assert readonly and lock the field.
	function noAutofill(el: HTMLInputElement) {
		el.readOnly = true;
		const unlock = () => (el.readOnly = false);
		el.addEventListener('pointerdown', unlock);
		el.addEventListener('focus', unlock);
		return {
			destroy() {
				el.removeEventListener('pointerdown', unlock);
				el.removeEventListener('focus', unlock);
			}
		};
	}
</script>

{#snippet snippetControl(snip: SnippetSpec)}
	<div class="control">
		<span class="control__name">{snip.name}</span>
		<p class="control__desc">{snip.description}</p>
		<div class="control__artifact">
			{#if snip.name === 'children'}
				<input type="text" autocomplete="off" use:noAutofill bind:value={slots[snip.name]} />
			{:else}
				<Switch checked={!!slots[snip.name]} onChange={(v) => (slots[snip.name] = v)} />
			{/if}
		</div>
	</div>
{/snippet}

<div class="controls">
	{#if spec.states?.length}
		<div class="control">
			<span class="control__name">state</span>
			<p class="control__desc">Force an interaction state to inspect it (preview only — not a prop).</p>
			<div class="control__artifact">
				<div class="options">
					{#each ['default', ...spec.states] as st (st)}
						<button
							type="button"
							class="option"
							class:active={(forced ?? 'default') === st}
							onclick={() => onForce?.(st === 'default' ? undefined : st)}
						>
							{st}
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}

	{#if childrenSnip && !childrenSnip.sample && !childrenSnip.parameterized}
		<!-- Field's sample control and parameterised panels (Tabs/Accordion) aren't
		     editable text. -->
		{@render snippetControl(childrenSnip)}
	{/if}

	{#each spec.props as prop (prop.name)}
		{#if !(spec.trigger && prop.name === 'open')}
			<!-- A triggered overlay's `open` is driven by the stage trigger, not a control. -->
			<div class="control">
			<span class="control__name">{prop.name}</span>
			<p class="control__desc">{prop.description}</p>
			<div class="control__artifact">
				{#if prop.type === 'enum'}
					<div class="options">
						{#each prop.values ?? [] as v (v)}
							<button
								type="button"
								class="option"
								class:active={values[prop.name] === v}
								onclick={() => (values[prop.name] = v)}
							>
								{v}
							</button>
						{/each}
					</div>
				{:else if prop.type === 'boolean'}
					<Switch checked={!!values[prop.name]} onChange={(v) => (values[prop.name] = v)} />
				{:else if prop.type === 'number'}
					<!-- Explicit write (like the enum/array controls) so the number reliably
					     flows to the shared `values` proxy; coerce to a real number. -->
					<input
						type="number"
						autocomplete="off"
						use:noAutofill
						placeholder={prop.placeholder ?? String(prop.default ?? '')}
						value={values[prop.name] ?? ''}
						oninput={(e) => {
							const n = e.currentTarget.valueAsNumber;
							values[prop.name] = Number.isNaN(n) ? undefined : n;
						}}
					/>
				{:else if prop.type === 'array'}
					<!-- Comma-separated editor → string[]. No empty-filter here so a
					     trailing comma keeps typing; consumers filter empties. -->
					<input
						type="text"
						autocomplete="off"
						use:noAutofill
						placeholder={prop.placeholder ?? 'comma, separated, values'}
						value={Array.isArray(values[prop.name]) ? values[prop.name].join(', ') : ''}
						oninput={(e) =>
							(values[prop.name] = e.currentTarget.value.split(',').map((s) => s.trim()))}
					/>
				{:else}
					<input
						type="text"
						autocomplete="off"
						use:noAutofill
						placeholder={prop.placeholder ?? String(prop.default ?? '')}
						bind:value={values[prop.name]}
					/>
				{/if}
			</div>
			</div>
		{/if}
	{/each}

	{#each extraSnips as snip (snip.name)}
		{@render snippetControl(snip)}
	{/each}
</div>

<style>
	.controls {
		display: flex;
		flex-direction: column;
	}
	.control {
		padding: 1.5rem 0; /* 24px */
		border-bottom: 1px solid var(--doc-line);
	}
	.control:first-child {
		padding-top: 0;
	}
	.control:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}
	.control__name {
		display: block;
		font-family: var(--doc-font);
		font-weight: 500;
		font-size: 0.875rem; /* 14px */
	}
	.control__desc {
		margin: 0.25rem 0 0; /* 4px */
		font-size: var(--doc-xs);
		line-height: 1.5;
		color: var(--doc-muted);
	}
	.control__artifact {
		margin-top: 1rem; /* 16px */
		display: flex;
		justify-content: center;
	}
	.control__artifact input[type='text'],
	.control__artifact input[type='number'] {
		font: inherit;
		font-size: var(--doc-xs); /* 12px */
		padding: 0.3rem 0.45rem;
		border: 1px solid var(--doc-ink);
		background: var(--doc-panel);
		width: 100%;
		max-width: 220px;
	}

	/* Enum values as an inline row of link-style options — all visible at once. */
	.options {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.3rem 1rem;
	}
	.option {
		appearance: none;
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		font-size: var(--doc-sm);
		cursor: pointer;
		color: var(--doc-muted);
	}
	.option:hover {
		color: var(--doc-ink);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.option.active {
		color: var(--doc-ink);
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
</style>
