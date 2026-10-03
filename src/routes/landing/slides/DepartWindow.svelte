<script lang="ts">
	// Swiss "Depart" departures board (desktop, DARK). Leans into Swiss design's actual heritage
	// — wayfinding / transit signage (Helvetica came from that world). Hairline-ruled rows, a
	// tabular clock, hazard-orange status. Real aronia components carry the nav: filter <Link>s
	// + a "LIVE" <Badge>. data-theme="dark" flips the palette to off-white ink on off-black stock.
	// No media — a board is pure type + data, which is exactly where Swiss shines.
	import { swiss } from '$lib/index.js';

	const { Link, Badge } = swiss;

	const rows = [
		{ time: '14:38', dest: 'Edinburgh Waverley', via: 'York · Newcastle', plat: '4', status: 'Boarding', k: 'go' },
		{ time: '14:45', dest: 'Leeds', via: 'Peterborough · Wakefield', plat: '7', status: 'On time', k: 'ok' },
		{ time: '14:52', dest: 'Cambridge', via: 'Stevenage', plat: '9', status: 'On time', k: 'ok' },
		{ time: '15:03', dest: 'York', via: 'Peterborough', plat: '2', status: 'Delayed 08m', k: 'bad' },
		{ time: '15:10', dest: 'Newcastle', via: 'Durham', plat: '5', status: 'On time', k: 'ok' },
		{ time: '15:18', dest: 'Peterborough', via: '—', plat: '8', status: 'Cancelled', k: 'bad' },
		{ time: '15:24', dest: 'Leeds', via: 'Wakefield', plat: '6', status: 'On time', k: 'ok' }
	];
</script>

<div class="dp-window" data-theme="dark">
	<header class="dp-top">
		<div class="dp-brand">
			<span class="dp-title">Departures</span>
			<span class="dp-station">London · King's Cross</span>
		</div>
		<div class="dp-top-right">
			<Badge variant="accent" shape="square"><span class="dp-live-dot"></span>LIVE</Badge>
			<span class="dp-clock">14:32</span>
		</div>
	</header>
	<nav class="dp-tabs">
		<Link variant="nav" active href="#">All</Link>
		<Link variant="nav" href="#">Trains</Link>
		<Link variant="nav" href="#">Underground</Link>
		<Link variant="nav" href="#">Bus</Link>
	</nav>
	<div class="dp-board">
		<div class="dp-colhead">
			<span>Time</span>
			<span>Destination</span>
			<span>Plat</span>
			<span>Status</span>
		</div>
		{#each rows as r (r.time + r.dest)}
			<div class="dp-row">
				<span class="dp-time">{r.time}</span>
				<div class="dp-dest">
					<span class="dp-dest-name">{r.dest}</span>
					<span class="dp-via">via {r.via}</span>
				</div>
				<span class="dp-plat">{r.plat}</span>
				<span class="dp-status" data-k={r.k}>{r.status}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.dp-window {
		width: 980px;
		max-width: 100%;
		font-family: var(--swiss-font);
		color: var(--swiss-ink);
		background: var(--swiss-paper);
		border: 1px solid var(--swiss-line);
		border-radius: var(--swiss-radius);
		overflow: hidden;
	}
	.dp-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 24px;
		border-bottom: 2px solid var(--swiss-ink);
	}
	.dp-brand {
		display: flex;
		align-items: baseline;
		gap: 14px;
	}
	.dp-title {
		font-size: 26px;
		font-weight: 700;
		letter-spacing: -0.02em;
	}
	.dp-station {
		font-size: 14px;
		font-weight: 500;
		color: var(--swiss-ink-soft);
	}
	.dp-top-right {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.dp-top-right :global(.swiss-badge) {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.dp-live-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: currentColor;
	}
	.dp-clock {
		font-size: 30px;
		font-weight: 700;
		letter-spacing: 0.01em;
		font-variant-numeric: tabular-nums;
	}
	.dp-tabs {
		display: flex;
		gap: 22px;
		padding: 12px 24px 0;
		border-bottom: 1px solid var(--swiss-line);
	}
	.dp-board {
		padding: 6px 24px 20px;
	}
	.dp-colhead,
	.dp-row {
		display: grid;
		grid-template-columns: 86px 1fr 70px 150px;
		align-items: center;
		gap: 16px;
	}
	.dp-colhead {
		padding: 12px 0 10px;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--swiss-ink-soft);
	}
	.dp-row {
		padding: 13px 0;
		border-top: 1px solid var(--swiss-line);
	}
	.dp-time {
		font-size: 22px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}
	.dp-dest {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	.dp-dest-name {
		font-size: 17px;
		font-weight: 700;
		letter-spacing: -0.01em;
	}
	.dp-via {
		font-size: 12px;
		color: var(--swiss-ink-soft);
	}
	.dp-plat {
		font-size: 20px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}
	.dp-status {
		font-size: 14px;
		font-weight: 600;
		color: var(--swiss-ink-soft);
	}
	.dp-status[data-k='go'] {
		color: var(--swiss-accent-text);
	}
	.dp-status[data-k='bad'] {
		color: var(--swiss-danger-ink);
	}
</style>
