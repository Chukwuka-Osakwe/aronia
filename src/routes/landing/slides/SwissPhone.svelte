<script lang="ts">
	// The Swiss "The Dispatch" news phone, built from the real --swiss-* tokens. `theme`
	// flips color-scheme so every light-dark() pair resolves its half (white ↔ off-black
	// stock, near-black ↔ off-white ink, hairlines, orange accent-text lightens on dark).
	// The hazard-orange accent + ink-on-orange are constant (the on-spot rule).
	import { swiss } from '$lib/index.js';

	const { Link } = swiss;

	let { theme = 'light' }: { theme?: 'light' | 'dark' } = $props();

	// Swiss media treatment = clean editorial GRAYSCALE (no duotone/gimmick), applied to real
	// press photos in the story thumbnails.
	const stories = [
		{ kicker: 'BUSINESS', title: 'Chipmaker lifts forecast on AI demand surge', ago: '2h ago', img: '/landing/hero/img/dispatch-biz.jpg' },
		{ kicker: 'TECHNOLOGY', title: 'The quiet return of the small, focused team', ago: '4h ago', img: '/landing/hero/img/dispatch-tech.jpg' },
		{ kicker: 'CULTURE', title: 'A new wave of type designers rethink the grid', ago: '5h ago', img: '/landing/hero/img/dispatch-cult.jpg' }
	];
</script>

<div class="sw-bezel">
	<div class="sw-screen" data-theme={theme}>
		<div class="sw-head">
			<div class="sw-status">
				<span>9:41</span>
				<span>● ● ●&nbsp;&nbsp;▰▰▰</span>
			</div>
			<div class="sw-masthead">
				<span class="sw-title">The Dispatch</span>
				<span class="sw-date">TUE 14 MAY</span>
			</div>
			<div class="sw-rule"></div>
		</div>
		<nav class="sw-tabs">
			<Link variant="nav" active href="#">Top</Link>
			<Link variant="nav" href="#">World</Link>
			<Link variant="nav" href="#">Business</Link>
			<Link variant="nav" href="#">Tech</Link>
			<Link variant="nav" href="#">Culture</Link>
		</nav>
		<div class="sw-lead">
			<span class="sw-kicker">WORLD · ANALYSIS</span>
			<h3 class="sw-headline">Central banks signal a slower path on rates as markets steady</h3>
			<p class="sw-body">
				Investors welcomed the measured tone, but analysts warned the reprieve could prove brief
				if inflation data surprises later this week.
			</p>
			<div class="sw-byline">
				<span class="sw-author">By Lena Ortiz</span>
				<span class="sw-bullet"></span>
				<span class="sw-read">6 min read</span>
			</div>
		</div>
		<div class="sw-list">
			{#each stories as s (s.kicker)}
				<div class="sw-story">
					<div class="sw-story-text">
						<span class="sw-story-kicker">{s.kicker}</span>
						<span class="sw-story-title">{s.title}</span>
						<span class="sw-story-ago">{s.ago}</span>
					</div>
					<div class="sw-thumb"><img src={s.img} alt="" /></div>
				</div>
			{/each}
		</div>
		<nav class="sw-nav">
			<span class="sw-nav-item on">
				<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2">
					<rect x="3" y="4" width="16" height="14" /><path d="M6.5 8.5h6M6.5 12h9M6.5 15h5" />
				</svg>
				<span>TODAY</span>
			</span>
			<span class="sw-nav-item">
				<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2">
					<rect x="3.5" y="3.5" width="6" height="6" /><rect x="12.5" y="3.5" width="6" height="6" /><rect x="3.5" y="12.5" width="6" height="6" /><rect x="12.5" y="12.5" width="6" height="6" />
				</svg>
				<span>SECTIONS</span>
			</span>
			<span class="sw-nav-item">
				<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M5 3.5h12v15l-6-4-6 4z" />
				</svg>
				<span>SAVED</span>
			</span>
			<span class="sw-nav-item">
				<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="11" cy="7" r="4" /><path d="M4 19c0-4 3.5-6 7-6s7 2 7 6" />
				</svg>
				<span>YOU</span>
			</span>
		</nav>
	</div>
</div>

<style>
	.sw-bezel {
		/* The real device frame — 414×874 (11px bezel → 392×852 screen), same as Paper and the
		   Riso phone, so every mobile slide is an identical physical device. */
		width: 414px;
		max-width: 100%;
		padding: 11px;
		border-radius: 46px;
		background: #141414;
		box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
	}
	.sw-screen {
		/* Fixed device height so every phone slide matches (not content-driven) — flex column
		   with the bottom nav pinned down. */
		height: 852px;
		display: flex;
		flex-direction: column;
		border-radius: 36px;
		overflow: hidden;
		background: var(--swiss-paper);
		color: var(--swiss-ink);
		font-family: var(--swiss-font);
	}
	.sw-head {
		display: flex;
		flex-direction: column;
		padding: 22px 20px 0;
	}
	.sw-status {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 14px;
		font-size: 12px;
		font-weight: 500;
	}
	.sw-masthead {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		padding: 8px 0 12px;
	}
	.sw-title {
		font-size: 26px;
		font-weight: 700;
		letter-spacing: -0.02em;
	}
	.sw-date {
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.08em;
		color: var(--swiss-ink-soft);
	}
	.sw-rule {
		height: 2px;
		background: var(--swiss-ink);
	}
	.sw-tabs {
		display: flex;
		align-items: flex-end;
		gap: 20px;
		padding: 13px 20px 0;
		border-bottom: 1px solid var(--swiss-line);
	}
	.sw-lead {
		display: flex;
		flex-direction: column;
		gap: 11px;
		padding: 20px;
		border-bottom: 1px solid var(--swiss-line);
	}
	.sw-kicker {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: var(--swiss-accent-text);
	}
	.sw-headline {
		margin: 0;
		font-size: 27px;
		font-weight: 700;
		line-height: 1.12;
		letter-spacing: -0.02em;
	}
	.sw-body {
		margin: 0;
		font-size: 15px;
		line-height: 1.45;
		color: var(--swiss-ink-soft);
	}
	.sw-byline {
		display: flex;
		align-items: center;
		gap: 8px;
		padding-top: 2px;
		font-size: 13px;
	}
	.sw-author {
		font-weight: 500;
	}
	.sw-bullet {
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: var(--swiss-ink-soft);
	}
	.sw-read {
		color: var(--swiss-ink-soft);
	}
	.sw-list {
		display: flex;
		flex-direction: column;
	}
	.sw-story {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		padding: 15px 20px;
		border-bottom: 1px solid var(--swiss-line);
	}
	.sw-story-text {
		display: flex;
		flex-direction: column;
		gap: 5px;
		flex: 1;
		min-width: 0;
	}
	.sw-story-kicker {
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.1em;
		color: var(--swiss-ink-soft);
	}
	.sw-story-title {
		font-size: 16px;
		font-weight: 700;
		line-height: 1.2;
		letter-spacing: -0.01em;
	}
	.sw-story-ago {
		font-size: 12px;
		color: var(--swiss-ink-soft);
	}
	.sw-thumb {
		width: 74px;
		height: 74px;
		flex-shrink: 0;
		overflow: hidden;
		border-radius: var(--swiss-radius);
		background: var(--swiss-muted);
		border: 1px solid var(--swiss-line);
	}
	.sw-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(1) contrast(1.05);
	}
	.sw-nav {
		display: flex;
		align-items: flex-start;
		justify-content: space-around;
		margin-top: auto;
		padding: 16px 18px 26px;
		border-top: 1px solid var(--swiss-line);
	}
	.sw-nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		width: 72px;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.09em;
		color: var(--swiss-ink-soft);
	}
	.sw-nav-item.on {
		color: var(--swiss-accent-text);
	}
</style>
