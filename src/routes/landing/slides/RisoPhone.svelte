<script lang="ts">
	// The Risograph "Simmer" food phone, built from the real --riso-* tokens. `theme` flips
	// color-scheme (paper ↔ plum stock, ink reflects, grain blend flips multiply↔screen on the
	// [data-theme] hook). The fluoro-pink accent + the duotone hero are constant spot colour.
	// Depth is overprint + grain, never shadow (riso doctrine).
	import { risograph } from '$lib/index.js';

	const { Button, Badge } = risograph;

	let { theme = 'light' }: { theme?: 'light' | 'dark' } = $props();

	const upNext = [
		{ title: 'Blistered Shishitos', meta: '15 MIN · SNACK', img: '/landing/hero/img/simmer-1.jpg' },
		{ title: 'Cold Soba, Sesame', meta: '20 MIN · LUNCH', img: '/landing/hero/img/simmer-2.jpg' }
	];
</script>

<div class="rz-bezel">
	<div class="rz-screen" data-theme={theme}>
		<div class="rz-status">
			<span>9:41</span>
			<span>● ● ●&nbsp;&nbsp;▰▰▰</span>
		</div>
		<div class="rz-head">
			<span class="rz-brand">Simmer</span>
		</div>
		<div class="rz-hero">
			<img class="rz-hero-img" src="/landing/hero/img/simmer-hero.jpg" alt="" />
			<span class="rz-tag">DINNER · 30 MIN</span>
			<h3 class="rz-hero-title">Charred Miso Aubergine</h3>
		</div>
		<div class="rz-content">
			<p class="rz-desc">
				Smoky, sticky, 20 minutes hands-on. The miso glaze does all the work while the grill
				does the rest.
			</p>
			<div class="rz-actions">
				<Button variant="primary">Start cooking</Button>
				<Badge variant="muted" shape="square">SERVES 2</Badge>
			</div>
			<span class="rz-label">UP NEXT</span>
			<div class="rz-list">
				{#each upNext as item (item.title)}
					<div class="rz-row">
						<div class="rz-thumb"><img src={item.img} alt="" /></div>
						<div class="rz-row-text">
							<span class="rz-row-title">{item.title}</span>
							<span class="rz-row-meta">{item.meta}</span>
						</div>
						<span class="rz-arrow">→</span>
					</div>
				{/each}
			</div>
		</div>
		<nav class="rz-nav">
			<span class="rz-nav-item on">
				<svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M4 10l7-6 7 6v8H4z" /><path d="M9 18v-5h4v5" />
				</svg>
				<span>FEED</span>
			</span>
			<span class="rz-nav-item">
				<svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="10" cy="10" r="6" /><path d="M15 15l4 4" />
				</svg>
				<span>SEARCH</span>
			</span>
			<span class="rz-nav-item">
				<svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M5 3.5h12v15l-6-4-6 4z" />
				</svg>
				<span>SAVED</span>
			</span>
			<span class="rz-nav-item">
				<svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="11" cy="7" r="4" /><path d="M4 19c0-4 3.5-6 7-6s7 2 7 6" />
				</svg>
				<span>YOU</span>
			</span>
		</nav>
	</div>
</div>

<style>
	.rz-bezel {
		/* The real device frame — 414×874 (11px bezel → 392×852 screen), same as Paper and the
		   Swiss phone, so every mobile slide is an identical physical device. */
		width: 414px;
		max-width: 100%;
		padding: 11px;
		border-radius: 46px;
		background: #241f31;
		box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
	}
	.rz-screen {
		/* Fixed device height (not content-driven) so the phone is a real device, not a box
		   that shrinks to its content; flex column with the bottom nav pinned down, so shorter
		   content just leaves breathing room above the nav. */
		position: relative;
		height: 852px;
		display: flex;
		flex-direction: column;
		border-radius: 36px;
		overflow: hidden;
		color: var(--riso-ink);
		font-family: var(--riso-font);
		/* paper ground with the fine grain multiplied/screened in like ink tooth */
		background-color: var(--riso-paper);
		background-image: var(--riso-grain);
		background-size: 90px 90px;
		background-blend-mode: var(--riso-grain-blend);
	}
	/* Heavier grain laid OVER the whole screen — including the (true-colour) food photo — so
	   the printed tooth carries the Riso character that the un-duotoned food can't. Coarser +
	   stronger than the base paper grain; multiplied in over everything. */
	.rz-screen::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 2;
		pointer-events: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.55'/%3E%3C/svg%3E");
		background-size: 120px 120px;
		mix-blend-mode: multiply;
		opacity: 0.85;
	}
	.rz-status {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 18px 20px 0;
		font-family: var(--riso-font-mono);
		font-size: 11px;
	}
	.rz-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 20px 14px;
	}
	.rz-brand {
		font-size: 24px;
		font-weight: 700;
		letter-spacing: -0.01em;
	}
	.rz-hero {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		height: 220px;
		padding: 16px;
		overflow: hidden;
		background: var(--riso-paper);
	}
	/* FOOD stays true-colour — duotone makes it unappetizing and unrecognizable. Just a light
	   "printed push" (a touch more contrast + saturation) so it sits in the print world while
	   reading, instantly, as food. Duotone is reserved for the Riso dark editorial slide. */
	.rz-hero-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: contrast(1.06) saturate(1.1);
	}
	.rz-hero::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(20, 16, 31, 0.6), transparent 55%);
		pointer-events: none;
	}
	.rz-tag {
		position: relative;
		z-index: 1;
		align-self: flex-start;
		margin-bottom: auto;
		padding: 4px 8px;
		font-family: var(--riso-font-mono);
		font-size: 11px;
		letter-spacing: 0.04em;
		color: var(--riso-ink);
		background: var(--riso-paper);
	}
	.rz-hero-title {
		position: relative;
		z-index: 1;
		margin: 0;
		max-width: 80%;
		font-size: 30px;
		font-weight: 700;
		line-height: 1.04;
		letter-spacing: -0.01em;
		color: #f5f0e8;
	}
	.rz-content {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 18px 20px 0;
	}
	.rz-desc {
		margin: 0;
		font-size: 14px;
		line-height: 1.5;
		color: var(--riso-ink-soft);
	}
	.rz-actions {
		display: flex;
		align-items: stretch; /* Badge grows to the Button's height so adjacent they line up */
		gap: 10px;
	}
	/* The Badge sits next to the Button here, so match its height (stretch) and re-centre its
	   label — a consumer-style local alignment, like the card borders. */
	.rz-actions :global(.riso-badge) {
		display: inline-flex;
		align-items: center;
	}
	.rz-label {
		margin-top: 2px;
		font-family: var(--riso-font-mono);
		font-size: 11px;
		letter-spacing: 0.1em;
		color: var(--riso-ink-soft);
	}
	.rz-list {
		display: flex;
		flex-direction: column;
	}
	.rz-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 0;
		border-top: var(--riso-border-width) solid var(--riso-line);
	}
	.rz-thumb {
		width: 52px;
		height: 52px;
		flex-shrink: 0;
		overflow: hidden;
		background: var(--riso-paper);
	}
	.rz-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: contrast(1.06) saturate(1.1);
	}
	.rz-row-text {
		display: flex;
		flex-direction: column;
		gap: 3px;
		flex: 1;
		min-width: 0;
	}
	.rz-row-title {
		font-size: 16px;
		font-weight: 700;
	}
	.rz-row-meta {
		font-family: var(--riso-font-mono);
		font-size: 11px;
		letter-spacing: 0.04em;
		color: var(--riso-ink-soft);
	}
	.rz-arrow {
		font-size: 18px;
		color: var(--riso-accent-text);
	}
	.rz-nav {
		display: flex;
		align-items: flex-start;
		justify-content: space-around;
		margin-top: auto;
		padding: 14px 16px 24px;
		border-top: var(--riso-border-width) solid var(--riso-line);
	}
	.rz-nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		width: 64px;
		font-family: var(--riso-font-mono);
		font-size: 10px;
		letter-spacing: 0.06em;
		color: var(--riso-ink-soft);
	}
	.rz-nav-item.on {
		color: var(--riso-accent-text);
	}
</style>
