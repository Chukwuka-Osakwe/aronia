<script lang="ts">
	import type { SkeletonShape } from './options.js';
	import '../styles/glassmorphism.css';

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

<style>
	.glass-skeleton--text {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		/* Concrete default width (not 100%) so it has intrinsic size when standalone
		   — e.g. the docs' shrink-to-content stage, where 100% collapses to zero.
		   Overridable via the `width` prop; caps at the container. */
		width: 22rem;
		max-width: 100%;
	}
	.glass-skeleton__bar {
		height: 0.85rem;
		width: 100%;
		border-radius: var(--glass-radius-sm);
	}
	.glass-skeleton--rect {
		display: block;
		width: 22rem;
		max-width: 100%;
		height: 8rem;
		border-radius: var(--glass-radius);
	}
	.glass-skeleton--circle {
		display: block;
		width: 3.5rem;
		aspect-ratio: 1;
		border-radius: 50%;
	}
	/* Shared skin: frosted translucent base + a bright highlight band that sweeps
	   left→right (background-position animation). */
	.glass-skeleton__bar,
	.glass-skeleton--rect,
	.glass-skeleton--circle {
		background-color: var(--glass-surface);
		background-image: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.55),
			transparent
		);
		background-size: 65% 100%;
		background-repeat: no-repeat;
		background-position: -65% 0;
		-webkit-backdrop-filter: blur(var(--glass-blur));
		backdrop-filter: blur(var(--glass-blur));
		animation: glass-skeleton-shimmer 1.4s ease-in-out infinite;
	}
	@keyframes glass-skeleton-shimmer {
		to {
			background-position: 165% 0;
		}
	}
	/* No sweep for reduced motion — the flat frosted surface still reads as a placeholder. */
	@media (prefers-reduced-motion: reduce) {
		.glass-skeleton__bar,
		.glass-skeleton--rect,
		.glass-skeleton--circle {
			animation: none;
			background-image: none;
		}
	}
</style>
