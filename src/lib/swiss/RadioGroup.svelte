<script module lang="ts">
	// Shared counter → a stable, unique group name per instance. Native radios
	// group by a shared `name`, so two groups on one page must not collide.
	// Render order is deterministic, so this stays SSR/hydration-safe.
	let uid = 0;
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import '../styles/swiss.css';
	import './css/radio-group.css';

	// A single-select group of native <input type="radio"> (visually hidden), so
	// keyboard, arrow-key roving, and form submission all work natively. Each option
	// gets a styled circular dot for the Swiss look — a ring that fills with an ink
	// inner disc when selected (monochrome, distinct from Checkbox's square tick).
	// `options` is a plain string list (label === value); `data-state` is pulled off
	// rest so the docs can force the focus ring onto the selected dot.
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
	const autoName = `swiss-radio-${uid++}`;
	const groupName = $derived(name || autoName);
</script>

<div class="swiss-radio" role="radiogroup" data-disabled={disabled} data-state={dataState} {...rest}>
	{#each options.filter(Boolean) as opt (opt)}
		<label class="swiss-radio__option" data-checked={value === opt}>
			<input
				type="radio"
				class="swiss-radio__input"
				name={groupName}
				value={opt}
				checked={value === opt}
				{disabled}
				onchange={() => (value = opt)}
			/>
			<span class="swiss-radio__dot"></span>
			<span class="swiss-radio__label">{opt}</span>
		</label>
	{/each}
</div>
