<script lang="ts">
	// Glassmorphism "Halo" weather app (mobile, LIGHT). Glass in its natural light habitat:
	// frosted cards floating on a bright sky gradient, so the backdrop-filter has vivid colour
	// to refract. The frosted panels are real aronia <Card>s; a <Badge> carries the "feels like".
	// Weather apps are icon/data, not photos, so there's no media treatment here. data-theme
	// unset → the light half of every --glass-* token resolves (dark ink on light frost).
	import { glassmorphism } from '$lib/index.js';

	const { Card, Badge } = glassmorphism;

	const hourly = [
		{ t: 'Now', temp: '64°', k: 'partly' },
		{ t: '1PM', temp: '65°', k: 'partly' },
		{ t: '2PM', temp: '66°', k: 'cloud' },
		{ t: '3PM', temp: '63°', k: 'cloud' },
		{ t: '4PM', temp: '61°', k: 'rain' },
		{ t: '5PM', temp: '59°', k: 'rain' }
	];
	const daily = [
		{ d: 'Today', k: 'partly', lo: '57°', hi: '68°', from: 42, to: 82 },
		{ d: 'Tue', k: 'sun', lo: '55°', hi: '71°', from: 38, to: 92 },
		{ d: 'Wed', k: 'cloud', lo: '56°', hi: '65°', from: 44, to: 74 },
		{ d: 'Thu', k: 'rain', lo: '54°', hi: '61°', from: 36, to: 62 },
		{ d: 'Fri', k: 'partly', lo: '55°', hi: '67°', from: 40, to: 78 }
	];
</script>

{#snippet wicon(kind: string)}
	{#if kind === 'sun'}
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
			<circle cx="12" cy="12" r="4.5" />
			<path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
		</svg>
	{:else if kind === 'cloud'}
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
			<path d="M7 18h9.5a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 7.2 9.7 3.6 3.6 0 0 0 7 18z" />
		</svg>
	{:else if kind === 'partly'}
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="8" cy="8" r="3" />
			<path d="M8 1.5v1.5M1.5 8H3M3.4 3.4l1 1M12.6 3.4l-1 1" />
			<path d="M9 19h8a3 3 0 0 0 .2-6A4.2 4.2 0 0 0 9.3 11.5 3 3 0 0 0 9 19z" />
		</svg>
	{:else}
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
			<path d="M7 15h9.5a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 7.2 6.7 3.6 3.6 0 0 0 7 15z" />
			<path d="M8.5 18.5l-1 2M12 18.5l-1 2M15.5 18.5l-1 2" />
		</svg>
	{/if}
{/snippet}

<div class="hl-bezel">
	<div class="hl-screen">
		<div class="hl-status">
			<span>9:41</span>
			<span>● ● ●&nbsp;&nbsp;▰▰▰</span>
		</div>
		<header class="hl-head">
			<span class="hl-loc">San Francisco</span>
			<div class="hl-temp">64°</div>
			<span class="hl-cond">Mostly Cloudy</span>
			<div class="hl-hilo">
				<span>H:68°</span><span>L:57°</span>
				<Badge variant="muted" shape="pill">Feels like 61°</Badge>
			</div>
		</header>

		<Card variant="surface" --glass-card-max-width="none">
			<div class="hl-hourly">
				{#each hourly as h (h.t)}
					<div class="hl-hour">
						<span class="hl-hour-t">{h.t}</span>
						<span class="hl-ico">{@render wicon(h.k)}</span>
						<span class="hl-hour-temp">{h.temp}</span>
					</div>
				{/each}
			</div>
		</Card>

		<Card variant="surface" --glass-card-max-width="none">
			<div class="hl-daily">
				{#each daily as d (d.d)}
					<div class="hl-day">
						<span class="hl-day-name">{d.d}</span>
						<span class="hl-ico sm">{@render wicon(d.k)}</span>
						<span class="hl-day-lo">{d.lo}</span>
						<span class="hl-bar"><span class="hl-bar-fill" style="left: {d.from}%; right: {100 - d.to}%"></span></span>
						<span class="hl-day-hi">{d.hi}</span>
					</div>
				{/each}
			</div>
		</Card>

		<div class="hl-stats">
			<Card variant="surface" --glass-card-max-width="none">
				<div class="hl-stat">
					<span class="hl-stat-lbl">WIND</span>
					<span class="hl-stat-num">8<small>mph</small></span>
					<span class="hl-stat-sub">NW breeze</span>
				</div>
			</Card>
			<Card variant="surface" --glass-card-max-width="none">
				<div class="hl-stat">
					<span class="hl-stat-lbl">HUMIDITY</span>
					<span class="hl-stat-num">72<small>%</small></span>
					<span class="hl-stat-sub">Dew pt 54°</span>
				</div>
			</Card>
		</div>
	</div>
</div>

<style>
	.hl-bezel {
		width: 414px;
		max-width: 100%;
		padding: 11px;
		border-radius: 46px;
		background: #141414;
		box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
	}
	.hl-screen {
		height: 852px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 22px 16px;
		border-radius: 36px;
		overflow: hidden;
		font-family: var(--glass-font);
		color: var(--glass-ink);
		/* bright daytime sky — the colour the frost refracts */
		background: linear-gradient(170deg, #4a91d9 0%, #7fb5e6 42%, #cfe3f5 100%);
	}
	.hl-status {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 12px;
		font-weight: 600;
	}
	.hl-head {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: 8px 0 6px;
	}
	.hl-loc {
		font-size: 20px;
		font-weight: 600;
	}
	.hl-temp {
		font-size: 76px;
		font-weight: 200;
		line-height: 1.05;
		letter-spacing: -0.02em;
	}
	.hl-cond {
		font-size: 15px;
		color: var(--glass-ink-soft);
	}
	.hl-hilo {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 4px;
		font-size: 14px;
		font-weight: 600;
	}
	.hl-hourly {
		display: flex;
		justify-content: space-between;
	}
	.hl-hour {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.hl-hour-t {
		font-size: 12px;
		color: var(--glass-ink-soft);
	}
	.hl-hour-temp {
		font-size: 15px;
		font-weight: 600;
	}
	.hl-ico {
		display: inline-flex;
		width: 24px;
		height: 24px;
	}
	.hl-ico.sm {
		width: 20px;
		height: 20px;
	}
	.hl-ico :global(svg) {
		width: 100%;
		height: 100%;
	}
	.hl-daily {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.hl-day {
		display: grid;
		grid-template-columns: 52px 22px 36px 1fr 36px;
		align-items: center;
		gap: 10px;
	}
	.hl-day-name {
		font-size: 15px;
		font-weight: 600;
	}
	.hl-day-lo {
		font-size: 14px;
		color: var(--glass-ink-soft);
		text-align: right;
	}
	.hl-day-hi {
		font-size: 14px;
		font-weight: 600;
		text-align: right;
	}
	.hl-bar {
		position: relative;
		height: 5px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--glass-ink) 14%, transparent);
	}
	.hl-bar-fill {
		position: absolute;
		top: 0;
		bottom: 0;
		border-radius: 999px;
		background: linear-gradient(90deg, #4aa3e0, #f5c451);
	}
	.hl-stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}
	.hl-stat {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.hl-stat-lbl {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: var(--glass-ink-soft);
	}
	.hl-stat-num {
		font-size: 30px;
		font-weight: 600;
	}
	.hl-stat-num small {
		font-size: 14px;
		font-weight: 500;
		color: var(--glass-ink-soft);
	}
	.hl-stat-sub {
		font-size: 12px;
		color: var(--glass-ink-soft);
	}
</style>
