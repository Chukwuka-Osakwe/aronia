<script module lang="ts">
	// Shared counter → a stable, unique group name per instance. Native radios
	// group by a shared `name`, so two groups on one page must not collide.
	// Render order is deterministic, so this stays SSR/hydration-safe.
	let uid = 0;
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import '../styles/neo-brutalism.css';
	import './css/radio-group.css';

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
