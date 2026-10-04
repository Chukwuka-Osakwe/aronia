<script lang="ts">
	// Neo-Brutalism "Tally" dashboard (dark). The app CHROME (window frame, topbar, sidebar
	// rail, chart) is hand-built — there are no components for those — but every element that
	// maps to a real aronia component IS one: the stat tiles + chart panel are real <Card>s
	// (border-only, no offset shadow — that's a Button thing, not a card thing), the actions
	// are real <Button>s, the nav items are real nav <Link>s. So the slide is genuinely built
	// with aronia. data-theme="dark" flips every light-dark() token to its dark half.
	// The ▲/▼ deltas are custom semantic chips: NB Badge has no success/warning variant
	// (it's brand-coloured), so a +/- signal uses the --nb-success/--nb-warning status tokens.
	import { neoBrutalism } from '$lib/index.js';

	const { Card, Button, Link } = neoBrutalism;

	const bars = [40, 52, 46, 64, 54, 70, 60, 78, 66, 84, 72, 92];
	const menu = ['Overview', 'Revenue', 'Customers', 'Reports', 'Settings'];
	const stats = [
		{ label: 'Revenue', sw: 'yellow', num: '$48.2k', delta: '▲ 12.4%', dir: 'up' },
		{ label: 'New customers', sw: 'cyan', num: '1,284', delta: '▲ 8.1%', dir: 'up' },
		{ label: 'Churn', sw: 'pink', num: '2.3%', delta: '▼ 0.4%', dir: 'down' }
	];
</script>

<div class="nb-window" data-theme="dark">
	<header class="nb-top">
		<div class="nb-brand">
			<span class="nb-wordmark">Tally</span>
			<nav class="nb-topnav">
				<Link variant="nav" active href="#">Overview</Link>
				<Link variant="nav" href="#">Revenue</Link>
				<Link variant="nav" href="#">Customers</Link>
			</nav>
		</div>
		<div class="nb-top-right">
			<Button variant="primary" size="sm">+ New report</Button>
			<span class="nb-avatar"></span>
		</div>
	</header>
	<div class="nb-body">
		<aside class="nb-side">
			<span class="nb-menu-label">MENU</span>
			{#each menu as item, i (item)}
				<Link variant="nav" active={i === 0} href="#">{item}</Link>
			{/each}
		</aside>
		<main class="nb-main">
			<div class="nb-main-head">
				<div>
					<h3 class="nb-h">Revenue overview</h3>
					<p class="nb-subcopy">Last 30 days · updated 2h ago</p>
				</div>
				<div class="nb-main-actions">
					<Button variant="muted" size="sm">This month ▾</Button>
					<Button variant="primary" size="sm">Export</Button>
				</div>
			</div>
			<div class="nb-stats">
				{#each stats as s (s.label)}
					<Card --nb-card-max-width="none">
						<div class="nb-stat">
							<div class="nb-stat-top">
								<span>{s.label}</span>
								<span class="nb-sw {s.sw}"></span>
							</div>
							<div class="nb-stat-num">{s.num}</div>
							<span class="nb-delta {s.dir}">{s.delta}</span>
						</div>
					</Card>
				{/each}
			</div>
			<Card --nb-card-max-width="none">
				<div class="nb-chart">
					<div class="nb-chart-head">
						<span class="nb-chart-title">Monthly revenue</span>
						<span class="nb-legend">
							<span class="nb-sw yellow"></span>2024
							<span class="nb-sw white"></span>2023
						</span>
					</div>
					<div class="nb-bars">
						{#each bars as h, i}
							<span class="nb-bar" class:last={i === bars.length - 1} style="height: {h}%"></span>
						{/each}
					</div>
				</div>
			</Card>
		</main>
	</div>
</div>

<style>
	.nb-window {
		/* Divider lines across the page (region rules + card borders) relax to 50% ink so the
		   dense dashboard doesn't read as a cage of full-strength rules; the window frame itself
		   keeps the full hard edge. Single source so they can't drift. */
		--nb-divider: color-mix(in srgb, var(--nb-ink) 50%, transparent);
		width: 880px;
		max-width: 100%;
		font-family: var(--nb-font);
		color: var(--nb-ink);
		background: var(--nb-paper);
		border: var(--nb-border);
		border-radius: var(--nb-radius);
		box-shadow: var(--nb-shadow-lg);
		overflow: hidden;
	}
	.nb-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 20px;
		border-bottom: var(--nb-border-width) solid var(--nb-divider);
	}
	.nb-brand {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.nb-wordmark {
		font-size: 20px;
		font-weight: 800;
	}
	.nb-topnav {
		display: flex;
		gap: 16px;
		margin-left: 8px;
		font-size: 14px;
	}
	.nb-top-right {
		display: flex;
		align-items: center;
		gap: 14px;
	}
	.nb-avatar {
		width: 30px;
		height: 30px;
		border-radius: 999px;
		background: var(--nb-secondary);
		border: var(--nb-border);
	}
	.nb-body {
		display: grid;
		grid-template-columns: 200px 1fr;
	}
	.nb-side {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 20px 16px;
		border-right: var(--nb-border-width) solid var(--nb-divider);
	}
	.nb-menu-label {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.1em;
		opacity: 0.5;
	}
	.nb-main {
		display: flex;
		flex-direction: column;
		gap: 18px;
		padding: 20px;
	}
	.nb-main-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}
	.nb-h {
		margin: 0;
		font-size: 24px;
		font-weight: 800;
		letter-spacing: -0.01em;
	}
	.nb-subcopy {
		margin: 4px 0 0;
		font-size: 13px;
		font-weight: 600;
		opacity: 0.6;
	}
	.nb-main-actions {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	/* A consumer-style local override (border-color is trivially overridable): adjacent full-ink
	   card borders read heavy/doubled in a dense dashboard, so drop them to the same 50% divider
	   ink as the region rules. The systemic version (context-aware border weight) is deferred to
	   the composition pass — see OPEN_THREADS #9; not worth building as a component feature. */
	.nb-main :global(.nb-card) {
		border-color: var(--nb-divider);
	}

	.nb-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 14px;
	}
	/* Stat content lives INSIDE a real <Card> (border-only); this is just the inner layout. */
	.nb-stat {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.nb-stat-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 13px;
		font-weight: 700;
	}
	.nb-sw {
		display: inline-block;
		width: 16px;
		height: 16px;
		border: 2px solid var(--nb-ink);
	}
	.nb-sw.yellow {
		background: var(--nb-primary);
	}
	.nb-sw.cyan {
		background: var(--nb-secondary);
	}
	.nb-sw.pink {
		background: var(--nb-accent);
	}
	.nb-sw.white {
		background: var(--nb-paper);
	}
	.nb-stat-num {
		font-size: 30px;
		font-weight: 800;
		letter-spacing: -0.02em;
	}
	/* Semantic delta chip — NOT a Badge (Badge is brand-coloured); a +/- signal uses the
	   status tokens, carrying the constant on-spot dark text like every saturated NB fill. */
	.nb-delta {
		align-self: flex-start;
		padding: 3px 7px;
		font-size: 12px;
		font-weight: 800;
		color: var(--nb-on-spot);
		border: 2px solid var(--nb-ink);
	}
	.nb-delta.up {
		background: var(--nb-success);
	}
	.nb-delta.down {
		background: var(--nb-warning);
	}
	.nb-chart {
		display: flex;
		flex-direction: column;
	}
	.nb-chart-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 14px;
	}
	.nb-chart-title {
		font-size: 16px;
		font-weight: 800;
	}
	.nb-legend {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		font-weight: 700;
	}
	.nb-legend .nb-sw {
		width: 14px;
		height: 14px;
	}
	.nb-bars {
		display: flex;
		align-items: flex-end;
		gap: 10px;
		height: 160px;
	}
	.nb-bar {
		flex: 1;
		background: var(--nb-primary);
		border: var(--nb-border);
	}
	.nb-bar.last {
		background: var(--nb-secondary);
	}
</style>
