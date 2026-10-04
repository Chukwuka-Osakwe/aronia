<script lang="ts">
	// Glassmorphism "Pulse" fitness tablet (dark). The frosted panels are real aronia <Card>s
	// (they carry backdrop-filter + the white rim + the dark-mode film themselves), the CTA is a
	// real <Button>, the streak chip is a real <Badge>. Only true chrome stays hand-built: the
	// tablet bezel, the app's dark mesh backdrop, the activity ring, the avatar and the icon.
	// data-theme="dark" flips every --glass-* token to its dark half so the films go faint.
	// (The slide is baked to a flat image for the marquee, so the blur has no runtime cost.)
	import { glassmorphism } from '$lib/index.js';

	const { Card, Button, Badge } = glassmorphism;
</script>

<div class="glass-tablet" data-theme="dark">
	<div class="glass-screen">
		<div class="glass-dash">
			<header class="glass-head">
				<div>
					<h3 class="glass-h">Good morning, Masaya</h3>
					<p class="glass-sub">Tuesday, 14 May</p>
				</div>
				<div class="glass-head-right">
					<Badge variant="muted" shape="pill">
						<span class="glass-dot"></span>12-day streak
					</Badge>
					<span class="glass-avatar">MR</span>
				</div>
			</header>
			<div class="glass-grid">
				<Card variant="surface">
					<div class="glass-activity">
						<div class="glass-panel-head">
							<span class="glass-panel-title">Activity</span>
							<span class="glass-muted-text">Today</span>
						</div>
						<div class="glass-ring-wrap">
							<div class="glass-ring"></div>
							<div class="glass-ring-center">
								<span class="glass-ring-pct">78%</span>
								<span class="glass-ring-label">of move goal</span>
							</div>
						</div>
						<div class="glass-metrics">
							<div><span class="glass-metric-num">520</span><span class="glass-metric-lbl">MOVE KCAL</span></div>
							<div><span class="glass-metric-num">42</span><span class="glass-metric-lbl">EXERCISE MIN</span></div>
							<div><span class="glass-metric-num">10</span><span class="glass-metric-lbl">STAND HRS</span></div>
						</div>
					</div>
				</Card>
				<div class="glass-col">
					<div class="glass-stat-row">
						<Card variant="surface">
							<div class="glass-mini">
								<span class="glass-muted-text">Steps</span>
								<span class="glass-mini-num">8,420</span>
								<span class="glass-up">+14% vs avg</span>
							</div>
						</Card>
						<Card variant="surface">
							<div class="glass-mini">
								<span class="glass-muted-text">Resting HR</span>
								<span class="glass-mini-num">58 bpm</span>
								<span class="glass-muted-text">Steady this week</span>
							</div>
						</Card>
					</div>
					<div class="glass-workout-cell">
						<Card variant="surface">
							<div class="glass-workout">
								<div class="glass-workout-top">
									<div>
										<span class="glass-eyebrow">NEXT WORKOUT</span>
										<span class="glass-workout-title">Full Body Strength</span>
										<span class="glass-muted-text">45 min · Intermediate · 12 moves</span>
									</div>
									<span class="glass-icon" aria-hidden="true">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
											<path d="M6.5 6.5v11M17.5 6.5v11M4 9v6M20 9v6M6.5 12h11" />
										</svg>
									</span>
								</div>
								<div class="glass-workout-foot">
									<span class="glass-muted-text">3 of 5 sessions this week</span>
									<Button variant="primary">Start workout</Button>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.glass-tablet {
		width: 920px;
		max-width: 100%;
		padding: 14px;
		border-radius: 30px;
		background: #0c0c16;
		box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
		font-family: var(--glass-font);
	}
	.glass-screen {
		border-radius: 18px;
		overflow: hidden;
		background:
			radial-gradient(120% 120% at 0% 0%, #5b3fd6 0%, transparent 55%),
			radial-gradient(120% 120% at 100% 100%, #c0397f 0%, transparent 55%),
			linear-gradient(135deg, #3a2a7a, #241f4a);
	}
	.glass-dash {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 24px;
		color: var(--glass-ink);
	}
	.glass-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.glass-h {
		margin: 0;
		font-size: 22px;
		font-weight: 700;
	}
	.glass-sub {
		margin: 3px 0 0;
		font-size: 13px;
		color: var(--glass-ink-soft);
	}
	/* Streak Badge + avatar sit together; stretch the row so the Badge matches the avatar's
	   height, and centre the Badge's dot + label on one line. */
	.glass-head-right {
		display: flex;
		align-items: stretch;
		gap: 12px;
	}
	.glass-head-right :global(.glass-badge) {
		display: inline-flex;
		align-items: center;
		gap: 7px;
	}
	.glass-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #f5c451;
	}
	.glass-avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		font-size: 13px;
		font-weight: 600;
		border-radius: 50%;
		color: #fff;
		background: linear-gradient(135deg, var(--glass-secondary), var(--glass-primary));
		border: var(--glass-border);
	}
	.glass-grid {
		display: grid;
		grid-template-columns: 1.3fr 1fr;
		gap: 16px;
		align-items: stretch;
	}
	.glass-panel-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.glass-panel-title {
		font-size: 15px;
		font-weight: 600;
	}
	.glass-muted-text {
		font-size: 12px;
		color: var(--glass-ink-soft);
	}
	/* Inner layouts — the frost/border/shadow all come from the real Card now. */
	.glass-activity {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}
	.glass-ring-wrap {
		position: relative;
		align-self: center;
		width: 180px;
		height: 180px;
		margin: 6px 0;
	}
	.glass-ring {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: conic-gradient(
			from -90deg,
			var(--glass-secondary),
			var(--glass-primary) 78%,
			rgba(255, 255, 255, 0.14) 78% 100%
		);
		-webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 15px), #000 calc(100% - 14px));
		mask: radial-gradient(farthest-side, transparent calc(100% - 15px), #000 calc(100% - 14px));
	}
	.glass-ring-center {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
	}
	.glass-ring-pct {
		font-size: 34px;
		font-weight: 700;
	}
	.glass-ring-label {
		font-size: 12px;
		color: var(--glass-ink-soft);
	}
	.glass-metrics {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		text-align: center;
	}
	.glass-metrics div {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	.glass-metric-num {
		font-size: 19px;
		font-weight: 700;
	}
	.glass-metric-lbl {
		font-size: 10px;
		letter-spacing: 0.06em;
		color: var(--glass-ink-soft);
	}
	.glass-col {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.glass-stat-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
	.glass-mini {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.glass-mini-num {
		font-size: 24px;
		font-weight: 700;
	}
	.glass-up {
		font-size: 12px;
		font-weight: 600;
		color: #4ade80;
	}
	/* The workout card fills the rest of the column so its bottom lines up with the Activity
	   card. The cell grows, the Card fills the cell, its body fills the Card, and the content
	   spreads so the CTA sits at the bottom. */
	.glass-workout-cell {
		flex: 1;
		display: flex;
	}
	.glass-workout-cell :global(.glass-card) {
		flex: 1;
	}
	.glass-workout-cell :global(.glass-card__body) {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.glass-workout {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 16px;
	}
	.glass-workout-top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
	}
	.glass-workout-top > div {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.glass-eyebrow {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.1em;
		color: var(--glass-ink-soft);
	}
	.glass-workout-title {
		font-size: 18px;
		font-weight: 700;
	}
	.glass-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		flex-shrink: 0;
		border-radius: var(--glass-radius-sm);
		color: var(--glass-ink);
		background: linear-gradient(135deg, var(--glass-secondary), var(--glass-primary));
	}
	.glass-workout-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
</style>
