<script lang="ts">
	import { registry } from '../../registry.js';
	import NeoWindow from '../slides/NeoWindow.svelte';
	import GlassTablet from '../slides/GlassTablet.svelte';

	// §4 ROTATOR SPECIMENS — capture surface.
	// The plan (2026-09-19) settled the rotator's real specimen as the SAME aronia card,
	// restyled per family: same component, only the style changes, so the LOOK is the one
	// variable (rhymes with the Proof argument, reads in 3s, scales to 20). This page renders
	// exactly that — one identical card in each family — each on its OWN ground with room to
	// breathe, so the styles that live on a background (glass's gradient, riso's printed paper)
	// can actually shine rather than sit on flat white. Screenshot each `.stage` tile to fill
	// the rotator slot at hi-fi; the caption below each tile is a label, not part of the shot.
	const families = [
		{ id: 'swiss', name: 'Swiss' },
		{ id: 'neo-brutalism', name: 'Neo-Brutalism' },
		{ id: 'glassmorphism', name: 'Glassmorphism' },
		{ id: 'risograph', name: 'Risograph' }
	];
</script>

<div class="sheet">
	<p class="note">
		Rotator specimens — one identical card per family. Screenshot each tile (not its label).
	</p>

	<!-- HERO SLIDE specimens — the device mockups themselves live in reusable components
	     (../slides/*.svelte) so the hero marquee and this capture sheet share one source. The
	     component carries data-theme="dark"; the "world" ground is the container's job. -->
	<figure class="hero-specimen">
		<div class="hero-stage">
			<div class="hero-label">
				<span class="hero-label-title">Neo-Brutalism</span>
				<span class="hero-label-sub">DESKTOP · TALLY · ANALYTICS</span>
			</div>
			<NeoWindow />
		</div>
		<figcaption>Hero slide — Neo-Brutalism (desktop · Tally) · DARK</figcaption>
	</figure>

	<!-- Glass is the exception to "world stays": frost needs a dark backdrop to read, so the
	     WORLD darkens to a deep mesh too (and the tablet carries its own dark screen mesh). -->
	<figure class="hero-specimen">
		<div class="hero-stage glass-stage">
			<div class="hero-label glass-label">
				<span class="hero-label-title">Glassmorphism</span>
				<span class="hero-label-sub">TABLET · PULSE · FITNESS</span>
			</div>
			<GlassTablet />
		</div>
		<figcaption>Hero slide — Glassmorphism (tablet · Pulse) · DARK</figcaption>
	</figure>

	<div class="grid">
		{#each families as fam (fam.id)}
			{@const Card = registry[fam.id].card}
			{@const Button = registry[fam.id].button}
			{@const Badge = registry[fam.id].badge}
			<figure class="specimen">
				<div class="stage" data-style={fam.id}>
					<Card>
						{#snippet header()}
							<div class="specimen-head">
								<span class="specimen-title">This week</span>
								<Badge variant="accent">New</Badge>
							</div>
						{/snippet}
						<p class="specimen-body">
							A calm home for the week — plan it, keep what matters, let the rest go.
						</p>
						{#snippet footer()}
							<Button variant="ghost">Later</Button>
							<Button variant="primary">Open</Button>
						{/snippet}
					</Card>
				</div>
				<figcaption>{fam.name}</figcaption>
			</figure>
		{/each}
	</div>
</div>

<style>
	/* Dark backdrop so the light specimen tiles read as framed windows — the same way
	   they'll sit in the dark rotator slot on the landing page. */
	/* The docs shell pins `html { overflow: hidden }`, so this page owns its own scroll
	   (mirrors how the landing wireframe scrolls internally) — otherwise it just clips. */
	.sheet {
		height: 100vh;
		overflow-y: auto;
		background: #26272d;
		padding: 3rem clamp(1.5rem, 4vw, 4rem) 5rem;
		font-family: system-ui, sans-serif;
	}
	.note {
		max-width: 1100px;
		margin: 0 auto 2rem;
		color: #b7b8be;
		font-size: 0.9rem;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 2.5rem;
		max-width: 1100px;
		margin: 0 auto;
	}
	@media (max-width: 720px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}

	.specimen {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	figcaption {
		color: #d8d9dd;
		font-size: 0.85rem;
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	/* The capture target: the family's ground + generous padding so the card floats with
	   breathing room. `color-scheme: light` pins light-dark() to the bright grounds, so
	   captures are consistent regardless of OS/page theme. */
	.stage {
		color-scheme: light;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 64px;
		min-height: 340px;
		border-radius: 16px;
		overflow: hidden;
	}
	/* Constrain each family's card to a rotator-sized footprint. */
	.stage :global(.swiss-card),
	.stage :global(.nb-card),
	.stage :global(.glass-card),
	.stage :global(.riso-card) {
		width: 340px;
		max-width: 100%;
	}

	/* Header content: title on the left, accent badge pinned right. */
	.specimen-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}
	.specimen-title {
		font-size: 1.15rem;
		font-weight: 700;
	}
	.specimen-body {
		margin: 0;
	}

	/* ── Grounds ───────────────────────────────────────────────────────
	   Swiss + Neo have no ground of their own (they live on the surface) → a clean
	   neutral, honest to how they ship. Glass + Riso DO carry a ground → give them one
	   worthy of the look. Glass reuses the canonical index gradient verbatim (so the frost
	   has colour to refract); Riso gets a warm printed paper with two ink blooms (accent
	   pink + info blue) so the duotone/print character reads. */
	.stage[data-style='swiss'] {
		background: #f1f1f3;
	}
	.stage[data-style='neo-brutalism'] {
		background: #ecebe4;
	}
	.stage[data-style='glassmorphism'] {
		background:
			radial-gradient(120% 120% at 0% 0%, #a78bfa 0%, transparent 55%),
			radial-gradient(120% 120% at 100% 100%, #7dd3fc 0%, transparent 55%),
			linear-gradient(135deg, #c4b5fd, #f0abfc);
	}
	/* Riso's ground is doctrine: matte ink on a WARM PAPER stock, never pastel/gradient —
	   and grain is the load-bearing tell. So it's a warm printed-paper field (deeper than
	   the card's own paper so the card lifts) carrying grain multiplied in like ink tooth.
	   The family's `--riso-grain` token is tuned at 0.35 for a small card surface and goes
	   faint on a large ground, so this stage uses the same fractal-noise at a stronger 0.6. */
	.stage[data-style='risograph'] {
		background-color: #ecdcbe;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E");
		background-size: 90px 90px;
		background-blend-mode: multiply;
	}

	/* ── HERO SLIDE stages — the "world" grounds the device components sit on ───────────
	   Neo's world is theme-independent: brand yellow + black dot-grid stay constant (only the
	   NeoWindow component flips dark). The label sits on this world so it uses constant black. */
	.hero-specimen {
		max-width: 1100px;
		margin: 0 auto 3.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.hero-stage {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding: 56px;
		border-radius: 16px;
		overflow: hidden;
		background-color: #ffe600; /* --nb-primary, constant */
		background-image: radial-gradient(circle, rgba(17, 17, 17, 0.16) 1.6px, transparent 1.7px);
		background-size: 24px 24px;
	}
	.hero-label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-family: var(--nb-font);
	}
	.hero-label-title {
		font-size: 42px;
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #111; /* constant on the yellow world */
	}
	.hero-label-sub {
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: #111;
	}

	/* Glass world: darkened mesh (frost needs a dark backdrop) + off-white label. */
	.glass-stage {
		background:
			radial-gradient(120% 120% at 15% 8%, #2a1a5c 0%, transparent 55%),
			radial-gradient(120% 120% at 88% 92%, #4a1248 0%, transparent 55%),
			linear-gradient(135deg, #171433, #0f1130);
	}
	.glass-label :global(*),
	.glass-label {
		color: #f2f2f7;
	}
</style>
