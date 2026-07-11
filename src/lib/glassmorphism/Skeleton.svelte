<script lang="ts">
	import type { SkeletonShape } from './options.js';
	import '../styles/glassmorphism.css';
	import './css/skeleton.css';

	// A loading placeholder — decorative, not interactive. `text` renders N lines
	// (last one short); `rect`/`circle` are single blocks. Glass's take on "loading":
	// a frosted translucent surface with a soft highlight that sweeps across (shimmer)
	// — the airy counterpart to NB's blunt opacity pulse.
	type Props = {
		shape?: SkeletonShape;
		/** For `text`: how many lines. */
		lines?: number;
		/** CSS width (e.g. '100%', '20rem'); for `circle` this is the diameter. */
		width?: string;
		/** CSS height — `rect` only. */
		height?: string;
	};
	let { shape = 'text', lines = 5, width, height }: Props = $props();

	const lineWidths = $derived(
		Array.from({ length: Math.max(1, lines) }, (_, i) =>
			i === lines - 1 && lines > 1 ? '60%' : '100%'
		)
	);
</script>

{#if shape === 'text'}
	<div
		class="glass-skeleton glass-skeleton--text"
		role="status"
		aria-label="Loading"
		style:width={width || undefined}
	>
		{#each lineWidths as w, i (i)}
			<span class="glass-skeleton__bar" style:width={w}></span>
		{/each}
	</div>
{:else}
	<span
		class="glass-skeleton glass-skeleton--{shape}"
		role="status"
		aria-label="Loading"
		style:width={width || undefined}
		style:height={shape === 'rect' ? height || undefined : undefined}
	></span>
{/if}
