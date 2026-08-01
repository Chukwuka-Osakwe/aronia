<script lang="ts">
	import type { SkeletonShape } from './options.js';
	import '../styles/riso.css';
	import './css/skeleton.css';

	// A loading placeholder — decorative, not interactive. `text` renders N lines
	// (the last one short, like a real paragraph's ragged edge); `rect`/`circle`
	// are single blocks sized by width/height. Riso's take: a flat warm deeper-
	// paper fill, hard 0px corners, a blunt opacity pulse (colour-only — no
	// shimmer sweep, no movement).
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
		class="riso-skeleton riso-skeleton--text"
		role="status"
		aria-label="Loading"
		style:width={width || undefined}
	>
		{#each lineWidths as w, i (i)}
			<span class="riso-skeleton__bar" style:width={w}></span>
		{/each}
	</div>
{:else}
	<span
		class="riso-skeleton riso-skeleton--{shape}"
		role="status"
		aria-label="Loading"
		style:width={width || undefined}
		style:height={shape === 'rect' ? height || undefined : undefined}
	></span>
{/if}
