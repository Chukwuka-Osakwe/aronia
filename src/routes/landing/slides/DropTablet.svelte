<script lang="ts">
	// Neo-Brutalism "Drop" sneaker shop (tablet, LIGHT). Shopping = a brand-new category, and
	// neo-brutalism is the native look of hype/streetwear. Real aronia components carry the UI:
	// nav <Link>s, a <Badge> for the drop tag, size + CTA <Button>s (which bring the hard offset
	// shadow), related-product <Card>s. Neo media treatment = hard black frame + high saturation
	// (flat, loud) on the product shots. data-theme="light" pins the bright half of the palette.
	import { neoBrutalism } from '$lib/index.js';

	const { Card, Button, Badge, Link } = neoBrutalism;

	const sizes = ['7', '8', '9', '10', '11'];
	const more = [
		{ name: 'Aero Trail — Mono', price: '$180', img: '/landing/hero/img/drop-1.jpg' },
		{ name: 'Court Hi — Sunbleach', price: '$150', img: '/landing/hero/img/drop-2.jpg' },
		{ name: 'Field Runner — Acid', price: '$165', img: '/landing/hero/img/drop-3.jpg' }
	];
</script>

<div class="dr-window" data-theme="light">
	<header class="dr-top">
		<span class="dr-brand">DROP</span>
		<nav class="dr-topnav">
			<Link variant="nav" active href="#">New</Link>
			<Link variant="nav" href="#">Men</Link>
			<Link variant="nav" href="#">Women</Link>
			<Link variant="nav" href="#">Sale</Link>
		</nav>
		<span class="dr-cart">BAG · 2</span>
	</header>
	<div class="dr-main">
		<div class="dr-hero">
			<img src="/landing/hero/img/drop-hero.jpg" alt="" />
		</div>
		<div class="dr-info">
			<Badge variant="accent" shape="square">JUST DROPPED</Badge>
			<h3 class="dr-name">Aero Trail '92</h3>
			<p class="dr-sub">Volt / Crimson colourway</p>
			<div class="dr-price">$180</div>
			<span class="dr-label">Select size · UK</span>
			<div class="dr-sizes">
				{#each sizes as s, i (s)}
					<Button variant={i === 2 ? 'primary' : 'muted'} size="sm">{s}</Button>
				{/each}
			</div>
			<div class="dr-actions">
				<Button variant="primary">Cop now</Button>
				<Button variant="ghost">Save</Button>
			</div>
		</div>
	</div>
	<div class="dr-more">
		<span class="dr-label">More colourways</span>
		<div class="dr-grid">
			{#each more as m (m.name)}
				<Card --nb-card-max-width="none">
					<div class="dr-card">
						<div class="dr-card-thumb"><img src={m.img} alt="" /></div>
						<span class="dr-card-name">{m.name}</span>
						<span class="dr-card-price">{m.price}</span>
					</div>
				</Card>
			{/each}
		</div>
	</div>
</div>

<style>
	.dr-window {
		width: 1040px;
		max-width: 100%;
		font-family: var(--nb-font);
		color: var(--nb-ink);
		background: var(--nb-paper);
		border: var(--nb-border);
		border-radius: var(--nb-radius);
		box-shadow: var(--nb-shadow-lg);
		overflow: hidden;
	}
	.dr-top {
		display: flex;
		align-items: center;
		gap: 28px;
		padding: 16px 22px;
		border-bottom: var(--nb-border);
	}
	.dr-brand {
		font-size: 24px;
		font-weight: 800;
		letter-spacing: 0.02em;
	}
	.dr-topnav {
		display: flex;
		gap: 18px;
		font-size: 14px;
	}
	.dr-cart {
		margin-left: auto;
		font-family: var(--nb-font);
		font-size: 13px;
		font-weight: 800;
		letter-spacing: 0.04em;
		padding: 6px 12px;
		border: var(--nb-border);
		background: var(--nb-primary);
		color: var(--nb-on-spot);
	}
	.dr-main {
		display: grid;
		grid-template-columns: 440px 1fr;
		gap: 28px;
		padding: 24px;
	}
	.dr-hero {
		height: 460px;
		overflow: hidden;
		border: var(--nb-border);
		background: var(--nb-primary);
	}
	.dr-hero img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		/* neo media: flat + loud */
		filter: saturate(1.2) contrast(1.05);
	}
	.dr-info {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	/* The column stretches its items full-width; keep the Badge hugging its label so the text
	   isn't stranded on the left of a wide pill. */
	.dr-info :global(.nb-badge) {
		align-self: flex-start;
	}
	.dr-name {
		margin: 6px 0 0;
		font-size: 34px;
		font-weight: 800;
		letter-spacing: -0.01em;
	}
	.dr-sub {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
		opacity: 0.65;
	}
	.dr-price {
		font-size: 28px;
		font-weight: 800;
	}
	.dr-label {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.06em;
		opacity: 0.6;
	}
	.dr-sizes {
		display: flex;
		gap: 8px;
	}
	.dr-actions {
		display: flex;
		gap: 12px;
		margin-top: 6px;
	}
	.dr-more {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 0 24px 24px;
	}
	.dr-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}
	.dr-card {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.dr-card-thumb {
		height: 130px;
		overflow: hidden;
		border: var(--nb-border);
		background: var(--nb-muted);
	}
	.dr-card-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(1.2) contrast(1.05);
	}
	.dr-card-name {
		font-size: 15px;
		font-weight: 700;
	}
	.dr-card-price {
		font-size: 14px;
		font-weight: 800;
	}
</style>
