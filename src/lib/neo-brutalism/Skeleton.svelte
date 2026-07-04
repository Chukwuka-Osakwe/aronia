<script lang="ts">
	import type { SkeletonShape } from './options.js';
	import '../styles/neo-brutalism.css';

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

<style>
	.nb-skeleton--text {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		/* Concrete default width (not 100%) so it has intrinsic size when standalone
		   — e.g. the docs' shrink-to-content stage, where 100% collapses to zero.
		   Overridable via the `width` prop; caps at the container. */
		width: 22rem;
		max-width: 100%;
	}
	.nb-skeleton__bar {
		height: 0.85rem;
		width: 100%;
		background: var(--nb-muted);
		border-radius: var(--nb-radius);
		animation: nb-skeleton-pulse 1.1s ease-in-out infinite;
	}
	.nb-skeleton--rect {
		display: block;
		width: 22rem;
		max-width: 100%;
		height: 8rem;
		background: var(--nb-muted);
		border-radius: var(--nb-radius);
		animation: nb-skeleton-pulse 1.1s ease-in-out infinite;
	}
	.nb-skeleton--circle {
		display: block;
		width: 3.5rem;
		aspect-ratio: 1;
		background: var(--nb-muted);
		border-radius: 50%;
		animation: nb-skeleton-pulse 1.1s ease-in-out infinite;
	}
	@keyframes nb-skeleton-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.45;
		}
	}
	/* No pulse for reduced motion — a static placeholder still communicates "loading". */
	@media (prefers-reduced-motion: reduce) {
		.nb-skeleton__bar,
		.nb-skeleton--rect,
		.nb-skeleton--circle {
			animation: none;
		}
	}
</style>
