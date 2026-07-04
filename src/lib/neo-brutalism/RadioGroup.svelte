<script module lang="ts">
	// Shared counter → a stable, unique group name per instance. Native radios
	// group by a shared `name`, so two groups on one page must not collide.
	// Render order is deterministic, so this stays SSR/hydration-safe.
	let uid = 0;
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import '../styles/neo-brutalism.css';

	// A single-select group of native <input type="radio"> (visually hidden), so
	// keyboard, arrow-key roving, and form submission all work natively. Each option
	// gets a styled square "dot" for the NB look — yellow fill with a hard black
	// inner square when selected (distinct from Checkbox's tick). `options` is a
	// plain string list (label === value); `data-state` is pulled off rest so the
	// docs can force the focus ring onto the selected dot.
	type Props = {
		value?: string;
		options?: string[];
		name?: string;
		disabled?: boolean;
	} & Omit<HTMLAttributes<HTMLDivElement>, 'role'>;

	let {
		value = $bindable(''),
		options = [],
		name,
		disabled = false,
		'data-state': dataState,
		...rest
	}: Props = $props();

	// Auto-name generated once; the resolved name stays reactive to the prop.
	const autoName = `nb-radio-${uid++}`;
	const groupName = $derived(name || autoName);
</script>

<div class="nb-radio" role="radiogroup" data-disabled={disabled} data-state={dataState} {...rest}>
	{#each options.filter(Boolean) as opt (opt)}
		<label class="nb-radio__option" data-checked={value === opt}>
			<input
				type="radio"
				class="nb-radio__input"
				name={groupName}
				value={opt}
				checked={value === opt}
				{disabled}
				onchange={() => (value = opt)}
			/>
			<span class="nb-radio__dot"></span>
			<span class="nb-radio__label">{opt}</span>
		</label>
	{/each}
</div>

<style>
	.nb-radio {
		display: inline-flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.nb-radio[data-disabled='true'] {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.nb-radio__option {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.625rem;
		cursor: pointer;
		font-family: var(--nb-font);
		font-weight: var(--nb-font-weight);
		color: var(--nb-ink);
	}

	/* Native input kept present & focusable, visually hidden; the dot mirrors it. */
	.nb-radio__input {
		position: absolute;
		top: 0;
		left: 0;
		width: 1px;
		height: 1px;
		margin: 0;
		opacity: 0;
	}

	.nb-radio__dot {
		position: relative;
		flex: none;
		width: 24px;
		height: 24px;
		background: var(--nb-paper);
		border: var(--nb-border);
		border-radius: var(--nb-radius);
		box-shadow: var(--nb-shadow);
		transition: background 120ms ease;
	}
	/* Selected: yellow fill + a hard black inner square. */
	.nb-radio__option[data-checked='true'] .nb-radio__dot {
		background: var(--nb-primary);
	}
	.nb-radio__option[data-checked='true'] .nb-radio__dot::after {
		content: '';
		position: absolute;
		inset: 6px;
		background: var(--nb-ink);
	}

	/* Focus ring on the dot — real keyboard focus, or docs-forced on the selection. */
	.nb-radio__input:focus-visible + .nb-radio__dot,
	.nb-radio[data-state='focus'] .nb-radio__option[data-checked='true'] .nb-radio__dot {
		box-shadow: var(--nb-shadow), 0 0 0 3px var(--nb-accent);
	}
</style>
