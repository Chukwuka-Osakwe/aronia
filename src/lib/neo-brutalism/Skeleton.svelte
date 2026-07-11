<script lang="ts">
	import type { SkeletonShape } from './options.js';
	import '../styles/neo-brutalism.css';
	import './css/skeleton.css';

	// A loading placeholder — decorative, not interactive. `text` renders N lines
	// (the last one short, like a real paragraph's ragged edge); `rect`/`circle` are
	// single blocks sized by width/height. NB's take on "loading": flat muted fill,
	// hard square corners, a blunt opacity pulse (no soft shimmer — that's glass).
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
		class="nb-skeleton nb-skeleton--text"
		role="status"
		aria-label="Loading"
		style:width={width || undefined}
	>
		{#each lineWidths as w, i (i)}
			<span class="nb-skeleton__bar" style:width={w}></span>
		{/each}
	</div>
{:else}
	<span
		class="nb-skeleton nb-skeleton--{shape}"
		role="status"
		aria-label="Loading"
		style:width={width || undefined}
		style:height={shape === 'rect' ? height || undefined : undefined}
	></span>
{/if}
