<script module lang="ts">
	// Shared counter → a stable, unique group name per instance. Native radios group
	// by a shared `name`, so two groups on one page must not collide.
	let uid = 0;
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import '../styles/glassmorphism.css';
	import './css/radio-group.css';

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
