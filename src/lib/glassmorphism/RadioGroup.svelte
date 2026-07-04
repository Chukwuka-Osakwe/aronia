<script module lang="ts">
	// Shared counter → a stable, unique group name per instance. Native radios group
	// by a shared `name`, so two groups on one page must not collide.
	let uid = 0;
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import '../styles/glassmorphism.css';

	// A single-select group of native <input type="radio"> (visually hidden), so
	// keyboard, arrow-key roving, and form submission all work natively. Each option
	// gets a round frosted dot that fills indigo with a white inner dot when selected.
	// `options` is a plain string list (label === value).
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

	const autoName = `glass-radio-${uid++}`;
	const groupName = $derived(name || autoName);
</script>

<div class="glass-radio" role="radiogroup" data-disabled={disabled} data-state={dataState} {...rest}>
	{#each options.filter(Boolean) as opt (opt)}
		<label class="glass-radio__option" data-checked={value === opt}>
			<input
				type="radio"
				class="glass-radio__input"
				name={groupName}
				value={opt}
				checked={value === opt}
				{disabled}
				onchange={() => (value = opt)}
			/>
			<span class="glass-radio__dot"></span>
			<span class="glass-radio__label">{opt}</span>
		</label>
	{/each}
</div>

<style>
	.glass-radio {
		display: inline-flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.glass-radio[data-disabled='true'] {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.glass-radio__option {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.625rem;
		cursor: pointer;
		font-family: var(--glass-font);
		font-weight: var(--glass-font-weight);
		color: var(--glass-ink);
	}

	/* Native input kept present & focusable, visually hidden; the dot mirrors it. */
	.glass-radio__input {
		position: absolute;
		top: 0;
		left: 0;
		width: 1px;
		height: 1px;
		margin: 0;
		opacity: 0;
	}

	.glass-radio__dot {
		position: relative;
		flex: none;
		width: 24px;
		height: 24px;
		background: var(--glass-surface-strong);
		-webkit-backdrop-filter: blur(var(--glass-blur));
		backdrop-filter: blur(var(--glass-blur));
		border: var(--glass-border);
		border-radius: 50%;
		box-shadow: var(--glass-shadow-sm), var(--glass-highlight);
		transition: background-color 160ms ease;
	}
	/* Selected: indigo fill + a white inner dot (≈5:1, over the 3:1 non-text bar). */
	.glass-radio__option[data-checked='true'] .glass-radio__dot {
		background: var(--glass-primary);
		border-color: transparent;
	}
	.glass-radio__option[data-checked='true'] .glass-radio__dot::after {
		content: '';
		position: absolute;
		inset: 7px;
		background: #fff;
		border-radius: 50%;
	}

	/* Focus ring on the dot — real keyboard focus, or docs-forced on the selection. */
	.glass-radio__input:focus-visible + .glass-radio__dot,
	.glass-radio[data-state='focus'] .glass-radio__option[data-checked='true'] .glass-radio__dot {
		box-shadow:
			var(--glass-shadow-sm),
			0 0 0 4px color-mix(in srgb, var(--glass-accent) 28%, transparent);
	}
</style>
