<script lang="ts">
	// Risograph "Spindle" vinyl player (desktop, DARK). This is where Riso media goes LOUD:
	// album art is mapped through a full blue↔pink DUOTONE (#duo-two — the gig-poster variant),
	// which rips on editorial/music imagery exactly where it would have died on food. Real riso
	// components carry the UI: nav <Link>s (library + top), a <Badge> for the now-spinning tag,
	// a primary <Button> for play. data-theme="dark" flips the palette to print-on-plum-stock.
	import { risograph } from '$lib/index.js';

	const { Link, Button, Badge } = risograph;

	const queue = [
		{ title: 'Carbon Ribbon', artist: 'Kôsô', len: '3:58', img: '/landing/hero/img/spindle-1.jpg' },
		{ title: 'Paper Jam', artist: 'The Overprints', len: '4:12', img: '/landing/hero/img/spindle-2.jpg' },
		{ title: 'Registration Marks', artist: 'Aomi', len: '2:47', img: '/landing/hero/img/spindle-3.jpg' },
		{ title: 'Spot Colour', artist: 'Dup / Dup', len: '5:21', img: '/landing/hero/img/spindle-4.jpg' }
	];
</script>

<!-- Loud TRITONE so the photo reads through: luminance → dark-navy shadow (#0c1030) → vivid
     blue mid (#0a84d6) → fluoro-pink highlight (#ff47b0). Darks stay dark (subject emerges)
     instead of flattening to one bright blue; only the mids/highlights carry the loud colour. -->
<svg class="sp-defs" aria-hidden="true" focusable="false" width="0" height="0">
	<filter id="sp-duo" color-interpolation-filters="sRGB">
		<feColorMatrix
			type="matrix"
			values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0"
		/>
		<feComponentTransfer>
			<feFuncR type="table" tableValues="0.047 0.039 1" />
			<feFuncG type="table" tableValues="0.063 0.518 0.278" />
			<feFuncB type="table" tableValues="0.188 0.839 0.690" />
		</feComponentTransfer>
	</filter>
</svg>

<div class="sp-window" data-theme="dark">
	<header class="sp-top">
		<span class="sp-brand">Spindle</span>
		<nav class="sp-topnav">
			<Link variant="nav" active href="#">Listen Now</Link>
			<Link variant="nav" href="#">Browse</Link>
			<Link variant="nav" href="#">Radio</Link>
		</nav>
	</header>
	<div class="sp-body">
		<aside class="sp-side">
			<span class="sp-label">LIBRARY</span>
			<Link variant="nav" active href="#">Recently Added</Link>
			<Link variant="nav" href="#">Artists</Link>
			<Link variant="nav" href="#">Albums</Link>
			<span class="sp-label sp-label-gap">PLAYLISTS</span>
			<Link variant="nav" href="#">Late Pressings</Link>
			<Link variant="nav" href="#">Ink &amp; Dust</Link>
			<Link variant="nav" href="#">Night Shift</Link>
		</aside>
		<main class="sp-main">
			<section class="sp-now">
				<div class="sp-cover"><img src="/landing/hero/img/spindle-hero.jpg" alt="" /></div>
				<div class="sp-now-info">
					<Badge variant="accent" shape="square">NOW SPINNING</Badge>
					<h3 class="sp-track">Midnight Pressing</h3>
					<p class="sp-artist">The Overprints</p>
					<div class="sp-progress"><span class="sp-progress-fill"></span></div>
					<div class="sp-times"><span>1:42</span><span>3:58</span></div>
					<div class="sp-controls">
						<button class="sp-ctrl" type="button" aria-label="Previous">⏮</button>
						<Button variant="primary" shape="pill">► Play</Button>
						<button class="sp-ctrl" type="button" aria-label="Next">⏭</button>
					</div>
				</div>
			</section>
			<section class="sp-queue">
				<span class="sp-label">UP NEXT</span>
				{#each queue as q (q.title)}
					<div class="sp-row">
						<div class="sp-row-cover"><img src={q.img} alt="" /></div>
						<div class="sp-row-text">
							<span class="sp-row-title">{q.title}</span>
							<span class="sp-row-artist">{q.artist}</span>
						</div>
						<span class="sp-row-len">{q.len}</span>
					</div>
				{/each}
			</section>
		</main>
	</div>
</div>

<style>
	.sp-defs {
		position: absolute;
		width: 0;
		height: 0;
	}
	.sp-window {
		position: relative;
		width: 940px;
		max-width: 100%;
		font-family: var(--riso-font);
		color: var(--riso-ink);
		border: var(--riso-border-width) solid var(--riso-line);
		overflow: hidden;
		/* plum stock + grain screened in (dark print tooth) */
		background-color: var(--riso-paper);
		background-image: var(--riso-grain);
		background-size: 90px 90px;
		background-blend-mode: screen;
	}
	.sp-top {
		display: flex;
		align-items: center;
		gap: 28px;
		padding: 16px 22px;
		border-bottom: var(--riso-border-width) solid var(--riso-line);
	}
	.sp-brand {
		font-size: 22px;
		font-weight: 700;
		letter-spacing: -0.01em;
	}
	.sp-topnav {
		display: flex;
		gap: 18px;
		font-size: 14px;
	}
	.sp-body {
		display: grid;
		grid-template-columns: 190px 1fr;
	}
	.sp-side {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 9px;
		padding: 20px 18px;
		border-right: var(--riso-border-width) solid var(--riso-line);
	}
	.sp-label {
		font-family: var(--riso-font-mono);
		font-size: 10px;
		letter-spacing: 0.12em;
		color: var(--riso-ink-soft);
	}
	.sp-label-gap {
		margin-top: 10px;
	}
	.sp-main {
		display: flex;
		flex-direction: column;
		gap: 22px;
		padding: 22px;
	}
	.sp-now {
		display: flex;
		gap: 22px;
	}
	.sp-cover {
		width: 190px;
		height: 190px;
		flex-shrink: 0;
		overflow: hidden;
		border: var(--riso-border-width) solid var(--riso-ink);
	}
	.sp-cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		/* lift the dark source into the readable mid/highlight range before the tritone maps it */
		filter: brightness(1.3) contrast(1.08) url(#sp-duo);
	}
	.sp-now-info {
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
		min-width: 0;
	}
	.sp-track {
		margin: 6px 0 0;
		font-size: 30px;
		font-weight: 700;
		letter-spacing: -0.01em;
	}
	.sp-artist {
		margin: 0;
		font-size: 15px;
		color: var(--riso-ink-soft);
	}
	.sp-progress {
		margin-top: 10px;
		height: 4px;
		background: var(--riso-line);
	}
	.sp-progress-fill {
		display: block;
		width: 42%;
		height: 100%;
		background: var(--riso-accent);
	}
	.sp-times {
		display: flex;
		justify-content: space-between;
		font-family: var(--riso-font-mono);
		font-size: 11px;
		color: var(--riso-ink-soft);
	}
	.sp-controls {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-top: 8px;
	}
	.sp-ctrl {
		font: inherit;
		font-size: 20px;
		line-height: 1;
		padding: 0;
		border: none;
		background: transparent;
		color: var(--riso-ink);
		cursor: default;
	}
	.sp-queue {
		display: flex;
		flex-direction: column;
	}
	.sp-queue .sp-label {
		margin-bottom: 6px;
	}
	.sp-row {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 10px 0;
		border-top: var(--riso-border-width) solid var(--riso-line);
	}
	.sp-row-cover {
		width: 44px;
		height: 44px;
		flex-shrink: 0;
		overflow: hidden;
		border: var(--riso-border-width) solid var(--riso-ink);
	}
	.sp-row-cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		/* lift the dark source into the readable mid/highlight range before the tritone maps it */
		filter: brightness(1.3) contrast(1.08) url(#sp-duo);
	}
	.sp-row-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		min-width: 0;
	}
	.sp-row-title {
		font-size: 15px;
		font-weight: 700;
	}
	.sp-row-artist {
		font-size: 12px;
		color: var(--riso-ink-soft);
	}
	.sp-row-len {
		font-family: var(--riso-font-mono);
		font-size: 12px;
		color: var(--riso-ink-soft);
	}
</style>
